import { ErrorRequestHandler, RequestHandler } from "express";
import createHttpError from "http-errors";
import { getStatusText, StatusCodes } from "http-status-codes";
import { changeResponse } from "./../utils/changeResponse";

import { ErrorResponse } from "./../types/response";

export const notfound: RequestHandler = (req, res, next) => {
  next(
    createHttpError(StatusCodes.NOT_FOUND, getStatusText(StatusCodes.NOT_FOUND))
  );
};

export const generic: ErrorRequestHandler = (err, req, res, next) => {
  const isDeveloperError = !err.statusCode;
  const isServerError = err.statusCode >= 500;

  //   LoggerService.error("http error:", [req.url, err]);
  if (isServerError || isDeveloperError) {
    // LoggerService.error(err);
  }

  if (isDeveloperError) {
    err = createHttpError(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  const code = err.statusCode;

  const response: ErrorResponse = {
    code,
    error: true,
    message: err.message,
    payload: err.payload || err.data,
  };

  res.status(code).json(changeResponse(false, null, response));
};
