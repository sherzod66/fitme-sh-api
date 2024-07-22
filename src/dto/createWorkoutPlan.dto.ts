import { IWorkout } from "database/models/workout";
import { GENDER, LEVEL } from "../types/common";

export interface CreateWorkoutPlan {
  title: string;
  description: string;
  price: number;
  gender: GENDER;
  level: LEVEL;
  creator: string;
  workouts: IWorkout[];
  isPublic: boolean;
}
