from datetime import datetime


class ModelLog():

    @classmethod
    def add(cls, db, usuario, accion, detalle, ip):
        """
        Registra un evento en la bitácora.
        """
        try:
            cursor = db.connection.cursor()
            sql = """INSERT INTO bitacora (fecha, usuario, accion, detalle, ip)
                     VALUES (%s, %s, %s, %s, %s)"""

            fecha_actual = datetime.now()
            values = (fecha_actual, usuario, accion, detalle, ip)

            cursor.execute(sql, values)
            db.connection.commit()
            return True
        except Exception as ex:
            # Si falla el log, lo imprimimos en consola pero no rompemos la app
            print(f"Error al guardar log: {ex}")
            db.connection.rollback()
            return False

    @classmethod
    def get_logs(cls, db):
        """
        Obtiene todos los registros ordenados del más reciente al más antiguo.
        """
        try:
            cursor = db.connection.cursor()
            sql = "SELECT id, fecha, usuario, accion, detalle, ip FROM bitacora ORDER BY fecha DESC"
            cursor.execute(sql)
            rows = cursor.fetchall()

            logs = []
            if rows:
                for row in rows:
                    logs.append({
                        "id": row[0],
                        "fecha": row[1].strftime('%Y-%m-%d %H:%M:%S'),  # Formateamos la fecha
                        "usuario": row[2],
                        "accion": row[3],
                        "detalle": row[4],
                        "ip": row[5]
                    })
            return logs
        except Exception as ex:
            raise Exception(ex)