import React, {useEffect, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Config from "../assets/configs/configs.json";

const Member = ({chatId, userId, setChatId, setChatWith, setAddingRoom}) => {
  const [userInChat, setUserInChat] = useState([]);
  const [member, setMember] = useState([]);
  const [chatRoomList, setChatRoomList] = useState([]);
  const handleChoose = (chatId, chatWith, index) => {
    setAddingRoom(false);
    setChatWith(chatWith);
    setChatId(chatId);
  };
  useEffect(() => {
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
        const res = await axios.get(`${Config.BACKEND_URL}/user`, {
          withCredentials: true,
        });
        setMember(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchUserInChat = async (chatId) => {
      await fetchCsrfToken();
      try {
        const res = await axios.get(`${Config.BACKEND_URL}/chat`, {
          withCredentials: true,
          params: {
            chatID: chatId,
          }
        });
        setUserInChat(res.data);
      } catch (error) {
        console.error(error);
      }
    };
  
    const fetchChatRoomList = async () => {
      await fetchCsrfToken();
      try {
        const res = await axios.get(`${Config.BACKEND_URL}/chat/all`, {
          withCredentials: true,
        });
        setChatRoomList(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMember();
    fetchChatRoomList();
    fetchUserInChat(chatId);
    return;
  }, [chatId]);

  return (
    <div className="member-container">
      <div className="chatlist">
        <div className="header">
          <h2>Create Group</h2>
          <i onClick={() => setAddingRoom(true)} class="fa-solid fa-plus"></i>
        </div>
        <div className="sub-header">
          <p>Members - {userInChat.length}</p>
        </div>
        
        {userInChat.length > 0 ? (
          <>
            {userInChat.map((user) => {
              const {_id, username} = user;
              return (
                <div className="member" key={_id}>
                  <h3 style={{ color: _id === userId ? "#22dcb4" : "black" }}> 
                    {username} {_id === userId ? "(Me)" : ""} 
                  </h3>
                </div>
              );
            })}
          </>
          ) : (
            <div className="no-chat"></div>
          )
        }
        
      </div>
    </div>
  );
};

export default Member;
