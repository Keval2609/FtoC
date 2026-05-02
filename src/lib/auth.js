import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  getAdditionalUserInfo
} from 'firebase/auth';
import { auth } from './firebase';

const googleProvider = new GoogleAuthProvider();

export async function signUpWithEmail(email, password, displayName, role) {
  if (!auth) throw new Error('Firebase Auth is not initialized. Check your configuration.');
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(result.user, { displayName });
    return result.user;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('User already exists. Please sign in');
    }
    throw error;
  }
}

export async function signInWithEmail(email, password) {
  if (!auth) throw new Error('Firebase Auth is not initialized. Check your configuration.');
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);

    return result.user;
  } catch (error) {
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error('Email or password is incorrect');
    }
    throw error;
  }
}

export async function signInWithGoogle() {
  if (!auth) throw new Error('Firebase Auth is not initialized. Check your configuration.');
  const result = await signInWithPopup(auth, googleProvider);

  const additionalInfo = getAdditionalUserInfo(result);
  
  return {
    user: result.user,
    isNewUser: additionalInfo?.isNewUser || false,
  };
}

export async function signOut() {
  if (!auth) return;
  await firebaseSignOut(auth);

}

export function onAuthChange(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

