// src/server/context.ts
import { NextApiRequest } from 'next';
import { db } from './db';


export function createContext({ req }: { req: NextApiRequest }) {
  return {
    db: db,
    req,
  };
}

export type Context = ReturnType<typeof createContext>;
