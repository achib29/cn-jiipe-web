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
  MousePointerClick,
  Download,
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
    className={`p-2 rounded-lg transition-all text-sm font-bold leading-none flex items-center justify-center ${active
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

  // --- CUSTOM PROMPT MODAL STATE ---
  const [promptConfig, setPromptConfig] = useState<{
    isOpen: boolean;
    type: "button" | "brochure" | "link";
    title: string;
    textLabel?: string;
    urlLabel?: string;
    variant?: "solid" | "outline";
  }>({
    isOpen: false,
    type: "button",
    title: "",
  });
  const [promptInputs, setPromptInputs] = useState({ text: "", url: "" });

  const openPrompt = (config: any, defaultText = "", defaultUrl = "") => {
    setPromptConfig({ ...config, isOpen: true });
    setPromptInputs({ text: defaultText, url: defaultUrl });
  };

  const handlePromptSubmit = () => {
    if (!editor) return;
    const { type, variant } = promptConfig;
    const { text, url } = promptInputs;

    if (type === "button") {
      if (!text || !url) return;
      const cls = variant === "outline" ? "btn-cta-outline" : "btn-cta";
      const isAnchor = url.startsWith("#");
      const targetAttr = isAnchor ? "" : ' target="_blank" rel="noopener noreferrer"';
      const html = `<a href="${url}" class="${cls}"${targetAttr}>${text}</a>`;
      editor.chain().focus().insertContent(html).run();
    } else if (type === "brochure") {
      if (!text) return;
      const html = `<a href="/brochure/cn-jiipe.pdf" data-track="download_brochure" data-agl-cvt="6" class="btn-cta" target="_blank" rel="noopener noreferrer">📄 ${text}</a>`;
      editor.chain().focus().insertContent(html).run();
    } else if (type === "link") {
      if (url === "") {
        editor.chain().focus().unsetLink().run();
      } else {
        editor.chain().focus().setLink({ href: url }).run();
      }
    }
    setPromptConfig((prev) => ({ ...prev, isOpen: false }));
  };
  // ---------------------------------

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
    openPrompt(
      { type: "link", title: "Insert / Edit Link", urlLabel: "URL:" },
      "",
      previousUrl || "https://"
    );
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

  const insertButton = (variant: "solid" | "outline") => {
    openPrompt(
      {
        type: "button",
        title: variant === "solid" ? "Insert CTA Button" : "Insert Outline CTA Button",
        textLabel: "Button Text:",
        urlLabel: "Target URL:",
        variant,
      },
      "立即咨询 →",
      "#contact"
    );
  };

  const insertBrochureButton = () => {
    openPrompt(
      {
        type: "brochure",
        title: "Insert Brochure Button",
        textLabel: "Button Text:",
      },
      "Download Brochure / 下载宣传册",
      ""
    );
  };

  const Divider = () => <div className="w-full h-px bg-gray-200 my-1" />;

  return (
    <div className="flex gap-3 h-full items-start">
      {/* --- CUSTOM PROMPT UI --- */}
      {promptConfig.isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 ring-1 ring-gray-200 transform animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-5">{promptConfig.title}</h3>
            
            {promptConfig.textLabel && (
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">{promptConfig.textLabel}</label>
                <input 
                  type="text" 
                  autoFocus
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 font-medium text-gray-800" 
                  value={promptInputs.text} 
                  onChange={e => setPromptInputs({...promptInputs, text: e.target.value})} 
                  onKeyDown={e => e.key === "Enter" && (!promptConfig.urlLabel || promptInputs.url) && handlePromptSubmit()}
                />
              </div>
            )}

            {promptConfig.urlLabel && (
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">{promptConfig.urlLabel}</label>
                <input 
                  type="text" 
                  autoFocus={!promptConfig.textLabel}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 font-medium text-gray-800" 
                  value={promptInputs.url} 
                  onChange={e => setPromptInputs({...promptInputs, url: e.target.value})} 
                  onKeyDown={e => e.key === "Enter" && handlePromptSubmit()}
                />
              </div>
            )}

            <div className="flex gap-3 justify-end mt-6">
              <button 
                type="button" 
                onClick={() => setPromptConfig(p => ({...p, isOpen: false}))} 
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition text-sm"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handlePromptSubmit} 
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition text-sm shadow-md shadow-red-500/30"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ------------------------ */}

      {/* ── LEFT VERTICAL TOOLBAR ───────────────────────────────────────── */}
      <div className="sticky top-16 z-30 flex flex-col items-center gap-0.5 bg-white border border-gray-200 rounded-xl shadow-sm p-2 w-11 shrink-0">
        {/* Undo / Redo */}
        <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo size={15} />
        </ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo size={15} />
        </ToolbarButton>

        <Divider />

        {/* Text formatting */}
        <ToolbarButton title="Bold (Ctrl+B)" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton title="Italic (Ctrl+I)" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton title="Underline (Ctrl+U)" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")}>
          <Underline size={15} />
        </ToolbarButton>

        <Divider />

        {/* Headings */}
        <ToolbarButton title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
          <span className="text-[11px] font-black">H2</span>
        </ToolbarButton>
        <ToolbarButton title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>
          <span className="text-[11px] font-black">H3</span>
        </ToolbarButton>

        <Divider />

        {/* Lists */}
        <ToolbarButton title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton title="Numbered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
          <ListOrdered size={15} />
        </ToolbarButton>

        <Divider />

        {/* Alignment */}
        <ToolbarButton title="Align Left" onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })}>
          <AlignLeft size={15} />
        </ToolbarButton>
        <ToolbarButton title="Align Center" onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })}>
          <AlignCenter size={15} />
        </ToolbarButton>
        <ToolbarButton title="Align Right" onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })}>
          <AlignRight size={15} />
        </ToolbarButton>
        <ToolbarButton title="Justify" onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })}>
          <AlignJustify size={15} />
        </ToolbarButton>

        <Divider />

        {/* Link */}
        <ToolbarButton title="Insert / Edit Link" onClick={setLink} active={editor.isActive("link")}>
          <LinkIcon size={15} />
        </ToolbarButton>

        {/* Horizontal Rule */}
        <ToolbarButton title="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus size={15} />
        </ToolbarButton>

        {/* Image upload */}
        {onImageUpload && (
          <>
            <ToolbarButton title="Insert Image" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 size={15} className="animate-spin text-red-500" /> : <ImagePlus size={15} className="text-red-600" />}
            </ToolbarButton>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) handleImageFile(e.target.files[0]); }}
            />
          </>
        )}

        <Divider />

        {/* Code View */}
        <ToolbarButton
          title={codeView ? "Switch to Visual Editor" : "Code View (HTML)"}
          onClick={() => {
            if (codeView) {
              isUpdatingRef.current = true;
              editor.commands.setContent(value || "");
              isUpdatingRef.current = false;
            }
            setCodeView(!codeView);
          }}
          active={codeView}
        >
          <Code2 size={15} />
        </ToolbarButton>

        <Divider />

        {/* Insert CTA Buttons */}
        <ToolbarButton title="Insert CTA Button (solid)" onClick={() => insertButton("solid")}>
          <span className="text-[9px] font-black text-red-600 leading-tight text-center">
            <MousePointerClick size={12} className="mx-auto mb-0.5" />
            Btn
          </span>
        </ToolbarButton>
        <ToolbarButton title="Insert CTA Button (outline)" onClick={() => insertButton("outline")}>
          <span className="text-[9px] font-black text-gray-500 leading-tight text-center">
            <MousePointerClick size={12} className="mx-auto mb-0.5" />
            Btn◻
          </span>
        </ToolbarButton>

        {/* Insert Brochure CTA */}
        <ToolbarButton title="Insert Brochure Download Button" onClick={insertBrochureButton}>
          <span className="text-[9px] font-black text-blue-600 leading-tight text-center">
            <Download size={12} className="mx-auto mb-0.5" />
            PDF
          </span>
        </ToolbarButton>
      </div>

      {/* ── EDITOR / CODE VIEW ──────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 h-full border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
        {/* Upload error banner */}
        {uploadError && (
          <div className="bg-red-50 border-b border-red-200 text-red-700 text-xs font-semibold px-4 py-2 flex items-center gap-2">
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
          <div className="flex-grow overflow-y-auto min-h-0">
            <EditorContent editor={editor} className="h-full" />
          </div>
        )}
      </div>

    </div>
  );
}
