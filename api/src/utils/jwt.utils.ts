import { sign, SignOptions, verify } from 'jsonwebtoken';
import * as config from '../config';

interface TokenPayload {
  exp?: number;
  accessTypes: string[];
  name: string;
  userId: number;
}

export function generateToken(payload: TokenPayload) {
  const signInOptions: SignOptions = {
    expiresIn: '40h',
  };

  // generate JWT
  return sign(payload, config.JWT_SECRET, signInOptions);
}

/**
 * checks if JWT token is valid
 *
 * @param token the expected token payload
 */
export function validateToken(token: string): Promise<TokenPayload> {
  return new Promise((resolve, reject) => {
    verify(token, config.JWT_SECRET, (error, decoded) => {
      if (error) {
        reject(error);
      } else {
        resolve(decoded as TokenPayload);
      }
    });
  });
}
