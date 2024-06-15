import { objectIdRegex } from "./../../constants/regex";
import * as yup from "yup";

export const exerciseValidationSchema = yup.object({
  title: yup
    .object()
    .shape({
      en: yup.string().required(),
      ru: yup.string().required(),
      uz: yup.string().required(),
    })
    .required(),
  image: yup.string().required(),
  video: yup.string().required(),
  description: yup
    .object()
    .shape({
      en: yup.string().required(),
      ru: yup.string().required(),
      uz: yup.string().required(),
    })
    .required(),
  metadescription: yup.string().required(),
  category: yup.string().matches(objectIdRegex).required(),
});

export const updateExerciseValidationSchema = yup.object({
  title: yup
    .object()
    .shape({
      en: yup.string().required(),
      ru: yup.string().required(),
      uz: yup.string().required(),
    })
    .required(),
  image: yup.string().required(),
  video: yup.string().required(),
  description: yup
    .object()
    .shape({
      en: yup.string().required(),
      ru: yup.string().required(),
      uz: yup.string().required(),
    })
    .required(),
  metadescription: yup.string().required(),
});

export const updateExerciseImageValidationSchema = yup.object({
  image: yup.string().required(),
});

export const updateExerciseCategoryValidationSchema = yup.object({
  category: yup.string().matches(objectIdRegex).required(),
});
