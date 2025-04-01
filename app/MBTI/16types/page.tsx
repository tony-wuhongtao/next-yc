import React from "react";
import Image from "next/image";

const fetchPersonalityTypes = async () => {
  const url = "http://localhost:3000/api/personality-types";
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await fetch(url);
  return response.json();
};

const mbtiPage = async () => {
  const personalityTypes = await fetchPersonalityTypes();
  // console.log(personalityTypes);
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">16种人格类型</h1>

      {/* 类型网格 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {personalityTypes.map((type: any) => (
          <div
            key={type.type}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
          >
            <figure className="px-4 pt-4">
              <Image
                src={type.image}
                alt={type.name}
                width={120}
                height={120}
                className="rounded-full"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className={`card-title text-2xl ${type.color}`}>
                {type.type}
              </h2>
              <h3 className="text-lg font-semibold">{type.name}</h3>
              <p className="text-sm text-gray-500">{type.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default mbtiPage;
