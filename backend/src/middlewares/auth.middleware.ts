import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/tokengenerator';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, message: 'Access token is missing or invalid' });
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const authenticateCustomer = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  authenticateToken(req, res, () => {
    if (req.user && (req.user.role === 'customer' || req.user.role === 'admin')) {
      next();
    } else {
      res.status(403).json({ success: false, message: 'Forbidden: Insufficient privileges' });
    }
  });
};

export const authenticateAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  authenticateToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ success: false, message: 'Forbidden: Admin privileges required' });
    }
  });
};
