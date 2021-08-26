# Proyecto SAIA

## Importante
Rocco Sada

API url https://mazos.herokuapp.com/

Esta aplicacion representa una API, para ser consumida con un cliente como Postman o Insomnia

### En Usuario:
- Crea un usuario sin emails repetidos POST: /api/usuario
    Body: 'nombre', 'apellido' e 'email' (los tres son obligatorios)
- obtiene todos los usuarios GET /api/usuario
- Obtiene usuario por ID con sus medallas y Mazos GET /api/usuario/id
- Modifica usuario por ID PATCH /api/usuario/id
    Body: 'nombre', 'apellido' o 'email'  (al menos uno es obligatorio)
- Elimina un usuario por id DELETE /api/usuario/id
- Agrega una medalla al usuario POST /api/usuario/add
    Body: 'email' y 'nombre' (ambos son obligatorios)

### En Tarjeta:
- Crea una tarjeta sin nombres repetidos y asociada a un Mazo POST /api/tarjeta
    Body: 'titulo', 'contenido' y 'mazo' (los tres son obligatorios)
- Obtiene todas las tarjetas GET /api/tarjeta
- Modifica una tarjeta por ID PATCH /api/tarjeta/id
    Body: 'titulo' y/o 'contenido' (al menos uno es obligatorio)
- Elimina una tarjeta por ID DELETE /api/tarjeta/id

### En Medalla:
- Crea una medalla sin nombres repetidos POST /api/medalla
    Body: 'nombre', 'descripcion' y 'puntos' (los tres son obligatorios)
- Obtiene todas las medallas GET /api/medalla
- Modifica una medalla por ID PATCH /api/medalla
    Body: 'nombre','descripcion','puntos' (al menos uno es obligatorio)
-  Elimina una medalla por ID DELETE /api/medalla

### En Mazo: 
- Crea un Mazo sin nombres repetidos y asociado a un Usuario POST /api/mazo
    Body: 'nombre','descripcion','email' del usuario al cual pertence el mazo (los tres son obligatorios)
- Obtiene un mazo por ID asociado con sus tarjetas GET /api/mazo/id
- Obtiene todos los mazos GET /api/mazo
- Modifica un Mazo por ID PATCH /api/mazo/id
    Body: 'nombre', 'descripcion' y/o 'completado' (al menos uno es obligatorio)
- Elimina un mazo por ID DELETE /api/mazo/id
