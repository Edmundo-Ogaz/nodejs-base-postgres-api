import Koa from 'koa';
import fs from 'fs';
import helmet from 'koa-helmet';
import jwt from 'koa-jwt';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import errors from './middlewares/errors';
import router from './routes/router';
import logger from '../../interfaces/tools/logger';
import models, { sequelize } from '../../models';

const port = process.env.PORT;
const environment = process.env.ENVIRONMENT;
const pubKey = fs.readFileSync('src/infraestructure/security/certs/base.pub');
const app = new Koa();

app.use(
  helmet({
    frameguard: {
      action: 'deny',
    },
    referrerPolicy: {
      policy: 'same-origin',
    },
    hsts: {
      maxAge: 31536000,
    },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
      },
    },
    noCache: true,
  }),
);
app.use(
  jwt({
    secret: pubKey,
  }).unless({
    path: [/^\/health/],
  }),
);
app.use(bodyParser());
app.use(cors());
app.use(errors);
app.use(router.routes());
app.use(async (req, res, next) => {
  req.context = {
    models,
    me: await models.User.findByLogin('rwieruch'),
  };
  next();
});

const server = app.listen(port, () =>
  logger.info(`Server running on port: ${port}, environment: ${environment}`),
);

// const eraseDatabaseOnSync = true;

// const createUsersWithMessages = async () => {
//   await models.User.create(
//     {
//       username: 'rwieruch',
//       messages: [
//         {
//           text: 'Published the Road to learn React',
//         },
//       ],
//     },
//     {
//       include: [models.Message],
//     },
//   );
//   await models.User.create(
//     {
//       username: 'ddavids',
//       messages: [
//         {
//           text: 'Happy to release ...',
//         },
//         {
//           text: 'Published a complete ...',
//         },
//       ],
//     },
//     {
//       include: [models.Message],
//     },
//   );
// };

// const server = sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
//   if (eraseDatabaseOnSync) {
//     createUsersWithMessages();
//   }
//   app.listen(port, () =>
//     logger.info(`Server running on port: ${port}, environment: ${environment}`),
//   );
// });

export default server;
