import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const session = await getSession({ req }); 

    if (session) {
      const userRole = session.user.role || 'guest';
      res.status(200).json({ role: userRole });
    } else {
      res.status(401).json({ error: 'Unauthorized' }); 
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
