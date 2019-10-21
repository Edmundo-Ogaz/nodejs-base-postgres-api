import supertest from 'supertest';
import Koa from 'koa';
import Router from 'koa-router';
import logger from '../../../src/interfaces/tools/logger';
import server from '../../../src/infraestructure/server';
import errorMiddleware from '../../../src/infraestructure/server/middlewares/errors';
import { responseTestPOST, requestTestPOST } from '../../fixtures';

logger.transports[0].silent = true;

describe('server', () => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnZpcm9ubWVudCI6IkRFVkVMT1BNRU5UIiwiYXBwbGljYXRpb25fbmFtZSI6InBtYy1iYXNlLWFwaSIsImlhdCI6MTU1MTgwODc2MCwiZXhwIjoxNjE0ODgwNzYwfQ.RXT_ngFVzqYQ9MHB8TTKV0IH7joFyk9HOv5liWBxOkK30gH5diB443QlctxhMEZ1OrSIEW3d_p0khV16yP6rwNWFcy6SRA5865OFQ0Dh-nmE4cHOZMbv_Gx16LAChHtmYu5IhCPHqXjiLXu1QJCdSwtc0_oUfCEXNgWG01sS3jxoFACUrFyz2wkSxcZ6uTeEHNS0UL84SOWZE-Sld8GuO9aA3wH63qqfu5pRBi1Pf4bRNLBNj-T6bSbIjBwFbcwZc1irhfHsymDfgowPG03BO-jWE4QtqZGDNe4ZYUxIVIUKlcAcSjPVl-9D1L6-fQhLEv1UzyhIFIcDA8LrUP4KKdL5bpBQr2YbRUXF70lWdvizYCoGWnFGPULmkd4xkWrdcwMOFajQtG2OzIqee-RiTchxeUfr-NySOsIcvcdYuEKn9sEnZ5RzlJBqnfP_i0lxj51TTs3KGuq78y-CFoPcjm2M1F1FQo8h8QFi-1TSBdZuzToSyyeNh-8bkjI8ud2PpRXUdE-KbmNvifsxr9fApwSSanFW1RJN97wNa2lJjWhwdK8XA7Pd3FtWGnqwSL1DiJkhSWF7KfekdD9w3DNuFmYmiBIlIdiDy9EwRXKoAeFMR-1OIR5E_AxxwPa1rPhNQKyfLbMxES1lWWzPIgkJPbwL897ZUBEV-rwKo36CpAo',
  };

  const app = new Koa();
  app.use(errorMiddleware);
  const router = new Router();
  router.post('/force_error', () => {
    const err = { message: 'DUMMY_ERROR' };
    throw err;
  });
  app.use(router.routes());
  const mockServer = app.listen(3001);

  beforeEach(() => {
    process.env = {
      ...process.env,
      PORT: 3080,
      ENVIRONMENT: 'test',
    };
  });

  afterEach(() => server.close());

  afterAll(() => mockServer.close());

  test('health endpoint', async () => {
    const response = await supertest(server).get('/health');

    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual('The API is healthty');
  });

  test('should return a bad parameter error when the request param are invalid', async () => {
    const response = await supertest(server)
      .post('/test')
      .set(headers)
      .send({});

    expect(response.status).toEqual(400);
    expect(response.text).toEqual('Invalid Request Params');
  });

  test('should return a internal server error if a internal error has ocurred', async () => {
    const response = await supertest(mockServer)
      .post('/force_error')
      .set(headers)
      .send(requestTestPOST);
    expect(response.status).toEqual(500);
    expect(response.text).toEqual('Internal Server Error');
  });

  test('should return response message when request params are valid in test POST method', async () => {
    const response = await supertest(server)
      .post('/test')
      .set({
        ...headers,
        'x-trace': 'uuid',
      })
      .send(requestTestPOST);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(responseTestPOST);
  });

  test('should return response message when call to test GET method', async () => {
    const response = await supertest(server)
      .get('/test')
      .set({
        ...headers,
        'x-trace': 'uuid',
      });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(responseTestPOST);
  });
});
