import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Navbar from "./components/Navbar";
import NoPage from "./pages/NoPage";
import SigninPage from "./pages/SigninPage";
import ChatPage from "./pages/ChatPage";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SigninPage signin />} />
          <Route path="/signup" element={<SigninPage signup />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
        <Navbar />
      </BrowserRouter>
    </>
  );
};

export default App;
