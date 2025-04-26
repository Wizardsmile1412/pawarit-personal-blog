export default function postValidate(req, res, next) {
  const { title, image, category_id, description, content, status_id } = req.body;

  const errors = {};

  
  if (!title) errors.title = "Title is required.";
  if (!image) errors.image = "Image is required.";
  if (!category_id) errors.category_id = "Category ID is required.";
  if (!description) errors.description = "Description is required.";
  if (!content) errors.content = "Content is required.";
  if (!status_id) errors.status_id = "Status ID is required.";

  if (title && typeof title !== "string") errors.title = "Title must be a string.";
  if (image && typeof image !== "string") errors.image = "Image must be a string.";
  if (description && typeof description !== "string") errors.description = "Description must be a string.";
  if (content && typeof content !== "string") errors.content = "Content must be a string.";
  if (category_id && typeof category_id !== "number") errors.category_id = "Category ID must be a number.";
  if (status_id && typeof status_id !== "number") errors.status_id = "Status ID must be a number.";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors
    });
  }

  next();
}

