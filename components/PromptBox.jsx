import { assets } from "@/assets/assets";
import Image from "next/image";
import React, { useState } from "react";

const PromptBox = ({isLoading, setisLoading}) => {
    const[prompt,setPrompt] = useState("");
  return (
    <form
      className={`w-full ${false ? "max-w-3xl" : "max-w-2xl"}
    bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}>
      <textarea
        className="outline-none w-full resize-none overflow-hidden break-words bg-transparent"
        rows={2}
        placeholder="Message Deepseek"
        required
        onChange={(e) => setPrompt(e.target.value)} value={prompt}
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
          <button className={`${prompt ? "bg-primary" : "bg-[#71717a]"} p-2 rounded-full`}>
            <Image className="w-4 aspect-square" src={prompt ? assets.arrow_icon : assets.arrow_icon_dull} alt="" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default PromptBox;
