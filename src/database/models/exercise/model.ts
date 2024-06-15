import { model, Schema, SchemaTypes } from "mongoose";
import { IExercise } from "./types";

const exerciseSchema = new Schema<IExercise>(
  {
    title: {
      en: {
        type: String,
        required: false,
      },
      ru: {
        type: String,
        required: true,
      },
      uz: {
        type: String,
        required: false,
      },
    },

    image: {
      type: String,
      required: true,
    },

    video: {
      type: String,
      required: true,
    },

    description: {
      en: {
        type: String,
        required: true,
      },
      ru: {
        type: String,
        required: true,
      },
      uz: {
        type: String,
        required: true,
      },
    },

    metadescription: {
      type: String,
      required: true,
    },

    category: {
      type: SchemaTypes.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

export const ExerciseModel = model("Exercise", exerciseSchema);
