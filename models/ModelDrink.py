from .Entities.Drink import Drink


class ModelDrink():
    @classmethod
    def getDrinks(cls, db):
        try:
            cursor = db.connection.cursor()
            cursor.execute("SELECT * FROM bebidas ORDER BY id DESC LIMIT 1")
            result = cursor.fetchall()
            if result is not None:
                return result
            else:
                return False
        except Exception as ex:
            raise Exception(ex)

