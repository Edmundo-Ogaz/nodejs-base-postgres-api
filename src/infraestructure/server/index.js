import Koa from 'koa';
import fs from 'fs';
import helmet from 'koa-helmet';
import jwt from 'koa-jwt';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import errors from './middlewares/errors';
import router from './routes/router';
import logger from '../../interfaces/tools/logger';

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

const server = app.listen(port, () =>
  logger.info(`Server running on port: ${port}, environment: ${environment}`),
);

export default server;
