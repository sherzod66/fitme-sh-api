import { Router } from "express";
import { validate } from "../middlewares/validate";
import { feedbackValidationSchema } from "../validation/schemas/auth";
import { FeedbackController } from "../controllers/feedbackController";

const router = Router();

const controller = new FeedbackController();

router.post("/send", validate(feedbackValidationSchema), controller.sendEmail);

export default router;
