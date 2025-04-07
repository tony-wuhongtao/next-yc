"use client";
import React, { useState, useEffect, useRef } from "react";

interface Track {
  title: string;
  url: string;
  loop: boolean;
}

interface FileData {
  filename: string;
  url: string;
}

const AudioPlayerPage = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchAudioList = async () => {
      try {
        const response = await fetch("/api/meows");
        const { data } = await response.json();
        setTracks(
          data.map((file: FileData) => ({
            title: file.filename.replace(".mp3", ""),
            url: file.url,
            loop: false,
          }))
        );
      } catch (error) {
        console.error("Failed to load audio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAudioList();
  }, []);

  const handlePlayPause = (url: string, loop: boolean) => {
    // 单音频实例管理 [2,3](@ref)
    if (audioRef.current) {
      // 处理同一音轨操作
      if (currentTrack === url) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play().catch(console.error);
        }
        setIsPlaying(!isPlaying);
      } else {
        // 切换新音轨 [1](@ref)
        audioRef.current.pause();
        audioRef.current.src = url;
        audioRef.current.loop = loop;
        audioRef.current.play().catch(console.error);
        setCurrentTrack(url);
        setIsPlaying(true);
      }
    } else {
      // 初始化音频实例 [3](@ref)
      const audio = new Audio(url);
      audio.loop = loop;
      audioRef.current = audio;
      audio.play().catch(console.error);
      setCurrentTrack(url);
      setIsPlaying(true);
    }
  };

  const handleLoop = (url: string) => {
    setTracks((prev) =>
      prev.map((track) =>
        track.url === url ? { ...track, loop: !track.loop } : track
      )
    );
    if (audioRef.current && currentTrack === url) {
      audioRef.current.loop = !audioRef.current.loop;
    }
  };

  // 事件绑定 [2](@ref)
  useEffect(() => {
    if (audioRef.current) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTrack(null);
      };

      audioRef.current.addEventListener("play", handlePlay);
      audioRef.current.addEventListener("pause", handlePause);
      audioRef.current.addEventListener("ended", handleEnded);

      return () => {
        audioRef.current?.removeEventListener("play", handlePlay);
        audioRef.current?.removeEventListener("pause", handlePause);
        audioRef.current?.removeEventListener("ended", handleEnded);
      };
    }
  }, [currentTrack]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4 sm:px-0">
      <div className="mx-auto sm:max-w-2xl bg-base-100 rounded-box shadow-sm">
        <div className="p-4 border-b border-base-200">
          <h1 className="text-xl font-bold flex items-center">
            <span className="text-3xl mr-2">
              <img
                src="/images/cat-meows/cat.svg"
                alt="cat icon"
                className="w-8 h-8"
              />
            </span>
            喵语库（Meows Lib）
          </h1>
        </div>

        <div className="p-4">
          <ul className="space-y-4">
            {tracks.map((track, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-3 bg-base-200 rounded-box hover:bg-base-300 transition-colors"
              >
                <div className="flex items-center flex-1 min-w-0">
                  <div className="avatar placeholder mr-3">
                    <div className="bg-white text-neutral-content rounded-full w-10">
                      <span className="text-3xl mr-2">
                        <img
                          src="/images/cat-meows/cat.svg"
                          alt="cat icon"
                          className="w-8 h-8"
                        />
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-base font-medium truncate">
                      {track.title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center ml-4 space-x-3">
                  <button
                    className="btn btn-circle btn-sm btn-primary"
                    onClick={() => handlePlayPause(track.url, track.loop)}
                  >
                    <svg
                      className="w-full h-full"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {currentTrack === track.url && isPlaying ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 6v12h4V6H8zm6 0v12h4V6h-4z"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 5v14l11-7z"
                        />
                      )}
                    </svg>
                  </button>
                  <button
                    className={`btn btn-circle btn-sm ${
                      track.loop ? "btn-secondary" : "btn-ghost"
                    }`}
                    onClick={() => handleLoop(track.url)}
                  >
                    <svg
                      className="w-full h-full"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayerPage;
