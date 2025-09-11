from .Entities.Order import Order


class ModelEncuestado():
    @classmethod
    def newOrder(cls, db, order = Order):
        try:
            cursor = db.connection.cursor()
            cursor.execute("SELECT * FROM orders ORDER BY id DESC LIMIT 1")
            total = cursor.fetchone()[0]
            return total
        except Exception as ex:
            raise Exception(ex)

