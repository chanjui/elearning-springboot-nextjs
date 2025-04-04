import {useEffect, useState} from "react";

interface LearnVideo {
  id: number;
  title: string;
  videoUrl: string;
  duration: number;
  previewUrl: string | null;
  seq: number;
  currentTime: number;
  completed: boolean;
  free: boolean;
}

export default function LearnVideoComponent({id}: { id: number }) {
  const [video, setVideo] = useState<LearnVideo | null>(null);
  const API_URL = `/api/course/learn/${id}`;

  const setData = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch, Status: ${response.status}`);
      }
      const data = await response.json();
      setVideo(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setData().then();
  }, [id]);

  if (!video) return <p>Loading...</p>;

  return (
    <div className="w-full h-screen flex items-start justify-end bg-black p-4">
      <video className="w-full h-auto" controls>
        <source src={video.videoUrl} type="video/mp4"/>
        Your browser does not support the video tag.
      </video>
    </div>

  );
}
