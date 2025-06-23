"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = ({ children }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const createNewChat = async () => {
    try {
      if (!user) return null;
      const token = await getToken();
      const { data } = await axios.post(
        "/api/chat/create",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        return data.data;
      }
      return null;
    } catch (error) {
      toast.error(error.message || "Failed to create chat");
      return null;
    }
  };

  const fetchUserChats = async () => {
    try {
      if (!user) return null;
      const token = await getToken();
      const { data } = await axios.get("/api/chat/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        let userChats = data.data;
        if (userChats.length === 0) {
          const newChat = await createNewChat();
          if (newChat) {
            userChats = [newChat];
          } else {
            setChats([]);
            setSelectedChat(null);
            return;
          }
        }

        // sort chats by updated date
        userChats.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        setChats(userChats);
        // set recently updated chat as selected chat
        setSelectedChat(userChats[0]);
        console.log("Selected chat set to:", userChats[0]);
      } else {
        toast.error(data.message || "Failed to fetch chats");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch chats");
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserChats();
    }
  }, [user]);

  const value = {
    // Define any state or functions you want to provide to the context
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    createNewChat,
    fetchUserChats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
