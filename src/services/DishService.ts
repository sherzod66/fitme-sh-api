import { Request } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { IDish, DishModel } from "./../database/models/dish";
import { ProductModel } from "./../database/models/product";
import { UserModel } from "./../database/models/user";
import { TrainerModel } from "./../database/models/trainer";
import UserService from "./UserService";

type TUpdateDto = {
  name: string;
  products: string[];
  amounts: string[];
  creator: string;
};

const populate = [
  { path: "products", populate: "category" },
  "creatorUser",
  "creatorTrainer",
];

const DishService = {
  findAll: async (req: Request) => {
    return await DishModel.find().populate(populate);
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

  update: async (
    body: TUpdateDto,
    dishId: string
  ): Promise<any | null | undefined> => {
    const findDish = await DishModel.findOne({ _id: dishId });
    if (!findDish) {
      throw createHttpError(
        StatusCodes.BAD_REQUEST,
        `Dish ${dishId} not found`
      );
    }
    const update = await DishModel.updateOne(
      { _id: dishId },
      {
        name: body.name,
        products: body.products,
        amounts: body.amounts,
        creator: body.creator,
      }
    );
    if (update.matchedCount === 0) {
      throw createHttpError(StatusCodes.BAD_REQUEST, `Something went wrong`);
    }
    const foundDish = await DishModel.findOne({ _id: dishId });
    return foundDish;
  },

  delete: async (_id: string): Promise<void> => {
    const foundDish = await DishService.find({ _id });

    if (!foundDish) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Dish not found");
    }
    const foundUser = await UserService.find({ _id: foundDish.creatorUser });

    if (!foundUser) {
      throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
    }

    const findIndex = [...(foundUser.dishes ?? [])].findIndex(
      (a) => a._id.toString() === foundDish._id.toString()
    );

    if (findIndex === -1) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Invalid dish Id");
    }

    let arr = [...foundUser.dishes];

    arr = [...arr.slice(0, findIndex), ...arr.slice(findIndex + 1)];
    foundUser.dishes = [...arr];

    await UserModel.findByIdAndUpdate(foundUser._id, foundUser);

    await DishModel.findByIdAndDelete(_id);
  },
};

export default DishService;
