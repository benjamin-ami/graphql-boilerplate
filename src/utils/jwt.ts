import * as jwt from 'jsonwebtoken';

const privateKey = process.env.PRIVATE_KEY || 'secret-key';

export const createToken = async (data) => {
  try {
    data.password && delete data.password;

    return await jwt.sign(data, privateKey);
  } catch (e) {
    throw e;
  }
};

export const verifyToken = async (token) => {
  try {
    if (!token) return null;
    return await jwt.verify(token, privateKey);
  } catch (e) {
    return null;
  }
};
