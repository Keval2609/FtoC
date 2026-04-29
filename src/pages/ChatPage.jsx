import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrCreateChat, sendMessage, onMessagesSnapshot, getUserProfile } from '../lib/firestore';
import { usePresence, useSetPresence, useTypingIndicator, useChatTyping } from '../hooks/usePresence';

/**
 * Format a timestamp to a readable time string.
 */
function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;

  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;

  // Same day
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) {
    return `Yesterday ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
    ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatPage() {
  const { farmerId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);

  // Presence & Typing Hooks
  useSetPresence(user?.uid);
  const otherPresence = usePresence(farmerId);
  const { setTyping } = useTypingIndicator(chat?.id, user?.uid);
  const typingUsers = useChatTyping(chat?.id, user?.uid);

  // Initialize chat and fetch other user's info
  useEffect(() => {
    if (!user?.uid || !farmerId) return;

    let unsub = () => {};

    (async () => {
      try {
        // Get or create the chat
        const chatDoc = await getOrCreateChat(user.uid, farmerId);
        setChat(chatDoc);

        // Fetch the other user's profile
        const profile = await getUserProfile(farmerId);
        setOtherUser(profile || { displayName: 'Farmer', role: 'farmer' });

        // Subscribe to real-time messages
        unsub = onMessagesSnapshot(chatDoc.id, (msgs) => {
          setMessages(msgs);
          setLoading(false);
        });
      } catch (err) {
        console.error('Failed to initialize chat:', err);
        setLoading(false);
      }
    })();

    return () => unsub();
  }, [user, farmerId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !chat || sending) return;

    setInput('');
    setTyping(false);
    setSending(true);
    try {
      await sendMessage(chat.id, user.uid, text);
    } catch (err) {
      console.error('Failed to send message:', err);
      setInput(text); // Restore input on failure
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-container mx-auto px-4 py-20 text-center">
        <p className="text-on-surface-variant">Please log in to access messages.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>
      {/* ─── Header ─── */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-outline-variant/30 bg-surface-container-lowest shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-surface-container rounded-xl transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 22 }}>
            arrow_back
          </span>
        </button>

        <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center shrink-0">
          <span
            className="material-symbols-outlined text-on-primary-container"
            style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}
          >
            {otherUser?.role === 'farmer' ? 'agriculture' : 'person'}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-on-surface text-sm truncate">
              {otherUser?.farmName || otherUser?.displayName || 'Loading…'}
            </p>
            <span className={`w-2 h-2 rounded-full ${otherPresence.online ? 'bg-green-500' : 'bg-gray-400'}`} title={otherPresence.online ? 'Online' : 'Offline'} />
          </div>
          <p className="text-xs text-on-surface-variant capitalize">
            {otherUser?.role || ''}
          </p>
        </div>
      </header>

      {/* ─── Messages Area ─── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-surface-container">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
            <div className="w-16 h-16 bg-primary-container/40 rounded-full flex items-center justify-center">
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontSize: 28, fontVariationSettings: "'FILL' 1" }}
              >
                chat
              </span>
            </div>
            <p className="text-on-surface-variant text-sm">
              Start a conversation! Ask about products, availability, or delivery.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user.uid;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                    ${isMe
                      ? 'bg-primary text-on-primary rounded-br-md'
                      : 'bg-surface-container-lowest text-on-surface rounded-bl-md ambient-shadow'
                    }
                  `}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      isMe ? 'text-on-primary/60' : 'text-on-surface-variant'
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-on-surface-variant/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-on-surface-variant/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-on-surface-variant/40 rounded-full animate-bounce" />
            </div>
            <p className="text-[11px] text-on-surface-variant italic font-medium">
              {otherUser?.displayName || 'Someone'} is typing...
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ─── Input Bar ─── */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 px-4 py-3 border-t border-outline-variant/30 bg-surface-container-lowest shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setTyping(e.target.value.length > 0);
          }}
          placeholder="Type a message…"
          className="flex-1 bg-surface-container border border-outline-variant/50 rounded-full px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          maxLength={2000}
          autoFocus
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>
            {sending ? 'pending' : 'send'}
          </span>
        </button>
      </form>
    </div>
  );
}
