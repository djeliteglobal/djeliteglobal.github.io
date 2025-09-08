import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDebounce } from 'use-debounce';
import { sendMessage, fetchMessages, subscribeToMessages, Message } from '../../services/messageService';
import { getCurrentProfile } from '../../services/profileService';
import { subscribeToUltraFastMessages, sendUltraFastMessage, sendTypingIndicator } from '../../services/ablyService';

interface ChatInterfaceProps {
  matchId: string;
  matchName?: string;
  matchAvatar?: string;
  onClose?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  matchId,
  matchName = "DJ Match",
  matchAvatar = "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100",
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [debouncedMessage] = useDebounce(newMessage, 300);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profile, messageHistory] = await Promise.all([
          getCurrentProfile(),
          fetchMessages(matchId)
        ]);
        
        if (profile) setCurrentUserId(profile.id);
        setMessages(messageHistory);
      } catch (error) {
        console.error('Failed to load chat data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    
    // Subscribe to Supabase real-time messages
    const unsubscribe = subscribeToMessages(matchId, (message) => {
      setMessages(prev => {
        if (prev.some(msg => msg.id === message.id) || message.sender_id === currentUserId) {
          return prev;
        }
        return [...prev, message];
      });
    });
    
    // Subscribe to ultra-fast Ably messages for instant delivery
    const unsubscribeAbly = subscribeToUltraFastMessages(
      matchId,
      (message) => {
        // Add ultra-fast message with temp ID
        const fastMessage: Message = {
          id: message.id,
          match_id: matchId,
          sender_id: 'other-user',
          content: message.content,
          created_at: new Date(message.timestamp).toISOString(),
          message_type: 'text',
          sender_name: matchName,
          sender_avatar: matchAvatar
        };
        setMessages(prev => [...prev, fastMessage]);
      },
      (typing) => {
        setIsTyping(typing);
      }
    );
    
    return () => {
      unsubscribe();
      unsubscribeAbly();
    };
  }, [matchId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Memoized message renderer for performance
  const MessageItem = useCallback(({ index, style }: { index: number; style: any }) => {
    const msg = messages[index];
    const isOwn = msg.sender_id === currentUserId;
    
    return (
      <div style={style}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className={`flex p-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`flex items-end gap-2 max-w-[80%] ${
            isOwn ? 'flex-row-reverse' : 'flex-row'
          }`}>
            <img 
              src={isOwn ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' : (msg.sender_avatar || matchAvatar)} 
              alt={isOwn ? 'You' : (msg.sender_name || matchName)}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className={`px-4 py-2 rounded-2xl ${
              isOwn 
                ? 'bg-[color:var(--accent)] text-black rounded-br-sm' 
                : 'bg-[color:var(--surface)] text-[color:var(--text-primary)] rounded-bl-sm'
            }`}>
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }, [messages, currentUserId, matchAvatar, matchName]);

  const memoizedMessages = useMemo(() => messages, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    
    setSending(true);
    const messageToSend = newMessage;
    const tempId = `temp-${Date.now()}`;
    
    // Optimistic update - show message instantly
    const optimisticMessage: Message = {
      id: tempId,
      match_id: matchId,
      sender_id: currentUserId,
      content: messageToSend,
      created_at: new Date().toISOString(),
      message_type: 'text',
      sender_name: 'You',
      sender_avatar: ''
    };
    
    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');
    
    try {
      // Send via ultra-fast Ably for instant delivery
      await sendUltraFastMessage(matchId, messageToSend);
      
      // Also send via Supabase for persistence
      const realMessage = await sendMessage(matchId, messageToSend);
      
      // Replace optimistic message with real one
      setMessages(prev => prev.map(msg => 
        msg.id === tempId ? realMessage : msg
      ));
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove failed message
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      setNewMessage(messageToSend);
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div 
        className="bg-[color:var(--surface)] rounded-2xl w-full max-w-md h-[600px] flex flex-col overflow-hidden shadow-2xl"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-[color:var(--border)] bg-[color:var(--surface-alt)]">
          <div className="flex items-center gap-3">
            <img src={matchAvatar} alt={matchName} className="w-10 h-10 rounded-full object-cover"/>
            <div>
              <h3 className="font-semibold text-[color:var(--text-primary)]">{matchName}</h3>
              <p className="text-xs text-green-500">● Online</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[color:var(--surface)] hover:bg-[color:var(--border)] flex items-center justify-center">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[color:var(--bg)] relative">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[color:var(--accent)]"></div>
            </div>
          ) : memoizedMessages.length === 0 ? (
            <div className="text-center py-8 text-[color:var(--text-secondary)]">
              <p>💬 Start the conversation!</p>
            </div>
          ) : (
            memoizedMessages.map((msg, index) => (
              <MessageItem key={msg.id} index={index} style={{}} />
            ))
          )}
          {isTyping && (
            <div className="text-xs text-[color:var(--text-secondary)] italic p-2">
              {matchName} is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-[color:var(--border)] bg-[color:var(--surface)]">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                // Send typing indicator
                sendTypingIndicator(matchId, e.target.value.length > 0);
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              onBlur={() => sendTypingIndicator(matchId, false)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-full focus:ring-2 focus:ring-[color:var(--accent)] outline-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              className="w-10 h-10 bg-[color:var(--accent)] text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
            >
              {sending ? '⏳' : '➤'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};