import type { RequestHandler } from 'express';

export const publicResponseCache = (maxAgeInSeconds: number): RequestHandler => {
  return (_req, res, next) => {
    res.set('Cache-Control', `public, max-age=${maxAgeInSeconds}`);
    next();
  };
};
