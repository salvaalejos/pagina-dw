from models.Entities.User import User
from werkzeug.security import check_password_hash, generate_password_hash


class ModelUser():

    @classmethod
    def login(self, db, user):
        try:
            cursor = db.connection.cursor()

            # CORREGIDO: Buscamos por 'usuario'
            sql = "SELECT id, nombre, email, usuario, id_sucursal, rol, password FROM usuarios WHERE usuario = %s"
            values = (user.usuario,)  # <-- CORREGIDO
            cursor.execute(sql, values)
            row = cursor.fetchone()

            if row != None:
                hashed_password = row[6]
                if check_password_hash(hashed_password, user.password):
                    # CORREGIDO: El orden de los argumentos ahora es correcto
                    logged_user = User(row[0], row[1], row[2], row[3], row[4], row[5], None)
                    return logged_user
                else:
                    return None
            else:
                return None
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def getById(self, db, id_user):
        try:
            cursor = db.connection.cursor()
            # CORREGIDO: Buscamos por 'usuario'
            sql = "SELECT id, nombre, email, usuario, id_sucursal, rol FROM usuarios WHERE id = %s"
            values = (id_user,)
            cursor.execute(sql, values)
            row = cursor.fetchone()
            if row != None:
                # CORREGIDO: El orden de los argumentos
                user = User(row[0], row[1], row[2], row[3], row[4], row[5], None)
                return user
            else:
                return None
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def create_user(self, db, user):
        try:
            cursor = db.connection.cursor()
            hashed_password = generate_password_hash(user.password)

            # CORREGIDO: SQL usa 'usuario'
            sql = """INSERT INTO usuarios (nombre, email, usuario, id_sucursal, rol, password) 
                     VALUES (%s, %s, %s, %s, %s, %s)"""

            # CORREGIDO: Pasamos user.usuario
            values = (user.name, user.email, user.usuario, user.id_branch, user.rol, hashed_password)

            cursor.execute(sql, values)
            db.connection.commit()
            return True
        except Exception as ex:
            db.connection.rollback()
            raise Exception(ex)

    @classmethod
    def get_all_users(self, db):
        try:
            cursor = db.connection.cursor()
            # CORREGIDO: SQL usa 'usuario'
            sql = "SELECT id, nombre, email, usuario, id_sucursal, rol FROM usuarios"
            cursor.execute(sql)
            result = cursor.fetchall()

            users_list = []
            if result is not None:
                for row in result:
                    users_list.append({
                        "id": row[0],
                        "nombre": row[1],
                        "email": row[2],
                        # CORREGIDO: Mapeamos la columna 'usuario' (row[3])
                        # de vuelta a 'username' para que el JSON sea consistente
                        # con lo que el frontend espera.
                        "username": row[3],
                        "id_sucursal": row[4],
                        "rol": row[5]
                    })
            return users_list
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def delete_user(self, db, id_user):
        try:
            cursor = db.connection.cursor()
            sql = "DELETE FROM usuarios WHERE id = %s"
            values = (id_user,)
            cursor.execute(sql, values)
            db.connection.commit()
            return True
        except Exception as ex:
            db.connection.rollback()
            raise Exception(ex)