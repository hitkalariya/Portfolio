// src/Loader.jsx

import React from "react";
import { Html, useProgress } from "@react-three/drei";

const CanvasLoader = () => {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="bg-[#151030] text-green-400 font-mono p-4 rounded-md shadow-lg border border-[#915eff] w-[280px] text-sm animate-pulse">
        <p> Initializing portfolio...</p>
        <p> Loading 3D assets... {progress.toFixed(0)}%</p>
        <p> Rendering interface...</p>
        <p className="text-[#915eff] mt-2">[Swastik Dev Engine v1.0]</p>
      </div>
    </Html>
  );
};

export default CanvasLoader;
