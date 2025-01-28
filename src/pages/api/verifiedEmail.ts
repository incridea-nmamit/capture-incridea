import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import { initTRPC } from '@trpc/server';
import { verifiedEmail } from '~/server/api/routers/verifiedemail';
import { createContext } from '~/server/context';
const t = initTRPC.create();
const appRouter = t.router({
  verifiedEmail,
});
const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
});
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(`Received ${req.method} request`);   
    try {
      await runMiddleware(req, res, cors);
      const apiKey = req.headers['x-api-key'];
      if (apiKey !== process.env.CAPTURE_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
      }  
      if (req.method === 'POST') {
        console.log('Handling POST request');   
        const trpcHandler = appRouter.createCaller(createContext({ req }));
        const { email, name,phone_number,college } = req.body;
        console.log('Email:', email);   
        const result = await trpcHandler.verifiedEmail.addVerifiedEmail({name, email ,phone_number,college });
        console.log('Result:', result);
        return res.status(200).json(result); 
      }  
      console.log(`Method Not Allowed: ${req.method}`); 
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ error: 'Method Not Allowed' }); 
    } catch (error) {
      console.error('Error:', error); // Log any errors
      return res.status(500).json({ error: (error as Error).message }); 
    }
  }
  