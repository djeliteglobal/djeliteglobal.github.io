import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ChatInterfaceProps {
  matchId?: string;
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
  const [messages, setMessages] = useState([
    {
      id: '1',
      position: 'left',
      type: 'text',
      text: `Hey! We matched! 🎧`,
      date: new Date(),
      avatar: matchAvatar,
      title: matchName
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now().toString(),
      position: 'right' as const,
      type: 'text' as const,
      text: newMessage,
      date: new Date(),
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      title: 'You'
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    setTimeout(() => {
      const responses = ["That sounds great! 🎵", "I'd love to collaborate!", "When are you free to jam?"];
      const response = {
        id: (Date.now() + 1).toString(),
        position: 'left' as const,
        type: 'text' as const,
        text: responses[Math.floor(Math.random() * responses.length)],
        date: new Date(),
        avatar: matchAvatar,
        title: matchName
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
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

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[color:var(--bg)]">
          {messages.map((msg) => (
            <motion.div 
              key={msg.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.position === 'right' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end gap-2 max-w-[80%] ${
                msg.position === 'right' ? 'flex-row-reverse' : 'flex-row'
              }`}>
                <img 
                  src={msg.avatar} 
                  alt={msg.title}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className={`px-4 py-2 rounded-2xl ${
                  msg.position === 'right' 
                    ? 'bg-[color:var(--accent)] text-black rounded-br-sm' 
                    : 'bg-[color:var(--surface)] text-[color:var(--text-primary)] rounded-bl-sm'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {msg.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-4 border-t border-[color:var(--border)] bg-[color:var(--surface)]">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-[color:var(--surface-alt)] border border-[color:var(--border)] rounded-full focus:ring-2 focus:ring-[color:var(--accent)] outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="w-10 h-10 bg-[color:var(--accent)] text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
            >
              ➤
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};