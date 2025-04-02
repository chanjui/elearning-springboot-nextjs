"use client"

import {useEffect, useRef, useState} from "react"
import Link from "next/link"
import {CheckCircle, ChevronLeft, Clock, Edit3, List, Play, Plus, Save, Search, Send, Trash2, X,} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Progress} from "@/components/ui/progress"
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Input} from "@/components/ui/input"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Textarea} from "@/components/ui/textarea"
import {Badge} from "@/components/ui/badge"
import {useParams} from "next/navigation";

interface replies {
  id: number;
  userId: number;
  user: string;
  profile: string;
  content: string;
  editDate: string;
}

interface Questions {
  id: number;
  userId: number;
  user: string;
  profile: string;
  subject: string;
  content: string;
  date: string; // LocalDate는 문자열로 처리
  replies: replies[];
}


interface Lecture {
  id: number;
  title: string;
  duration: number;
  currentTime: number;
  completed: boolean;
  free: boolean;
}

interface Section {
  id: number;
  title: string;
  lectures: Lecture[];
}

interface Course {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  totalLectures: number;
  completedLectures: number;
  curriculum: Section[];
  questions: Questions[]; // 질문 목록, 현재 구조가 불확실하므로 any[]
}

export default function CourseLearnPage(/*{params}: { params: { slug: string } }*/) {
  const params = useParams();
  const {slug} = params;
  const API_URL = `/api/course/${slug}/learn`;
  const [course, setCourse] = useState<Course>({
    id: 0,
    title: "",
    instructor: "",
    progress: 0,
    totalLectures: 0,
    completedLectures: 0,
    curriculum: [
      {
        id: 0,
        title: "",
        lectures: [
          {id: 0, title: "", duration: 0, completed: true, currentTime: 0, free: true}
        ],
      }
    ],
    questions: [
      {
        id: 0,
        userId: 0,
        user: "",
        profile: "",
        subject: "",
        content: "",
        date: "",
        replies: [
          {
            id: 0,
            userId: 0,
            user: "",
            profile: "",
            content: "",
            editDate: ""
          },
        ],
      }
    ],
  });

  const setData = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        // 응답 상태 코드 출력
        throw new Error(`Failed to fetch, Status: ${response.status}`);
      }
      const data = await response.json();
      setCourse(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setData().then();
  }, [])

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentLecture, setCurrentLecture] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [sidebarTab, setSidebarTab] = useState("curriculum")
  const [newQuestion, setNewQuestion] = useState("")
  const [newNote, setNewNote] = useState("")
  const [notes, setNotes] = useState<Array<{ id: string; timestamp: string; content: string; date: string }>>([
    {
      id: "note1",
      timestamp: "02:15",
      content: "컨테이너와 VM의 차이점: 컨테이너는 OS 커널을 공유하지만 VM은 각각 독립적인 OS를 가짐",
      date: "2023-11-15",
    },
    {
      id: "note2",
      timestamp: "05:30",
      content: "Docker 이미지는 불변(Immutable)이고, 컨테이너는 이미지의 실행 가능한 인스턴스",
      date: "2023-11-15",
    },
  ])
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editNoteContent, setEditNoteContent] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)


  /*// 예시 데이터
  const course = {
    id: "1",
    slug: params.slug,
    title: "비전공자도 이해할 수 있는 Docker 입문/실전",
    instructor: "JSCODE 박재성",
    progress: 15,
    totalLectures: 65,
    completedLectures: 10,
    curriculum: [
      {
        id: "section-1",
        title: "섹션 1: Docker 소개",
        lectures: [
          {id: "lecture-1-1", title: "Docker란 무엇인가?", duration: "10:15", isCompleted: true},
          {id: "lecture-1-2", title: "Docker의 역사와 중요성", duration: "08:30", isCompleted: true},
          {id: "lecture-1-3", title: "Docker vs 가상머신", duration: "12:45", isCompleted: false},
        ],
      },
      {
        id: "section-2",
        title: "섹션 2: Docker 설치 및 기본 명령어",
        lectures: [
          {id: "lecture-2-1", title: "Windows에 Docker 설치하기", duration: "15:20", isCompleted: false},
          {id: "lecture-2-2", title: "Mac에 Docker 설치하기", duration: "14:10", isCompleted: false},
          {id: "lecture-2-3", title: "Linux에 Docker 설치하기", duration: "16:30", isCompleted: false},
          {id: "lecture-2-4", title: "기본 Docker 명령어 익히기", duration: "20:15", isCompleted: false},
        ],
      },
      {
        id: "section-3",
        title: "섹션 3: Docker 이미지와 컨테이너",
        lectures: [
          {id: "lecture-3-1", title: "Docker 이미지 개념 이해하기", duration: "11:45", isCompleted: false},
          {id: "lecture-3-2", title: "Docker Hub 활용하기", duration: "09:30", isCompleted: false},
          {id: "lecture-3-3", title: "컨테이너 생성 및 관리", duration: "18:20", isCompleted: false},
        ],
      },
    ],
    questions: [
      {
        id: "q1",
        title: "Docker 컨테이너 간 통신 문제",
        content: "같은 네트워크에 있는 두 컨테이너가 서로 통신이 안 되는 문제가 있습니다. 어떻게 해결할 수 있을까요?",
        timestamp: "05:20",
        date: "2023-11-10",
        status: "답변완료",
        replies: [
          {
            id: "r1",
            author: "박재성 강사",
            content:
              "컨테이너 간 통신 문제는 대부분 네트워크 설정 때문입니다. 다음을 확인해보세요:\n\n1. 두 컨테이너가 같은 Docker 네트워크에 있는지 확인\n2. 방화벽 설정 확인\n3. 컨테이너 내부에서 ping 명령어로 테스트",
            date: "2023-11-11",
          },
        ],
      },
      {
        id: "q2",
        title: "Docker Compose 오류",
        content:
          "Docker Compose로 여러 서비스를 실행하려고 하는데 의존성 오류가 발생합니다. depends_on을 설정했는데도 문제가 계속됩니다.",
        timestamp: "15:45",
        date: "2023-11-12",
        status: "대기중",
        replies: [],
      },
    ],
  }*/

  // 현재 강의 정보
  const currentSection = course.curriculum[0]
  const currentLectureData = currentSection.lectures[currentLecture]

  // 다음 강의로 이동
  const goToNextLecture = () => {
    if (currentLecture < currentSection.lectures.length - 1) {
      setCurrentLecture(currentLecture + 1)
    } else if (course.curriculum.length > 1) {
      // 다음 섹션의 첫 강의로 이동
      setCurrentLecture(0)
    }
  }

  // 이전 강의로 이동
  const goToPrevLecture = () => {
    if (currentLecture > 0) {
      setCurrentLecture(currentLecture - 1)
    }
  }

  // 비디오 재생/일시정지 토글
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    } else {
      // 비디오 요소가 없는 경우 (플레이스홀더 상태)
      setIsPlaying(!isPlaying)
    }
  }

  // 질문 제출
  const submitQuestion = () => {
    if (newQuestion.trim()) {
      // 여기서는 실제로 질문을 저장하지 않고 UI만 리셋합니다
      // 실제 구현에서는 API 호출 등을 통해 질문을 저장해야 합니다
      setNewQuestion("")
      alert("질문이 제출되었습니다.")
    }
  }

  // 메모 추가
  const addNote = () => {
    if (newNote.trim()) {
      const currentTime = videoRef.current ? videoRef.current.currentTime : 0
      const minutes = Math.floor(currentTime / 60)
      const seconds = Math.floor(currentTime % 60)
      const timestamp = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`

      const newNoteItem = {
        id: `note${Date.now()}`,
        timestamp,
        content: newNote,
        date: new Date().toISOString().split("T")[0],
      }

      setNotes([newNoteItem, ...notes])
      setNewNote("")
    }
  }

  // 메모 편집 시작
  const startEditNote = (note: { id: string; content: string }) => {
    setEditingNoteId(note.id)
    setEditNoteContent(note.content)
  }

  // 메모 저장
  const saveNote = () => {
    if (editingNoteId && editNoteContent.trim()) {
      setNotes(notes.map((note) => (note.id === editingNoteId ? {...note, content: editNoteContent} : note)))
      setEditingNoteId(null)
      setEditNoteContent("")
    }
  }

  // 메모 삭제
  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  return (
    <div className="flex h-screen flex-col bg-black text-white">
      {/* 상단 헤더 */}
      <header className="bg-black border-b border-gray-800 flex items-center justify-between px-4 py-2 h-14">
        <div className="flex items-center">
          <Link href={`/course/${slug}`} className="flex items-center text-gray-300 hover:text-white">
            <ChevronLeft className="h-5 w-5 mr-1"/>
            <span className="hidden sm:inline">강의로 돌아가기</span>
          </Link>
        </div>

        <div className="flex-1 mx-4 text-center">
          <h1 className="text-lg font-medium truncate">{course.title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            {sidebarOpen ? <X className="h-4 w-4"/> : <List className="h-4 w-4"/>}
            <span className="ml-1 hidden sm:inline">{sidebarOpen ? "목차 닫기" : "목차 보기"}</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 왼쪽 사이드바 */}
        {sidebarOpen && (
          <aside className="w-80 border-r border-gray-800 bg-gray-900 flex flex-col">
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-400">진행률</div>
                <div className="text-sm font-medium">
                  {course.completedLectures}/{course.totalLectures} 강의
                </div>
              </div>
              <Progress value={course.progress} className="h-2 bg-gray-800"/>
            </div>

            {/* 사이드바 탭 */}
            <div className="border-b border-gray-800">
              <Tabs defaultValue="curriculum" value={sidebarTab} onValueChange={setSidebarTab}>
                <TabsList className="w-full bg-gray-900 border-b border-gray-800">
                  <TabsTrigger
                    value="curriculum"
                    className="flex-1 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                  >
                    커리큘럼
                  </TabsTrigger>
                  <TabsTrigger
                    value="questions"
                    className="flex-1 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                  >
                    질문
                  </TabsTrigger>
                  <TabsTrigger
                    value="notes"
                    className="flex-1 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                  >
                    메모
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* 검색 */}
            {sidebarTab === "curriculum" && (
              <div className="p-4 border-b border-gray-800">
                <div className="relative">
                  <Search
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                  <Input placeholder="강의 검색" className="pl-8 bg-gray-800 border-gray-700 text-white"/>
                </div>
              </div>
            )}

            <ScrollArea className="flex-1">
              {/* 커리큘럼 탭 내용 */}
              {sidebarTab === "curriculum" && (
                <div className="p-4">
                  {course.curriculum.map((section) => (
                    <div key={section.id} className="mb-4">
                      <h3 className="font-medium mb-2 text-gray-300">{section.title}</h3>
                      <div className="space-y-1">
                        {section.lectures.map((lecture, index) => (
                          <button
                            key={lecture.id}
                            className={`w-full text-left p-2 rounded-md flex items-center text-sm ${
                              currentSection.id === section.id && currentLecture === index
                                ? "bg-gray-800 text-white"
                                : "hover:bg-gray-800 text-gray-300"
                            }`}
                            onClick={() => setCurrentLecture(index)}
                          >
                            {lecture.completed ? (
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500"/>
                            ) : (
                              <Play className="h-4 w-4 mr-2 text-gray-400"/>
                            )}
                            <div className="flex-1 truncate">{lecture.title}</div>
                            <div className="text-xs text-gray-500">{lecture.duration}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 질문 탭 내용 */}
              {sidebarTab === "questions" && (
                <div className="p-4">
                  <div className="mb-4">
                    <h3 className="font-medium mb-2 text-gray-300">새 질문 작성</h3>
                    <div className="space-y-2">
                      <Input placeholder="질문 제목"
                             className="bg-gray-800 border-gray-700 text-white"/>
                      <Textarea
                        placeholder="질문 내용을 작성해주세요..."
                        className="min-h-[100px] bg-gray-800 border-gray-700 text-white"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                      />
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-400">
                          현재 재생 시간:{" "}
                          {videoRef.current
                            ? Math.floor(videoRef.current.currentTime / 60)
                              .toString()
                              .padStart(2, "0")
                            : "00"}
                          :
                          {videoRef.current
                            ? Math.floor(videoRef.current.currentTime % 60)
                              .toString()
                              .padStart(2, "0")
                            : "00"}
                        </div>
                        <Button className="bg-red-600 hover:bg-red-700"
                                onClick={submitQuestion}>
                          <Send className="h-4 w-4 mr-1"/>
                          질문하기
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-medium mb-2 text-gray-300">내 질문 목록</h3>
                    <div className="space-y-3">
                      {course.questions.map((question) => (
                        <div key={question.id}
                             className="border border-gray-800 rounded-md p-3 bg-gray-800/50">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-sm">{question.subject}</h4>
                            <Badge
                              className={question.replies && question.replies.length > 0 ? "bg-green-600" : "bg-yellow-600"}>
                              {question.replies && question.replies.length > 0 ? "답변완료" : "대기중"}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400 mb-2">
                            {question.date}
                          </p>
                          <p className="text-sm text-gray-300 mb-2 line-clamp-2">{question.content}</p>

                          {question.replies.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-700">
                              <p className="text-xs text-gray-400 mb-1">답변 {question.replies.length}개</p>
                              {question.replies.map((reply) => (
                                <div
                                  key={reply.id}
                                  className="text-xs text-gray-300 pl-2 border-l-2 border-gray-700 mt-1"
                                >
                                  <p className="font-medium text-green-400">{reply.user}</p>
                                  <p className="line-clamp-2">{reply.content}</p>
                                  <p className="text-gray-400 text-xs mt-1">{reply.editDate}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 메모 탭 내용 */}
              {sidebarTab === "notes" && (
                <div className="p-4">
                  <div className="mb-4">
                    <h3 className="font-medium mb-2 text-gray-300">새 메모 작성</h3>
                    <div className="space-y-2">
                      <Textarea
                        placeholder="메모 내용을 작성해주세요..."
                        className="min-h-[100px] bg-gray-800 border-gray-700 text-white"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                      />
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1"/>
                          현재 시간:{" "}
                          {videoRef.current
                            ? Math.floor(videoRef.current.currentTime / 60)
                              .toString()
                              .padStart(2, "0")
                            : "00"}
                          :
                          {videoRef.current
                            ? Math.floor(videoRef.current.currentTime % 60)
                              .toString()
                              .padStart(2, "0")
                            : "00"}
                        </div>
                        <Button className="bg-red-600 hover:bg-red-700" onClick={addNote}>
                          <Plus className="h-4 w-4 mr-1"/>
                          메모 추가
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-medium mb-2 text-gray-300">내 메모 목록</h3>
                    <div className="space-y-3">
                      {notes.map((note) => (
                        <div key={note.id}
                             className="border border-gray-800 rounded-md p-3 bg-gray-800/50">
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center">
                              <Badge variant="outline"
                                     className="border-gray-700 text-gray-300">
                                {note.timestamp}
                              </Badge>
                              <span
                                className="text-xs text-gray-400 ml-2">{note.date}</span>
                            </div>
                            <div className="flex space-x-1">
                              {editingNoteId === note.id ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-green-500"
                                  onClick={saveNote}
                                >
                                  <Save className="h-3 w-3"/>
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                                  onClick={() => startEditNote(note)}
                                >
                                  <Edit3 className="h-3 w-3"/>
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                                onClick={() => deleteNote(note.id)}
                              >
                                <Trash2 className="h-3 w-3"/>
                              </Button>
                            </div>
                          </div>

                          {editingNoteId === note.id ? (
                            <Textarea
                              className="mt-2 min-h-[80px] bg-gray-800 border-gray-700 text-white"
                              value={editNoteContent}
                              onChange={(e) => setEditNoteContent(e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-gray-300 mt-2">{note.content}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
          </aside>
        )}

        {/* 메인 콘텐츠
        <main className="flex-1 flex flex-col bg-black">
           비디오 플레이어
          <div className="bg-black relative aspect-video">
            <div className="absolute inset-0 flex items-center justify-center">
              {!isPlaying ? (
                <>
                  <Image
                    src="/placeholder.svg?height=720&width=1280"
                    alt="Video thumbnail"
                    width={1280}
                    height={720}
                    className="w-full h-full object-contain"
                  />
                  <Button
                    className="absolute bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full w-20 h-20"
                    size="lg"
                    onClick={togglePlay}
                  >
                    <Play className="h-10 w-10"/>
                  </Button>
                </>
              ) : (
                <video
                  ref={videoRef}
                  className="w-full h-full"
                  controls
                  autoPlay
                  poster="/placeholder.svg?height=720&width=1280"
                  onTimeUpdate={() => {
                    if (videoRef.current) {
                      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
                      setProgress(progress)
                    }
                  }}
                  onEnded={() => {
                    setIsPlaying(false)
                    setProgress(0)
                  }}
                >
                  <source src="#" type="video/mp4"/>
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

             비디오 컨트롤
            {!isPlaying && (
              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10"
                            onClick={togglePlay}>
                      <Play className="h-5 w-5"/>
                    </Button>
                    <div className="text-sm">00:00 / {currentLectureData.duration}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                      <Volume2 className="h-5 w-5"/>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                      <Settings className="h-5 w-5"/>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                      <Maximize className="h-5 w-5"/>
                    </Button>
                  </div>
                </div>

                <Progress value={progress} className="h-1 mt-2 bg-gray-700"/>
              </div>
            )}
          </div>

           강의 내용
          <div className="flex-1 p-6">
            <div className="bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{currentLectureData.title}</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPrevLecture}
                    disabled={currentLecture === 0}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1"/>
                    이전 강의
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextLecture}
                    disabled={currentLecture === currentSection.lectures.length - 1}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
                  >
                    다음 강의
                    <ChevronRight className="h-4 w-4 ml-1"/>
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="content">
                <TabsList className="bg-gray-800">
                  <TabsTrigger value="content" className="data-[state=active]:bg-gray-700">
                    강의 내용
                  </TabsTrigger>
                  <TabsTrigger value="materials" className="data-[state=active]:bg-gray-700">
                    자료
                  </TabsTrigger>
                  <TabsTrigger value="questions" className="data-[state=active]:bg-gray-700">
                    질문 & 답변
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="mt-4">
                  <div className="prose prose-invert max-w-none">
                    <h3>강의 요약</h3>
                    <p>
                      이 강의에서는 Docker의 기본 개념과 작동 원리에 대해 알아봅니다. 컨테이너 기술이 왜 중요한지,
                      그리고 가상 머신과의 차이점은 무엇인지 살펴보겠습니다.
                    </p>

                    <h3>학습 목표</h3>
                    <ul>
                      <li>Docker의 기본 개념 이해하기</li>
                      <li>컨테이너와 가상 머신의 차이점 알기</li>
                      <li>Docker가 개발 환경에 가져오는 이점 이해하기</li>
                    </ul>

                    <h3>주요 내용</h3>
                    <ol>
                      <li>Docker 소개 및 역사</li>
                      <li>컨테이너 기술의 원리</li>
                      <li>Docker의 주요 구성 요소</li>
                      <li>가상 머신과 컨테이너 비교</li>
                    </ol>
                  </div>
                </TabsContent>

                <TabsContent value="materials" className="mt-4">
                  <div className="space-y-4">
                    <div
                      className="flex items-center justify-between p-4 border border-gray-700 rounded-md bg-gray-800">
                      <div className="flex items-center">
                        <div className="bg-blue-900 p-2 rounded mr-3">
                          <Download className="h-5 w-5 text-blue-300"/>
                        </div>
                        <div>
                          <div className="font-medium">Docker 설치 가이드.pdf</div>
                          <div className="text-sm text-gray-400">2.4MB</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm"
                              className="border-gray-700 text-gray-300 hover:bg-gray-700">
                        <Download className="h-4 w-4 mr-1"/>
                        다운로드
                      </Button>
                    </div>

                    <div
                      className="flex items-center justify-between p-4 border border-gray-700 rounded-md bg-gray-800">
                      <div className="flex items-center">
                        <div className="bg-blue-900 p-2 rounded mr-3">
                          <Download className="h-5 w-5 text-blue-300"/>
                        </div>
                        <div>
                          <div className="font-medium">강의 코드 예제.zip</div>
                          <div className="text-sm text-gray-400">1.8MB</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm"
                              className="border-gray-700 text-gray-300 hover:bg-gray-700">
                        <Download className="h-4 w-4 mr-1"/>
                        다운로드
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="questions" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <Button className="bg-red-600 hover:bg-red-700">
                        <MessageSquare className="h-4 w-4 mr-1"/>
                        질문하기
                      </Button>
                    </div>

                    <div className="border border-gray-700 rounded-md p-4 bg-gray-800">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                          <span className="font-medium">김</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">김철수</div>
                            <div className="text-sm text-gray-400">2일 전</div>
                          </div>
                          <div className="mt-2">
                            <p>Docker 설치 시 Windows Home 버전에서도 문제없이 설치가 가능한가요?</p>
                          </div>

                          <div className="mt-4 pl-6 border-l-2 border-gray-700">
                            <div className="flex items-start gap-3">
                              <div
                                className="w-8 h-8 rounded-full bg-green-900 flex items-center justify-center">
                                <span className="font-medium text-sm">박</span>
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <div className="font-medium text-green-400">박재성
                                    (강사)
                                  </div>
                                  <div className="text-sm text-gray-400 ml-2">1일 전
                                  </div>
                                </div>
                                <div className="mt-1">
                                  <p>
                                    네, Windows Home에서도 Docker Desktop을 설치할 수 있습니다.
                                    다만 WSL2를 먼저
                                    설치해야 합니다. 다음 강의에서 자세히 다룰 예정입니다.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-700 rounded-md p-4 bg-gray-800">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                          <span className="font-medium">이</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">이영희</div>
                            <div className="text-sm text-gray-400">1주일 전</div>
                          </div>
                          <div className="mt-2">
                            <p>Docker와 Kubernetes의 관계에 대해 더 자세히 설명해주실 수 있나요?</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>*/}
      </div>
    </div>
  )
}

