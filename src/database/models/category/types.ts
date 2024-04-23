import { Document, ObjectId } from "mongoose";
import { CATEGORY_TYPES, MultiLanguageName } from "./../../../types/common";

export interface ICategory {
  _id: ObjectId | string;
  name: MultiLanguageName;
  type: CATEGORY_TYPES;
  parent?: ObjectId;
  children?: ICategory[];
}

export type CategoryDocument = Document & ICategory;
