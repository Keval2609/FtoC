import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';
import { createUserProfile, getUserProfile } from './firestore';

const googleProvider = new GoogleAuthProvider();

/**
 * Sign up with email + create Firestore user profile with selected role.
 * @param {string} email
 * @param {string} password
 * @param {string} displayName
 * @param {string} role - "farmer" or "customer"
 */
export async function signUpWithEmail(email, password, displayName, role) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });

  // Create the Firestore user profile doc
  await createUserProfile(result.user.uid, {
    email,
    displayName,
    role,
  });

  return result.user;
}

export async function signInWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

/**
 * Google sign-in.
 * If the user doesn't have a Firestore profile yet, returns { user, isNewUser: true }
 * so the calling code can prompt for role selection.
 */
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Check if profile already exists
  const existingProfile = await getUserProfile(user.uid);

  return {
    user,
    isNewUser: !existingProfile,
  };
}

export async function signOut() {
  await firebaseSignOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}
