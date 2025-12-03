# -----------------------------------------------------------------
# 1. Imports
# -----------------------------------------------------------------

from functools import wraps
from flask import Flask, request, jsonify, send_file # <--- Agrega send_file
import subprocess # <--- NUEVO
import os # <--- NUEVO
from flask_mysqldb import MySQL
from flask_wtf.csrf import CSRFProtect
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_cors import CORS
from config import config
from datetime import datetime
import requests
# Imports de Modelos
from models.Entities.Comment import Comment
from models.Entities.Drink import Drink
from models.ModelUser import ModelUser
from models.Entities.Sucursal import Sucursal
from models.Entities.User import User
from models.ModelComment import ModelComment
from models.ModelDrink import ModelDrink
from models.ModelSucursal import ModelSucursal
from models.ModelOrder import ModelOrder
from models.ModelLog import ModelLog  # <--- NUEVO: Importamos el modelo de Logs

# -----------------------------------------------------------------
# 2. Configuración de la App
# -----------------------------------------------------------------
app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "https://localhost:3000"}})

app.config.from_object(config['production'])
csrf = CSRFProtect()
csrf.init_app(app)
db = MySQL(app)
login_manager_app = LoginManager(app)


# -----------------------------------------------------------------
# 3. Decoradores de Roles
# -----------------------------------------------------------------
def admin_required(f):
    @wraps(f)
    @login_required
    def decorated_function(*args, **kwargs):
        if current_user.rol != 'admin':
            return jsonify({"message": "Acceso denegado. Se requiere rol de Admin."}), 403
        return f(*args, **kwargs)

    return decorated_function


def sucursal_required(f):
    @wraps(f)
    @login_required
    def decorated_function(*args, **kwargs):
        if current_user.rol != 'sucursal':
            return jsonify({"message": "Acceso denegado. Se requiere rol de Sucursal."}), 403
        if current_user.id_branch is None:
            return jsonify({"message": "Usuario de sucursal no tiene sucursal asignada."}), 403
        return f(*args, **kwargs)

    return decorated_function


# -----------------------------------------------------------------
# 4. Endpoints de Autenticación (Auth)
# -----------------------------------------------------------------

@app.route('/api/login', methods=['POST'])
@csrf.exempt
def login():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No se enviaron datos"}), 400

    username = data.get('username')
    password = data.get('password')
    captcha_token = data.get('captchaToken')  # Recibimos el token

    # 1. Validar que enviaron el token
    if not captcha_token:
        return jsonify({'message': 'Por favor completa el Captcha'}), 400

    # 2. Verificar con Google (Lógica V2)
    google_verify_url = "https://www.google.com/recaptcha/api/siteverify"
    payload = {
        'secret': '6LePJxIsAAAAABdOaS_sna0FneB4IefvA9TxMpvu',
        'response': captcha_token,
        'remoteip': request.remote_addr
    }

    try:
        verify_response = requests.post(google_verify_url, data=payload).json()

        # En V2 solo nos importa si success es True
        if not verify_response.get('success'):
            return jsonify({'message': 'Captcha inválido. Intenta de nuevo.'}), 400

    except Exception as e:
        print("Error conectando con Google:", e)
        return jsonify({'message': 'Error al validar seguridad'}), 500

    # 3. Si pasa, Login Normal...
    user_entity = User(0, 0, None, usuario=username, id_branch=0, rol='admin', password=password)
    logged_user = ModelUser.login(db, user_entity)

    if logged_user is not None:
        login_user(logged_user)
        ModelLog.add(db, logged_user.usuario, 'LOGIN', 'Inicio de sesión exitoso', request.remote_addr)
        return jsonify({
            "id": logged_user.id,
            "name": logged_user.name,
            "username": logged_user.usuario,
            "rol": logged_user.rol,
            "id_branch": logged_user.id_branch
        }), 200
    else:
        ModelLog.add(db, username or 'Desconocido', 'LOGIN_FAIL', 'Credenciales incorrectas', request.remote_addr)
        return jsonify({'message': 'Usuario o contraseña incorrectos'}), 401

@app.route('/api/logout', methods=['POST'])
@csrf.exempt
@login_required
def logout():
    usuario_temp = current_user.usuario  # Guardamos el nombre antes de desloguear
    logout_user()
    # --- LOG: Logout ---
    ModelLog.add(db, usuario_temp, 'LOGOUT', 'Cierre de sesión', request.remote_addr)
    return jsonify({"message": "Sesión cerrada exitosamente"}), 200


@login_manager_app.user_loader
def load_user(id_user):
    return ModelUser.getById(db, id_user)


# -----------------------------------------------------------------
# 5. Endpoints de Registro (Clientes)
# -----------------------------------------------------------------

@app.route('/api/register', methods=['POST'])
@csrf.exempt
def register_user():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No se enviaron datos"}), 400

    # 1. VALIDACIÓN DE CAPTCHA
    captcha_token = data.get('captchaToken')
    if not captcha_token:
        return jsonify({'message': 'Por favor completa el Captcha'}), 400

    google_verify_url = "https://www.google.com/recaptcha/api/siteverify"
    payload = {
        'secret': '6LePJxIsAAAAABdOaS_sna0FneB4IefvA9TxMpvu',  # <--- TU CLAVE SECRETA
        'response': captcha_token,
        'remoteip': request.remote_addr
    }

    try:
        verify_response = requests.post(google_verify_url, data=payload).json()
        if not verify_response.get('success'):
            return jsonify({'message': 'Captcha inválido. Intenta de nuevo.'}), 400
    except Exception as e:
        print("Error validando captcha:", e)
        return jsonify({'message': 'Error de seguridad'}), 500

    # 2. VALIDACIÓN DE DUPLICADOS (Lógica existente)
    existe = ModelUser.check_existence(db, data['username'], data['email'])
    if existe == 'username':
        return jsonify({'message': f"El usuario '{data['username']}' ya está ocupado. Por favor elige otro."}), 409
    if existe == 'email':
        return jsonify({'message': f"El correo '{data['email']}' ya está registrado."}), 409

    try:
        # 3. CREACIÓN DEL USUARIO (Lógica existente)
        new_user = User(
            id=0,
            name=data['name'],
            email=data['email'],
            usuario=data['username'],
            id_branch=None,
            rol='cliente',
            password=data['password']
        )

        ModelUser.create_user(db, new_user)
        ModelLog.add(db, data['username'], 'REGISTER', 'Nuevo usuario registrado', request.remote_addr)

        return jsonify({'message': '¡Usuario cliente creado con éxito!'}), 201

    except Exception as ex:
        return jsonify({'message': 'Error en el servidor', 'error': str(ex)}), 500

# -----------------------------------------------------------------
# 6. Endpoints de Gestión de Usuarios (ADMIN)
# -----------------------------------------------------------------

@app.route('/api/users', methods=['GET'])
@csrf.exempt
@admin_required
def get_users():
    try:
        users = ModelUser.get_all_users(db)
        return jsonify(users), 200
    except Exception as ex:
        return jsonify({'message': 'Error al obtener usuarios', 'error': str(ex)}), 500


@app.route('/api/users', methods=['POST'])
@csrf.exempt
@admin_required
def create_user_by_admin():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No se enviaron datos"}), 400

    # --- NUEVA VALIDACIÓN ---
    existe = ModelUser.check_existence(db, data['username'], data.get('email', ''))
    if existe == 'username':
        return jsonify({'message': f"El usuario '{data['username']}' ya existe."}), 409
    if existe == 'email':
        return jsonify({'message': f"El correo '{data['email']}' ya está registrado."}), 409
    # ------------------------

    try:
        rol = data.get('rol')
        id_branch = data.get('id_branch', None)

        if rol == 'sucursal' and id_branch is None:
            return jsonify({"message": "Se debe proveer un 'id_branch' para el rol 'sucursal'"}), 400
        if rol != 'sucursal':
            id_branch = None

        new_user = User(
            id=0,
            name=data['name'],
            email=data.get('email', None),
            usuario=data['username'],
            id_branch=id_branch,
            rol=rol,
            password=data['password']
        )

        ModelUser.create_user(db, new_user)

        ModelLog.add(db, current_user.usuario, 'ADMIN_CREATE_USER', f"Creó usuario: {data['username']} (Rol: {rol})",
                     request.remote_addr)

        return jsonify({'message': f'Usuario {rol} creado con éxito'}), 201

    except Exception as ex:
        return jsonify({'message': 'Error en el servidor', 'error': str(ex)}), 500

@app.route('/api/users/<int:id>', methods=['DELETE'])
@csrf.exempt
@admin_required
def delete_user(id):
    try:
        if id == current_user.id:
            return jsonify({'message': 'No puedes eliminar tu propia cuenta de administrador'}), 403

        ModelUser.delete_user(db, id)

        # --- LOG: Admin elimina usuario ---
        ModelLog.add(db, current_user.usuario, 'ADMIN_DELETE_USER', f"Eliminó usuario ID: {id}", request.remote_addr)

        return jsonify({'message': 'Usuario eliminado correctamente'}), 200
    except Exception as ex:
        return jsonify({'message': 'Error al eliminar el usuario', 'error': str(ex)}), 500


# -----------------------------------------------------------------
# 7. Endpoints de Gestión de Bebidas (ADMIN)
# -----------------------------------------------------------------

@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        drinks_tuples = ModelDrink.getDrinks(db)
        drinks_list = []
        for drink in drinks_tuples:
            drinks_list.append({
                "id": drink[0],
                "nombre": drink[1],
                "precio": float(drink[2]),
                "descripcion": drink[3],
                "imagen": drink[4],
                "id_sucursal": drink[5]
            })
        return jsonify(drinks_list), 200
    except Exception as ex:
        return jsonify({'message': 'Error al obtener productos', 'error': str(ex)}), 500


@app.route('/api/products', methods=['POST'])
@csrf.exempt
@admin_required
def add_product():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No se enviaron datos"}), 400

    try:
        new_drink = Drink(0,
                          data['product_name'],
                          data['product_price'],
                          data['product_description'],
                          data['product_image'],
                          data['product_sucursal'])

        insert = ModelDrink.newDrink(db, new_drink)
        if insert:
            # --- LOG: Producto Agregado ---
            ModelLog.add(db, current_user.usuario, 'ADD_PRODUCT',
                         f"Nuevo producto: {data['product_name']} (Sucursal {data['product_sucursal']})",
                         request.remote_addr)
            return jsonify({'message': 'Producto agregado correctamente'}), 201
        else:
            return jsonify({'message': 'Error al agregar el producto'}), 500
    except Exception as ex:
        return jsonify({'message': 'Error en el servidor', 'error': str(ex)}), 500


@app.route('/api/products/<int:id>', methods=['DELETE'])
@csrf.exempt
@admin_required
def delete_products(id):
    try:
        ModelDrink.deleteDrink(db, id)
        # --- LOG: Producto Eliminado ---
        ModelLog.add(db, current_user.usuario, 'DELETE_PRODUCT', f"Producto eliminado ID: {id}", request.remote_addr)
        return jsonify({'message': 'Producto eliminado correctamente'}), 200
    except Exception as ex:
        return jsonify({'message': 'Error al eliminar el producto', 'error': str(ex)}), 500


# -----------------------------------------------------------------
# 8. Endpoints de Gestión de Sucursales (ADMIN)
# -----------------------------------------------------------------

@app.route('/api/branches', methods=['GET'])
def get_branches():
    try:
        sucursales_tuples = ModelSucursal.getSucursales(db)
        sucursales_list = []
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
@admin_required
def add_branch():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No se enviaron datos"}), 400

    try:
        new_branch = Sucursal(0, data['branch_name'], data['branch_address'], data['branch_phone'])
        insert = ModelSucursal.newSucursal(db, new_branch)
        if insert:
            # --- LOG: Sucursal Agregada ---
            ModelLog.add(db, current_user.usuario, 'ADD_BRANCH', f"Nueva sucursal: {data['branch_name']}",
                         request.remote_addr)
            return jsonify({'message': 'Sucursal agregada correctamente'}), 201
        else:
            return jsonify({'message': 'Error al agregar la sucursal'}), 500
    except Exception as ex:
        return jsonify({'message': 'Error en el servidor', 'error': str(ex)}), 500


@app.route('/api/branches/<int:id>', methods=['DELETE'])
@csrf.exempt
@admin_required
def delete_branch(id):
    try:
        ModelSucursal.deleteSucursal(db, id)
        # --- LOG: Sucursal Eliminada ---
        ModelLog.add(db, current_user.usuario, 'DELETE_BRANCH', f"Sucursal eliminada ID: {id}", request.remote_addr)
        return jsonify({'message': 'Sucursal eliminada correctamente'}), 200
    except Exception as ex:
        return jsonify({'message': 'Error al eliminar la sucursal', 'error': str(ex)}), 500


# -----------------------------------------------------------------
# 9. Endpoints de Gestión (SUCURSAL)
# -----------------------------------------------------------------

@app.route('/api/sucursal/products', methods=['GET'])
@csrf.exempt
@sucursal_required
def get_sucursal_products():
    try:
        sucursal_id = current_user.id_branch
        drinks_tuples = ModelDrink.getDrinksBySucursal(db, sucursal_id)
        drinks_list = []
        for drink in drinks_tuples:
            drinks_list.append({
                "id": drink[0],
                "nombre": drink[1],
                "precio": float(drink[2]),
                "descripcion": drink[3],
                "imagen": drink[4],
                "id_sucursal": drink[5]
            })
        return jsonify(drinks_list), 200
    except Exception as ex:
        return jsonify({'message': 'Error al obtener productos de la sucursal', 'error': str(ex)}), 500


@app.route('/api/sucursal/products', methods=['POST'])
@csrf.exempt
@sucursal_required
def add_sucursal_product():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No se enviaron datos"}), 400

    try:
        sucursal_id = current_user.id_branch
        new_drink = Drink(0,
                          data['product_name'],
                          data['product_price'],
                          data['product_description'],
                          data['product_image'],
                          sucursal_id)

        insert = ModelDrink.newDrink(db, new_drink)
        if insert:
            # --- LOG: Sucursal agrega producto ---
            ModelLog.add(db, current_user.usuario, 'ADD_PRODUCT_SUCURSAL',
                         f"Agregado: {data['product_name']} en Sucursal {sucursal_id}", request.remote_addr)
            return jsonify({'message': 'Producto agregado a tu sucursal'}), 201
        else:
            return jsonify({'message': 'Error al agregar el producto'}), 500
    except Exception as ex:
        return jsonify({'message': 'Error en el servidor', 'error': str(ex)}), 500


@app.route('/api/sucursal/products/<int:id>', methods=['DELETE'])
@csrf.exempt
@sucursal_required
def delete_sucursal_product(id):
    try:
        sucursal_id = current_user.id_branch
        producto_es_de_sucursal = ModelDrink.checkDrinkOwnership(db, id, sucursal_id)

        if not producto_es_de_sucursal:
            return jsonify({'message': 'No tienes permiso para borrar este producto'}), 403

        ModelDrink.deleteDrink(db, id)
        # --- LOG: Sucursal borra producto ---
        ModelLog.add(db, current_user.usuario, 'DELETE_PRODUCT_SUCURSAL',
                     f"Eliminado ID: {id} de Sucursal {sucursal_id}", request.remote_addr)
        return jsonify({'message': 'Producto eliminado correctamente'}), 200
    except Exception as ex:
        return jsonify({'message': 'Error al eliminar el producto', 'error': str(ex)}), 500


# -----------------------------------------------------------------
# 10. Endpoints de Comentarios
# -----------------------------------------------------------------
@app.route('/api/comments', methods=['POST'])
@csrf.exempt
def add_comments():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No se enviaron datos"}), 400

    try:
        new_comment = Comment(0, data['name'], data['email'], data['message'])
        insert = ModelComment.newComment(db, new_comment)
        if insert:
            return jsonify({'message': 'Comentario enviado correctamente'}), 201
        else:
            return jsonify({'message': 'Error al enviar el comentario'}), 500
    except Exception as ex:
        return jsonify({'message': 'Error en el servidor', 'error': str(ex)}), 500


# -----------------------------------------------------------------
# 11. Endpoints de Pedidos
# -----------------------------------------------------------------

@app.route('/api/my-orders', methods=['GET'])
@csrf.exempt
@login_required
def get_my_orders():
    try:
        if current_user.rol != 'cliente':
            return jsonify({"message": "Acceso denegado. Solo para clientes."}), 403

        user_id = current_user.id
        orders = ModelOrder.get_orders_by_user(db, user_id)
        return jsonify(orders), 200
    except Exception as ex:
        return jsonify({'message': 'Error al obtener pedidos', 'error': str(ex)}), 500


@app.route('/api/orders', methods=['POST'])
@csrf.exempt
@login_required
def create_order():
    try:
        if current_user.rol != 'cliente':
            return jsonify({"message": "Acceso denegado. Solo los clientes pueden ordenar."}), 403

        data = request.get_json()
        if not data:
            return jsonify({"message": "No se enviaron datos del pedido"}), 400

        user_id = current_user.id
        cart_items = data.get('cartItems')
        total = data.get('total')
        sucursal_id = data.get('sucursal_id')

        if not all([cart_items, total, sucursal_id]):
            return jsonify({"message": "Faltan datos en el pedido"}), 400

        ModelOrder.create_order(db, user_id, sucursal_id, total, cart_items)

        # --- LOG: Nuevo Pedido ---
        ModelLog.add(db, current_user.usuario, 'NEW_ORDER', f"Pedido por ${total} en Sucursal {sucursal_id}",
                     request.remote_addr)

        return jsonify({'message': '¡Pedido creado con éxito!'}), 201
    except Exception as ex:
        return jsonify({'message': 'Error al crear el pedido', 'error': str(ex)}), 500


# -----------------------------------------------------------------
# 12. NUEVO: Endpoint de Bitácora (SOLO ADMIN)
# -----------------------------------------------------------------
@app.route('/api/logs', methods=['GET'])
@csrf.exempt
@admin_required
def get_system_logs():
    """ Obtiene el historial completo de acciones. """
    try:
        logs = ModelLog.get_logs(db)
        return jsonify(logs), 200
    except Exception as ex:
        return jsonify({'message': 'Error al obtener logs', 'error': str(ex)}), 500

# -----------------------------------------------------------------
# 14. NUEVO: Endpoint de Respaldo de Base de Datos (SOLO ADMIN)
# -----------------------------------------------------------------
@app.route('/api/backup', methods=['GET'])
@csrf.exempt
@admin_required
def backup_database():
    """ Genera y descarga un dump SQL de la base de datos. """
    try:
        # 1. Obtener credenciales
        user = app.config['MYSQL_USER']
        password = app.config['MYSQL_PASSWORD']
        db_name = app.config['MYSQL_DB']
        host = app.config['MYSQL_HOST']

        # 2. Definir ruta del archivo
        filename = f"backup_{db_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.sql"
        file_path = os.path.join(os.getcwd(), filename)

        # --- CORRECCIÓN PARA WINDOWS ----------------------------------
        # Pon aquí la ruta exacta donde encontraste mysqldump.exe
        # Usa r"" al principio para que Python lea bien las barras invertidas (\)
        mysqldump_path = r"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe"

        # Si no lo encuentras ahí, prueba buscar en: r"C:\xampp\mysql\bin\mysqldump.exe"
        # --------------------------------------------------------------

        # 3. Construir el comando usando la ruta absoluta
        # Las comillas \" extra son por si la ruta tiene espacios (ej: "Program Files")
        command = f"\"{mysqldump_path}\" -h {host} -u {user} -p{password} {db_name} > \"{file_path}\""

        # 4. Ejecutar comando
        process = subprocess.run(command, shell=True, capture_output=True)

        if process.returncode != 0:
            # Esto nos dirá exactamente qué pasó si falla
            error_msg = process.stderr.decode('utf-8') or "Error desconocido ejecutando mysqldump"
            raise Exception(f"Error del sistema: {error_msg}")

        # 5. Registrar en Log
        ModelLog.add(db, current_user.usuario, 'DB_BACKUP', 'Descarga de respaldo SQL', request.remote_addr)

        # 6. Enviar
        return send_file(file_path, as_attachment=True, download_name=filename)

    except Exception as ex:
        return jsonify({'message': 'Error al generar el respaldo', 'error': str(ex)}), 500


# -----------------------------------------------------------------
# 13. Rutas y Handlers Genéricos
# -----------------------------------------------------------------

@app.route('/')
@csrf.exempt
def index():
    return jsonify({"message": "Bienvenido a la API de PopBubbles"}), 200


@app.route('/protected')
@login_required
def protected():
    return jsonify({"message": f"Vista protegida para {current_user.username}"})


def status_401_json(error):
    return jsonify({"error": "No autorizado. Debes iniciar sesión."}), 401


def status_404_json(error):
    return jsonify({"error": "Ruta no encontrada en la API."}), 404


app.register_error_handler(401, status_401_json)
app.register_error_handler(404, status_404_json)

if __name__ == '__main__':
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True,
        ssl_context=("frontend/certs/cert.pem", "frontend/certs/key.pem")
    )