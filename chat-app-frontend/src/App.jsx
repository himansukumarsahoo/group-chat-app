
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import Chat from "./components/Chat";
import { ToastContainer } from "react-toastify";
import "./index.css"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/chat",
    element: <Chat />
  }
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer autoClose={2000} position="top-right" />
    </>
  );
};

export default App;