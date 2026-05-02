// src/hooks/usePresence.js
// Tracks user online/offline presence using Firebase Realtime Database.
// Uses onDisconnect() so the status updates even if the tab crashes.
//
// Usage:
//   import { usePresence } from '../hooks/usePresence';
//   const { isOnline, lastSeen } = usePresence(userId);

import { useEffect, useState } from 'react';
import {
  ref,
  set,
  onValue,
  onDisconnect,
  serverTimestamp,
  getDatabase,
} from 'firebase/database';
import app from '../lib/firebase';

const db = getDatabase(app);

// ── Set your own presence (call in AppShell or a top-level component) ────
export function useSetPresence(uid) {
  useEffect(() => {
    if (!uid) return;

    const presenceRef = ref(db, `presence/${uid}`);
    const connectedRef = ref(db, '.info/connected');

    // Listen to Firebase's own connection state
    const unsub = onValue(connectedRef, (snap) => {
      if (!snap.val()) return; // not connected yet

      // When the user disconnects (close tab / crash), set offline
      onDisconnect(presenceRef).set({
        online:   false,
        lastSeen: serverTimestamp(),
      });

      // Mark as online now
      set(presenceRef, {
        online:   true,
        lastSeen: serverTimestamp(),
      });
    });

    return () => {
      unsub();
      // Proactively set offline on clean unmount (e.g. logout)
      set(presenceRef, {
        online:   false,
        lastSeen: serverTimestamp(),
      });
    };
  }, [uid]);
}

// ── Read another user's presence ─────────────────────────────────────────
export function usePresence(uid) {
  const [presence, setPresence] = useState({ online: false, lastSeen: null });

  useEffect(() => {
    if (!uid) return;

    const presenceRef = ref(db, `presence/${uid}`);
    const unsub = onValue(presenceRef, (snap) => {
      if (snap.exists()) {
        setPresence(snap.val());
      }
    });

    return () => unsub();
  }, [uid]);

  return presence;
}

// ── Set typing indicator ──────────────────────────────────────────────────
export function useTypingIndicator(chatId, uid) {
  const setTyping = (isTyping) => {
    if (!chatId || !uid) return;
    const typingRef = ref(db, `typing/${chatId}/${uid}`);
    set(typingRef, isTyping);
  };

  return { setTyping };
}

// ── Read typing indicators for a chat ────────────────────────────────────
export function useChatTyping(chatId, currentUid) {
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    if (!chatId) return;

    const typingRef = ref(db, `typing/${chatId}`);
    const unsub = onValue(typingRef, (snap) => {
      if (!snap.exists()) {
        setTypingUsers([]);
        return;
      }
      // Collect all uids that are currently typing, excluding self
      const typing = [];
      snap.forEach((child) => {
        if (child.val() === true && child.key !== currentUid) {
          typing.push(child.key);
        }
      });
      setTypingUsers(typing);
    });

    return () => unsub();
  }, [chatId, currentUid]);

  return typingUsers;
}
