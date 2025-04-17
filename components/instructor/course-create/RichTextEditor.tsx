"use client"

import "@toast-ui/editor/dist/toastui-editor.css"
import { Editor } from "@toast-ui/react-editor"
import { useRef, useEffect } from "react"

interface Props {
  value: string
  onChange: (value: string) => void
}

export default function RichTextEditor({ value, onChange }: Props) {
  const editorRef = useRef<any>(null)

  useEffect(() => {
    const injectStyle = () => {
      if (document.head.querySelector("[data-toast-style]")) return

      const style = document.createElement("style")
      style.setAttribute("data-toast-style", "true")
      style.innerHTML = `
        /* ✅ Toast UI Editor 다크 테마 전체 적용 */
        .toastui-editor-defaultUI .toastui-editor-contents,
        .toastui-editor-defaultUI .ProseMirror,
        .toastui-editor-defaultUI .toastui-editor-contents *,
        .toastui-editor-defaultUI .ProseMirror * {
          color: #ffffff !important;
          font-weight: 500 !important;
          line-height: 1.7 !important;
          letter-spacing: 0.01em !important;
        }

        .toastui-editor-defaultUI pre,
        .toastui-editor-defaultUI blockquote {
          color: #f8fafc !important;
        }

        .toastui-editor-defaultUI {
          background-color: #0f172a !important;
          border: none !important;
          border-radius: 0.5rem;
        }

        .toastui-editor-defaultUI .toastui-editor-toolbar {
          background-color: #1e293b !important;
          border-bottom: 1px solid #334155 !important;
        }

        .toastui-editor-defaultUI .toastui-editor-toolbar button {
          color: #e2e8f0 !important;
          border: none !important;
          box-shadow: none !important;
        }

        .toastui-editor-defaultUI .toastui-editor-toolbar button:hover,
        .toastui-editor-defaultUI .toastui-editor-toolbar button:focus {
          background-color: #334155 !important;
        }

        .toastui-editor-defaultUI .toastui-editor-md-splitter {
          background-color: transparent !important;
          width: 0px !important;
        }

        .toastui-editor-defaultUI .toastui-editor-mode-switch {
          background-color: #1e293b !important;
          color: #e2e8f0 !important;
          border-top: 1px solid #334155 !important;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }

        .toastui-editor-defaultUI .toastui-editor-mode-switch .tab-item {
          color: #94a3b8 !important;
        }

        .toastui-editor-defaultUI .toastui-editor-mode-switch .tab-item.active {
          color: #ffffff !important;
          font-weight: bold !important;
        }

        /* ✅ 팝업 내부 입력 필드 */
        .toastui-editor-defaultUI .tui-dialog input[type="text"],
        .toastui-editor-defaultUI .tui-dialog textarea,
        .toastui-editor-defaultUI .tui-dialog .tui-textarea {
          background-color: #ffffff !important;
          color: #000000 !important;
          font-weight: 500 !important;
          border: 1px solid #d1d5db !important;
          padding: 0.5rem !important;
        }

        /* ✅ 드롭다운/헤딩 선택 */
        .toastui-editor-defaultUI .toastui-editor-dropdown-item,
        .toastui-editor-defaultUI .tui-select-box-item {
          background-color: #ffffff !important;
          color: #000000 !important;
          font-weight: 500 !important;
          border: none !important;
        }

        .toastui-editor-defaultUI .toastui-editor-dropdown-item.active,
        .toastui-editor-defaultUI .tui-select-box-item.active {
          background-color: #e2e8f0 !important;
          color: #000000 !important;
          font-weight: bold !important;
        }

        .toastui-editor-defaultUI .toastui-editor-dropdown-item:hover,
        .toastui-editor-defaultUI .tui-select-box-item:hover {
          background-color: #f1f5f9 !important;
          color: #000000 !important;
        }

        /* ✅ 팝업 버튼 */
        .toastui-editor-defaultUI .tui-dialog-footer .tui-dialog-button {
          background-color: #1d4ed8 !important;
          color: white !important;
          border: none !important;
        }

        .toastui-editor-defaultUI .tui-dialog-footer .tui-dialog-button:hover {
          background-color: #2563eb !important;
        }

        .toastui-editor-defaultUI .tui-dialog-close {
          color: #e2e8f0 !important;
        }
      `
      document.head.appendChild(style)
    }

    const applyPopupFixes = () => {
      const selectors = [
        ".tui-dialog input[type='text']",
        ".tui-dialog textarea",
        ".tui-dialog .tui-textarea",
        ".toastui-editor-dropdown-item",
        ".tui-select-box-item"
      ]
    
      selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector)
        console.log(`[PopupFix] Applying styles to ${elements.length} elements for selector: ${selector}`)
        elements.forEach((el) => {
          const elem = el as HTMLElement
          elem.style.backgroundColor = "#ffffff"
          elem.style.color = "#000000"
          elem.style.fontWeight = "500"
          elem.style.border = "1px solid #d1d5db"
          elem.style.padding = "0.5rem"
        })
      })
    
      console.log("✅ Popup style fixes applied.")
    }

    requestAnimationFrame(() => {
      injectStyle()
      setTimeout(applyPopupFixes, 300)
    })

    const observer = new MutationObserver(() => {
      applyPopupFixes()
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      const prevStyle = document.head.querySelector("[data-toast-style]")
      if (prevStyle) document.head.removeChild(prevStyle)
      observer.disconnect()
    }
  }, [])

  const handleImageUpload = async (
    blob: Blob,
    callback: (url: string, altText: string) => void
  ) => {
    const res = await fetch("/api/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: (blob as File).name,
        fileType: blob.type,
      }),
    })

    const { uploadUrl, fileUrl } = await res.json()

    await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": blob.type },
      body: blob,
    })

    callback(fileUrl, "image")
  }

  return (
    <div className="rounded overflow-hidden">
      <Editor
        ref={editorRef}
        height="400px"
        initialEditType="markdown"
        previewStyle="vertical"
        initialValue={value}
        placeholder="강의 내용을 입력하세요..."
        hooks={{ addImageBlobHook: handleImageUpload }}
        onChange={() => {
          const markdown = editorRef.current?.getInstance().getMarkdown()
          onChange(markdown)
        }}
      />
    </div>
  )
}