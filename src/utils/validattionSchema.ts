import * as Yup from "yup";

export const bookSchema = Yup.object({
  title: Yup.string()
    .matches(
      /^(?=.*[A-Za-z])[A-Za-z0-9\s\-']+$/,
      "Title must contain at least one letter and may include numbers, spaces, hyphens, and apostrophes"
    )
    .required("Title is required"),

  author: Yup.string()
    .matches(
      /^(?=.*[A-Za-z])[A-Za-z\s\.\']+$/,
      "Author must contain at least one letter and may include spaces, dots, and apostrophes"
    )
    .required("Author is required"),

  year: Yup.number().typeError("Year must be a number").required("Year is required"),

  genre: Yup.string()
    .oneOf(["thriller", "action", "adventure", "romantic", "comedy"], "Invalid genre")
    .required("Genre is required"),

  status: Yup.string()
    .oneOf(["available", "issued"], "Invalid status")
    .required("Status is required"),
});
