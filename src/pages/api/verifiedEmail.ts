/**
 * Email Verification API Handler
 * Handles verification of emails with API key authentication
 */

import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import { initTRPC } from '@trpc/server';
import { verifiedEmail } from '~/server/api/routers/verifiedemail';
import { createContext } from '~/server/context';
import { z } from 'zod';
const t = initTRPC.create();
const appRouter = t.router({
  verifiedEmail,
});

/**
 * CORS middleware configuration
 */
const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
});

/**
 * Middleware runner utility
 * @param req - Next.js API request
 * @param res - Next.js API response
 * @param fn - Middleware function to run
 */
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

/**
 * Main API handler for email verification
 * Validates API key and processes verification requests
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(`Received ${req.method} request`);   
    try {
      await runMiddleware(req, res, cors);
      const apiKey = req.headers['authorization'] as string | undefined;
      if (!apiKey || !apiKey.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      if (apiKey.split(' ')[1] !== process.env.CAPTURE_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
      }  
      if (req.method === 'POST') {
        console.log('Handling POST request');   
        const trpcHandler = appRouter.createCaller(createContext({ req }));
        const {success,data,error}=z.object({
          email: z.string(),
          name: z.string(),
          phoneNumber: z.string(),
          specialType: z.enum(['faculty','alumni','participant']).default('participant'),
        }).safeParse(JSON.parse(req.body));
        if (!success) { 
          return res.status(400).json({ error: error}); 
        }
        if(data.specialType==='faculty'){
          const { email, name,phoneNumber } = data;
          console.log('Email:', email);   
          const result = await trpcHandler.verifiedEmail.addVerifiedEmailFaculty({name, email ,phone_number:phoneNumber });
          console.log('Result:', result);
          return res.status(200).json(result); 
        } else if(data.specialType==='alumni'){
          const { email, name,phoneNumber } = data;
          console.log('Email:', email);   
          const result = await trpcHandler.verifiedEmail.addVerifiedEmailAlumni({name, email ,phone_number:phoneNumber });
          console.log('Result:', result);
          return res.status(200).json(result); 
        } else if(data.specialType==='participant'){
          const { email, name,phoneNumber } = data;
          console.log('Email:', email);   
          const result = await trpcHandler.verifiedEmail.addVerifiedEmail({name, email ,phone_number:phoneNumber });
          console.log('Result:', result);
          return res.status(200).json(result); 
        }
      }  
      console.log(`Method Not Allowed: ${req.method}`); 
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ error: 'Method Not Allowed' }); 
    } catch (error) {
      console.error('Error:', error); // Log any errors
      return res.status(500).json({ error: (error as Error).message }); 
    }
  }
