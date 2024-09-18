import React, { useState } from "react";
import ChatSidebar from "../../../components/chat/ChatList";
import ChatArea from "../../../components/chat/chat";

const ChatScreen: React.FC = () => {
    
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  return (
    <div className="flex">
      <ChatSidebar />
      {selectedChatId ? (
        <ChatArea chatId={selectedChatId} />
      ) : (
        <div className="w-3/4 h-screen bg-white flex items-center justify-center">
          <p>Select a chat to start messaging</p>
        </div>
      )}
    </div>
  );
};

export default ChatScreen;
