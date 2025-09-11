from .Entities.Topping import Topping


class ModelEncuestado():
    @classmethod
    def getToppings(self, db):
        try:
            cursor = db.connection.cursor()
            query = f"SELECT * FROM toppings ORDER BY id DESC"
            cursor.execute(query)
            resultado = cursor.fetchall()
            toppings = []
            if resultado:
                for row in resultado:
                    id_topping = row[0]
                    name = row[1]
                    extra = row[2]
                    topping = Topping(id_topping, name, extra)
                    toppings.append(topping)
                return toppings
            else:
                return False
        except Exception as ex:
            raise Exception(ex)
