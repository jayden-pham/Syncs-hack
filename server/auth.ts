import validator from 'validator';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';
import {
  User,
  Profile,
  UserProfile,
  AuthResponse,
} from './interface.js';
import { getData } from './datastore.js';

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function checkPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function generateAccessToken(userId: string): string {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign({ userId }, secret, { expiresIn: '24h' });
}

export function validToken(token: string): string | { error: string } {
  const data = getData();

  if (!token) {
    return { error: 'Token is required' };
  }

  const secret = process.env.JWT_SECRET || 'your-secret-key';
  try {
    const decoded = jwt.verify(token, secret) as { userId: string };
    if (!decoded?.userId) {
      return { error: 'Invalid token payload' };
    }

    const user = data.users.find(u => u.userId === decoded.userId);
    if (!user) {
      return { error: 'User not found' };
    }

    return decoded.userId;
  } catch {
    return { error: 'Invalid or expired token' };
  }
}

export function validName(nameFirst: string, nameLast: string): { error: string } | null {
  if (!/^[a-zA-Z\s'-]+$/.test(nameFirst) || nameFirst.length < 2 || nameFirst.length > 20) {
    return { error: 'Invalid first name: must be 2-20 characters and contain only letters, spaces, hyphens, or apostrophes' };
  }

  if (!/^[a-zA-Z\s'-]+$/.test(nameLast) || nameLast.length < 2 || nameLast.length > 20) {
    return { error: 'Invalid last name: must be 2-20 characters and contain only letters, spaces, hyphens, or apostrophes' };
  }
  return null;
}

export function validPassword(password: string): { error: string } | null {
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters long' };
  }

  if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
    return { error: 'Password must contain at least 1 letter and number' };
  }
  return null;
}

export function createUserProfile(nameFirst: string, nameLast: string): Profile {
  const profileId = uuidv4();
  const data = getData();
  const newProfile: Profile = {
    profileId,
    nameFirst,
    nameLast,
    age: undefined,
    gender: undefined,
    budget: undefined,
    bio: undefined,
    location: undefined,
    phoneNumber: null,
    currentGroupId: null,
  };
  data.profiles.push(newProfile);
  return newProfile;
}

export function authSignup(
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string
): AuthResponse {
  const data = getData();
  if (data.users.some(user => user.username === email.toLowerCase())) {
    throw new Error('Email address is already in use');
  }

  if (!validator.isEmail(email)) {
    throw new Error('Invalid email address');
  }

  const nameError = validName(nameFirst, nameLast);
  if (nameError) {
    throw new Error(nameError.error);
  }

  const passwordError = validPassword(password);
  if (passwordError) {
    throw new Error(passwordError.error);
  }

  const hashedPassword = hashPassword(password);
  const userId = uuidv4();
  const profile = createUserProfile(nameFirst, nameLast);

  const newUser: User = {
    userId,
    username: email.toLowerCase(),
    password: hashedPassword,
    profileId: profile.profileId
  };
  data.users.push(newUser);

  return { accessToken: generateAccessToken(userId) };
}

export function authLogin(email: string, password: string): AuthResponse {
  const data = getData();
  const user = data.users.find(u => u.username === (email || '').toLowerCase());
  if (!user) {
    throw new Error('Invalid email or password');
  } 

  if (!checkPassword(password || '', user.password)) {
    throw new Error('Invalid email or password');
  }

  return { accessToken: generateAccessToken(user.userId) };
}

export function authMe(token: string): UserProfile {
  const data = getData();
  const userId = validToken(token);
  if (typeof userId === 'object') {
    throw new Error(userId.error);
  }

  const user = data.users.find(u => u.userId === userId);
  if (!user) {
    throw new Error('User not found');
  }

  const profile = data.profiles.find(p => p.profileId === user.profileId);
  if (!profile) {
    throw new Error('Profile not found');
  }

  return {
    profile,
    currentGroupId: profile.currentGroupId ?? null
  };
}
