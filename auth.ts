// auth.ts
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

interface User {
  username: string;
  password: string;
  uid: string;
}

const users: User[] = [];

const generateToken = (uid: string) => {
  // In a real-world scenario, you should use a secure secret and set an expiration time for the token.
  const secret = 'your-secret-key';
  return jwt.sign({ uid }, secret);
};

const createUser = async (username: string, password: string): Promise<User> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const uid = uuidv4();
  const user: User = { username, password: hashedPassword, uid };
  users.push(user);
  return user;
};

const findUserByUsername = (username: string): User | undefined => {
  return users.find((user) => user.username === username);
};

const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

const authenticateUser = async (username: string, password: string): Promise<string | null> => {
  const user = findUserByUsername(username);

  if (!user) {
    return null; // User not found
  }

  const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    return null; // Invalid password
  }

  return generateToken(user.uid);
};

export { createUser, authenticateUser };
