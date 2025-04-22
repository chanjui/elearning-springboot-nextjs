"use client"

import { use } from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

import CourseCreateForm from "@/components/instructor/course-create/CourseCreateForm"

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)  // ✅ use()로 unwrap

  const [initialData, setInitialData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/courses/${id}`, { withCredentials: true })
        setInitialData(res.data)
      } catch (err) {
        console.error("강의 정보를 불러오지 못했습니다:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [id])

  if (loading) return <div className="text-white">로딩 중...</div>

  return <CourseCreateForm initialData={initialData} isEdit />
}