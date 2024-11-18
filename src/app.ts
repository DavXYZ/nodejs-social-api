// app.ts
import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './auth/auth.api';
import { AppDataSource } from './data-source';
import friendRoutes from './routes/FriendRoute';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/api/v1', authRoutes);
app.use('/api/v1', friendRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error during Data Source initialization:', error);
    process.exit(1);
  });


export default app;
