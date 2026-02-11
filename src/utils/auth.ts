// Import helper functions to read and write data to the browser's local storage
import { readJson, writeJson } from './storage';

// Define the shape of a User object so the app knows what profile data to expect
export type AuthUser = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: 'learner' | 'instructor' | 'admin';
  image?: string;
};

// Unique keys (labels) used to identify our data inside the browser's storage
const tokenKey = 'edulearn_token';
const userKey = 'edulearn_user';

// Pulls the saved security token from storage; returns null if it doesn't exist
export const getToken = () => readJson<string | null>(tokenKey, null);

// Saves the security token to storage, or deletes it if 'null' is passed (logout)
export const setToken = (token: string | null) => {
  if (token) {
    writeJson(tokenKey, token);
  } else if (typeof window !== 'undefined') {
    // remove the item if we are clearing the token
    window.localStorage.removeItem(tokenKey);
  }
};

// Pulls the saved user profile information from storage
export const getUser = () => readJson<AuthUser | null>(userKey, null);

// Saves the user profile object to storage, or deletes it if 'null' is passed
export const setUser = (user: AuthUser | null) => {
  if (user) {
    writeJson(userKey, user);
  } else if (typeof window !== 'undefined') {
    // Manually remove the item if we are clearing the user
    window.localStorage.removeItem(userKey);
  }
};


export const clearAuth = () => {
  setToken(null);
  setUser(null);
};