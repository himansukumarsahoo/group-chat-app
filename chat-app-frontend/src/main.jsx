import { createRoot } from "react-dom/client";
import App from "./App";
import { ChatProvider } from "./context/Chatcontext";
createRoot(document.querySelector("#root")).render(
  <ChatProvider>
    <App/>
  </ChatProvider>
)