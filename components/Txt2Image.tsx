import React from "react";
import { usePollinationsImage } from "@pollinations/react";

interface Txt2ImageProps {
  prompt: string;
  width?: number;
  height?: number;
  seed?: number;
  model?: string;
  alt?: string;
}

const Txt2ImageComponent = ({
  prompt,
  width = 800,
  height = 600,
  seed = 42,
  model = "flux",
  alt = "",
}: Txt2ImageProps) => {
  const imageUrl = usePollinationsImage(prompt, {
    width,
    height,
    seed,
    model,
    nologo: true,
    enhance: false,
  });

  return (
    <div className="w-full h-full">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-full object-cover rounded-box"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
    </div>
  );
};

export default Txt2ImageComponent;
