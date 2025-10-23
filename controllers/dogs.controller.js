import Dog from "../models/Dog.js";
import mongoose from "mongoose";
// REGISTER NEW DOG
export const registerDog = async (req, res) => {
    try {
        const { name, description } = req.body;
            if (!name) {
                return res.status(400).json({ error: "Dog name is required." }); // Validate name field
            }
            const dog = await Dog.create({
                name, 
                description,
                owner: req.user.id, // Set owner to the authenticated user's ID
            });
            res.status(201).json(dog);
        } catch (err) {
            console.error("Error registering dog:", err.message);
            res.status(500).json({ error: "Failed to register dog" });
        }
    };
    //Adopt a dog by ID
    export const adoptDog = async (req, res) => {
        const { id } = req.params;
        const { thankYouMessage } = req.body;
      
        // Validate dog ID
        if (!mongoose.isValidObjectId(id)) {
          return res.status(400).json({ error: "Invalid dog ID" });
        }
      
        try {
          const dog = await Dog.findById(id);
      
          if (!dog) {
            return res.status(404).json({ error: "Dog not found" });
          }
      
          // Prevent adopting own dog
          if (dog.owner.toString() === req.user.id) {
            return res.status(403).json({ error: "You cannot adopt your own dog" });
          }
      
          // Prevent double adoption
          if (dog.status === "adopted") {
            return res.status(409).json({ error: "Dog is already adopted" });
          }
      
          // Update the dog's adoption details
          dog.status = "adopted";
          dog.adoptedBy = req.user.id;
          dog.thankYouMessage = thankYouMessage || null;
          dog.adoptedAt = new Date();
      
          await dog.save();
      
          res.json(dog);
        } catch (err) {
          console.error("Error adopting dog:", err.message);
          res.status(500).json({ error: "Failed to adopt dog" });
        }
      };
      // Remove a dog (only owner and if not adopted)
      export const removeDog = async (req, res) => {
        const { id } = req.params;
      
        if (!mongoose.isValidObjectId(id)) {
          return res.status(400).json({ error: "Invalid dog ID" });
        }
      
        try {
          const dog = await Dog.findById(id);
      
          if (!dog) {
            return res.status(404).json({ error: "Dog not found" });
          }
      
          // Only owner can remove
          if (dog.owner.toString() !== req.user.id) {
            return res.status(403).json({ error: "You are not the owner of this dog" });
          }
      
          // Cannot delete an adopted dog
          if (dog.status === "adopted") {
            return res.status(409).json({ error: "Cannot remove an adopted dog" });
          }
      
          await dog.deleteOne();
          res.status(204).send(); // 204 = success, no content
        } catch (err) {
          console.error("Error removing dog:", err.message);
          res.status(500).json({ error: "Failed to remove dog" });
        }
      };
      //List dogs registered by the authenticated user supports pagination
      export const listMyRegisteredDogs = async (req, res) => {
        const { page = 1, limit = 10, status } = req.query;
      
        // Build query dynamically
        const query = { owner: req.user.id };
        if (status) query.status = status;
      
        // Pagination math
        const skip = (Math.max(parseInt(page), 1) - 1) * Math.max(parseInt(limit), 1);
        const lim = Math.min(Math.max(parseInt(limit), 1), 100);
      
        try {
          const [items, total] = await Promise.all([
            Dog.find(query)
              .sort({ createdAt: -1 })
              .skip(skip)
              .limit(lim),
            Dog.countDocuments(query),
          ]);
      
          res.json({
            items,
            page: Number(page),
            limit: lim,
            total,
            pages: Math.ceil(total / lim),
          });
        } catch (err) {
          console.error("Error listing dogs:", err.message);
          res.status(500).json({ error: "Failed to list registered dogs" });
        }
      };
// list dogs adopted by the authenticated user with pagination
export const listMyAdoptedDogs = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
  
    const skip = (Math.max(parseInt(page), 1) - 1) * Math.max(parseInt(limit), 1);
    const lim = Math.min(Math.max(parseInt(limit), 1), 100);
  
    try {
      const [items, total] = await Promise.all([
        Dog.find({ adoptedBy: req.user.id })
          .sort({ adoptedAt: -1 })
          .skip(skip)
          .limit(lim),
        Dog.countDocuments({ adoptedBy: req.user.id }),
      ]);
  
      res.json({
        items,
        page: Number(page),
        limit: lim,
        total,
        pages: Math.ceil(total / lim),
      });
    } catch (err) {
      console.error("Error listing adopted dogs:", err.message);
      res.status(500).json({ error: "Failed to list adopted dogs" });
    }
  };