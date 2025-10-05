from werkzeug.utils import secure_filename
from flask import Flask, render_template, request, redirect, url_for, g, flash, make_response, jsonify
from flask_mysqldb import MySQL
from flask_wtf.csrf import CSRFProtect
from flask_login import LoginManager, login_user, logout_user, login_required
from config import config
from jinja2.ext import loopcontrols

from models.Entities.Comment import Comment
from models.Entities.Drink import Drink
from models.Entities.ModelUser import ModelUser
from models.Entities.Sucursal import Sucursal
from models.Entities.User import User
from models.ModelComment import ModelComment
from models.ModelDrink import ModelDrink
import datetime

from models.ModelSucursal import ModelSucursal

app = Flask(__name__)
app.jinja_env.add_extension(loopcontrols)
app.config.from_object(config['development'])  # Cambia 'development' a 'production' para producción
csrf = CSRFProtect()
csrf.init_app(app)
db = MySQL(app)
login_manager_app = LoginManager(app)


################## Conexión base de datos ##########################


fecha = datetime.date.today() #Fecha de hoy
hora = datetime.datetime.now().strftime("%H:%M:%S") #Devuelve hora con minutos y segundos
@app.route('/')
def index():  # put application's code here
    return redirect(url_for('bubbles'))

@app.route('/protected')
@login_required
def protected():#Renderiza una vista protegida que requiere autenticación del usuario.
    #Returns:
        # str: Un mensaje HTML que indica que esta vista está reservada para ciertos usuarios.
    return "<h1>Esta es una vista para ciertos usuarios</h1>"

def status_401(error):# Redirige a la página de inicio de sesión cuando se produce un error de autenticación (401).
    #Retorna
    #Response: Redirige a la página de inicio de sesión.
    return redirect(url_for('login'))

def status_404(error):# Maneja las solicitudes a URLs no encontradas (404).
    #Returns:
        #Tuple[str, int]: Retorna un mensaje HTML indicando que la página no se encontró con el código de estado 404.
    return "<h1>404 - Página no encontrada</h1>", 404

@app.route('/logout') #  Cierra la sesión del usuario actual.
def logout():
    #Returns:
        #Response: Redirige a la página de inicio de sesión después de cerrar la sesión.
    logout_user()
    return redirect(url_for('login'))

@app.route('/admin')
@login_required
def admin():
    actual_drinks = ModelDrink.getDrinks(db)
    actual_sucursales = ModelSucursal.getSucursales(db)
    return render_template('admin/add_elements.html',
                           drinks=actual_drinks,
                           sucursales=actual_sucursales
                           )

@app.route('/add-product', methods=['GET','POST'])
def add_product():
    product_name = request.form['product_name']
    product_price = request.form['product_price']
    product_image = request.form['product_image']
    product_description = request.form['product_description']
    product_sucursal = request.form['product_sucursal']
    new_drink = Drink(0, product_name, product_price, product_description, product_image, product_sucursal )
    if request.method == 'POST':
        insert = ModelDrink.newDrink(db, new_drink)
        if insert:
            flash('Producto agregado correctamente')
        else:
            flash('Error al agregar el producto')


    return redirect(url_for('admin'))

@app.route('/delete-products/<int:id>', methods=['GET','POST'])
def delete_products(id):
    actual_drinks = ModelDrink.getDrinks(db)
    actual_sucursales = ModelSucursal.getSucursales(db)
    try:
        ModelDrink.deleteDrink(db, id)
        flash('Producto eliminado correctamente')
    except Exception as ex:
        flash('Error al eliminar el producto')
    return redirect(url_for('admin'))

@app.route('/add-branch', methods=['GET','POST'])
def add_branch():
    if request.method == 'POST':
        branch_name = request.form['branch_name']
        branch_address = request.form['branch_address']
        branch_phone = request.form['branch_phone']
        new_branch = Sucursal(0, branch_name, branch_address, branch_phone)
        insert = ModelSucursal.newSucursal(db, new_branch)
        if insert:
            flash('Sucursal agregada correctamente')
        else:
            flash('Error al agregar la sucursal')
    return redirect(url_for('admin'))

@app.route('/delete-branch/<int:id>', methods=['GET','POST'])
def delete_branch(id):
    try:
        ModelSucursal.deleteSucursal(db, id)
        flash('Sucursal eliminada correctamente')
    except Exception as ex:
        flash('Error al eliminar la sucursal')
    return redirect(url_for('admin'))


@app.route('/bubbles', methods=['GET','POST'])
def bubbles():
    actual_drinks = ModelDrink.getDrinks(db)
    actual_sucursales = ModelSucursal.getSucursales(db)
    return render_template('client/bubbles.html'
                           , drinks=actual_drinks
                           , sucursales=actual_sucursales)

@app.route('/add-comments', methods=['GET','POST'])
def add_comments():
    if request.method == 'POST':
        message = request.form['message']
        name = request.form['name']
        email = request.form['email']
        new_comment = Comment(0, name, email, message)
        insert = ModelComment.newComment(db, new_comment)
        if insert:
            flash('Comentario enviado correctamente')
        else:
            flash('Error al enviar el comentario')
    return redirect(url_for('bubbles'))


@app.route('/login', methods=['GET','POST']) # Maneja la autenticación de usuarios.
def login():
    if request.method=='POST':
        username = request.form['username']
        password = request.form['password']
        user = User(0,0,username, 0, 'admin', password)
        logged_user = ModelUser.login(db,user)
        if logged_user != None:
            login_user(logged_user)
            if logged_user.rol == "admin":
                return redirect(url_for('admin'))
            else:
                return redirect(url_for('bubbles'))
        else:
            flash('Usuario o contraseña incorrectos')
            return render_template('auth/login.html')
    else:
        return render_template('auth/login.html')


@login_manager_app.user_loader # Función para cargar un usuario dado su ID.
def load_user(id_user):
    return ModelUser.getById(db, id_user)

app.register_error_handler(401, status_401)
app.register_error_handler(404, status_404)



if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
