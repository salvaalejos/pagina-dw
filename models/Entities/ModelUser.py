from models.Entities.User import User

class ModelUser():
    @classmethod
    def login(self, db, user):
        try:
            cursor = db.connection.cursor()
            sql = "SELECT * FROM usuarios WHERE usuario = %s AND password = %s"
            values = (user.username, user.password)
            cursor.execute(sql, values)
            row = cursor.fetchone()
            if row != None:
                user = User(row[0], row[1], row[2], row[3], row[4], row[5])
                return user
            else:
                return None
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def getById(self, db, id_user):
        try:
            cursor = db.connection.cursor()
            sql = "SELECT * FROM usuarios WHERE id = %s"
            values = (id_user,)
            cursor.execute(sql, values)
            row = cursor.fetchone()
            if row != None:
                user = User(row[0], row[1], row[2], row[3], row[4], row[5])
                return user
            else:
                return None
        except Exception as ex:
            raise Exception(ex)