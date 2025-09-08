import Ably from 'ably';

// Ultra-low latency messaging with Ably
const ably = new Ably.Realtime({
  key: 'demo-key', // Replace with your Ably key
  clientId: 'dj-elite-user',
  echoMessages: false,
  autoConnect: true
});

export const subscribeToUltraFastMessages = (
  matchId: string,
  onMessage: (message: any) => void,
  onTyping: (isTyping: boolean) => void
) => {
  const channel = ably.channels.get(`chat:${matchId}`);
  
  // Subscribe to messages with <50ms latency
  channel.subscribe('message', (message) => {
    onMessage(message.data);
  });
  
  // Subscribe to typing indicators
  channel.subscribe('typing', (message) => {
    onTyping(message.data.isTyping);
  });
  
  return () => {
    channel.unsubscribe();
    channel.detach();
  };
};

export const sendUltraFastMessage = async (matchId: string, content: string) => {
  const channel = ably.channels.get(`chat:${matchId}`);
  
  await channel.publish('message', {
    content,
    timestamp: Date.now(),
    id: `msg-${Date.now()}`
  });
};

export const sendTypingIndicator = (matchId: string, isTyping: boolean) => {
  const channel = ably.channels.get(`chat:${matchId}`);
  
  channel.publish('typing', {
    isTyping,
    timestamp: Date.now()
  });
};