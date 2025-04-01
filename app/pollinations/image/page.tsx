"use client";
import { useState } from "react";

const Txt2ImagePage = () => {
  const [prompt, setPrompt] = useState(
    "A futuristic city with flying cars and neon lights"
  );
  const [model, setModel] = useState("flux");
  const [seed, setSeed] = useState("42");
  const [width, setWidth] = useState("1024");
  const [height, setHeight] = useState("1024");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateRandomSeed = () => {
    const randomSeed = Math.floor(Math.random() * 1000000).toString();
    setSeed(randomSeed);
  };

  const generateImage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/pollinations/txt2img", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          width: parseInt(width),
          height: parseInt(height),
          seed: parseInt(seed),
          model,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">AI文生图</h1>
        <p className="text-gray-600">
          支持中文描述图片，系统会自动翻译为英文提示词。
        </p>
      </div>

      {/* 控制区域 */}
      <div className="card bg-base-200 shadow-xl mb-8">
        <div className="card-body">
          {/* 输入提示 */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">图片中文描述</span>
            </label>
            <input
              type="text"
              className="input input-bordered mx-auto w-full"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          {/* 配置选项 - 响应式网格布局 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {/* 模型选择 */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">模型选择</span>
              </label>
              <select
                className="select select-bordered"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                <option value="flux">flux</option>
                <option value="turbo">turbo</option>
              </select>
            </div>

            {/* 种子输入带随机按钮 */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">随机数种子</span>
              </label>
              <div className="flex flex-row gap-2">
                <input
                  type="text"
                  className="input input-bordered w-3/4"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                />
                <button
                  className="btn btn-ghost w-1/4"
                  onClick={generateRandomSeed}
                >
                  🎲
                </button>
              </div>
            </div>

            {/* 宽度输入 */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">图片宽度</span>
              </label>
              <input
                type="number"
                className="input input-bordered"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
            </div>

            {/* 高度输入 */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">图片高度</span>
              </label>
              <input
                type="number"
                className="input input-bordered"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </div>

          {/* 应用按钮 */}
          <div className="mt-6">
            <button
              className="btn btn-primary w-full"
              onClick={generateImage}
              disabled={isLoading}
            >
              {isLoading ? "生成中..." : "开始生图"}
            </button>
          </div>
        </div>
      </div>

      {/* 图片生成区域 */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="aspect-square bg-gray-100 rounded-box flex items-center justify-center">
            {isLoading ? (
              <span className="loading loading-spinner loading-lg"></span>
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt="Generated image"
                className="w-full h-full object-cover rounded-box"
              />
            ) : (
              <span className="text-gray-400">
                Image preview will appear here
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Txt2ImagePage;
