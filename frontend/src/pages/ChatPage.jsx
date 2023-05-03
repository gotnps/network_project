import React, {useState, useEffect} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Config from "../assets/configs/configs.json";
import ChatBox from "../components/ChatBox";
import AddChatRoom from "../components/AddChatRoom";
import Chats from "../components/Chats";
import Member from "../components/Member";

const ChatPage = () => {
  const [chatId, setChatId] = useState("");
  const [chatWith, setChatWith] = useState("");
  const [isAddingRoom, setAddingRoom] = useState(false);
  const user = localStorage.getItem("username");
  const userId = localStorage.getItem("user_id");

  const [member, setMember] = useState([]);

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get(`${Config.BACKEND_URL}/csrf-token`, {
        withCredentials: true,  
      });
      Cookies.set("csrf-token", response.data.token);
    } catch (error) {
      console.error("Failed to fetch CSRF token", error);
    }
  };

  const fetchMember = async () => {
    await fetchCsrfToken();
    try {
      const res = await axios.get(
        `${Config.BACKEND_URL}/user/chatRooms/${userId}`,
        {
          withCredentials: true,
        }
      );
      setMember(res.data.chats);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMember();
    return;
  }, []);

  return (
    <div className="chatpage-container">
      <div className="chat-container">
        <Chats
          userId={userId}
          setChatId={setChatId}
          setChatWith={setChatWith}
        />
        
        {isAddingRoom ? (
          <AddChatRoom
            userId={userId}
            setChatId={setChatId}
            setChatWith={setChatWith}
          />
        ) : (
          <ChatBox
            chatId={chatId}
            user={user}
            userId={userId}
            chatWith={chatWith}
          />
        )}
        <Member
          chatId={chatId}
          userId={userId}
          setChatId={setChatId}
          setChatWith={setChatWith}
          setAddingRoom={setAddingRoom}
        />

      </div>
    </div>
  );
};

export default ChatPage;
