const CreateError = require('http-errors');

const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (allowedRoles.length > 0) {
      if (req?.payload?.role && allowedRoles.includes(req?.payload?.role)) {
        return next();
      } else {
        return next(
          CreateError.Forbidden(
            "You don't have permission to access this resource"
          )
        );
      }
    } else {
      return next(
        CreateError.BadRequest('Please define some roles in this route')
      );
    }
  };
};

module.exports = verifyRoles;
