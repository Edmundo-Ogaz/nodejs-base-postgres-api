import validator from '..';

const schema = validator.object().keys({
  payload: validator.object().required(),
});

const validateSchema = payload => validator.validate(payload, schema, { abortEarly: false });

export default validateSchema;
