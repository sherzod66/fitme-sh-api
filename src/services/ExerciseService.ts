import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { CategoryService } from ".";
import { IExercise, ExerciseModel } from "../database/models/exercise";
import { CategoryDocument } from "../database/models/category";
import { CATEGORY_TYPES } from "../types/common";
import fs from "fs";
import path from "path";
import { removeFileAsync } from "../utils/removeFile";

const populate = ["category"];

const ExerciseService = {
  find: async (
    condition: Partial<IExercise>
  ): Promise<any | null | undefined> => {
    return await ExerciseModel.findOne(condition).populate(populate);
  },

  create: async (data: any) => {
    const { title, video, image, description, metadescription } = data;
    console.log(data);
    const category: CategoryDocument = await CategoryService.findOne({
      _id: data.category,
    });

    if (!category) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Category not found");
    }

    if (!category.parent || category.type !== CATEGORY_TYPES.EXERCISE) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid Category");
    }

    const created = await ExerciseModel.create({
      title,
      video,
      image,
      description,
      metadescription,
      category,
    });

    return created;
  },

  updateCategory: async (
    _id: string,
    categoryId: string
  ): Promise<any | null | undefined> => {
    const category: CategoryDocument = await CategoryService.findOne({
      _id: categoryId,
    });

    if (!category) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Category not found");
    }

    if (!category.parent || category.type !== CATEGORY_TYPES.EXERCISE) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid Category");
    }

    const exercise: IExercise = await ExerciseService.find({
      _id,
    });

    if (!exercise) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Exercise not found");
    }

    if (exercise?.category._id.toString() === category._id.toString()) {
      throw createHttpError(
        StatusCodes.BAD_REQUEST,
        "Category must be another Category"
      );
    }

    exercise.category = category;
    await ExerciseModel.findByIdAndUpdate(exercise._id, exercise);

    return exercise;
  },

  delete: async (_id: string): Promise<void> => {
    const found: IExercise = await ExerciseService.find({ _id });

    if (!found) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Exercise not found");
    }
    await removeFileAsync(
      `${path.join(path.resolve(), "static")}${found.image}`
    );
    await ExerciseModel.findByIdAndDelete(_id);
  },
};

export default ExerciseService;
