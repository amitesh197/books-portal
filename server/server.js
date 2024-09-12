import express from 'express';
import bodyParser from 'body-parser';
import dataRoutes from './routes/data.js';

const app = express();
const port = 3005;

app.use(bodyParser.json());
app.use('/api/data', dataRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
