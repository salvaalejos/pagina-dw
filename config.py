class Config():  # Maneja la conexion a la base de datos
    SECRET_KEY = 'KlsJmNOF+aS%qFM^^3'


class DevelopmentConfig(Config):
    DEBUG = True
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = '0451alejos@'
    MYSQL_DB = 'bubble_tea'


class ProductionConfig(Config):
    DEBUG = False
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = 'admin'
    MYSQL_DB = 'bubble_tea'
    # MYSQL_PORT = 3306


config = {

    'development': DevelopmentConfig,
    'production': ProductionConfig
}