// pages/api/get-ip.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const ip =
    req.headers['x-forwarded-for']?.toString().split(',')[0] || // Use first IP in case of multiple proxies
    req.socket.remoteAddress || // Fallback to socket's remote address
    '';
    
  console.log(`IP Logged: ${ip}`); // Log IP access for debugging
  res.status(200).json({ ip });
}
