# Proyecto SAIA
Rocco Sada

## En Usuario:
- Crea un usuario sin emails repetidos POST: /api/user
- obtiene todos los usuarios GET /api/user
- Obtiene usuario por ID con sus medallas y Mazos GET /api/user/id
- Modifica usuario por ID PATCH /api/user/id
- Elimina un usuario por id DELETE /api/user/id
- Agrega una medalla al usuario POST /api/user/add

## En Tarjeta:
- Crea una tarjeta sin nombres repetidos y asociada a un Mazo POST /api/tarjeta
- Obtiene todas las tarjetas GET /api/tarjeta
- Modifica una tarjeta por ID PATCH /api/tarjeta/id
- Elimina una tarjeta por ID DELETE /api/tarjeta/id

## En Medalla:
- Crea una medalla sin nombres repetidos POST /api/medalla
- Obtiene todas las medallas GET /api/medalla
- Modifica una medalla por ID PATCH /api/medalla
-  Elimina una medalla por ID DELETE /api/medalla

## En Mazo: 
- Crea un Mazo sin nombres repetidos y asociado a un Usuario POST /api/mazo
- Obtiene todos los mazos cada uno asociado con sus tarjetas GET /api/mazo
- Modifica un Mazo por ID PATCH /api/mazo/id
- Elimina un mazo por ID DELETE /api/mazo/id
