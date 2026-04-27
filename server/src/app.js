import express from 'express';
import cors from 'cors';
import { servicesRouter, professionalsRouter } from './modules/professionals/index.js';

const app = express();

app.use(
	cors({
		origin: '*',
	})
);
app.use(express.json());

app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok' });
});

app.use('/api/services', servicesRouter);
app.use('/api/professionals', professionalsRouter);

app.use((req, res) => {
	res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).json({ message: 'Internal server error' });
});

export default app;
