function getJoi() {
  let Joi;

  try {
    Joi = require('joi');
  } catch (ignoreJoiError) {
    try {
      Joi = require('@hapi/joi');
    } catch (ignoreHapiError) {
      // ignore
    }
  }

  if (!Joi) {
    throw new Error('joi-password-complexity requires either `joi` or `@hapi/joi` to be installed.');
  }

  return Joi;
}

module.exports = getJoi;
