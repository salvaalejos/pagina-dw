from werkzeug.utils import secure_filename
from flask import Flask, render_template, request, redirect, url_for, g, flash, make_response, jsonify
from flask_mysqldb import MySQL
from flask_wtf.csrf import CSRFProtect
from flask_login import LoginManager, login_user, logout_user, login_required
from config import config
from jinja2.ext import loopcontrols
from models.ModelDrink import ModelDrink
import datetime

from models.ModelSucursal import ModelSucursal

app = Flask(__name__)
app.jinja_env.add_extension(loopcontrols)
app.config.from_object(config['development'])  # Cambia 'development' a 'production' para producción
csrf = CSRFProtect()
csrf.init_app(app)
db = MySQL(app)


################## Conexión base de datos ##########################


fecha = datetime.date.today() #Fecha de hoy
hora = datetime.datetime.now().strftime("%H:%M:%S") #Devuelve hora con minutos y segundos
@app.route('/')
def index():  # put application's code here
    return redirect(url_for('bubbles'))

@app.route('/add-elements')
def add_elements():
    actual_drinks = ModelDrink.getDrinks(db)
    actual_sucursales = ModelSucursal.getSucursales(db)
    return render_template('admin/add_elements.html',
                           drinks=actual_drinks,
                           sucursales=actual_sucursales
                           )


@app.route('/bubbles')
def bubbles():
    return render_template('client/bubbles.html')

if __name__ == '__main__':
    app.run()
