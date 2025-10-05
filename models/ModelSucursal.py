from .Entities.Topping import Topping


class ModelSucursal():
    @classmethod
    def getSucursales(self, db):
        try:
            cursor = db.connection.cursor()
            query = f"SELECT * FROM sucursales ORDER BY id DESC"
            cursor.execute(query)
            result = cursor.fetchall()
            if result is not None:
                return result
            else:
                return False
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def newSucursal(self, db, sucursal):
        try:
            cursor = db.connection.cursor()
            sql = "INSERT INTO sucursales (nombre, direccion, telefono) VALUES (%s, %s, %s)"
            values = (sucursal.name, sucursal.adress, sucursal.phone)
            cursor.execute(sql, values)
            db.connection.commit()
            return True
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def deleteSucursal(self, db, id):
        try:
            cursor = db.connection.cursor()
            sql = "DELETE FROM sucursales WHERE id = %s"
            values = (id,)
            cursor.execute(sql, values)
            sql_drinks = "DELETE FROM bebidas WHERE id_sucursal = %s"
            cursor.execute(sql_drinks, values)
            db.connection.commit()
            return True
        except Exception as ex:
            raise Exception(ex)