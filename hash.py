from werkzeug.security import generate_password_hash

# La contraseña que quieres para tu admin
admin_password = "password"

hashed_password = generate_password_hash(admin_password)

print("\n¡Copia y pega este hash en tu SQL!:\n")
print(hashed_password)
print("\n")