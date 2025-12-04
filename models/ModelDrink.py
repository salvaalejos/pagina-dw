from .Entities.Drink import Drink


class ModelDrink():

    @classmethod
    def getDrinks(cls, db):
        """
        Obtiene TODAS las bebidas de TODAS las sucursales.
        (Para el menú público del cliente y el admin).
        """
        try:
            cursor = db.connection.cursor()
            cursor.execute("SELECT * FROM bebidas ORDER BY id_sucursal, nombre")  # Ordenamos por sucursal
            result = cursor.fetchall()
            if result is not None:
                return result
            else:
                return []
        except Exception as ex:
            raise Exception(ex)

    # --- NUEVA FUNCIÓN PARA ROL 'SUCURSAL' ---
    @classmethod
    def getDrinksBySucursal(cls, db, sucursal_id):
        """
        Obtiene las bebidas de UNA sucursal específica.
        (Para el dashboard del usuario 'sucursal').
        """
        try:
            cursor = db.connection.cursor()
            sql = "SELECT * FROM bebidas WHERE id_sucursal = %s ORDER BY nombre"
            values = (sucursal_id,)
            cursor.execute(sql, values)
            result = cursor.fetchall()
            if result is not None:
                return result
            else:
                return []
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def newDrink(cls, db, drink):
        try:
            cursor = db.connection.cursor()
            sql = "INSERT INTO bebidas (nombre, precio, descripcion, imagen, id_sucursal) VALUES (%s, %s, %s, %s, %s)"
            values = (drink.name, drink.price, drink.description, drink.image, drink.sucursal)
            cursor.execute(sql, values)
            db.connection.commit()
            return True
        except Exception as ex:
            db.connection.rollback()
            raise Exception(ex)

    @classmethod
    def deleteDrink(cls, db, id):
        try:
            cursor = db.connection.cursor()

            # PASO 1: Eliminar la bebida de los pedidos históricos
            # Esto elimina la restricción (FOREIGN KEY) sin tocar la estructura de la BD.
            # Nota: El pedido seguirá existiendo, pero esta bebida desaparecerá de él.
            sql_remove_dependencies = "DELETE FROM pedido_bebidas WHERE bebida_id = %s"
            cursor.execute(sql_remove_dependencies, (id,))

            # PASO 2: Ahora que está "libre", borramos la bebida
            sql_delete_drink = "DELETE FROM bebidas WHERE id = %s"
            cursor.execute(sql_delete_drink, (id,))

            db.connection.commit()
            return True
        except Exception as ex:
            db.connection.rollback()
            raise Exception(ex)

    # --- NUEVA FUNCIÓN DE SEGURIDAD PARA ROL 'SUCURSAL' ---
    @classmethod
    def checkDrinkOwnership(cls, db, drink_id, sucursal_id):
        """
        Verifica si una bebida (drink_id) pertenece a una sucursal (sucursal_id).
        Retorna True si es dueña, False si no.
        """
        try:
            cursor = db.connection.cursor()
            sql = "SELECT id FROM bebidas WHERE id = %s AND id_sucursal = %s"
            values = (drink_id, sucursal_id)
            cursor.execute(sql, values)
            result = cursor.fetchone()
            # Si fetchone() devuelve algo, significa que la bebida sí es de esa sucursal
            return result is not None
        except Exception as ex:
            raise Exception(ex)