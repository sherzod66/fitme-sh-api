import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { CategoryModel } from "./../database/models/category/model";
import { changeResponse } from "./../utils/changeResponse";
import { CategoryDocument } from "./../database/models/category/types";
import { CategoryService } from "../services";

export class CategoryController {
  public async find(req: Request, res: Response, next: NextFunction) {
    try {
      let query: any = {};

      if (req.query.type) {
        query.type = req.query.type;
      }

      let result = await CategoryModel.find(query).populate([
        "parent",
        "children",
      ]);

      if (req.query.parents) {
        result = result.filter((c) => !c.parent);
      }

      res.status(StatusCodes.OK).json(changeResponse(true, result));
    } catch (e) {
      next(e);
    }
  }

  public async getParentCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await CategoryModel.find({
        parent: undefined,
        ...req.query,
      }).populate(["parent", "children"]);

      res.status(StatusCodes.OK).json(changeResponse(true, result));
    } catch (e) {
      next(e);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      let parent: CategoryDocument | null = null;
      const { parent: _id } = req.body;

      if (_id) {
        parent = await CategoryModel.findOne({ _id });

        if (!parent) {
          throw createHttpError(
            StatusCodes.NOT_FOUND,
            "Parent Category not found"
          );
        }
      }

      const saved = await CategoryModel.create({
        ...req.body,
        parent: parent?._id ?? undefined,
      });

      if (parent) {
        parent.children = [...(parent.children as any[]), saved._id];
        await parent.save();
      }

      res.status(StatusCodes.CREATED).json(changeResponse(true, saved));
    } catch (e) {
      next(e);
    }
  }

  public async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const found = await CategoryService.findOne({ _id: req.params.id });

      if (!found) {
        throw createHttpError(StatusCodes.NOT_FOUND, "Category not found");
      }

      res.status(StatusCodes.OK).json(changeResponse(true, found));
    } catch (e) {
      next(e);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: _id } = req.params;

      const updated = await CategoryModel.updateOne({ _id }, { ...req.body });

      if (!updated.modifiedCount) {
        throw createHttpError(StatusCodes.NOT_FOUND, "Category not found");
      }

      res
        .status(StatusCodes.OK)
        .json(changeResponse(true, { ...req.body, _id }));
    } catch (e) {
      next(e);
    }
  }

  public async updateParent(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await CategoryService.updateParent(
        req.params.id,
        req.body.parent
      );

      res.status(StatusCodes.OK).json(changeResponse(true, updated));
    } catch (e) {
      next(e);
    }
  }

  public async updateChildren(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await CategoryService.updateChildren(
        req.params.id,
        req.body.children
      );

      res.status(StatusCodes.OK).json(changeResponse(true, updated));
    } catch (e) {
      next(e);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await CategoryService.delete(req.params.id);

      res.status(StatusCodes.OK).json(changeResponse(true, null));
    } catch (e) {
      next(e);
    }
  }
}
