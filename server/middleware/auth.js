import jwt from 'jsonwebtoken';
import ENV from '../config.js';

export class AuthMiddleware {
  async Auth(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1];

      const decodeToken = await jwt.verify(token, ENV.JWT_SECRET);
      console.log(decodeToken);
      req.user = decodeToken;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Authentication Failed' });
    }
  }

  async LocalVariables(req, res, next) {
    req.app.locals = {
      OTP: null,
      resetSession: false,
    };
    next();
  }
}
