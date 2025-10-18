from .Entities.Drink import Drink


class ModelDrink():
    @classmethod
    def getDrinks(cls, db):
        try:
            cursor = db.connection.cursor()
            cursor.execute("SELECT * FROM bebidas ORDER BY id")
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
            raise Exception(ex)

    @classmethod
    def deleteDrink(cls, db, id):
        try:
            cursor = db.connection.cursor()
            sql = "DELETE FROM bebidas WHERE id = %s"
            values = (id,)
            cursor.execute(sql, values)
            db.connection.commit()
            return True
        except Exception as ex:
            raise Exception(ex)