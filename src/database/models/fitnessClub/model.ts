import { model, Schema, SchemaTypes } from "mongoose";
import { IFitnessClub } from "./types";
import { ROLES, GENDER } from "../../../types/common";

const FitnessClubSchema = new Schema<Partial<IFitnessClub>>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    role: {
      type: String,
      enum: [
        ROLES.SUPERADMIN,
        ROLES.ADMIN,
        ROLES.TRAINER,
        ROLES.USER,
        ROLES.FITNESS_CLUB,
      ],
      default: ROLES.FITNESS_CLUB,
    },

    age: {
      type: Number,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      required: true,
    },

    aboutMe: {
      type: String,
      required: true,
    },

    telegramLink: {
      type: String,
      required: true,
    },

    instagramLink: {
      type: String,
      required: true,
    },

    requestedDisciples: {
      type: [SchemaTypes.ObjectId],
      ref: "User",
      default: null,
    },

    disciples: {
      type: [SchemaTypes.ObjectId],
      ref: "User",
      default: null,
    },

    workoutPlans: {
      type: [SchemaTypes.ObjectId],
      ref: "WorkoutPlan",
      default: null,
    },

    products: {
      type: [SchemaTypes.ObjectId],
      ref: "Product",
      default: null,
    },

    dishes: {
      type: [SchemaTypes.ObjectId],
      ref: "Dish",
      default: null,
    },

    nutritionPlans: {
      type: [SchemaTypes.ObjectId],
      ref: "NutritionPlan",
      default: null,
    },
  },
  { timestamps: true }
);

export const FitnessClubModel = model("Fitness", FitnessClubSchema);
