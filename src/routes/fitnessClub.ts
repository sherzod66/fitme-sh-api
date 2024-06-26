import { Router } from "express";
import { validateIdParam, validate } from "./../middlewares/validate";
import {
  discipleValidationSchema,
  trainerValidationSchema,
} from "./../validation/schemas/trainer";
import { FitnessController } from "../controllers/fitnessController";

const router = Router();

const controller = new FitnessController();

router.get("/", controller.find);

router.post("/", controller.create);

router.get("/:id", validateIdParam, controller.findOne);
router.get("/find/:email", controller.findByEmail);

router.put(
  "/:id",
  validateIdParam,
  validate(trainerValidationSchema),
  controller.update
);

router.put(
  "/request-add-trainer/:id",
  validateIdParam,
  validate(discipleValidationSchema),
  controller.requestAddTrainer
);

router.put(
  "/add-disciple/:id",
  validateIdParam,
  validate(discipleValidationSchema),
  controller.addDisciple
);

router.patch(
  "/remove-disciple/:id",
  validateIdParam,
  validate(discipleValidationSchema),
  controller.removeDisciple
);

router.delete("/:id", validateIdParam, controller.delete);

export default router;
