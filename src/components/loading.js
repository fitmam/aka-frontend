import React from "react";
import Lottie from "lottie-react";
import animationData from "../lottie/loading.json";

export default function Loading() {
  return (
    <div className="w-full h-screen top-0 flex justify-center items-center fixed bg-white/[0.5]">
      <div className="w-32 h-32">
        <Lottie animationData={animationData} height={100} width={100}></Lottie>
      </div>
    </div>
  );
}
