from .Entities.Drink import Drink


class ModelDrink():
    @classmethod
    def getDrinks(cls, db):
        try:
            cursor = db.connection.cursor()
            cursor.execute("SELECT * FROM bebidas ORDER BY id DESC LIMIT 1")
            total = cursor.fetchone()[0]
            return total
        except Exception as ex:
            raise Exception(ex)

