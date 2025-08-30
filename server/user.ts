import { Profile, ProfileUpdate } from './interface.ts';
import { validToken } from './auth.ts';
import { getData } from './datastore.js';

export function usersMe(token: string): { profile: Profile } {
  const userId = validToken(token);
  if (typeof userId === 'object') {
    throw new Error(userId.error);
  }

  const data = getData();
  const user = data.users.find(u => u.userId === userId);
  if (!user) {
    throw new Error('User not found');
  }

  const profile = data.profiles.find(p => p.profileId === user.profileId);
  if (!profile) {
    throw new Error('Profile not found');
  }

  return { profile };
}

export function usersMeUpdate(token: string, update: ProfileUpdate): { profile: Profile } {
  const userId = validToken(token);

  const data = getData();
  const user = data.users.find(u => u.userId === userId);
  if (!user) {
    throw new Error('User not found');
  }

  const profile = data.profiles.find(p => p.profileId === user.profileId);
  if (!profile) {
    throw new Error('Profile not found');
  }

  if (update.nameFirst !== undefined) {
    const v = String(update.nameFirst).trim();
    if (!/^[A-Za-z\s'-]{2,50}$/.test(v)) {
      throw new Error('Invalid first name');
    }
    profile.nameFirst = v;
  }

  if (update.nameLast !== undefined) {
    const v = String(update.nameLast).trim();
    if (!/^[A-Za-z\s'-]{2,50}$/.test(v)) {
      throw new Error('Invalid last name');
    }
    profile.nameLast = v;
  }

  if (update.age !== undefined) {
    const n = Number(update.age);
    if (!Number.isInteger(n) || n < 13 || n > 120) {
      throw new Error('Invalid age');
    }
    profile.age = n;
  }

  if (update.gender !== undefined) {
    const v = String(update.gender).trim();
    if (v.length > 50) {
      throw new Error('Invalid gender');
    }
    profile.gender = v;
  }

  if (update.location !== undefined) {
    const v = String(update.location).trim();
    if (v.length > 255) {
      throw new Error('Invalid location');
    }
    profile.location = v;
  }

  if (update.budget !== undefined) {
    const n = Number(update.budget);
    if (!Number.isFinite(n) || n < 0 || n > 1_000_000_000) {
      throw new Error('Invalid budget');
    }
    profile.budget = n;
  }

  if (update.bio !== undefined) {
    const v = String(update.bio);
    if (v.length > 1000) {
      throw new Error('Bio too long');
    }
    profile.bio = v;
  }

  if (update.phoneNumber !== undefined) {
    const v = String(update.phoneNumber).trim();
    if (v.length > 20) {
      throw new Error('Invalid phone number');
    }
    profile.phoneNumber = v;
  }

  return { profile };
}