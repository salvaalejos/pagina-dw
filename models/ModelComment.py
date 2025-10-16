from .Entities.Comment import Comment


class ModelComment():
    @classmethod
    def newComment(self, db, comment: Comment):
        try:
            cursor = db.connection.cursor()

            # -----------------
            # CORRECCIÓN IMPORTANTE
            # -----------------

            # 1. La consulta ahora es "parametrizada" (usa %s).
            #    Esto previene Inyección SQL. ¡Nunca uses f-strings para armar consultas!
            sql = "INSERT INTO comments (name, email, message) VALUES (%s, %s, %s)"

            # 2. Los valores se pasan como una tupla separada.
            values = (comment.name, comment.email, comment.message)

            cursor.execute(sql, values)

            # 3. ¡Lo más importante! Hacemos "commit" para guardar los cambios.
            db.connection.commit()

            # 4. Devolvemos True para que app.py sepa que todo salió bien.
            return True

        except Exception as ex:
            # Si algo sale mal, revertimos los cambios (rollback) y lanzamos la excepción
            db.connection.rollback()
            raise Exception(ex)