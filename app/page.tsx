"use client";

import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [likeCount, setLikeCount] = useState<number>(0);

  useEffect(() => {
    // Establish WebSocket connection
    const socket = new WebSocket("ws://localhost:6789");

    // Event listener for receiving messages
    socket.onmessage = (event: MessageEvent) => {
      const messages = JSON.parse(event.data);
      console.log(messages);
      messages.forEach((message: any) => {
        if (message.event === "like_count") {
          setLikeCount(message.data);
        }
      });
    };

    return () => {
      socket.close();
    };
  }, []);

  const nextLargeMilestone = Math.ceil(likeCount / 1000) * 1000;

  const largeProgress = ((likeCount % 1000) / 1000) * 100;

  return (
    <div className="h-screen w-[30rem] p-6 flex flex-col gap-2 bg-success">
      {/* Large Progress Bar */}
      <div className="relative w-full">
        <progress
          className="progress w-full h-6 progress-error"
          value={largeProgress}
          max="100"
        ></progress>
        <span className="absolute inset-0 flex items-center justify-center text-white pb-1 font-bold">
          SAUTE D'UN ÉTAGE : {likeCount} / {nextLargeMilestone} ❤
        </span>
      </div>
    </div>
  );
}
