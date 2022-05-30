const schemaValidator = (
  schema,
  property,
  options = { allowUnknown: true }
) => {
  return (req, res, next) => {
    if (schema && req && property in req) {
      schema
        .validateAsync(req[property], options)
        .then((response) => {
          req.validatedBody = response;
          next();
        })
        .catch((err) => {
          const message = err.details
            .map((i) => {
              return i.message;
            })
            .join(",");
          return res.status(200).json({
            success: false,
            message: message,
          });
        });
    } else {
      return res.status(200).json({
        error: "No Schema was provided or property for request to validate",
      });
    }
  };
};
module.exports = schemaValidator;
