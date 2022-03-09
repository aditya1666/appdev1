from flask import Flask,render_template,Blueprint,send_from_directory
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials

app = Flask(__name__, static_folder='angular/dist/angular')
CORS(app)

#cred = credentials.Certificate(r"D:\DOWNLOADS\Task2\firebase.json")
firebase_admin.initialize_app()
from api import info

angular = Blueprint('angular', __name__,
                    template_folder='angular/dist/angular')
app.register_blueprint(angular)

app.register_blueprint(info,url_prefix='/api')
@app.route('/assets/<path:filename>')
def custom_static_for_assets(filename):
    return send_from_directory('angular/dist/angular/assets', filename)


@app.route('/<path:filename>')
def custom_static(filename):
    return send_from_directory('angular/dist/angular/', filename)


@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000, debug=True)
 