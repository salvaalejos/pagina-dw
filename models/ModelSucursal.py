from .Entities.Topping import Topping


class ModelSucursal():
    @classmethod
    def getSucursales(self, db):
        try:
            cursor = db.connection.cursor()
            query = f"SELECT * FROM toppings ORDER BY id DESC"
            cursor.execute(query)
            result = cursor.fetchall()
            if result is not None:
                return result
            else:
                return False
        except Exception as ex:
            raise Exception(ex)
