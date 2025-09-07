class Config():  # Maneja la conexion a la base de datos
    SECRET_KEY = 'KlsJmNOF+aS%qFM^^3'


class DevelopmentConfig(Config):
    DEBUG = True
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = '123456'
    MYSQL_DB = 'nombreBDD'


class ProductionConfig(Config):
    DEBUG = False
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'usuario'
    MYSQL_PASSWORD = 'password'
    MYSQL_DB = 'nombreBDD'
    # MYSQL_PORT = 3306


config = {

    'development': DevelopmentConfig,
    'production': ProductionConfig
}