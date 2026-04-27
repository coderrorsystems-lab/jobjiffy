import express from 'express';
import { listServices } from './store.js';

const router = express.Router();

router.get('/', (req, res) => {
  const { q = '', limit = 8, offset = 0 } = req.query;
  const result = listServices({ query: q, limit, offset });
  res.status(200).json(result);
});

export default router;
