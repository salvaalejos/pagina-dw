from .Entities.Comment import Comment

class ModelComment():
    @classmethod
    def newComment(self, db, comment: Comment):
        try:
            cursor = db.connection.cursor()
            query = f"INSERT INTO comments (name, email, message) VALUES ('{comment.name}', '{comment.email}', '{comment.message}')"
            cursor.execute(query)
            result = cursor.fetchall()
            if result is not None:
                return result
            else:
                return False
        except Exception as ex:
            raise Exception(ex)
