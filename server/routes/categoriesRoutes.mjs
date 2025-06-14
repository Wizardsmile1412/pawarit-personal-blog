import express from "express";
import { createClient } from "@supabase/supabase-js";
import protectAdmin from "../middlewares/protectAdmin.mjs";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const categoriesRouter = express.Router();

categoriesRouter.get("/", protectAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

categoriesRouter.get("/:id", protectAdmin, async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Category ID is required" });
  }
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

categoriesRouter.post("/", protectAdmin, async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  try {
    const { data, error } = await supabase
      .from("categories")
      .insert([{ name }])
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json(data);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
});

categoriesRouter.put("/:id", protectAdmin, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  try {
    const { data, error } = await supabase
      .from("categories")
      .update({ name })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
});

categoriesRouter.delete("/:id", protectAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

export default categoriesRouter;