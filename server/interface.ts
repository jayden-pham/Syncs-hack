export interface User {
  userId: string;
  username: string;
  password: string;     
  profileId: string;
  preferences?: Preferences;
}

export interface Preferences {
  age?: { min?: number; max?: number };
  gender?: string[];
  groupsRated?: string[];
  groupsCandidates?: string[];
}

export interface Profile {
  profileId: string;
  nameFirst: string;
  nameLast: string;
  age?: number;
  gender?: string;
  location?: string;
  phoneNumber?: string | null;
  budget?: number;
  bio?: string;
  currentGroupId?: string | null;
}

export interface ProfileUpdate {
  nameFirst?: string;
  nameLast?: string;
  age?: number;
  gender?: string;
  location?: string;
  budget?: number;
  bio?: string;
  phoneNumber?: string | null;
}

export interface AuthResponse {
  accessToken: string;
}

export interface UserProfile {
  profile: Profile;
  currentGroupId: string | null; 
}

export interface dataStore {
  users: User[];
  profiles: Profile[];
}
