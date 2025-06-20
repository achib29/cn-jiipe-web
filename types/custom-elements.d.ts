declare namespace JSX {
  interface IntrinsicElements {
    'chat-bot': {
      platform_id: string;
      user_id: string;
      chatbot_id: string;
      children?: React.ReactNode;
    };
  }
}
