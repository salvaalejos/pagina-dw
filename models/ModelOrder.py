from .Entities.Order import Order
from .Entities.Drink import Drink  # Necesitamos las entidades
import datetime


class ModelOrder():

    @classmethod
    def create_order(self, db, user_id, sucursal_id, total, cart_items):
        """
        Crea un nuevo pedido. Es una transacción:
        1. Inserta en la tabla 'pedidos'.
        2. Inserta cada bebida en la tabla 'pedido_bebidas'.
        """
        try:
            cursor = db.connection.cursor()

            # 1. Insertar el pedido principal
            sql_pedido = """INSERT INTO pedidos (user_id, sucursal_id, total, fecha) 
                            VALUES (%s, %s, %s, %s)"""
            values_pedido = (user_id, sucursal_id, total, datetime.datetime.now())

            cursor.execute(sql_pedido, values_pedido)

            # Obtener el ID del pedido que acabamos de insertar
            pedido_id = cursor.lastrowid

            if not pedido_id:
                raise Exception("No se pudo obtener el ID del nuevo pedido.")

            # 2. Preparar las bebidas para 'pedido_bebidas'
            # cart_items es una lista de diccionarios: [{'bebida_id': 1, 'cantidad': 2, 'precio': 15.99}, ...]

            sql_bebidas = """INSERT INTO pedido_bebidas (pedido_id, bebida_id, cantidad, precio_unitario) 
                             VALUES (%s, %s, %s, %s)"""

            # Creamos una lista de tuplas para insertar todas las bebidas de una vez
            values_bebidas = []
            for item in cart_items:
                values_bebidas.append(
                    (pedido_id, item['bebida_id'], item['cantidad'], item['precio_unitario'])
                )

            # cursor.executemany() es mucho más rápido que un bucle
            cursor.executemany(sql_bebidas, values_bebidas)

            # 3. Si todo salió bien, guardamos los cambios
            db.connection.commit()
            return True

        except Exception as ex:
            # Si algo falla (ej. una bebida no existe), revertimos TODO
            db.connection.rollback()
            raise Exception(ex)

    @classmethod
    def get_orders_by_user(self, db, user_id):
        """
        Obtiene el historial de pedidos de un cliente, incluyendo el detalle
        de las bebidas en cada pedido.
        """
        try:
            cursor = db.connection.cursor()

            # 1. Obtener todos los pedidos del usuario
            sql_pedidos = """SELECT id, sucursal_id, total, fecha 
                             FROM pedidos 
                             WHERE user_id = %s 
                             ORDER BY fecha DESC"""
            cursor.execute(sql_pedidos, (user_id,))
            pedidos_rows = cursor.fetchall()

            pedidos_list = []
            if not pedidos_rows:
                return []  # El usuario no tiene pedidos

            # 2. Para cada pedido, buscar sus bebidas
            for pedido_row in pedidos_rows:
                pedido_id = pedido_row[0]

                # Consulta que une 'pedido_bebidas' con 'bebidas' para obtener los nombres
                sql_detalle = """SELECT pb.cantidad, pb.precio_unitario, b.nombre, b.imagen
                                 FROM pedido_bebidas pb
                                 JOIN bebidas b ON pb.bebida_id = b.id
                                 WHERE pb.pedido_id = %s"""

                cursor.execute(sql_detalle, (pedido_id,))
                bebidas_rows = cursor.fetchall()

                bebidas_list = []
                for bebida_row in bebidas_rows:
                    bebidas_list.append({
                        "cantidad": bebida_row[0],
                        "precio_unitario": float(bebida_row[1]),
                        "nombre": bebida_row[2],
                        "imagen": bebida_row[3]
                    })

                pedidos_list.append({
                    "id": pedido_id,
                    "sucursal_id": pedido_row[1],
                    "total": float(pedido_row[2]),
                    "fecha": pedido_row[3].strftime('%Y-%m-%d %H:%M:%S'),
                    "bebidas": bebidas_list  # Anidamos la lista de bebidas
                })

            return pedidos_list

        except Exception as ex:
            raise Exception(ex)