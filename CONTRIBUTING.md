# Como Contribuir

El proyecto cuenta únicamente con la rama `master` por lo tanto todo nuevo cambio debe salir de esta rama estando actualizada y luego volverse a integrar mediante un pull request.

Comandos útiles:

- `$ git fetch --all --prune` o `gfa` para actualizar todos los origenes y ramas.
- `$ git pull` o `gl` para traerse todos los cambios del remoto al local
- `$ git checkout -b branchName` o `gcb branchName` para crear una nueva rama localmente donde se realizaran todos los cambios
- `$ git status` o `gst` para conocer el estado de los archivos
- `$ git add --all` o `gaa` para agregar todos los cambios al commit
- `$ git commit -m 'message'` o `gcmsg 'mesaje'` para crear el commit con su respectivo mensaje
- `$ git commit -a -m 'message'` o `gcam 'message'` alternativa para agregar todos los archivos modificados y crear el commit con el mensaje correspondiente
- `$ git push --set-upstream origin branchName` o `gpsup` para realizar el primer commit desde la rama local al remoto
- `$ git push` o `gp` para realizar commits de la rama local al remoto
- `$ git push --force` o `gpf` para sobreescribir la rama desde el local al remoto por ejemplo despues de hacer hecho rebase
- `$ git rebase -i HEAD~%d` o `grbi HEAD~%d` para realizar un rebase interactivo de la cantidad de commit deseados donde `%d` es el número de commits por ejemplo `HEAD~2`
- `$ git rebase master` o `grb master` para actualizar su rama con la de master, en caso de que existan cambios posteriores a la creación de su rama.

Una vez realizado todos los cambios pertinentes:

- Asegurarse que la nueva rama cuente con un solo commit, en caso de que tenga mas de uno utilizar el `rebase` para dejar uno solo.
- Asegurarse de que el mensaje del commit sea suficientemente explicativo
- Si se agregaron nuevas validaciones asegurarse de que cuenten con sus tests respectivos.
- Si se agregaron nuevas credenciales asegurarse de agregarlas también en el vault.

Al realizar el pull request:

- Agregar como reviewers al equipo encargado en su momento.
- Marcar el check de cerrar rama al momento de hacer el merge.
- Detallar un poco en la descripción los cambios realizados.

El pull request será revisado por el equipo encargado en su momento en conjunto con el equipo responsable del pull request y al pasar por todas las validaciónes sera agregado.

En la medida de lo posible solo se deberían agregar productos nuevos y validaciones dependiendo del caso.

Para temas de cambios en las definiciones del dominio existe un repositorio [documentacion-pmc](https://bitbucket.org/segurosfalabella/documentacion-pmc/src/master/) en el cual se debe pasar por el proceso correspondiente, antes de realizar este tipo de cambios.

## Como agregar un producto nuevo

Dependendiendo del caso y las configuraciones ya existentes no todos los pasos son requeridos.

Para agregar un producto nuevo se debe modificar los siguientes archivos:

### config.js

Este archivo contiene las configuraciones generales.

```javascript
export default {
  URL: {
    DEPARTMENT: `${process.env.BASE_URL}/api/Province`,
    PROVINCE: `${process.env.BASE_URL}/api/District`,
    DISTRICT: `${process.env.BASE_URL}/api/Municipality`,
    VEHICLE_PLATE: `${process.env.BASE_URL_INTEGRATION}/plate`,
    VEHICLE_SAVE: `${process.env.BASE_URL}/api/Auto`,
    AUTHENTICATE: `${process.env.BASE_URL}/api/user/authenticate`,
    TOKEN_TARIF: process.env.BASE_URL_TOKEN_TARIF,
    QUOTE: process.env.BASE_URL_TARIF,
    INSURED_SAVE: `${process.env.BASE_URL}/api/cliente`,
  },
  BROKER_ID: process.env.BROKER_ID,
  INTERMEDIA_ID: process.env.INTERMEDIA_ID,
  CLIENT_ID: process.env.TOKEN_CLIENT_ID,
  GRANT_TYPE: process.env.TOKEN_GRANT_TYPE,
  TOKEN_USERNAME: process.env.TOKEN_USERNAME,
  TOKEN_PASSWORD: process.env.TOKEN_PASSWORD,
  AUTHENTICATE_USERNAME: process.env.AUTHENTICATE_USERNAME,
  AUTHENTICATE_PASSWORD: process.env.AUTHENTICATE_PASSWORD,
};
```

### stack.yml

Al momento de hacer el deploy el drone se conecta con vault y trae los datos para inyectarselos al archivo stack el cual los habilita como variables de entorno dentro del artefacto.

Si su producto requiere de variables de entornos nuevas deben agregarse en el vault.

Ejemplo de como agregar un producto nuevo:

```javascript
    ...
    environment:
      - ENVIRONMENT=${ENVIRONMENT}
      - PORT=${PORT}
      - CONSUL_HTTP_ADDR=${CONSUL_HTTP_ADDR}
      - CONSUL_HTTP_TOKEN=${CONSUL_HTTP_TOKEN}
      - VAULT_ADDR=${VAULT_ADDR}
      - VAULT_TOKEN=${VAULT_TOKEN}
      - CL_RECTOR_ADAPTER_URL=${CL_RECTOR_ADAPTER_URL}
      - CL_RECTOR_ADAPTER_TOKEN=${CL_RECTOR_ADAPTER_TOKEN}
      - PE_SUPERCASH_ADAPTER_URL=${PE_SUPERCASH_ADAPTER_URL} // <- Nombre de la variable que pasara al archivo ecosystem y le asigna el valor que trae de vault
      - PE_SUPERCASH_ADAPTER_TOKEN=${PE_SUPERCASH_ADAPTER_TOKEN} // <- Nombre de la variable que pasara al archivo ecosystem y le asigna el valor que trae de vault
      ...
```

### ecosystem.ctmpl

Este archivo sirve para crear y reemplazar el archivo `ecosystem.json` al momento de hacer el deploy y basado en el ambiente, los datos los saca desde el archivo stack.

Ejemplo de como agregar un producto nuevo:

```javascript
{
  ...
  "env_docker": {
    "ENVIRONMENT": "{{ env "ENVIRONMENT" }}",
    "PORT": {{ env "PORT" }},
    "CL_RECTOR_ADAPTER_URL": "{{ env "CL_RECTOR_ADAPTER_URL" }}",
    "CL_RECTOR_ADAPTER_TOKEN": "{{ env "CL_RECTOR_ADAPTER_TOKEN" }}",
    "PE_SUPERCASH_ADAPTER_URL": "{{ env "PE_SUPERCASH_ADAPTER_URL" }}", // <- Nombre de la variable de entorno correspondiente
    "PE_SUPERCASH_ADAPTER_TOKEN": "{{ env "PE_SUPERCASH_ADAPTER_TOKEN" }}" // <- Nombre de la variable de entorno correspondiente
  }
}
```

### ecosystem.json

Este archivo sirve para levantar los artefactos de manera local y sera reemplazado al momento de hacer el deploy basado en el ambiente con los datos correspondientes.

Ejemplo de como agregar un producto nuevo:

```javascript
{
  ...
  "env_docker": {
    "ENVIRONMENT": "development",
    "PORT": 3002,
    "CL_RECTOR_ADAPTER_URL": "http://host.docker.internal:8080",
    "CL_RECTOR_ADAPTER_TOKEN": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnZpcm9ubWVudCI6IkRFVkVMT1BNRU5UIiwiYXBwbGljYXRpb25fbmFtZSI6InBtYy1yZWN0b3ItcXVvdGUtYWRhcHRlciIsImlhdCI6MTU1NjExNTUwMywiZXhwIjoxNjE5MTg3NTAzfQ.TzS83HCcaaqIg7ZQvo9oTt8PKeOtano4cwRHbgaEmahmeCXLq5tfsmS3J5vSZvb0MtlDwazil-HKFWEnKM53s16yB3lnJvZtaNtJ-EaMVTGi1fYT_q_J7ZpFupQYwZYItnOTPr6DQHU8hLsJme4IpB_UyH4qroX6uag7O_tLswVfIdqs0t4XAR0SpnSVuMXSVn9wRUkdw70pB7AFZkMivJSJAw8I9LTsdTtKbcaktwr_n6Pd2jCxqZGTfAXUQDeqQrmQc4yUe_-Tc3wn0xpS5k-qJqYNDk_GjBwX8xs_SwobWdpI6QAmjwfQY_4Uzt1k2ZNZ_IT09yoxPTdUUM1ApePmsjdQRNN3LJuh30aFwSVJesa7NSEVgVegXwU1NlSdIotvsFhozNwZblaHNk5uUomnvPDB11ixN4u2RLWl2vb2iZwHxCHPb7pX0WZM-pjQvrQIWAxjUxy9Fqacgoz29EFuwT8YqsxzvWs2ATJldc7y-EptjhU9YZi8sHP1LuQ8fbkC_-03aKl0UjDn-INOJVkbLv9VQIYfIjoMxXNSdxO4znVV5hit7oTiqmtukgaHvGZPE9wKKzTlnEzMpBFLLmqNfk69J2ozYiboma_zHI64O9xgk2ymqwRSoRot1GhvEio2fqVOFhgSqIhyRQhgrZ43axbNzQJMCjY04s7R7a8",
    "PE_SUPERCASH_ADAPTER_URL": "http://host.docker.internal:8081", // <- URL local del artefacto
    "PE_SUPERCASH_ADAPTER_TOKEN": "token" // <- Token de seguridad del artefacto en local
  },
  "env_local": {
    "ENVIRONMENT": "development",
    "PORT": 3002,
    "CL_RECTOR_ADAPTER_URL": "http://localhost:8086",
    "CL_RECTOR_ADAPTER_TOKEN": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnZpcm9ubWVudCI6IkRFVkVMT1BNRU5UIiwiYXBwbGljYXRpb25fbmFtZSI6InBtYy1yZWN0b3ItcXVvdGUtYWRhcHRlciIsImlhdCI6MTU1NjExNTUwMywiZXhwIjoxNjE5MTg3NTAzfQ.TzS83HCcaaqIg7ZQvo9oTt8PKeOtano4cwRHbgaEmahmeCXLq5tfsmS3J5vSZvb0MtlDwazil-HKFWEnKM53s16yB3lnJvZtaNtJ-EaMVTGi1fYT_q_J7ZpFupQYwZYItnOTPr6DQHU8hLsJme4IpB_UyH4qroX6uag7O_tLswVfIdqs0t4XAR0SpnSVuMXSVn9wRUkdw70pB7AFZkMivJSJAw8I9LTsdTtKbcaktwr_n6Pd2jCxqZGTfAXUQDeqQrmQc4yUe_-Tc3wn0xpS5k-qJqYNDk_GjBwX8xs_SwobWdpI6QAmjwfQY_4Uzt1k2ZNZ_IT09yoxPTdUUM1ApePmsjdQRNN3LJuh30aFwSVJesa7NSEVgVegXwU1NlSdIotvsFhozNwZblaHNk5uUomnvPDB11ixN4u2RLWl2vb2iZwHxCHPb7pX0WZM-pjQvrQIWAxjUxy9Fqacgoz29EFuwT8YqsxzvWs2ATJldc7y-EptjhU9YZi8sHP1LuQ8fbkC_-03aKl0UjDn-INOJVkbLv9VQIYfIjoMxXNSdxO4znVV5hit7oTiqmtukgaHvGZPE9wKKzTlnEzMpBFLLmqNfk69J2ozYiboma_zHI64O9xgk2ymqwRSoRot1GhvEio2fqVOFhgSqIhyRQhgrZ43axbNzQJMCjY04s7R7a8",
    "PE_SUPERCASH_ADAPTER_URL": "http://host.docker.internal:8081", // <- URL local del artefacto
    "PE_SUPERCASH_ADAPTER_TOKEN": "token" // <- Token de seguridad del artefacto en local
  }
}
```

## Agregar validaciones

Dependiendo del caso y las configuraciones ya existentes, puedo que el producto amerite nuevas validaciones.

Las validaciones deben tener sus tests correspondientes.

### document

Crear el validador en la ruta `src/interfaces/tools/validator/extensions` con el nombre correspondiente, en este caso `dni.js`.

Cada documento de identidad tiene sus propias validaciones, este es un ejemplo del RUT:

```javascript
const regexRut = /^0*(\d{1,3}(\.?\d{3})*)-?([\dkK])$/i; // <- Expresion regular para validar la sintaxis del documento

const cleanRut = rut => rut.replace(/^0+|[^0-9kK]+/g, '').toUpperCase(); // <- Función para sanitizar el documento ingresado

const rutValidator = rut => {
  if (!regexRut.test(rut)) {
    return false;
  }

  const cleanedRut = cleanRut(rut);

  let t = parseInt(cleanedRut.slice(0, -1), 10);
  let m = 0;
  let s = 1;

  while (t > 0) {
    s = (s + (t % 10) * (9 - (m % 6))) % 11;
    t = Math.floor(t / 10);
    m += 1;
  }

  const v = s > 0 ? `${s - 1}` : 'K';

  return v === rut.toUpperCase().slice(-1);
}; // <- Función principal que se encarga de validar el documento

const rut = validator => ({
  base: validator.string(),
  name: 'string',
  language: { rut: 'invalid rut' }, // <- Colocar el nombre correspondiente del tipo de documento, por ejemplo dni
  rules: [
    {
      name: 'rut', <- colocar el nombre correspondiente del tipo de documento, por ejemplo dni
      validate(params, value, state, options) {
        if (!rutValidator(value)) { // <- Llamar a la función que se encargue de validar el documento
          return this.createError('string.rut', { v: value }, state, options); // <- Colocar el nombre correspondiente del tipo de documento, por ejemplo dni
        }

        return value;
      },
    },
  ],
}); // <- Función del validador para agregar extensiones al mismo

export default rut; // <- Colocar el nombre correspondiente de la función
```

Agregar la extensión al validador en el archivo `src/interfaces/tools/validator/index.js`

```javascript
import validator from '@hapi/joi';
import rutExtension from './extensions/rut';
import dniExtension from './extensions/dni'; // <- Importar el validador creado anteriormente
import clPhoneExtension from './extensions/clPhone';

export default validator
  .extend(rutExtension)
  .extend(clPhoneExtension)
  .extend(dniExtension); // <- Agregar la extension
```

Modificar el archivo `config.js` para agregar el nuevo tipo de documento:

```javascript
...
export const DOCUMENT_TYPES = [
  'RUT',
  'DNI' // <- Nuevo tipo de documento
];
...
```

Modifica el archivo `documentSchema.js` para agregar el nuevo validador:

```javascript
...
type: validator
  .string()
  .valid(DOCUMENT_TYPES)
  .optional(),
number: validator
  .alternatives()
  .when('type', {
    is: 'RUT',
    then: validator
      .string()
      .rut()
      .optional(),
  })
  .when('type', {
    is: 'DNI',
    then: validator
      .string()
      .dni()
      .optional()
  }) // <- Nuevo validador basado en el tipo de documento
...
```

### phone

La validación del teléfono se basa en el `country`.

Crear el validador en la ruta `src/interfaces/tools/validator/extensions` con el nombre correspondiente, en este caso `pePhone.js`.

```javascript
const regexPhone = /^\+56(9|2)[0-9]{8}$/i; // <- Modificar el regex para adaptarlo al formato del país correspondiente

const phoneValidator = phone => regexPhone.test(phone);

const phone = validator => ({
  base: validator.string(),
  name: 'string',
  language: { clPhone: 'invalid cl phone number, must be in the international format.' }, // <- Modificar el nombre y mensaje correspondiente al país
  rules: [
    {
      name: 'clPhone', // <- Modificar el nombre correspondiente al país
      validate(params, value, state, options) {
        if (!phoneValidator(value)) {
          return this.createError('string.clPhone', { v: value }, state, options); // <- Modificar el nombre correspondiente al país
        }

        return value;
      },
    },
  ],
});

export default phone;
```

Agregar la extensión al validador en el archivo `src/interfaces/tools/validator/index.js`

```javascript
import validator from '@hapi/joi';
import rutExtension from './extensions/rut';
import clPhoneExtension from './extensions/clPhone';
import pePhoneExtension from './extensions/pePhone'; // <- Importar el validador creado anteriormente

export default validator
  .extend(rutExtension)
  .extend(clPhoneExtension)
  .extend(pePhoneExtension); // <- Agregar la extension
```

Modificar el archivo `personSchema.js` para agregar la nueva validación:

```javascript
...
    phone: validator
      .alternatives()
      .when('$country', {
        is: 'CL',
        then: validator
          .string()
          .clPhone()
          .optional(),
      })
      .when('$country', {
        is: 'PE',
        then: validator
          .string()
          .pePhone()
          .optional()
      }) // <- Nuevo validador basado en el país
...
```
