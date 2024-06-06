import { Request } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { IDish, DishModel } from "./../database/models/dish";
import { ProductModel } from "./../database/models/product";
import { UserModel } from "./../database/models/user";
import { TrainerModel } from "./../database/models/trainer";

const populate = [
  { path: "products", populate: "category" },
  "category",
  "creatorUser",
  "creatorTrainer",
];

const DishService = {
  findAll: async (req: Request) => {
    let query: any = {};

    if (req.query.category) {
      query.category = req.query.category;
    }

    return await DishModel.find(query).populate(populate);
  },

  find: async (condition: Partial<IDish>): Promise<any | null | undefined> => {
    return await DishModel.findOne(condition).populate(populate);
  },

  create: async (obj: any): Promise<any | null | undefined> => {
    const { name, products, amounts, creator: creatorId } = obj;

    const foundDish = await ProductModel.findOne({ name });

    if (foundDish) {
      throw createHttpError(
        StatusCodes.BAD_REQUEST,
        `Dish with ${name} already created`
      );
    }

    if (products.length !== amounts.length) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid amounts");
    }

    for (let i = 0; i < (products as string[]).length; i++) {
      const foundProduct = await ProductModel.findById(products[i]);

      if (!foundProduct) {
        throw createHttpError(
          StatusCodes.NOT_FOUND,
          `Product with ${products[i]} not found`
        );
      }
    }

    const foundUser = await UserModel.findById(creatorId);
    const foundTrainer = await TrainerModel.findById(creatorId);

    if (!(foundUser || foundTrainer)) {
      throw createHttpError(StatusCodes.NOT_FOUND, "creator not found");
    }

    let creator: any = {};

    if (foundUser) {
      creator.creatorUser = foundUser._id;
    }
    if (foundTrainer) {
      creator.creatorTrainer = foundTrainer._id;
    }

    const created = await DishModel.create({
      name,
      products,
      amounts,
      ...creator,
    });

    if (foundUser) {
      foundUser.dishes = [...(foundUser.dishes ?? []), created];
      await foundUser.save();
    }
    if (foundTrainer) {
      foundTrainer.dishes = [...(foundTrainer.dishes ?? []), created];
      await foundTrainer.save();
    }

    return created;
  },

  delete: async (_id: string): Promise<void> => {
    const foundDish = await DishService.find({ _id });

    if (!foundDish) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Dish not found");
    }

    await DishModel.findByIdAndDelete(_id);
  },
};

export default DishService;
