import { Request, Response, NextFunction } from "express";
import StatusCodes from "http-status-codes";
import { changeResponse } from "../utils/changeResponse";
import nodemailer from "nodemailer";

import { feedbackHtml } from "../utils/feedbackHtml";

var transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "fitme.uz@gmail.com",
    pass: "gyjtszcdhryrogyx",
  },
});

transport.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

export const sendOtp = (
  fullName: string,
  email: string,
  userName: string,
  cause: string
) => {
  var mailOptions = {
    from: '"Fitme Team" <empire.soft.uz@gmail.com>',
    to: "fit.me.company.rn@gmail.com",
    subject: "Удаление аккаунта",
    html: feedbackHtml(fullName, email, userName, cause),
  };

  transport.sendMail(mailOptions);
};

export class FeedbackController {
  public async sendEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, email, userName, cause } = req.body;
      sendOtp(fullName, email, userName, cause);
      res.status(StatusCodes.OK).json(changeResponse(true, { email }));
    } catch (e) {
      next(e);
    }
  }
}
