import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import axios from "axios";
import Config from "../assets/configs/configs.json";

const AddChatRoom = ({userId,setChatId, setChatWith}) => {
  const {register, handleSubmit, getValues} = useForm();
  const [users, setUsers] = useState([]);

  const onSubmit = async (data) => {
    await addThenShowDM(
      data.name,
      [userId]
    );
    window.location.reload();
  };

  const addThenShowDM = async (name, allowedUsers) => {
    const data = {
      allowedUsers: allowedUsers,
      name: name,
      typeRoom: "Group",
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

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get(`${Config.BACKEND_URL}/user`, {
          withCredentials: true,
        });

        setUsers(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    getUsers();
  }, []);

  return (
    <div className="chatbox-container">
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "28px 48px",
          gap: "24px",
          position: "relative",
        }}
      >
        <h2
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Create A Group Chat
        </h2>
        <label style={{display: "flex", gap: "24px", alignItems: "center"}}>
          Group name :
          <input
            style={{
              border: "1px solid grey",
              borderRadius: "6px",
              width: "fit-content",
              padding: "12px",
            }}
            type="text"
            {...register("name")}
          />
        </label>
        <button type="submit" style={{width: "95%", textAlign: "right"}}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddChatRoom;
