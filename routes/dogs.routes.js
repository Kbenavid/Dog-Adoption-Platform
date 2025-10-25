import express from "express";
import {
  registerDog,
  adoptDog,
  removeDog,
  listMyRegisteredDogs,
  listMyAdoptedDogs
} from "../controllers/dogs.controller.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🐾 Protected routes
router.post("/", authenticate, registerDog);
router.post("/:id/adopt", authenticate, adoptDog);
router.delete("/:id", authenticate, removeDog);
router.get("/my-registered", authenticate, listMyRegisteredDogs);
router.get("/my-adopted", authenticate, listMyAdoptedDogs);

export default router;