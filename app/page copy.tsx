"use client";

import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [likeCount, setLikeCount] = useState<number>(0);
  const [carouselImages, setCarouselImages] = useState<
    { url: string; isBoss: boolean; isItem: boolean }[]
  >([]);

  // Refs for audio elements
  const enemySoundRef = useRef<HTMLAudioElement>(null);
  const bossSoundRef = useRef<HTMLAudioElement>(null);
  const itemSoundRef = useRef<HTMLAudioElement>(null);

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
        } else if (
          message.event === "spawn_enemy" ||
          message.event === "spawn_boss" ||
          message.event === "spawn_item"
        ) {
          let details = "";
          let isBoss = false;
          let isItem = false;

          if (message.event === "spawn_enemy") {
            details = message.monster;
            if (enemySoundRef.current) {
              enemySoundRef.current.play();
            }
          } else if (message.event === "spawn_boss") {
            details = message.monster;
            isBoss = true;
            if (bossSoundRef.current) {
              bossSoundRef.current.play();
            }
          } else if (message.event === "spawn_item") {
            details = message.item;
            isItem = true;
            if (itemSoundRef.current) {
              itemSoundRef.current.volume = 0.3;
              itemSoundRef.current.play();
            }
          }

          const imageUrl = `/images/${details}.webp`;
          setCarouselImages((prevImages) => [
            { url: imageUrl, isBoss: isBoss, isItem: isItem },
            ...prevImages,
          ]);
        }
      });
    };

    return () => {
      socket.close();
    };
  }, []);

  const nextSmallMilestone = Math.ceil(likeCount / 20) * 20;
  const nextMediumMilestone = Math.ceil(likeCount / 100) * 100;
  const nextLargeMilestone = Math.ceil(likeCount / 1000) * 1000;

  const smallProgress = ((likeCount % 20) / 20) * 100;
  const mediumProgress = ((likeCount % 100) / 100) * 100;
  const largeProgress = ((likeCount % 1000) / 1000) * 100;

  return (
    <div className="h-screen w-[40rem] p-6 flex flex-col gap-2 bg-base-300">
      {/* Audio elements */}
      <audio ref={enemySoundRef} src="/sounds/enemy_spawn.mp3" />
      <audio ref={bossSoundRef} src="/sounds/boss_spawn.mp3" />
      <audio ref={itemSoundRef} src="/sounds/item_spawn.mp3" />

      {/* Carousel */}
      <div className="carousel max-w space-x-1 py-4">
        {carouselImages.map((image, index) => (
          <div key={index} className={`carousel-item`}>
            <div className={"avatar " + (index === 0 ? "animate-bounce" : "")}>
              <div
                className={
                  "w-12 rounded-full " +
                  (image.isBoss ? "bg-error" : "bg-neutral")
                }
              >
                <img src={image.url} alt={`Spawned ${index}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Small Progress Bar */}
      <div className="relative w-full">
        <progress
          className="progress w-full h-6 progress-warning"
          value={smallProgress}
          max="100"
        ></progress>
        <span className="absolute inset-0 flex items-center justify-center text-white pb-1 font-bold">
          MONSTRE : {likeCount} / {nextSmallMilestone} ❤
        </span>
      </div>

      {/* Medium Progress Bar */}
      <div className="relative w-full">
        <progress
          className="progress w-full h-6 progress-success"
          value={mediumProgress}
          max="100"
        ></progress>
        <span className="absolute inset-0 flex items-center justify-center text-white pb-1 font-bold">
          OBJET : {likeCount} / {nextMediumMilestone} ❤
        </span>
      </div>

      {/* Large Progress Bar */}
      <div className="relative w-full">
        <progress
          className="progress w-full h-6 progress-error"
          value={largeProgress}
          max="100"
        ></progress>
        <span className="absolute inset-0 flex items-center justify-center text-white pb-1 font-bold">
          BOSS : {likeCount} / {nextLargeMilestone} ❤
        </span>
      </div>
    </div>
  );
}
