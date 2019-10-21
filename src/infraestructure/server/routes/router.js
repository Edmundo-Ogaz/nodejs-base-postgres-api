import Router from 'koa-router';
import requestValidation from '../middlewares/request';

const router = new Router();

router.get('/health', ctx => {
  ctx.body = { message: 'The API is healthty' };
});

router.post('/test', requestValidation, ctx => {
  ctx.body = { message: 'OK' };
});

router.get('/test', ctx => {
  ctx.body = { message: 'OK' };
});

export default router;
