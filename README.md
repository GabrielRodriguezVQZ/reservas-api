# Reservas API

API REST para administrar reservas de un restaurante, construida con **NestJS**. El proyecto muestra el ciclo completo de una petición HTTP y la responsabilidad de cada componente: Middleware, Guard, Interceptor, Pipe y Exception Filter.

**Actividad práctica:** Flujo de una petición en NestJS (semana 5)
**Autor:** _tu nombre aquí_
**Fecha:** _fecha de entrega_

---

## Flujo de una petición

```
Request → Middleware → Guard → Interceptor → Pipe → Controller → Service → Interceptor → Response
Si ocurre un error → Exception Filter → Error Response
```

| Componente | Archivo | Responsabilidad |
|---|---|---|
| Middleware | `src/common/middleware/logger.middleware.ts` | Registra método, ruta, hora y tiempo de respuesta |
| Guard | `src/common/guards/api-key.guard.ts` | Valida el header `x-api-key`; si falla, responde 403 |
| Pipe | `src/reservations/dto/create-reservation.dto.ts` + `ValidationPipe` | Valida el cuerpo antes de llegar al controller |
| Interceptor | `src/common/interceptors/response.interceptor.ts` | Envuelve las respuestas exitosas en `{ success, data, timestamp }` |
| Exception Filter | `src/common/filters/http-exception.filter.ts` | Da formato uniforme a los errores HTTP |

---

## Tecnologías

- Node.js
- NestJS
- TypeScript
- class-validator / class-transformer
- Swagger (`@nestjs/swagger`), extra opcional para documentar y probar

---

## Estructura del proyecto

```
src/
├── common/
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── guards/
│   │   └── api-key.guard.ts
│   ├── interceptors/
│   │   └── response.interceptor.ts
│   └── middleware/
│       └── logger.middleware.ts
├── reservations/
│   ├── dto/
│   │   └── create-reservation.dto.ts
│   ├── reservations.controller.ts
│   ├── reservations.service.ts
│   └── reservations.module.ts
├── app.module.ts
└── main.ts
```

---

## Descripción

Proyecto base creado con [Nest](https://github.com/nestjs/nest), un framework progresivo de [Node.js](http://nodejs.org) para construir aplicaciones del lado del servidor eficientes y escalables, escrito en TypeScript.

## Requisitos previos

- [Node.js](https://nodejs.org) (versión LTS recomendada) y npm.
- Un editor como VS Code.
- Un cliente para probar la API (Swagger, REST Client, Postman, Insomnia o Bruno).

Verifica las versiones instaladas:

```bash
node -v
npm -v
```

## Crear el proyecto desde cero

```bash
# 1. Instalar el CLI de Nest de forma global
npm i -g @nestjs/cli

# 2. Crear el proyecto (elige npm como gestor de paquetes)
nest new reservas-api
cd reservas-api

# 3. Instalar dependencias adicionales
npm i class-validator class-transformer @nestjs/swagger

# 4. Generar el módulo de reservas
nest g module reservations
nest g controller reservations --no-spec
nest g service reservations --no-spec
```

`nest new` deja el repositorio de git inicializado y registra los módulos generados en `app.module.ts` automáticamente.

## Instalación (si ya tienes el proyecto)

```bash
npm install
```

## Compilar y ejecutar

```bash
# desarrollo
npm run start

# modo watch (recarga automática, el recomendado para desarrollar)
npm run start:dev

# producción
npm run build
npm run start:prod
```

El servidor queda en `http://localhost:3000` y la documentación Swagger en `http://localhost:3000/api`.

## Ejecutar tests

```bash
# tests unitarios
npm run test

# tests e2e
npm run test:e2e

# cobertura
npm run test:cov
```

> Nota: `nest new` genera un test e2e (`test/app.e2e-spec.ts`) que prueba `GET /` esperando `Hello World!`. Si eliminas `AppController`, ese test fallará; puedes borrarlo o adaptarlo a `/reservations`.

## Despliegue

Cuando quieras llevar la aplicación a producción, consulta la [documentación de despliegue de NestJS](https://docs.nestjs.com/deployment).

---

## Endpoints

| Método | Ruta | Protegido | Descripción |
|---|---|---|---|
| GET | `/reservations` | No | Lista todas las reservas |
| POST | `/reservations` | Sí (`x-api-key`) | Crea una reserva |

### POST /reservations

**Headers**

```
Content-Type: application/json
x-api-key: restaurant-secret
```

**Body**

```json
{
  "customerName": "Carlos Pérez",
  "email": "carlos@email.com",
  "people": 4
}
```

**Validaciones**

- `customerName`: obligatorio, texto.
- `email`: debe ser un correo válido.
- `people`: entero, mínimo 1.

### Formato de respuesta exitosa

```json
{
  "success": true,
  "data": {
    "id": 1,
    "customerName": "Carlos Pérez",
    "email": "carlos@email.com",
    "people": 4
  },
  "timestamp": "2026-09-30T15:00:00.000Z"
}
```

### Formato de respuesta de error

```json
{
  "success": false,
  "statusCode": 400,
  "message": ["email must be a valid email", "people must be at least 1"],
  "path": "/reservations",
  "timestamp": "2026-09-30T15:00:00.000Z"
}
```

---

## Cómo probar

### Opción 1: Swagger (navegador)

Con el servidor corriendo, abre `http://localhost:3000/api`.

1. Clic en **Authorize**, escribe `restaurant-secret` y confirma.
2. Abre `POST /reservations` → **Try it out** → **Execute**.
3. Para probar sin API key, haz **Authorize → Logout** y ejecuta de nuevo.

### Opción 2: REST Client (VS Code)

Con la extensión **REST Client**, crea un archivo `pruebas.http` en la raíz:

```http
### 1. POST válido + API key correcta
POST http://localhost:3000/reservations
Content-Type: application/json
x-api-key: restaurant-secret

{
  "customerName": "Carlos Pérez",
  "email": "carlos@email.com",
  "people": 4
}

### 2. POST sin API key
POST http://localhost:3000/reservations
Content-Type: application/json

{
  "customerName": "Carlos Pérez",
  "email": "carlos@email.com",
  "people": 4
}

### 3. Datos inválidos
POST http://localhost:3000/reservations
Content-Type: application/json
x-api-key: restaurant-secret

{
  "customerName": "",
  "email": "esto-no-es-un-email",
  "people": 0
}

### 4. GET público
GET http://localhost:3000/reservations
```

### Opción 3: Postman, Insomnia o Bruno

Misma configuración: URL `http://localhost:3000/reservations`, headers `Content-Type` y `x-api-key`, y el body en JSON.

---

## Casos de prueba

| # | Escenario | Resultado esperado | Componente principal | Evidencia |
|---|---|---|---|---|
| 1 | POST válido + API key correcta | 201, formato `success/data/timestamp` | Todos | `evidencias/01-post-valido.png` |
| 2 | POST sin API key | 403 Forbidden | Guard | `evidencias/02-sin-api-key.png` |
| 3 | Email inválido | 400, error de validación | Pipe | `evidencias/03-email-invalido.png` |
| 4 | Excepción provocada | Error con formato uniforme | Exception Filter | `evidencias/04-excepcion-forzada.png` |
| 5 | Petición normal | Log visible en consola | Middleware | `evidencias/05-log-middleware.png` |
| 6 | Respuesta exitosa | Formato `success/data` | Interceptor | `evidencias/06-formato-interceptor.png` |

> Para el caso 4 se descomenta temporalmente `throw new BadRequestException('Reservation data is invalid')` en `reservations.controller.ts`. Después de la prueba se vuelve a comentar.

---

## Pregunta de análisis

**¿Cuál es la diferencia entre lanzar una `BadRequestException` y crear un Exception Filter?**

_Escribe aquí tu respuesta con tus propias palabras._

---

## Lista de entrega

- [ ] Middleware registrado y funcionando.
- [ ] Exception Filter aplicado y probado.
- [ ] Guard validando la API Key.
- [ ] DTO con validaciones y `ValidationPipe` activo.
- [ ] Interceptor transformando respuestas exitosas.
- [ ] `POST /reservations` funcionando con todos los componentes.
- [ ] Pruebas realizadas para casos exitosos y de error.
- [ ] Pregunta de análisis respondida.
- [ ] Archivos sobrantes de `nest new` eliminados (`app.controller.ts`, `app.service.ts`, `app.controller.spec.ts`).

---

## Recursos

- [Documentación de NestJS](https://docs.nestjs.com)
- [Middleware](https://docs.nestjs.com/middleware) · [Exception filters](https://docs.nestjs.com/exception-filters) · [Guards](https://docs.nestjs.com/guards) · [Interceptors](https://docs.nestjs.com/interceptors) · [Pipes](https://docs.nestjs.com/pipes)
- [Swagger en NestJS](https://docs.nestjs.com/openapi/introduction)
- [Cursos oficiales de NestJS](https://courses.nestjs.com/)
- [Canal de Discord](https://discord.gg/G7Qnnhy)
- [NestJS Devtools](https://devtools.nestjs.com)

## Licencia

Nest es un proyecto open source con [licencia MIT](https://github.com/nestjs/nest/blob/master/LICENSE).