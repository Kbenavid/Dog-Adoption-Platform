import Dog from '../models/Dog.js';
import mongoose from 'mongoose';

// POST /dogs  (protected) — register a dog
export const registerDog = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Dog name is required.' });

    const dog = await Dog.create({
      name,
      description: description || '',
      owner: req.user.id,                     // from auth middleware
    });

    return res.status(201).json(dog);
  } catch (err) {
    console.error('Error registering dog:', err.message);
    return res.status(500).json({ error: 'Failed to register dog' });
  }
};

// (Keep these if you want full functionality; tests only need register)
export const adoptDog = async (req, res) => {
  const { id } = req.params;
  const { thankYouMessage } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid dog ID' });
  }

  try {
    const dog = await Dog.findById(id);
    if (!dog) return res.status(404).json({ error: 'Dog not found' });

    if (dog.owner.toString() === req.user.id) {
      return res.status(403).json({ error: 'You cannot adopt your own dog' });
    }

    if (dog.status === 'adopted') {
      return res.status(409).json({ error: 'Dog is already adopted' });
    }

    dog.status = 'adopted';
    dog.adoptedBy = req.user.id;
    dog.thankYouMessage = thankYouMessage || null;
    dog.adoptedAt = new Date();

    await dog.save();
    return res.json(dog);
  } catch (err) {
    console.error('Error adopting dog:', err.message);
    return res.status(500).json({ error: 'Failed to adopt dog' });
  }
};

export const removeDog = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid dog ID' });
  }

  try {
    const dog = await Dog.findById(id);
    if (!dog) return res.status(404).json({ error: 'Dog not found' });

    if (dog.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You are not the owner of this dog' });
    }

    if (dog.status === 'adopted') {
      return res.status(409).json({ error: 'Cannot remove an adopted dog' });
    }

    await dog.deleteOne();
    return res.status(204).send();
  } catch (err) {
    console.error('Error removing dog:', err.message);
    return res.status(500).json({ error: 'Failed to remove dog' });
  }
};

export const listMyRegisteredDogs = async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const query = { owner: req.user.id };
  if (status) query.status = status;

  const skip = (Math.max(parseInt(page), 1) - 1) * Math.max(parseInt(limit), 1);
  const lim = Math.min(Math.max(parseInt(limit), 1), 100);

  try {
    const [items, total] = await Promise.all([
      Dog.find(query).sort({ createdAt: -1 }).skip(skip).limit(lim),
      Dog.countDocuments(query),
    ]);
    return res.json({ items, page: Number(page), limit: lim, total, pages: Math.ceil(total / lim) });
  } catch (err) {
    console.error('Error listing dogs:', err.message);
    return res.status(500).json({ error: 'Failed to list registered dogs' });
  }
};

export const listMyAdoptedDogs = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Math.max(parseInt(page), 1) - 1) * Math.max(parseInt(limit), 1);
  const lim = Math.min(Math.max(parseInt(limit), 1), 100);

  try {
    const [items, total] = await Promise.all([
      Dog.find({ adoptedBy: req.user.id }).sort({ adoptedAt: -1 }).skip(skip).limit(lim),
      Dog.countDocuments({ adoptedBy: req.user.id }),
    ]);
    return res.json({ items, page: Number(page), limit: lim, total, pages: Math.ceil(total / lim) });
  } catch (err) {
    console.error('Error listing adopted dogs:', err.message);
    return res.status(500).json({ error: 'Failed to list adopted dogs' });
  }
};