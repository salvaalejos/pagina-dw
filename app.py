from werkzeug.utils import secure_filename
from flask import Flask, render_template, request, redirect, url_for, g, flash, make_response, jsonify
from flask_mysqldb import MySQL
from flask_wtf.csrf import CSRFProtect
from flask_login import LoginManager, login_user, logout_user, login_required
from config import config
from jinja2.ext import loopcontrols

app = Flask(__name__)
app.jinja_env.add_extension(loopcontrols)
app.config.from_object(config['development'])  # Cambia 'development' a 'production' para producción
@app.route('/')
def index():  # put application's code here
    return redirect(url_for('add_elements'))

@app.route('/add-elements')
def add_elements():
    return render_template('admin/add_elements.html')

if __name__ == '__main__':
    app.run()
