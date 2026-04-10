import React, { useEffect, useRef, useState } from "react";
import { useChatContext } from "../context/Chatcontext";
import { useNavigate } from "react-router-dom";
import { VscSend } from "react-icons/vsc";
import { GrAttachment } from "react-icons/gr";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { baseURL } from "../services/AxiosHelper";
import { toast } from "react-toastify";
import { getMessages } from "../services/RoomServices";
import { timeAgo } from "../services/helper";
import ThemeToggle from "./ThemeToggle";

const Chat = () => {
  const {
    currentUser,
    setCurrentUser,
    roomID,
    setroomID,
    connected,
    setConnected,
  } = useChatContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [roomID, connected, currentUser]);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  const currentuser = currentUser;

  const stompClientRef = useRef(null);

  useEffect(() => {
    if (!connected || stompClientRef.current) return;

    const sock = new SockJS(`${baseURL}/chat`);
    const client = Stomp.over(sock);

    client.connect({}, () => {

      stompClientRef.current = client;
      setStompClient(client);

      client.subscribe(`/topic/room/${roomID}`, (message) => {
        const newMessage = JSON.parse(message.body);

        setMessages((prev) => [...prev, newMessage]);
      });
    });
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect(() => {
          console.log("Disconnected");
        });
        stompClientRef.current = null;
      }
    };
  }, [connected]);

  useEffect(() => {
    async function loadMessages() {
      try {
        const message = await getMessages(roomID);
        setMessages(message);
      } catch (error) {}
    }
    if (connected) {
      loadMessages();
    }
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (stompClient && connected && input.trim()) {

      const message = {
        sender: currentUser,
        content: input,
        roomId: roomID,
      };

      stompClient.send(
        `/app/sendmessage/${roomID}`,
        {},
        JSON.stringify(message)
      );
      setInput("");
    }
  };
  
  const handleLogout = () => {
    if (stompClient) stompClient.disconnect();
    setConnected(false);
    setCurrentUser("");
    setroomID("");
    navigate("/");
  };

  return (
    <div className="bg-gray-400 dark:bg-gray-950 text-gray-900 dark:text-gray-100 h-screen transition-colors duration-300 flex flex-col">
      {/* navbar.. */}
      <div className="bg-slate-300 dark:bg-gray-800 py-3 sm:py-5 shadow flex flex-row justify-between sm:justify-around items-center w-full z-10 transition-colors duration-300 fixed top-0 px-4 sm:px-0">
        <div className="flex flex-col">
          <h1 className="font-semibold text-lg sm:text-xl">
            Room: <span className="text-blue-600 dark:text-blue-400">{roomID}</span>
          </h1>
          <h1 className="font-semibold text-sm sm:hidden">
            Name: <span className="text-amber-600 dark:text-amber-400">{currentUser}</span>
          </h1>
        </div>

        <div className="hidden sm:block">
          <h1 className="font-semibold text-lg sm:text-xl">
            Name: <span className="text-amber-600 dark:text-amber-400">{currentUser}</span>
          </h1>
        </div>

        <div className="flex gap-3 sm:gap-4 items-center">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold text-white transition-colors duration-300 text-sm shadow-sm"
          >
            Leave
          </button>
        </div>
      </div>

      {/* Chatpage.. */}
      <div
        ref={chatBoxRef}
        className="flex-grow pb-20 pt-28 sm:pt-24 px-4 sm:px-10 w-full lg:w-2/3 md:w-3/4 mx-auto dark:bg-gray-900 bg-white border-x border-gray-200 dark:border-gray-800 overflow-auto transition-colors duration-300"
      >
        {messages.map((ele, index) => (
          <div
            key={index}
            className={`flex mb-4 ${ele.sender === currentuser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-3 max-w-[85%] sm:max-w-md rounded-2xl shadow-sm transition-colors duration-300 ${
                ele.sender === currentuser 
                  ? "bg-green-100 dark:bg-green-800 text-green-900 dark:text-white rounded-tr-none" 
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-none"
              }`}
            >
              <div className="flex flex-row gap-3 items-start">
                <img
                  className="h-8 w-8 rounded-full flex-shrink-0 mt-1"
                  src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVgPimc_RQYYbUhV3A_xER8GPifFju7nveLA&s"}
                  alt="avatar"
                />
                <div className="flex flex-col gap-1 w-full overflow-hidden">
                  <div className="flex justify-between items-baseline gap-2">
                    <p className="text-sm font-bold opacity-80">{ele.sender}</p>
                    <p className="text-[10px] opacity-60 whitespace-nowrap">{timeAgo(ele.timestamp)}</p>
                  </div>
                  <p className="break-words leading-relaxed text-sm">{ele.content}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* input box */}
      <div className="fixed bottom-0 w-full py-3 bg-slate-300 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300 px-4 sm:px-0">
        <div className="w-full lg:w-2/3 md:w-3/4 mx-auto flex items-center gap-2">
          <div className="flex-grow flex items-center pr-2 bg-gray-100 dark:bg-gray-700 rounded-full border border-gray-300 dark:border-gray-600 transition-colors duration-300 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
             <input
              type="text"
              value={input}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="bg-transparent px-5 py-3 w-full focus:outline-none dark:text-white text-gray-900"
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="flex-shrink-0 bg-blue-800 hover:bg-blue-900 dark:bg-green-800 dark:hover:bg-green-900 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-full transition-colors duration-300 shadow-md"
          >
            <VscSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
