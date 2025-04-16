"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import "@uiw/react-md-editor/markdown-editor.css"
import "@uiw/react-markdown-preview/markdown.css"

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false })

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div data-color-mode="dark" className="bg-gray-900 text-white rounded-lg overflow-hidden p-4">
      <MDEditor
        value={value}
        onChange={(val = "") => onChange(val)}
        height={400}
        preview="live" // 단일 에디터 모드
      />
    </div>
  )
}