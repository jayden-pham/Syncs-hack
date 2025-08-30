import 'dotenv/config';
import express, { json, Request, Response } from 'express';
import { authSignup, authLogin, authMe } from './auth.ts';
import { usersMe, usersMeUpdate } from './user.ts';
import { loadData, saveData } from './datastore.ts';

const app = express();
app.use(json());

const PORT: number = parseInt(process.env.PORT || '5001', 10);
const HOST: string = process.env.IP || '127.0.0.1';

loadData();

app.post('/auth/signup', (req: Request, res: Response) => {
  try {
    const { email, password, nameFirst, nameLast } = req.body;
    const result = authSignup(email, password, nameFirst, nameLast);
    saveData();
    return res.status(200).json({ access_token: result.accessToken });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

app.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = authLogin(email, password);
    saveData();
    return res.status(200).json({ access_token: result.accessToken });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/auth/me', (req: Request, res: Response) => {
  try {
    const auth = req.header('Authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
    const result = authMe(token);
    saveData();
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(401).json({ error: error.message });
  }
});

app.get('/users/me', (req: Request, res: Response) => {
  try {
    const auth = req.header('Authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
    const result = usersMe(token);
    saveData();
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(401).json({ error: error.message });
  }
});

app.put('/users/me', (req: Request, res: Response) => {
  try {
    const auth = req.header('Authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
    const result = usersMeUpdate(token, req.body ?? {});
    saveData();
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// !!!
app.use((req: Request, res: Response) => {
  const error = `route not found`;
  res.status(404).json({ error });
});

const server = app.listen(PORT, HOST, () => {
  console.log(`server started on port ${PORT} at ${HOST}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('shutting down server');
    process.exit();
  });
});
