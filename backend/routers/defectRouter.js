import Defect from '../models/defectsModel.js';
import express from 'express'

const router = express.Router();


router.get('/', async (req, res) => {
  try {

    const count = await Defect.countDocuments();

    res.json({ message: "fetched", data: count });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/defects', async (req, res) => {
  try {
    const defects = await Defect.find();

    res.status(200).json({
      status: 200,
      message: "fetched",
      data: defects
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/datapdf', async (req, res) => {
  try {
    const defects = await Defect.find()
  .sort({ time: -1 })
  .limit(30);

    res.status(200).json({
      status: 200,
      message: "fetched",
      data: defects
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;