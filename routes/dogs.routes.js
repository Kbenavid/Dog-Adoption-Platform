// routes/dogs.routes.js
import { Router } from "express";
import { authRequired } from "../middlewares/auth.js";
import {
  registerDog,
  adoptDog,
  removeDog,
  listMyRegisteredDogs,
  listMyAdoptedDogs,
} from "../controllers/dogs.controller.js";

const router = Router();

// Dog management routes
router.post("/", authRequired, registerDog);             // Register new dog
router.post("/:id/adopt", authRequired, adoptDog);       // Adopt a dog
router.delete("/:id", authRequired, removeDog);          // Remove your dog
router.get("/registered", authRequired, listMyRegisteredDogs); // List your registered dogs
router.get("/adopted", authRequired, listMyAdoptedDogs);       // List your adopted dogs

export default router;