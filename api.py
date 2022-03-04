import email
from functools import wraps
from heapq import merge
import traceback
from flask import Blueprint, jsonify, render_template, abort,request
import json
from firebase_admin import firestore,auth
db=firestore.client()

def checkToken(f):
    @wraps(f)
    def decorated_function(*args,**kws):
        if not 'Authorization' in request.headers:
            abort(401,{'message':'Unauthorized caller'})
        user=None
        try:
            data=request.headers['Authorization']
            header_token=str(data)
            token=header_token.split(" ")[-1]
            user=auth.verify_id_token(token)
            kws['uid']=user['uid']
            kws['email']=user['email']
        except Exception:
            traceback.print_exc()
            abort(401)
        return f(*args,**kws)
    return decorated_function
        
    


info = Blueprint('info', __name__,)

@info.route('/user', methods=['POST']) 
def store_info(*args,**kwargs):
    user_info=request.json
    email=user_info.get('email')
    db.collection("users").document(email).set(user_info)
    return json.dumps({
        "status":"OK"
    })
@info.route('/tasks',methods=['POST'])
@checkToken
def tasks_info(*args,**kwargs):
    new_tasks=request.json
    email=(kwargs['email'])
    df=db.collection(email).get()
    ids=[]
    for d in df:
        ids.append(d.reference.id)
    if len(ids)==0:
        ids.append('0')        
    db.collection(email).document(str(int(ids[-1])+1)).set(new_tasks)
    return json.dumps({
        "status":"OK"
    })
    
@info.route('/list',methods=['Get'])
@checkToken
def lists(*args,**kwargs):
    email=(kwargs['email'])
    df=db.collection(email).get()
    ids=[]
    for d in df:
        ids.append(d.reference.id)
    data={}
    for i in ids:
        data[i]=db.collection(email).document(str(i)).get().to_dict()['task']

    docs=db.collection(email)
    l=[]
    all_todos = [doc.to_dict() for doc in docs.stream()]
    return jsonify(all_todos)
   
@info.route('/delete',methods=['POST'])
@checkToken
def deletes(*args,**kwargs):
    t=request.json.get('task')
    email=(kwargs['email'])
    df=db.collection(email).where('task',u'==',t).get()
    id=df[0].reference.id
    db.collection(email).document(id).delete()
    return (
        {"status":"ok"}
    )
@info.route('/updates',methods=['POST'])
@checkToken
def updates(*args,**kwargs):
    t=request.json.get('task')
    u=request.json.get('updates')
    email=kwargs['email']
    df=db.collection(email).where('task',u'==',t).get()
    id=df[0].reference.id
    db.collection(email).document(id).update({u'task':u})
    return({
        "status":"ok"
    })
@info.route('user_info',methods=['GET'])
@checkToken
def getuser(*args,**kwargs):
    email=kwargs['email']
    df=db.collection("users").document(email).get().to_dict()
    return jsonify(df)