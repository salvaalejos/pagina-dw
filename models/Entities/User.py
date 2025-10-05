from flask_login import UserMixin

class User(UserMixin):
    def __init__(self, id, name, username, id_branch, rol, password) -> None:
        self.id = id
        self.name = name
        self.username = username
        self.id_branch = id_branch
        self.rol = rol
        self.password = password

    def get_id(self):
        return str(self.id)