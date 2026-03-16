"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExtension from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  ImagePlus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Loader2,
  Undo,
  Redo,
  Minus,
  Code2,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

const ToolbarButton = ({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded-lg transition-all text-sm font-bold leading-none flex items-center justify-center ${
      active
        ? "bg-red-100 text-red-600"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
  >
    {children}
  </button>
);

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write content here...",
  onImageUpload,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [codeView, setCodeView] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const isUpdatingRef = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      UnderlineExtension,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-red-600 hover:underline font-medium",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: "w-full rounded-xl my-6 shadow-md border border-gray-200",
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:text-gray-400 before:italic before:float-left before:pointer-events-none before:h-0",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      if (!isUpdatingRef.current) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none focus:outline-none min-h-[400px] p-8 text-gray-800 leading-relaxed",
      },
    },
  });

  // Sync external value changes (e.g. when switching EN/CN or loading edit data)
  useEffect(() => {
    if (!editor) return;
    const currentHtml = editor.getHTML();
    // Only update if truly different to avoid cursor jumping
    if (value !== currentHtml) {
      isUpdatingRef.current = true;
      editor.commands.setContent(value || "");
      isUpdatingRef.current = false;
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL:", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const handleImageFile = useCallback(
    async (file: File) => {
      if (!editor || !onImageUpload) return;
      setUploading(true);
      setUploadError(null);
      try {
        const url = await onImageUpload(file);
        if (!url) throw new Error("No URL returned from server");
        editor.chain().focus().setImage({ src: url, alt: file.name }).run();
      } catch (e: any) {
        console.error("Image upload failed:", e);
        setUploadError(e?.message || "Upload gagal. Coba lagi.");
        setTimeout(() => setUploadError(null), 6000);
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [editor, onImageUpload]
  );

  if (!editor) return null;

  const Divider = () => <div className="w-px h-6 bg-gray-200 mx-1 self-center" />;

  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-xl overflow-auto bg-white shadow-sm">
      {/* TOOLBAR - sticky agar selalu terlihat saat scroll */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap items-center gap-0.5 sticky top-0 z-10 shadow-sm">
        {/* Undo / Redo */}
        <ToolbarButton
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo size={16} />
        </ToolbarButton>

        <Divider />

        {/* Text formatting */}
        <ToolbarButton
          title="Bold (Ctrl+B)"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          title="Italic (Ctrl+I)"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          title="Underline (Ctrl+U)"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
        >
          <Underline size={16} />
        </ToolbarButton>

        <Divider />

        {/* Headings */}
        <ToolbarButton
          title="Heading 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
        >
          <span className="text-xs font-black">H2</span>
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
        >
          <span className="text-xs font-black">H3</span>
        </ToolbarButton>

        <Divider />

        {/* Lists */}
        <ToolbarButton
          title="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          title="Numbered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <ListOrdered size={16} />
        </ToolbarButton>

        <Divider />

        {/* Alignment */}
        <ToolbarButton
          title="Align Left"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
        >
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton
          title="Align Center"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
        >
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton
          title="Align Right"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
        >
          <AlignRight size={16} />
        </ToolbarButton>
        <ToolbarButton
          title="Justify"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          active={editor.isActive({ textAlign: "justify" })}
        >
          <AlignJustify size={16} />
        </ToolbarButton>

        <Divider />

        {/* Link */}
        <ToolbarButton
          title="Insert / Edit Link"
          onClick={setLink}
          active={editor.isActive("link")}
        >
          <LinkIcon size={16} />
        </ToolbarButton>

        {/* Horizontal Rule */}
        <ToolbarButton
          title="Horizontal Rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={16} />
        </ToolbarButton>

        {/* Image upload */}
        {onImageUpload && (
          <>
            <ToolbarButton
              title="Insert Image"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 size={16} className="animate-spin text-red-500" />
              ) : (
                <ImagePlus size={16} className="text-red-600" />
              )}
            </ToolbarButton>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleImageFile(e.target.files[0]);
              }}
            />
          </>
        )}

        <Divider />

        {/* Code View toggle */}
        <ToolbarButton
          title={codeView ? "Switch to Visual Editor" : "Code View (HTML)"}
          onClick={() => {
            if (codeView) {
              // switching back to visual — sync textarea back to editor
              isUpdatingRef.current = true;
              editor.commands.setContent(value || "");
              isUpdatingRef.current = false;
            }
            setCodeView(!codeView);
          }}
          active={codeView}
        >
          <Code2 size={16} />
        </ToolbarButton>
      </div>

      {/* EDITOR CONTENT */}
      {/* UPLOAD ERROR BANNER */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-2 flex items-center gap-2">
          ⚠️ Upload Gagal: {uploadError}
        </div>
      )}

      {codeView ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-grow p-6 font-mono text-sm text-gray-700 bg-gray-50 resize-none outline-none leading-relaxed"
          placeholder="Paste or edit raw HTML here..."
          spellCheck={false}
        />
      ) : (
        <div className="flex-grow overflow-y-auto">
          <EditorContent editor={editor} className="h-full" />
        </div>
      )}
    </div>
  );
}
