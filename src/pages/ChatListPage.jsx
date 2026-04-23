import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserChats } from '../lib/firestore';

/**
 * Format a timestamp to a relative string.
 */
function timeAgo(ts) {
  if (!ts) return '';
  const diff = Date.now() - ts;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`;
  return new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function ChatListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    (async () => {
      try {
        const result = await getUserChats(user.uid);
        setChats(result);
      } catch (err) {
        console.error('Failed to load chats:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-container mx-auto px-4 py-20 text-center">
        <p className="text-on-surface-variant">Please log in to view your messages.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
            Direct Messages
          </p>
          <h1 className="font-display-xl text-3xl text-primary leading-none">Messages</h1>
        </div>
        <div className="w-12 h-12 bg-primary-container/40 rounded-2xl flex items-center justify-center">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontSize: 24, fontVariationSettings: "'FILL' 1" }}
          >
            forum
          </span>
        </div>
      </div>

      {/* Chat List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : chats.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto">
            <span
              className="material-symbols-outlined text-on-surface-variant"
              style={{ fontSize: 32 }}
            >
              chat_bubble_outline
            </span>
          </div>
          <h2 className="font-headline-md text-xl text-on-surface">No conversations yet</h2>
          <p className="text-on-surface-variant text-sm max-w-xs mx-auto">
            Visit a farmer's profile and start a conversation to ask about their products.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2.5 bg-primary text-on-primary font-button text-sm rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
          >
            Browse Farmers
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => {
                const otherUid = chat.otherUser?.uid || chat.participants.find((p) => p !== user.uid);
                navigate(`/chat/${otherUid}`);
              }}
              className="w-full flex items-center gap-3 p-4 bg-surface-container-lowest rounded-2xl hover:bg-surface-container-low transition-colors cursor-pointer text-left ambient-shadow"
            >
              {/* Avatar */}
              <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-on-primary-container"
                  style={{ fontSize: 22, fontVariationSettings: "'FILL' 1" }}
                >
                  {chat.otherUser?.role === 'farmer' ? 'agriculture' : 'person'}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-on-surface text-sm truncate">
                    {chat.otherUser?.farmName || chat.otherUser?.displayName || 'User'}
                  </p>
                  <span className="text-[11px] text-on-surface-variant shrink-0">
                    {timeAgo(chat.updatedAt)}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant truncate mt-0.5">
                  {chat.lastMessage || 'No messages yet'}
                </p>
              </div>

              {/* Arrow */}
              <span className="material-symbols-outlined text-on-surface-variant/40 shrink-0" style={{ fontSize: 18 }}>
                chevron_right
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
