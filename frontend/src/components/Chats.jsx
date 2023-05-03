import React, {useEffect, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Config from "../assets/configs/configs.json";

const Chats = ({userId, setChatId, setChatWith}) => {
  const [member, setMember] = useState([]);
  const [chatRoomList, setChatRoomList] = useState([]);

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

    const fetchChatRoomList = async () => {
      await fetchCsrfToken();
      try {
        const res = await axios.get(`${Config.BACKEND_URL}/chat/all`, {
          withCredentials: true,
          params: {
            typeRoom: "Group",
          }
        });
        setChatRoomList(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMember();
    fetchChatRoomList();
    return;
  }, []);

  const addThenShowDM = async (id1, id2) => {
    const data = {
      allowedUsers: [id1, id2],
      typeRoom: "DM",
    };
    try {
      const res = await axios.post(`${Config.BACKEND_URL}/chat/create`, data, {
        withCredentials: true,
      });
      const {chatID, name} = res.data;
      setChatId(chatID);
      setChatWith(name);
    } catch (error) {
      console.error(error);
    }
  };

  const joinThenShowChatRoom = async (userID, chatID) => {
    const data = {
        chatID: chatID,
        userID: userID,
    };
    try {
      const res = await axios.patch(`${Config.BACKEND_URL}/chat/join`, data, {
        withCredentials: true,
      });
      const {chatID, name} = res.data;

      setChatId(chatID);
      setChatWith(name);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="chatlist-container">
      <div className="chatlist">
        <div className="sub-header">
          <p>Clients ({member.length})</p>
        </div>
        <div className="section">
          {member.length > 0 ? (
          <>
            {member.map((chat, index) => {
              const {_id, username} = chat;
              return (
                <div className="chat-dm" key={_id}>
                  <h3>{username}</h3>
                  {_id !== userId && (
                    <i
                      className="fa-solid fa-paper-plane"
                      onClick={() => addThenShowDM(userId, _id)}
                    ></i>
                  )}
                </div>
              );
            })}
          </>
          ) : (
            <div className="no-chat"></div>
          )}
        </div>
        <div className="sub-header">
          <p>Groups ({chatRoomList.length})</p>
        </div>
        <div className="section">
          {chatRoomList.length > 0 ? (
            <>
              {chatRoomList.map((chat, index) => {
                const {_id, name} = chat;
                return (
                <div className="chat-dm" key={_id}>
                  <h3>{name}</h3>
                  <i
                    className="fa-solid fa-paper-plane"
                    onClick={() => joinThenShowChatRoom(userId, _id)}
                  ></i>
                </div>
                );
              })}
            </>
          ) : (
            <div className="no-chat"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chats;
