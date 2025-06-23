import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";

const PromptBox = ({ isLoading, setisLoading }) => {
  const [prompt, setPrompt] = useState("");

  const {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    createNewChat,
    fetchUsersChats,
  } = useAppContext();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrompt(e);
    }
  };

  const sendPrompt = async (e) => {
    const promptCopy = prompt;
    try {
      e.preventDefault();
      if (!user) return toast.error('Please Login to send message');
      if (isLoading) return toast.error('Already sending a message');

      setisLoading(true);
      setPrompt("");

      const userPrompt = {
        role: "user",
        content: promptCopy,
        timestamp: Date.now(),
      };

      // saving user prompts in chats array
      setChats((prevChats) => prevChats.map((chat) => chat._id === selectedChat._id ? {
        ...chat,
        messages: [...chat.messages, userPrompt],
      } : chat
      ));

      setSelectedChat((prev) => ({
        ...prev,
        messages: [...prev.messages, userPrompt]
      }));

      const { data } = await axios.post('/api/chat/ai', {
        chatId: selectedChat._id,
        prompt: promptCopy,
      });

      if (data.success) {
        setChats((prevChats) => prevChats.map((chat) => chat._id === selectedChat._id ?
          { ...chat, messages: [...chat.messages, data.data] } : chat));

        const message = data.data.content;
        const messageTokens = message.split(' ');
        let assistantMessage = {
          role: "assistant",
          content: "",
          timestamp: Date.now(),
        };

        setSelectedChat((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
        }));

        for (let i = 0; i < messageTokens.length; i++) {
          setTimeout(() => {
            assistantMessage.content = messageTokens.slice(0, i + 1).join(" ");
            setSelectedChat((prev) => {
              const updatedMessages = [...prev.messages.slice(0, -1), assistantMessage];
              return { ...prev, messages: updatedMessages };
            });
          }, 100 * i);
        }
      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      setPrompt(promptCopy);
    } finally {
      setisLoading(false);
    }
  };

  return (
    <form onSubmit={sendPrompt}
      className={`w-full ${selectedChat?.messages.length > 0 ? "max-w-3xl" : "max-w-2xl"}
    bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}
    >
      <textarea
        onKeyDown={handleKeyDown}
        className="outline-none w-full resize-none overflow-hidden break-words bg-transparent"
        rows={2}
        placeholder="Message Deepseek"
        required
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
      />
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 py-1 px-2 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image className="h-5" src={assets.deepthink_icon} alt="" />
            Deepthink (R1)
          </p>
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 py-1 px-2 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image className="h-5" src={assets.search_icon} alt="" />
            Search
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Image
            className="w-6 h-6 cursor-pointer rounded-full p-1 hover:bg-gray-500/20"
            src={assets.search_icon}
            alt=""
          />
          <button
            className={`${
              prompt ? "bg-primary" : "bg-[#71717a]"
            } p-2 rounded-full`}
          >
            <Image
              className="w-4 aspect-square"
              src={prompt ? assets.arrow_icon : assets.arrow_icon_dull}
              alt=""
            />
          </button>
        </div>
      </div>
    </form>
  );
};

export default PromptBox;
