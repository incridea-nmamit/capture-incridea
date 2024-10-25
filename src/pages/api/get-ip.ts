// pages/api/get-ip.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const ip =
    req.headers['x-forwarded-for']?.toString().split(',')[0] ??
    req.socket.remoteAddress ??
    '';
    
  console.log(`IP Logged: ${ip}`); // Log IP access for debugging
  res.status(200).json({ ip });
}
