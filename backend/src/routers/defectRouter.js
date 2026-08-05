import express from 'express';
import Defect from '../models/defectsModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const count = await Defect.countDocuments();
    res.json({ message: 'fetched', data: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/defects', async (req, res) => {
  try {
    const defects = await Defect.find().sort({ time: -1 });
    res.json({ status: 200, message: 'fetched', data: defects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/datapdf', async (req, res) => {
  try {
    const defects = await Defect.find().sort({ time: -1 }).limit(30);
    res.json({ status: 200, message: 'fetched', data: defects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const defect = await Defect.create({ ...req.body, reportedBy: req.user._id });
    res.status(201).json({ message: 'Defect created', data: defect });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
