# 8-turnos-BE - Sistema de Gestión de Turnos (Paginación, Filtros, Poblado de Colecciones y Validación con Zod)

Octava iteración del backend para la gestión de turnos y servicios. En este proyecto se optimiza la escalabilidad, la integridad de los datos y el rendimiento mediante la incorporación de **Paginación y Filtrado indexado con Mongoose Paginate v2**, **Validación estricta de esquemas con Zod**, y **Poblado relacional de documentos (Mongoose Population)** entre reservas y servicios.

---

## 📋 Descripción y Nuevas Actualizaciones

En comparación con `7-turnos-BE`, esta versión implementa cuatro avances arquitectónicos fundamentales:

1. **Validación de Esquemas en Tiempo de Ejecución con Zod (`zod`)**:
   - Se crea el middleware reutilizable [`validateBody`](file:///c:/Users/feder/OneDrive/Escritorio/Coderhouse/8-turnos-BE/src/middlewares/validate.js) para interceptar las peticiones antes de los controladores.
   - Definición de esquemas rigurosos en [`src/validations/`](file:///c:/Users/feder/OneDrive/Escritorio/Coderhouse/8-turnos-BE/src/validations/):
     - [`service.validation.js`](file:///c:/Users/feder/OneDrive/Escritorio/Coderhouse/8-turnos-BE/src/validations/service.validation.js): Validación para creación (`createServiceSchema`) y actualización parcial (`updateServiceSchema`).
     - [`booking.validation.js`](file:///c:/Users/feder/OneDrive/Escritorio/Coderhouse/8-turnos-BE/src/validations/booking.validation.js): Validación de emails, formatos de fecha ISO, hora y enums de estado.
2. **Paginación y Filtros con `mongoose-paginate-v2`**:
   - Integración del plugin de paginación en [`services.model.js`](file:///c:/Users/feder/OneDrive/Escritorio/Coderhouse/8-turnos-BE/src/models/services.model.js).
   - Consulta paginada por `limit` y `page` en el catálogo de servicios.
   - Filtrado dinámico por categoría (`category`) y disponibilidad (`available`), con índices en MongoDB para optimizar las consultas.
   - La vista SSR [`services.handlebars`](file:///c:/Users/feder/OneDrive/Escritorio/Coderhouse/8-turnos-BE/src/views/services.handlebars) incluye controles visuales interactivos de paginación ("Anterior" y "Siguiente").
3. **Poblado de Colecciones (Mongoose Population)**:
   - En [`bookings.model.js`](file:///c:/Users/feder/OneDrive/Escritorio/Coderhouse/8-turnos-BE/src/models/bookings.model.js), los servicios asociados ahora se referencian mediante `type: mongoose.Types.ObjectId, ref: "services"`.
   - [`BookingsDAO`](file:///c:/Users/feder/OneDrive/Escritorio/Coderhouse/8-turnos-BE/src/dao/bookings.dao.js) aplica `.populate("services.service")`, permitiendo obtener la reserva con la información completa de cada servicio (nombre, descripción, duración, precio) en lugar de solo su identificador.
4. **Mantenimiento del Ecosistema Previo**:
   - Persistencia en MongoDB Atlas.
   - Vistas con motor de plantillas **Handlebars**.
   - Notificaciones y actualización en tiempo real mediante **WebSockets (Socket.io)** (`changes-on-service`, `changes-on-bookings`).
   - Prefijado de la API REST bajo `/api/services` y `/api/bookings`.

---

## 🏛️ Arquitectura del Sistema con Validaciones y Paginación

```mermaid
flowchart TD
    Client(["Cliente / Navegador / Postman"])
    
    subgraph RoutingAndValidation ["Ruteo y Middlewares"]
        Router["Router (/api/services, /api/bookings)"]
        ValidateMiddleware["Middleware validateBody(schema)<br>• safeParse con Zod<br>• 400 Bad Request si falla"]
        ZodSchemas["Esquemas Zod<br>• createServiceSchema<br>• updateServiceSchema<br>• createBookingSchema"]
    end

    subgraph ControllersLayer ["Capa Controladores"]
        Ctrl["Controllers<br>• Extrae query / params / body limpio"]
    end

    subgraph BusinessLayer ["Lógica de Negocio"]
        ServicesLayer["Services<br>• Reglas de negocio<br>• Filtros & Opciones de Paginación"]
    end

    subgraph DataAccessLayer ["Acceso a Datos y Persistencia"]
        Repo["Repositories"]
        DAO["DAOs<br>• paginate() con lean: true<br>• find() / findById() con .populate()"]
        Mongo[("MongoDB Atlas<br>• Índices en category y available<br>• Relación bookings -> services")]
    end

    Client -->|HTTP Request| Router
    Router -->|Pasa por middleware| ValidateMiddleware
    ValidateMiddleware -.->|Aplica reglas| ZodSchemas
    ValidateMiddleware -->|Body Válido| Ctrl
    Ctrl --> ServicesLayer
    ServicesLayer --> Repo
    Repo --> DAO
    DAO <-->|Paginación / Populate| Mongo
    
    Ctrl -->|HTTP Response { status, payload }| Client
```

---

## 🛠️ Requisitos Previos

- **Node.js** (versión 18 o superior)
- **npm**
- Instancia activa de **MongoDB** (local o en la nube con MongoDB Atlas)

---

## ⚙️ Variables de Entorno

Crea el archivo `.env` en la raíz de `8-turnos-BE` a partir de `.env.example`:

```env
PORT=8080
NODE_ENV=development
MONGO_DB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<nombre-bd>
```

| Variable | Tipo | Obligatoria | Descripción |
| :--- | :--- | :--- | :--- |
| `PORT` | Number | Sí | Puerto donde escucha el servidor HTTP |
| `NODE_ENV` | String | Sí | Modo de ejecución (`development` / `production`) |
| `MONGO_DB_URI` | String | Sí | Cadena de conexión URI a MongoDB Atlas |

---

## 📦 Cómo Instalar

1. Navega hasta el directorio del proyecto:
   ```bash
   cd 8-turnos-BE
   ```

2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   ```bash
   cp .env.example .env
   ```
   *(En PowerShell: `Copy-Item .env.example .env`)*

---

## 🚀 Cómo Ejecutar

- **Modo Desarrollo** (recarga en caliente al modificar archivos):
  ```bash
  npm run dev
  ```

- **Modo Producción**:
  ```bash
  npm start
  ```

---

## 📁 Estructura del Proyecto

```text
8-turnos-BE/
├── .env.example
├── package.json
├── src/
│   ├── app.js                          # Configuración de Express, Handlebars y estáticos
│   ├── server.js                       # Servidor HTTP, Socket.io y conexión a MongoDB
│   ├── utils.js                        # Definición de __dirname
│   ├── config/
│   │   ├── database.config.js          # Conexión Mongoose a MongoDB
│   │   └── env.config.js               # Validación de variables de entorno
│   ├── controllers/                    # Controladores HTTP y emisión Socket.io
│   │   ├── bookings.controller.js
│   │   └── services.controller.js
│   ├── services/                       # Lógica de negocio y armado de filtros
│   │   ├── bookings.service.js
│   │   └── services.service.js
│   ├── repositories/                   # Capa de repositorios
│   │   ├── bookings.repository.js
│   │   └── services.repository.js
│   ├── dao/                            # DAOs con paginate() y populate()
│   │   ├── bookings.dao.js
│   │   └── services.dao.js
│   ├── models/                         # Modelos y Schemas Mongoose
│   │   ├── bookings.model.js           # Schema con referencia ref: 'services'
│   │   └── services.model.js           # Schema con plugin mongoose-paginate-v2 e índices
│   ├── middlewares/                    # [NUEVO] Middlewares de validación
│   │   └── validate.js                 # validateBody(schema)
│   ├── validations/                    # [NUEVO] Esquemas de validación Zod
│   │   ├── booking.validation.js       # createBookingSchema
│   │   └── service.validation.js       # createServiceSchema & updateServiceSchema
│   ├── public/                         # Estáticos y clientes Socket.io
│   │   ├── css/
│   │   │   └── index.css
│   │   └── js/
│   │       ├── bookings.js
│   │       └── services.js
│   ├── routes/                         # Enrutadores Express
│   │   ├── booking.router.js           # /api/bookings con validación de body
│   │   ├── services.router.js          # /api/services con validación de body
│   │   └── views.router.js             # /services y /bookings (SSR)
│   ├── views/                          # Plantillas Handlebars
│   │   ├── bookings.handlebars         # Vista con servicios poblados
│   │   ├── services.handlebars         # Vista con paginador (prevPage, nextPage)
│   │   └── layouts/
│   │       └── main.handlebars
│   └── utils/
│       └── http.js
```

---

## 🛡️ Validaciones Aplicadas con Zod

El sistema utiliza la biblioteca **Zod** para validar y sanitizar el cuerpo de las peticiones antes de que lleguen a la capa de controladores mediante el middleware `validateBody(schema)`:

```javascript
// src/middlewares/validate.js
export const validateBody = schema => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ message: result.error.issues[0].message });
        }
        req.body = result.data;
        next();
    };
};
```

### 1. Esquema de Servicios ([`service.validation.js`](file:///c:/Users/feder/OneDrive/Escritorio/Coderhouse/8-turnos-BE/src/validations/service.validation.js))

| Campo | Reglas Zod | Mensaje de Error |
| :--- | :--- | :--- |
| `name` | `z.string().trim().min(2)` | *"El nombre debe tener al menos dos caracteres"* |
| `description` | `z.string().trim().min(5)` | *"La descripcion debe tener al menos 5 caracteres"* |
| `duration` | `z.number().int().positive()` | *"La duración debe ser un número entero mayor que 0"* |
| `price` | `z.number().min(0)` | *"El precio no puede ser negativo"* |
| `category` | `z.string().trim().min(5)` | *"La categoria debe tener al menos 2 caracteres"* |
| `available` | `z.boolean().optional()` | *"La dispoibilidad debe ser true o false"* |

- **`createServiceSchema`**: `.strict()` — Rechaza cualquier campo adicional no declarado en el esquema.
- **`updateServiceSchema`**: `.partial().strict().refine(...)` — Permite actualizar campos de forma individual, pero exige enviar **al menos un campo** válido para actualizar.

#### Ejemplo de Error de Validación (400 Bad Request):
Si se envía un precio negativo en `POST /api/services`:
```bash
curl -X POST http://localhost:8080/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Corte Clásico",
    "description": "Corte con tijera",
    "duration": 30,
    "price": -500,
    "category": "Peluquería"
  }'
```
**Respuesta:**
```json
{
  "message": "El precio no puede ser negativo"
}
```

---

### 2. Esquema de Reservas ([`booking.validation.js`](file:///c:/Users/feder/OneDrive/Escritorio/Coderhouse/8-turnos-BE/src/validations/booking.validation.js))

| Campo | Reglas Zod | Mensaje de Error |
| :--- | :--- | :--- |
| `clientName` | `z.string().trim().min(2)` | *"El nombre debe tener al menos dos caracteres"* |
| `clientEmail` | `z.email().trim().min(5)` | *"La descripcion debe ser un texto en formato email"* |
| `date` | `z.iso.date()` | *"La fecha debe venir en formato YYYY-MM-DD"* |
| `time` | `z.iso.time()` | *"La hora debe venir en HH:MM"* |
| `status` | `z.enum(["active", "inactive"])` | *"El estado solo puede ser active o inactive"* |
| `services` | `z.array(z.object({ service: string, quantity: number })).optional()` | Valida el ID y cantidad del servicio si se provee |

---

## 🔍 Filtros, Paginación y Ordenamiento

La consulta de servicios (`GET /api/services`) está potenciada por **`mongoose-paginate-v2`** y soporta parámetros de búsqueda mediante `query strings`.

### 1. Parámetros de Consulta Soportados

| Parámetro | Tipo | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `page` | Number | `1` | Número de página a consultar |
| `limit` | Number | `10` | Cantidad de documentos por página |
| `category` | String | *Ninguno* | Filtra exactamente por la categoría indicada (campo indexado) |
| `available` | Boolean | *Ninguno* | Filtra por disponibilidad (`true` o `false`, campo indexado) |
| `sort` | String / Object | *Ninguno* | Ordenamiento de resultados (ej: por precio o nombre) |

---

### 2. Ejemplos de Consultas

#### A. Paginación Básica (Página 1 con 2 resultados por página):
```bash
curl -X GET "http://localhost:8080/api/services?page=1&limit=2"
```

#### B. Filtro por Categoría:
```bash
curl -X GET "http://localhost:8080/api/services?category=Peluquería"
```

#### C. Filtro por Disponibilidad:
```bash
curl -X GET "http://localhost:8080/api/services?available=true"
```

#### D. Filtro Combinado con Paginación:
```bash
curl -X GET "http://localhost:8080/api/services?category=Estética&available=true&page=1&limit=5"
```

#### E. Estructura de Respuesta Paginada (Payload de Mongoose Paginate):
```json
{
  "status": "success",
  "payload": {
    "docs": [
      {
        "_id": "664f1a23e59b1a03f491c011",
        "name": "Corte y Peinado",
        "description": "Lavado, corte personalizado y peinado",
        "duration": 45,
        "price": 11000,
        "category": "Peluquería",
        "available": true
      },
      {
        "_id": "664f208ce59b1a03f491c019",
        "name": "Coloración Balayage",
        "description": "Técnica balayage con nutrición",
        "duration": 120,
        "price": 38000,
        "category": "Peluquería",
        "available": true
      }
    ],
    "totalDocs": 15,
    "limit": 2,
    "totalPages": 8,
    "page": 1,
    "pagingCounter": 1,
    "hasPrevPage": false,
    "hasNextPage": true,
    "prevPage": null,
    "nextPage": 2
  }
}
```

---

## 🔗 Cómo Consultar una Reserva con Servicios Completos (Mongoose Populate)

En entregas anteriores, los turnos solo almacenaban un string con el ID del servicio. En `8-turnos-BE`, el esquema de reservas define una referencia relacional directa:

```javascript
// src/models/bookings.model.js
services: {
    type: [{
        service: {
            type: mongoose.Types.ObjectId,
            ref: "services", // Referencia a la colección 'services'
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    default: [],
    required: true
}
```

En la capa DAO ([`bookings.dao.js`](file:///c:/Users/feder/OneDrive/Escritorio/Coderhouse/8-turnos-BE/src/dao/bookings.dao.js)), se utiliza el método `.populate("services.service")`:

```javascript
async getById(id) {
    const booking = await BookingModel.findById(id).populate("services.service").lean();
    return booking;
}
```

### Ejemplo de Consulta:

```bash
curl -X GET http://localhost:8080/api/bookings/664f22abe59b1a03f491c025
```

### Respuesta con Servicios Completamente Poblados:
Observe cómo la propiedad `service` contiene **todo el objeto del servicio** (nombre, descripción, duración, precio, etc.) y no solo un ID:

```json
{
  "status": "success",
  "payload": {
    "_id": "664f22abe59b1a03f491c025",
    "clientName": "Ana Morales",
    "clientEmail": "ana.morales@example.com",
    "date": "2026-12-10",
    "time": "18:00",
    "status": "active",
    "services": [
      {
        "_id": "664f22abe59b1a03f491c026",
        "quantity": 2,
        "service": {
          "_id": "664f1a23e59b1a03f491c011",
          "name": "Corte y Peinado",
          "description": "Lavado, corte personalizado y peinado",
          "duration": 45,
          "price": 11000,
          "category": "Peluquería",
          "available": true
        }
      }
    ],
    "__v": 0
  }
}
```

### Renderizado en la Vista Web SSR ([`bookings.handlebars`](file:///c:/Users/feder/OneDrive/Escritorio/Coderhouse/8-turnos-BE/src/views/bookings.handlebars)):
Gracias a `.populate()` y `.lean()`, la plantilla HTML puede acceder directamente al nombre del servicio:
```handlebars
<ul>
    {{#each this.services}}
    <li><p>{{this.service.name}}: {{this.quantity}} reservas</p></li>
    {{/each}}
</ul>
```

---

## 🔌 Endpoints de la API REST y Ejemplos

### Servicios (`/api/services`)

#### 1. Crear un servicio
- **Método**: `POST`
- **Ruta**: `/api/services`
- **Validado por**: `createServiceSchema`

```bash
curl -X POST http://localhost:8080/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Masaje Descontracturante",
    "description": "Masaje profundo de espalda y cuello",
    "duration": 50,
    "price": 18000,
    "category": "Spa y Bienestar",
    "available": true
  }'
```

#### 2. Actualizar un servicio
- **Método**: `PUT`
- **Ruta**: `/api/services/:sid`
- **Validado por**: `updateServiceSchema`

```bash
curl -X PUT http://localhost:8080/api/services/664f1a23e59b1a03f491c011 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 19500
  }'
```

#### 3. Eliminar un servicio
```bash
curl -X DELETE http://localhost:8080/api/services/664f1a23e59b1a03f491c011
```

---

### Reservas (`/api/bookings`)

#### 1. Crear una nueva reserva
- **Método**: `POST`
- **Ruta**: `/api/bookings`
- **Validado por**: `createBookingSchema`

```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Gonzalo Valenzuela",
    "clientEmail": "gonzalo.valenzuela@example.com",
    "date": "2026-12-15",
    "time": "10:30",
    "status": "active"
  }'
```

#### 2. Agregar un servicio a la reserva
- **Método**: `POST`
- **Ruta**: `/api/bookings/:bid/services/:sid`
- Valida que la reserva y el servicio existan; si el servicio ya estaba en el turno, incrementa su cantidad automáticamente.

```bash
curl -X POST http://localhost:8080/api/bookings/664f22abe59b1a03f491c025/services/664f1a23e59b1a03f491c011
```

---

## 🖥️ Vistas Web SSR y Tiempo Real

- **`http://localhost:8080/services`**:
  - Catálogo de servicios en tarjetas.
  - Paginador interactivo en la parte inferior con enlaces automáticos a `?page=X`.
  - Conectado a Socket.io (`changes-on-service`): si un servicio se crea, edita o elimina vía API, el navegador notifica y ofrece refrescar al instante.

- **`http://localhost:8080/bookings`**:
  - Listado de turnos registrados.
  - Muestra en tiempo real los nombres de los servicios reservados gracias al poblado de colecciones (`{{this.service.name}}`).
  - Conectado a Socket.io (`changes-on-bookings`).

