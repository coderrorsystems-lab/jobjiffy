import express from 'express';
import { addProfessional, getProfessionalById, listProfessionals } from './store.js';

const router = express.Router();

router.get('/', (req, res) => {
  const { service = '', search = '', sort = 'top_rated', availableToday = 'false' } = req.query;
  const result = listProfessionals({
    service,
    search,
    sort,
    availableToday: availableToday === 'true',
  });

  return res.status(200).json(result);
});

router.get('/:id', (req, res) => {
  const professional = getProfessionalById(req.params.id);

  if (!professional) {
    return res.status(404).json({ message: 'Professional not found' });
  }

  return res.status(200).json({ data: professional });
});

router.post('/register', (req, res) => {
  const {
    fullName,
    email,
    category,
    experience,
    servicesOffered,
    pricePerService,
    serviceArea,
  } = req.body || {};

  if (!fullName || !email || !category || !experience || !pricePerService || !serviceArea) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const result = addProfessional({
    fullName,
    email,
    category,
    experience,
    servicesOffered,
    pricePerService,
    serviceArea,
  });

  return res.status(201).json({
    message: 'Professional registered successfully',
    professional: result.professional,
    registeredServices: result.registeredServices,
  });
});

export default router;
