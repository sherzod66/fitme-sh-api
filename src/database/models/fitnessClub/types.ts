import { Document, ObjectId } from "mongoose";
import { DishDocument } from "../dish";
import { NutritionPlanDocument } from "../nutrition";
import { ProductDocument } from "../product";
import { UserDocument } from "../user";
import { ROLES } from "../../../types/common";
import { WorkoutPlanDocument } from "../workout/types";

export interface IFitnessClub {
  _id: ObjectId | string;
  name: string;
  phoneNumber: string;
  email: string;
  role: ROLES;
  age: number;
  city: string;
  avatar: string;
  experience: number;
  aboutMe: string;
  telegramLink: string;
  instagramLink: string;
  requestedDisciples: UserDocument[];
  disciples: UserDocument[];
  workoutPlans: WorkoutPlanDocument[];
  products: ProductDocument[];
  dishes: DishDocument[];
  nutritionPlans: NutritionPlanDocument[];
}

export type FitnessDocument = Document & IFitnessClub;
