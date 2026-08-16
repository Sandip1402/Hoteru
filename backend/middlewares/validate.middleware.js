import AppError from "../utils/app-error.js";

export const validate = (schema, source = "body") => {
  return (req, res, next) => {

    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return next(
        new AppError(
          400,
          "Validation failed",
          result.error.flatten().fieldErrors
        )
      );
    }

    if (source === "query") {
      req.validatedQuery = result.data;
    } else {
      req[source] = result.data;
    }

    next();
  };
};