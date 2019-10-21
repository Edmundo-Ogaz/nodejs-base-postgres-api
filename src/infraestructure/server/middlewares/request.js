import validate from '../../../interfaces/tools/validator/schemas/request';
import statusCodes from '../../../interfaces/tools/statusCodes';

export default (ctx, next) => {
  const { error: validation } = validate(ctx.request.body);

  if (validation) {
    const errors = validation.details
      .map(({ message }) => message)
      .toString()
      .replace(/,/g, ' - ');
    const error = {
      message: 'Invalid Request Params',
      errorMessage: errors,
      code: statusCodes.BAD_REQUEST,
      payload: ctx.request.body,
    };

    throw error;
  }

  return next();
};
