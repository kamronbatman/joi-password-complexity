const softRequire = (path) => {
  try {
    // eslint-disable-next-line import/no-dynamic-require
    return require(path);
  } catch (ignoreError) {
    return null;
  }
};

const getJoi = () => {
  const joi = softRequire('joi') || softRequire('@hapi/joi');

  if (!joi) {
    throw new Error('joi-password-complexity requires either `joi` or `@hapi/joi` to be installed.');
  }

  return joi;
};

module.exports = getJoi;
