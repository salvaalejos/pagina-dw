# -----------------------------------------------------------------
# 1. Imports: Añadimos 'current_user' y 'wraps'
# -----------------------------------------------------------------
from functools import wraps  # <-- NUEVO: Para crear decoradores
from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_wtf.csrf import CSRFProtect
# 'current_user' nos dice quién está logueado
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_cors import CORS
from config import config

# Imports de Modelos
from models.Entities.Comment import Comment
from models.Entities.Drink import Drink
from models.ModelUser import ModelUser
from models.Entities.Sucursal import Sucursal
from models.Entities.User import User
from models.ModelComment import ModelComment
from models.ModelDrink import ModelDrink
from models.ModelSucursal import ModelSucursal
# Importamos el nuevo modelo de pedidos
from models.ModelOrder import ModelOrder

# -----------------------------------------------------------------
# 2. Configuración de la App (Sin cambios)
# -----------------------------------------------------------------
app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "http://localhost:3000"}})

app.config.from_object(config['development'])
csrf = CSRFProtect()
csrf.init_app(app)
db = MySQL(app)
login_manager_app = LoginManager(app)


# -----------------------------------------------------------------
# 3. NUEVO: Decoradores de Roles
# -----------------------------------------------------------------
def admin_required(f):
    @wraps(f)
    @login_required  # Primero revisa que esté logueado
    def decorated_function(*args, **kwargs):
        # Si el rol del usuario actual NO es 'admin'
        if current_user.rol != 'admin':
            return jsonify({"message": "Acceso denegado. Se requiere rol de Admin."}), 403
        return f(*args, **kwargs)

    return decorated_function


def sucursal_required(f):
    @wraps(f)
    @login_required
    def decorated_function(*args, **kwargs):
        # Si el rol NO es 'sucursal'
        if current_user.rol != 'sucursal':
            return jsonify({"message": "Acceso denegado. Se requiere rol de Sucursal."}), 403
        # También nos aseguramos que TENGA una sucursal asignada
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

    username = data.get('username')  # <-- El JSON del frontend dice 'username'
    password = data.get('password')

    # CORREGIDO: Mapeamos 'username' del JSON al parámetro 'usuario' de la Entidad
    user_entity = User(0, 0, None, usuario=username, id_branch=0, rol='admin', password=password)

    logged_user = ModelUser.login(db, user_entity)

    if logged_user is not None:
        login_user(logged_user)
        return jsonify({
            "id": logged_user.id,
            "name": logged_user.name,
            # CORREGIDO: Mapeamos de vuelta. El JSON usa 'username', la entidad 'usuario'
            "username": logged_user.usuario,
            "rol": logged_user.rol,
            "id_branch": logged_user.id_branch
        }), 200
    else:
        return jsonify({'message': 'Usuario o contraseña incorrectos'}), 401

@app.route('/api/logout', methods=['POST'])
@csrf.exempt
@login_required  # Solo alguien logueado puede desloguearse
def logout():
    logout_user()
    return jsonify({"message": "Sesión cerrada exitosamente"}), 200


@login_manager_app.user_loader
def load_user(id_user):
    # ModelUser.getById ahora incluye el email
    return ModelUser.getById(db, id_user)


# -----------------------------------------------------------------
# 5. NUEVO: Endpoints de Registro (para Clientes)
# -----------------------------------------------------------------

@app.route('/api/register', methods=['POST'])
@csrf.exempt
def register_user():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No se enviaron datos"}), 400

    try:
        # CORREGIDO: Mapeamos 'username' del JSON al parámetro 'usuario' de la Entidad
        new_user = User(
            id=0,
            name=data['name'],
            email=data['email'],
            usuario=data['username'],  # <-- CORREGIDO
            id_branch=None,
            rol='cliente',
            password=data['password']
        )

        ModelUser.create_user(db, new_user)

        return jsonify({'message': '¡Usuario cliente creado con éxito!'}), 201
    except Exception as ex:
        if '1062' in str(ex):
            return jsonify({'message': 'Error: El email o usuario ya existe.', 'error': str(ex)}), 409
        return jsonify({'message': 'Error en el servidor', 'error': str(ex)}), 500

# -----------------------------------------------------------------
# 6. NUEVO: Endpoints de Gestión de Usuarios (SOLO ADMIN)
# -----------------------------------------------------------------

@app.route('/api/users', methods=['GET'])
@csrf.exempt
@admin_required  # <-- ¡Protegido!
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

    try:
        rol = data.get('rol')
        id_branch = data.get('id_branch', None)

        if rol == 'sucursal' and id_branch is None:
            return jsonify({"message": "Se debe proveer un 'id_branch' para el rol 'sucursal'"}), 400

        if rol != 'sucursal':
            id_branch = None

        # CORREGIDO: Mapeamos 'username' del JSON al parámetro 'usuario' de la Entidad
        new_user = User(
            id=0,
            name=data['name'],
            email=data.get('email', None),
            usuario=data['username'],  # <-- CORREGIDO
            id_branch=id_branch,
            rol=rol,
            password=data['password']
        )

        ModelUser.create_user(db, new_user)
        return jsonify({'message': f'Usuario {rol} creado con éxito'}), 201

    except Exception as ex:
        if '1062' in str(ex):
            return jsonify({'message': 'Error: El email o usuario ya existe.', 'error': str(ex)}), 409
        return jsonify({'message': 'Error en el servidor', 'error': str(ex)}), 500

@app.route('/api/users/<int:id>', methods=['DELETE'])
@csrf.exempt
@admin_required  # <-- ¡Protegido!
def delete_user(id):
    try:
        # Evitar que el admin se borre a sí mismo (opcional pero buena idea)
        if id == current_user.id:
            return jsonify({'message': 'No puedes eliminar tu propia cuenta de administrador'}), 403

        ModelUser.delete_user(db, id)
        return jsonify({'message': 'Usuario eliminado correctamente'}), 200
    except Exception as ex:
        return jsonify({'message': 'Error al eliminar el usuario', 'error': str(ex)}), 500


# -----------------------------------------------------------------
# 7. Endpoints de Gestión de Bebidas (SOLO ADMIN)
# -----------------------------------------------------------------

@app.route('/api/products', methods=['GET'])
def get_products():
    # Esta ruta sigue siendo pública, para que los clientes vean el menú
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
@admin_required  # <-- ¡Protegido!
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
                          data['product_sucursal'])  # El admin elige la sucursal

        insert = ModelDrink.newDrink(db, new_drink)
        if insert:
            return jsonify({'message': 'Producto agregado correctamente'}), 201
        else:
            return jsonify({'message': 'Error al agregar el producto'}), 500
    except Exception as ex:
        return jsonify({'message': 'Error en el servidor', 'error': str(ex)}), 500


@app.route('/api/products/<int:id>', methods=['DELETE'])
@csrf.exempt
@admin_required  # <-- ¡Protegido!
def delete_products(id):
    try:
        ModelDrink.deleteDrink(db, id)
        return jsonify({'message': 'Producto eliminado correctamente'}), 200
    except Exception as ex:
        return jsonify({'message': 'Error al eliminar el producto', 'error': str(ex)}), 500


# -----------------------------------------------------------------
# 8. Endpoints de Gestión de Sucursales (SOLO ADMIN)
# -----------------------------------------------------------------

@app.route('/api/branches', methods=['GET'])
def get_branches():
    # Esta ruta es pública, clientes y admins la necesitan
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
@admin_required  # <-- ¡Protegido!
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
@admin_required  # <-- ¡Protegido!
def delete_branch(id):
    try:
        ModelSucursal.deleteSucursal(db, id)
        return jsonify({'message': 'Sucursal eliminada correctamente'}), 200
    except Exception as ex:
        return jsonify({'message': 'Error al eliminar la sucursal', 'error': str(ex)}), 500


# -----------------------------------------------------------------
# 9. NUEVO: Endpoints de Gestión (SOLO SUCURSAL)
# -----------------------------------------------------------------

@app.route('/api/sucursal/products', methods=['GET'])
@csrf.exempt
@sucursal_required  # <-- ¡Protegido!
def get_sucursal_products():
    """ Obtiene solo los productos de la sucursal del usuario logueado. """
    try:
        # Obtenemos el id_branch del usuario que hace la petición
        sucursal_id = current_user.id_branch

        # Necesitamos una nueva función en ModelDrink
        # (La crearemos en el siguiente paso)
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
@sucursal_required  # <-- ¡Protegido!
def add_sucursal_product():
    """ Agrega un producto a la sucursal del usuario logueado. """
    data = request.get_json()
    if not data:
        return jsonify({"message": "No se enviaron datos"}), 400

    try:
        # Forzamos que el id_sucursal sea el de la sesión, ignorando lo que venga del frontend
        sucursal_id = current_user.id_branch

        new_drink = Drink(0,
                          data['product_name'],
                          data['product_price'],
                          data['product_description'],
                          data['product_image'],
                          sucursal_id)  # <-- ID de sucursal forzado

        insert = ModelDrink.newDrink(db, new_drink)
        if insert:
            return jsonify({'message': 'Producto agregado a tu sucursal'}), 201
        else:
            return jsonify({'message': 'Error al agregar el producto'}), 500
    except Exception as ex:
        return jsonify({'message': 'Error en el servidor', 'error': str(ex)}), 500


@app.route('/api/sucursal/products/<int:id>', methods=['DELETE'])
@csrf.exempt
@sucursal_required  # <-- ¡Protegido!
def delete_sucursal_product(id):
    """ Borra un producto SÓLO SI pertenece a la sucursal del usuario. """
    try:
        sucursal_id = current_user.id_branch

        # Necesitamos una función que verifique la pertenencia
        # (La crearemos en el siguiente paso)
        producto_es_de_sucursal = ModelDrink.checkDrinkOwnership(db, id, sucursal_id)

        if not producto_es_de_sucursal:
            return jsonify({'message': 'No tienes permiso para borrar este producto'}), 403

        # Si es suyo, lo borra
        ModelDrink.deleteDrink(db, id)
        return jsonify({'message': 'Producto eliminado correctamente'}), 200
    except Exception as ex:
        return jsonify({'message': 'Error al eliminar el producto', 'error': str(ex)}), 500


# -----------------------------------------------------------------
# 10. Endpoints de Comentarios (Público)
# -----------------------------------------------------------------
@app.route('/api/comments', methods=['POST'])
@csrf.exempt
def add_comments():
    # ... (Esta sección no cambia, es pública)
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
# 11. NUEVO: Endpoints de Pedidos (SOLO CLIENTE)
# -----------------------------------------------------------------

@app.route('/api/my-orders', methods=['GET'])
@csrf.exempt
@login_required  # <-- ¡Protegido! (Cualquier usuario logueado puede tener pedidos)
def get_my_orders():
    """ Obtiene el historial de pedidos del cliente logueado. """
    try:
        if current_user.rol != 'cliente':
            return jsonify({"message": "Acceso denegado. Solo para clientes."}), 403

        user_id = current_user.id

        # Nueva función en ModelOrder (próximo paso)
        orders = ModelOrder.get_orders_by_user(db, user_id)
        return jsonify(orders), 200

    except Exception as ex:
        return jsonify({'message': 'Error al obtener pedidos', 'error': str(ex)}), 500


@app.route('/api/orders', methods=['POST'])
@csrf.exempt
@login_required  # <-- ¡Protegido!
def create_order():
    """ Crea un nuevo pedido para el cliente logueado. """
    try:
        if current_user.rol != 'cliente':
            return jsonify({"message": "Acceso denegado. Solo los clientes pueden ordenar."}), 403

        data = request.get_json()
        if not data:
            return jsonify({"message": "No se enviaron datos del pedido"}), 400

        user_id = current_user.id
        cart_items = data.get('cartItems')  # Espera una lista de {bebida_id, cantidad, precio}
        total = data.get('total')
        sucursal_id = data.get('sucursal_id')

        if not all([cart_items, total, sucursal_id]):
            return jsonify({"message": "Faltan datos en el pedido"}), 400

        # Nueva función en ModelOrder (próximo paso)
        ModelOrder.create_order(db, user_id, sucursal_id, total, cart_items)

        return jsonify({'message': '¡Pedido creado con éxito!'}), 201
    except Exception as ex:
        return jsonify({'message': 'Error al crear el pedido', 'error': str(ex)}), 500


# -----------------------------------------------------------------
# 12. Rutas y Handlers Genéricos (Sin cambios)
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

# -----------------------------------------------------------------
# 13. Arranque de la App (Sin cambios)
# -----------------------------------------------------------------
if __name__ == '__main__':
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True,
        ssl_context=("frontend/certs/cert.pem", "frontend/certs/key.pem")
    )


