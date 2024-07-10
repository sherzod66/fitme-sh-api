import { Router } from "express";

import auth from "./auth";
import feedback from "./feedback";
import users from "./users";
import trainers from "./trainers";
import fitness from "./fitnessClub";
import categories from "./categories";
import exercises from "./exercises";
import workoutPlans from "./workoutPlans";
import products from "./products";
import dishes from "./dishes";
import nutritionPlans from "./nutritionPlans";
import uploads from "./uploads";
import ad from "./ad";

import authenticate from "../middlewares/authenticate";

const router = Router();

router.use("/auth", auth);
router.use("/feedback", feedback);
router.use("/users", authenticate, users);
router.use("/trainers", trainers);
router.use("/fitness-club", fitness);
router.use("/categories", categories);
router.use("/exercises", exercises);
router.use("/workout-plans", authenticate, workoutPlans);
router.use("/products", products);
router.use("/dishes", dishes);
router.use("/nutrition-plans", authenticate, nutritionPlans);
router.use("/uploads", uploads);
router.use("/ads", ad);

export default router;
