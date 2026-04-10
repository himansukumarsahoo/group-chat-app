import { createContext, useState, useEffect, useContext } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [roomID, setroomID] = useState(() => sessionStorage.getItem("roomID") || "");
  const [currentUser, setCurrentUser] = useState(() => sessionStorage.getItem("currentUser") || "");
  const [connected, setConnected] = useState(() => sessionStorage.getItem("connected") === "true");

  useEffect(() => {
    sessionStorage.setItem("roomID", roomID);
    sessionStorage.setItem("currentUser", currentUser);
    sessionStorage.setItem("connected", connected);
  }, [roomID, currentUser, connected]);

  return (
    <ChatContext.Provider
      value={{currentUser, setCurrentUser, roomID, setroomID, connected, setConnected}}
    >
      {children}
    </ChatContext.Provider>
  );
};

// ✅ custom hook (CORRECT WAY)
export const useChatContext = () => {
  return useContext(ChatContext);
};