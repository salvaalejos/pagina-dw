# -----------------------------------------------------------------
# 1. Imports: Añadimos CORS y quitamos lo que ya no se usa
# -----------------------------------------------------------------
from werkzeug.utils import secure_filename
from flask import Flask, request, jsonify  # Quitamos render_template, redirect, url_for, g, flash
from flask_mysqldb import MySQL
from flask_wtf.csrf import CSRFProtect
from flask_login import LoginManager, login_user, logout_user, login_required
from flask_cors import CORS  # Importamos CORS
from config import config
from jinja2.ext import loopcontrols

# Imports de Modelos (sin cambios)
from models.Entities.Comment import Comment
from models.Entities.Drink import Drink
from models.Entities.ModelUser import ModelUser
from models.Entities.Sucursal import Sucursal
from models.Entities.User import User
from models.ModelComment import ModelComment
from models.ModelDrink import ModelDrink
import datetime
from models.ModelSucursal import ModelSucursal

# -----------------------------------------------------------------
# 2. Configuración de la App: Añadimos CORS
# -----------------------------------------------------------------
app = Flask(__name__)
CORS(app)  # Habilitamos CORS para toda la aplicación

app.jinja_env.add_extension(loopcontrols)
app.config.from_object(config['development'])
csrf = CSRFProtect()
csrf.init_app(app)  # Mantenemos CSRF por si flask-login lo necesita, pero eximiremos las rutas
db = MySQL(app)
login_manager_app = LoginManager(app)


# -----------------------------------------------------------------
# 3. Autenticación (Auth) API Endpoints
# -----------------------------------------------------------------

@app.route('/api/login', methods=['POST'])
@csrf.exempt  # Eximimos la ruta de la protección CSRF
def login():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No se enviaron datos"}), 400

    username = data.get('username')
    password = data.get('password')

    # Usamos la entidad User para pasar los datos al modelo
    user_entity = User(0, 0, username, 0, 'admin', password)
    logged_user = ModelUser.login(db, user_entity)

    if logged_user is not None:
        login_user(logged_user)  # Flask-Login crea la sesión
        # Devolvemos los datos del usuario como JSON
        return jsonify({
            "id": logged_user.id,
            "name": logged_user.name,
            "username": logged_user.username,
            "rol": logged_user.rol
        }), 200
    else:
        return jsonify({'message': 'Usuario o contraseña incorrectos'}), 401


@app.route('/api/logout', methods=['POST'])
@csrf.exempt
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Sesión cerrada exitosamente"}), 200


# Esta función es esencial para que flask-login funcione
@login_manager_app.user_loader
def load_user(id_user):
    return ModelUser.getById(db, id_user)


# -----------------------------------------------------------------
# 4. Productos (Drinks) API Endpoints
# -----------------------------------------------------------------

@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        drinks_tuples = ModelDrink.getDrinks(db)
        drinks_list = []
        # Convertimos las tuplas de la BD a una lista de diccionarios
        for drink in drinks_tuples:
            drinks_list.append({
                "id": drink[0],
                "nombre": drink[1],
                "precio": float(drink[2]),  # Aseguramos que el precio sea un número
                "descripcion": drink[3],
                "imagen": drink[4],
                "id_sucursal": drink[5]
            })
        return jsonify(drinks_list), 200
    except Exception as ex:
        return jsonify({'message': 'Error al obtener productos', 'error': str(ex)}), 500


@app.route('/api/products', methods=['POST'])
@csrf.exempt
@login_required
def add_product():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No se enviaron datos"}), 400

    try:
        # Extraemos datos del JSON
        new_drink = Drink(0,
                          data['product_name'],
                          data['product_price'],
                          data['product_description'],
                          data['product_image'],
                          data['product_sucursal'])

        insert = ModelDrink.newDrink(db, new_drink)
        if insert:
            return jsonify({'message': 'Producto agregado correctamente'}), 201
        else:
            return jsonify({'message': 'Error al agregar el producto'}), 500
    except Exception as ex:
        return jsonify({'message': 'Error en el servidor', 'error': str(ex)}), 500


@app.route('/api/products/<int:id>', methods=['DELETE'])
@csrf.exempt
@login_required
def delete_products(id):
    try:
        ModelDrink.deleteDrink(db, id)
        return jsonify({'message': 'Producto eliminado correctamente'}), 200
    except Exception as ex:
        return jsonify({'message': 'Error al eliminar el producto', 'error': str(ex)}), 500


# -----------------------------------------------------------------
# 5. Sucursales (Branches) API Endpoints
# -----------------------------------------------------------------

@app.route('/api/branches', methods=['GET'])
def get_branches():
    try:
        sucursales_tuples = ModelSucursal.getSucursales(db)
        sucursales_list = []
        # Convertimos las tuplas de la BD a una lista de diccionarios
        for suc in sucursales_tuples:
            sucursales_list.append({
                "id": suc[0],
                "nombre": suc[1],
                "direccion": suc[2],
                "telefono": suc[3]
            })
        return jsonify(sucursales_list), 200
    except Exception as ex:
        return jsonify({'message': 'Error al obtener sucursales', 'error': str(ex)}), 500


@app.route('/api/branches', methods=['POST'])
@csrf.exempt
@login_required
def add_branch():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No se enviaron datos"}), 400

    try:
        new_branch = Sucursal(0,
                              data['branch_name'],
                              data['branch_address'],
                              data['branch_phone'])

        insert = ModelSucursal.newSucursal(db, new_branch)
        if insert:
            return jsonify({'message': 'Sucursal agregada correctamente'}), 201
        else:
            return jsonify({'message': 'Error al agregar la sucursal'}), 500
    except Exception as ex:
        return jsonify({'message': 'Error en el servidor', 'error': str(ex)}), 500


@app.route('/api/branches/<int:id>', methods=['DELETE'])
@csrf.exempt
@login_required
def delete_branch(id):
    try:
        ModelSucursal.deleteSucursal(db, id)
        return jsonify({'message': 'Sucursal eliminada correctamente'}), 200
    except Exception as ex:
        return jsonify({'message': 'Error al eliminar la sucursal', 'error': str(ex)}), 500


# -----------------------------------------------------------------
# 6. Comentarios (Comments) API Endpoints
# -----------------------------------------------------------------

@app.route('/api/comments', methods=['POST'])
@csrf.exempt
def add_comments():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No se enviaron datos"}), 400

    try:
        new_comment = Comment(0,
                              data['name'],
                              data['email'],
                              data['message'])

        insert = ModelComment.newComment(db, new_comment)
        if insert:
            return jsonify({'message': 'Comentario enviado correctamente'}), 201
        else:
            return jsonify({'message': 'Error al enviar el comentario'}), 500
    except Exception as ex:
        return jsonify({'message': 'Error en el servidor', 'error': str(ex)}), 500


# -----------------------------------------------------------------
# 7. Rutas y Handlers Genéricos
# -----------------------------------------------------------------

@app.route('/')
@csrf.exempt
def index():
    # Esta ya no es la ruta principal, pero es bueno tenerla
    return jsonify({"message": "Bienvenido a la API de PopBubbles"}), 200


@app.route('/protected')
@login_required
def protected():
    # Ruta de prueba protegida
    return jsonify({"message": "Esta es una vista protegida para ciertos usuarios"})


# Nuevos Handlers de error que devuelven JSON
def status_401_json(error):
    return jsonify({"error": "No autorizado. Debes iniciar sesión."}), 401


def status_404_json(error):
    return jsonify({"error": "Ruta no encontrada en la API."}), 404


app.register_error_handler(401, status_401_json)
app.register_error_handler(404, status_404_json)

# -----------------------------------------------------------------
# 8. Arranque de la App
# -----------------------------------------------------------------
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)