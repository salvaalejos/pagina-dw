from flask_login import UserMixin

class User(UserMixin):
    # CAMBIO: 'username' ahora es 'usuario'
    def __init__(self, id, name, email, usuario, id_branch, rol, password) -> None:
        self.id = id
        self.name = name
        self.email = email
        self.usuario = usuario  # <-- CORREGIDO
        self.id_branch = id_branch
        self.rol = rol
        self.password = password

    def get_id(self):
        return str(self.id)