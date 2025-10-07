import Ably from 'ably';

// Ultra-low latency messaging with Ably
const ablyKey = import.meta.env.VITE_ABLY_API_KEY;
const ably = ablyKey ? new Ably.Realtime({
  key: ablyKey,
  clientId: 'dj-elite-user',
  echoMessages: false,
  autoConnect: true
}) : null;

export const subscribeToUltraFastMessages = (
  matchId: string,
  onMessage: (message: any) => void,
  onTyping: (isTyping: boolean) => void
) => {
  if (!ably) return () => {};
  
  const channel = ably.channels.get(`chat:${matchId}`);
  
  channel.subscribe('message', (message) => {
    onMessage(message.data);
  });
  
  channel.subscribe('typing', (message) => {
    onTyping(message.data.isTyping);
  });
  
  return () => {
    channel.unsubscribe();
    channel.detach();
  };
};

export const sendUltraFastMessage = async (matchId: string, content: string) => {
  if (!ably) return;
  
  const channel = ably.channels.get(`chat:${matchId}`);
  
  await channel.publish('message', {
    content,
    timestamp: Date.now(),
    id: crypto.randomUUID()
  });
};

export const sendTypingIndicator = (matchId: string, isTyping: boolean) => {
  if (!ably) return;
  
  const channel = ably.channels.get(`chat:${matchId}`);
  
  channel.publish('typing', {
    isTyping,
    timestamp: Date.now()
  });
};
