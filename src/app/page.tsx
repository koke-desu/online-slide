"use client";
import HeadToolbar from "@/components/HeadToolbar";
import MainCanvas from "@/components/MainCanvas";
import RightControlPanel from "@/components/RightControlPanel";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/ws/");
    ws.onopen = () => {
      ws.send("hello");
    };

    ws.onmessage = (e) => {
      console.log(e.data);
    };
  }, []);

  return (
    <main className="h-screen w-screen bg-white flex flex-col overflow-hidden">
      <HeadToolbar />
      <div className="flex-1 w-full">
        <div className="relative h-full w-full">
          <div className="w-60 h-full absolute top-0 left-0 bg-white z-10"></div>
          <MainCanvas />
          <RightControlPanel />
        </div>
      </div>
    </main>
  );
};

export default Home;
