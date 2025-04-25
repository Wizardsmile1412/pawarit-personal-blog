export default function postValidate(req, res, next) {
  const { title, image, category_id, description, content, status_id } =
    req.body;

  if (
    !title ||
    !image ||
    !category_id ||
    !description ||
    !content ||
    !status_id
  ) {
    return res.status(400).json({
      message:
        "Server could not create post because there are missing data from client",
    });
  }

  if (typeof category_id !== "number" || typeof status_id !== "number") {
    return res.status(400).json({
      error: "category_id and status_id must be numbers.",
    });
  }

  next();
}
