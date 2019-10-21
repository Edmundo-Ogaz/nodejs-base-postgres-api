# NODEJS-BASE-POSTGRES-API

Proyecto de esquema postgres base para la creación de APIs dentro del sistema.
Construido en NodeJS con framework KOA.

dependencias base:

- PM2 (administrador de procesos de node)
- KOA (framework REST para nodejs)
- JOI (validador de modelo)
- WINSTON (wrapper de logs)

Si se desea crear una API nueva para sistema, favor realizar un fork sobre este proyecto.

## Requisitos

- Node
- Yarn (de preferencia) o npm
- Docker (solo si desea levantarlo con esta herramienta)

## Levantar servicio

### Ambiente Local

Se debe tener los requisitos instalados previamente (excepto el Docker).

En la terminal ejecutar el comando `yarn` o `npm install` para instalar los paquetes necesarios, luego ejecutar el comando `yarn start` o `npm start`.

El servicio será levantado en http://localhost:3080.

### Ambiente Docker

Se debe tener los requisitos del instalados previamente.

En la terminal ejecutar el comando `yarn docker:build` o `npm run docker:build` para generar la imagen del contenedor de docker, luego ejecutar el comando `yarn docker:start` o `npm run docker:start` para levantar el servicio en un contenedor de docker con la imagen previamente generada.

Si se desea desarrollar/modificar/probar sin la necesidad de estar constantemente generando y levantando el servicio, una vez generada la imagen, ejecutar el comando `yarn docker:dev` o `npm run docker:dev`. Esto hará que cada vez que haga un cambio en el cÃ³digo fuente se sincronize/actualice automaticamente, excepto las variables de internos e instalaciones de nuevos paquetes, en este caso se debe volver a generar al imagen.

Si se desea debugear la imagen generada, ejecutar el comando `yarn docker:sh` o `npm run docker:sh`.

## Herramientas

- Para saber si el servicio se encuentra arriba/operativo esta disponible el endpoint de `/health`.
- Para ejecutar las pruebas se encuentra disponible el comando `yarn test` y para ver la cobertura de codigo `yarn coverage`

## Notas

- En archivo drone.yml se dejan comentados procesos y pasos del pipeline que tienen que ver sobre el deploy en ambientes específicos del cluster.
- Se deja certificado publico de seguridad ejemplo en la ruta src/security/certs/base.pub y token valido para ese certificado en misma ruta (src/security/certs/token) al momento de realizar fork del proyecto, utilizar certificado publico de seguridad propio para el artefacto y eliminar el archivo token.
- A modo de prueba se expone el servicio GET `/test` donde al consultar obtiene como resultado:

```
{
  "message": "OK",
}
```

- A modo de prueba se expone el servicio POST `/test`, el cual valida el body enviado, el cual debe tener la siguiente estructura:

```
{
  "payload": [Object]
}
```

donde al consultar, si la validación es correcta, obtiene como resultado:

```
{
  "message": "OK",
}
```

Ambos métodos anteriormente descritos requieren que se envíe el header `Authorization` donde se le da el valor Bearer [token] donde token es la cadena de caracteres que se encuentra en el archivo src/security/certs/token
