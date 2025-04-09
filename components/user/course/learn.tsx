import {useCallback, useEffect, useRef, useState} from "react";
//import {useRouter} from "next/navigation";
import useUserStore from "@/app/auth/userStore";

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
  nextVideoId: number;
}

export default function LearnVideoComponent({id, onNext}: { id: number, onNext?: (nextId: number) => void }) {
  const [video, setVideo] = useState<LearnVideo | null>(null);
  const currentTimeRef = useRef(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const API_URL = `/api/course/learn`;
  const {user, restoreFromStorage} = useUserStore();
  //const router = useRouter();
  const hasPromptedRef = useRef(false);

  const sendProgressToServer = useCallback(async () => {
    if (!video || currentTimeRef.current === 0) return;

    try {
      const progressUrl = `${API_URL}/${id}/progress?userId=${user?.id}&lectureVideoId=${id}&currentTime=${Math.floor(currentTimeRef.current)}`;
      await fetch(progressUrl, {
        method: "POST",
      });
      console.log("✅ Progress saved:", currentTimeRef.current);
    } catch (error) {
      console.error("❌ Failed to save progress", error);
    }
  }, [video, user, id]);

  const setData = async () => {
    try {
      const response = await fetch(`${API_URL}/${id}?userId=${user?.id}`);
      const data = await response.json();
      setVideo(data.data);
      hasPromptedRef.current = false;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setData().catch(console.error);
    restoreFromStorage();
  }, [id]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      (e as any).returnValue = "";
      sendProgressToServer().catch(console.error);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      sendProgressToServer().catch(console.error);
    };
  }, [sendProgressToServer]);

  useEffect(() => {
    if (video && !video.completed && video.currentTime > 0 && !hasPromptedRef.current) {
      hasPromptedRef.current = true;
      const shouldResume = window.confirm(
        `이전에 ${Math.floor(video.currentTime)}초까지 시청하셨습니다. 이어서 보시겠습니까?`
      );
      if (shouldResume && videoRef.current) {
        videoRef.current.currentTime = video.currentTime;
      }
    }
  }, [video]);

  useEffect(() => {
    const handleEnded = () => {
      if (video?.nextVideoId) {
        const goNext = window.confirm("강의를 모두 시청하셨습니다. 다음 강의로 이동하시겠습니까?");
        if (goNext && onNext) {
          onNext(video.nextVideoId); // ✅ 부모에게 다음 강의 ID 전달
        }
      } else {
        alert("강의를 모두 시청하셨습니다.");
      }
    };

    const currentVideo = videoRef.current;
    if (currentVideo) {
      currentVideo.addEventListener("ended", handleEnded);
    }

    return () => {
      if (currentVideo) {
        currentVideo.removeEventListener("ended", handleEnded);
      }
    };
  }, [video, onNext]);

  if (!video) return <p>Loading...</p>;

  return (
    <div className="w-full h-screen flex items-start justify-end bg-black p-4">
      <video
        key={id}
        ref={videoRef}
        className="w-full h-auto"
        controls
        onTimeUpdate={() => {
          currentTimeRef.current = videoRef.current?.currentTime ?? 0;
        }}
      >
        <source src={video.videoUrl} type="video/mp4"/>
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
