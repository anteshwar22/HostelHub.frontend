import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  MessageSquare,
  Send,
  Trash2,
  Users,
  Building2,
  Sparkles,
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Hash,
  UtensilsCrossed,
  BookOpen,
  Trophy,
  HelpCircle,
  RefreshCw
} from 'lucide-react';

export const HostelChatRoom = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [newMsgCategory, setNewMsgCategory] = useState('GENERAL');
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const isFirstLoadRef = useRef(true);

  // Determine hostel ID with fallback fetch if not yet attached to user state
  const [resolvedHostelId, setResolvedHostelId] = useState(
    () => user?.studentProfile?.hostelId || user?.wardenProfile?.hostelId || null
  );
  const [resolvedHostelName, setResolvedHostelName] = useState(
    () => user?.studentProfile?.hostel?.name || user?.wardenProfile?.hostel?.name || 'Campus Hostel'
  );

  useEffect(() => {
    if (!resolvedHostelId) {
      if (user?.role === 'STUDENT') {
        api.get('/students/me')
          .then((res) => {
            if (res.data?.profile?.hostelId) {
              setResolvedHostelId(res.data.profile.hostelId);
              setResolvedHostelName(res.data.profile.hostel?.name || 'Campus Hostel');
            }
          })
          .catch(console.error);
      }
    }
  }, [user, resolvedHostelId]);

  const hostelId = resolvedHostelId;
  const hostelName = resolvedHostelName;

  const fetchMessages = async (silent = false) => {
    if (!hostelId) return;
    if (!silent) setLoading(true);

    try {
      const res = await api.get(`/chat/${hostelId}`, {
        params: {
          category: selectedCategory !== 'ALL' ? selectedCategory : undefined
        }
      });
      setMessages(res.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch chat messages:', err);
      if (!silent) setError('Unable to load chat messages. Please try again.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Initial fetch and auto-polling every 3.5 seconds for live conversation
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages(true);
    }, 3500);

    return () => clearInterval(interval);
  }, [hostelId, selectedCategory]);

  // Scroll to bottom on new message if near bottom or on initial load
  useEffect(() => {
    if (isFirstLoadRef.current && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      isFirstLoadRef.current = false;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || sending || !hostelId) return;

    const payload = {
      message: messageText.trim(),
      category: newMsgCategory
    };

    setSending(true);
    try {
      const res = await api.post(`/chat/${hostelId}`, payload);
      // Append optimistically
      setMessages((prev) => [...prev, res.data]);
      setMessageText('');
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/chat/${messageId}`);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (err) {
      alert(err.message || 'Could not delete message');
    }
  };

  const categories = [
    { key: 'ALL', label: 'All Discussion', icon: Hash },
    { key: 'GENERAL', label: 'General', icon: MessageSquare },
    { key: 'MESS', label: 'Mess & Food', icon: UtensilsCrossed },
    { key: 'STUDY', label: 'Study & Notes', icon: BookOpen },
    { key: 'SPORTS', label: 'Sports & Gym', icon: Trophy },
    { key: 'LOST_FOUND', label: 'Lost & Found', icon: HelpCircle },
  ];

  const quickPrompts = [
    'Hot water is available 6:00 AM – 8:00 AM!',
    'Lunch in mess starts at 11:30 AM today.',
    'Dinner starts at 7:30 PM to 9:30 PM.',
    'Anyone interested in group study in the library?',
  ];

  if (!hostelId) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
        <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900">No Hostel Allocated Yet</h3>
        <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
          You need an allocated hostel to access the resident discussion lounge. Please select your hostel in your profile or contact the hostel administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-10rem)] min-h-[550px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Chat Header */}
      <div className="p-4 sm:px-6 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-purple-600/30">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white tracking-tight">
                {hostelName} Discussion Lounge
              </h2>
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Chat
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Community chat for hostel residents, meal updates, and campus queries
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchMessages()}
          title="Refresh messages"
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-slate-400 font-medium mr-1 text-[11px] uppercase tracking-wider">
          Filter:
        </span>
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Message Feed Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
        {loading && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-2" />
            <span className="text-xs font-medium">Loading hostel discussion...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <MessageSquare className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <h4 className="font-bold text-sm text-slate-700">No messages in this topic yet</h4>
            <p className="text-xs text-slate-500 mt-1">
              Be the first to start the conversation with fellow hostel residents!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            const isWarden = msg.senderRole === 'WARDEN' || msg.senderRole === 'ADMIN';

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 group ${isMe ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
                    isWarden
                      ? 'bg-emerald-600 text-white'
                      : isMe
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {msg.senderName?.charAt(0) || 'U'}
                </div>

                {/* Message Bubble Container */}
                <div className={`max-w-xl ${isMe ? 'text-right' : 'text-left'}`}>
                  {/* Sender Metadata Bar */}
                  <div
                    className={`flex items-center gap-1.5 text-xs mb-1 ${
                      isMe ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span className="font-bold text-slate-900">{msg.senderName}</span>
                    {isWarden ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800">
                        {msg.senderDesignation || 'Warden'}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-medium">
                        Rm {msg.senderRoom} • {msg.senderDept || 'Student'}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">•</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Bubble Content */}
                  <div
                    className={`inline-block p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isMe
                        ? 'bg-purple-600 text-white rounded-tr-none text-left'
                        : isWarden
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-tl-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                    }`}
                  >
                    {/* Category tag if not GENERAL */}
                    {msg.category && msg.category !== 'GENERAL' && (
                      <div
                        className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mb-1.5 ${
                          isMe
                            ? 'bg-purple-700/60 text-purple-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span>{msg.category}</span>
                      </div>
                    )}
                    <p className="whitespace-pre-line">{msg.message}</p>
                  </div>

                  {/* Actions (Delete if author or warden) */}
                  {(isMe || user?.role === 'ADMIN' || user?.role === 'WARDEN') && (
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="opacity-0 group-hover:opacity-100 text-[10px] text-slate-400 hover:text-rose-600 ml-2 transition-opacity inline-flex items-center gap-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
          Quick Post:
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setMessageText(prompt)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-600 text-[11px] whitespace-nowrap transition-colors border border-slate-200/60"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Bottom Message Input Bar */}
      <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2">
        {/* Category selector for new message */}
        <select
          value={newMsgCategory}
          onChange={(e) => setNewMsgCategory(e.target.value)}
          className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="GENERAL">General</option>
          <option value="MESS">Mess & Food</option>
          <option value="STUDY">Study & Notes</option>
          <option value="SPORTS">Sports</option>
          <option value="LOST_FOUND">Lost & Found</option>
        </select>

        {/* Text Input */}
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder={`Message ${hostelName} residents...`}
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!messageText.trim() || sending}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all shrink-0"
        >
          {sending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
