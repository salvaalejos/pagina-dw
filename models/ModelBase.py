from .Entities.Base import Base

class ModelEncuestado():
    @classmethod
    def getBases(self, db):
        try:
            cursor = db.connection.cursor()
            query = f"SELECT * FROM bases ORDER BY id DESC"
            cursor.execute(query)
            resultado = cursor.fetchall()
            bases = []
            if resultado:
                for row in resultado:
                    id_base = row[0]
                    name = row[1]
                    price = row[2]
                    base = Base(id_base, name, price)
                    bases.append(base)
                return bases
            else:
                return False
        except Exception as ex:
            raise Exception(ex)
