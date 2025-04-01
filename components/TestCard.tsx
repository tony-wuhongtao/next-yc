"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface TestCardProps {
  imageUrl: string;
  altText: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

function TestCard({
  imageUrl,
  altText,
  title,
  description,
  buttonText,
  buttonLink,
}: TestCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(buttonLink);
  };

  return (
    <div className="bg-base-100 shadow-xl rounded-lg">
      <figure className="px-10 pt-10">
        <img src={imageUrl} alt={altText} className="rounded-xl" />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
        <div className="card-actions">
          <button className="btn btn-primary" onClick={handleClick}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestCard;
