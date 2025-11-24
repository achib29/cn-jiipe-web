"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase"; 
import { useRouter, useSearchParams } from "next/navigation"; 
import { 
  Bold, Italic, Heading1, List, 
  Link as LinkIcon, Image as ImageIcon, Eye, Edit3, X as XIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  ImagePlus, Loader2, ArrowLeft, Save, Flame, Calendar 
} from "lucide-react";

export default function AddNewsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit") ?? null;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false); 
  const [uploadingBodyImg, setUploadingBodyImg] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bodyImageInputRef = useRef<HTMLInputElement>(null);
  
  // State Form Data
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Industry News");
  const [status, setStatus] = useState("Published");
  const [isHot, setIsHot] = useState(false); 
  const [hotPriority, setHotPriority] = useState<number | null>(null); // <--- urutan manual
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState(""); 
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // --- LOAD DATA LAMA JIKA EDIT ---
  useEffect(() => {
    if (editId) {
      const fetchArticle = async () => {
        setFetching(true);
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', editId)
          .single();
        
        if (error) {
          console.error("Error fetching data:", error);
          alert("Gagal mengambil data artikel.");
        } else if (data) {
          setTitle(data.title);
          setCategory(data.category);
          setStatus(data.status || "Published");
          setIsHot(data.is_hot || false); 
          setHotPriority(data.hot_priority ?? null);          // <---
          setSummary(data.summary);
          setContent(data.content.replaceAll('<br/>', '\n'));
          setImagePreview(data.coverImage);
          
          if (data.date) {
            const dateObj = new Date(data.date);
            if (!isNaN(dateObj.getTime())) {
               setPublishDate(dateObj.toISOString().split('T')[0]);
            }
          }
        }
        setFetching(false);
      };
      fetchArticle();
    }
  }, [editId]);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleBodyImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setUploadingBodyImg(true);
    try {
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '');
      const fileName = `body-${Date.now()}-${cleanFileName}`;
      
      const { error: uploadError } = await supabase.storage.from('news-images').upload(fileName, file);
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage.from('news-images').getPublicUrl(fileName);
      const imageUrl = urlData.publicUrl;

      const imgTag = `\n<img src="${imageUrl}" alt="Image" class="w-full rounded-xl my-6 shadow-md border border-gray-200" />\n<p class="text-center text-gray-500 text-sm italic mt-2">Caption Here</p>\n`;
      insertTag(imgTag, ''); 
    } catch (error) {
      console.error("Gagal upload gambar body:", error);
      alert("Gagal upload gambar.");
    } finally {
      setUploadingBodyImg(false);
      if (bodyImageInputRef.current) bodyImageInputRef.current.value = '';
    }
  };

  const insertTag = (startTag: string, endTag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const newText = text.substring(0, start) + startTag + text.substring(start, end) + endTag + text.substring(end);
    setContent(newText);
    setTimeout(() => {
      textarea.focus();
      const cursorPosition = start + startTag.length;
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    }, 0);
  };

  // --- SUBMIT DATA (CREATE / UPDATE) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let publicImageUrl = imagePreview || "https://via.placeholder.com/800x400"; 
      
      // Upload Cover Image Baru (Jika ada file dipilih)
      if (imageFile) {
        const cleanFileName = imageFile.name.replace(/[^a-zA-Z0-9.]/g, '');
        const fileName = `cover-${Date.now()}-${cleanFileName}`;
        const { error: uploadError } = await supabase.storage.from('news-images').upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('news-images').getPublicUrl(fileName);
        publicImageUrl = urlData.publicUrl;
      }

      // Generate Slug & Format Content
      const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
      const finalContent = content.replace(/\n/g, '<br/>');

      // Format Tanggal ke String yang Cantik (Contoh: "December 18, 2024")
      const formattedDate = new Date(publishDate).toLocaleDateString("en-US", { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      const articleData: any = {
        title,
        slug,
        category,
        status,
        is_hot: isHot, 
        hot_priority: isHot ? hotPriority : null, // <--- simpan priority kalau Hot, kalau tidak null
        summary,
        content: finalContent,
        coverImage: publicImageUrl,
        date: formattedDate, // Simpan tanggal custom
      };

      // 🔒 Pastikan setiap hot_priority hanya dipakai 1 artikel
      if (isHot && hotPriority) {
        if (editId) {
          // Mode edit: kosongkan priority pada artikel lain dengan priority yang sama
          const { error: clearError } = await supabase
            .from('articles')
            .update({ is_hot: false, hot_priority: null })
            .eq('hot_priority', hotPriority)
            .neq('id', editId);   // jangan hapus priority milik artikel ini sendiri
          if (clearError) throw clearError;
        } else {
          // Mode create: kosongkan priority pada artikel lain dengan priority yang sama
          const { error: clearError } = await supabase
            .from('articles')
            .update({ is_hot: false, hot_priority: null })
            .eq('hot_priority', hotPriority);
          if (clearError) throw clearError;
        }
      }

      if (editId) {
        // UPDATE DATA LAMA
        const { error } = await supabase.from('articles').update(articleData).eq('id', editId);
        if (error) throw error;
        alert("Artikel berhasil diperbarui!");
      } else {
        // INSERT DATA BARU
        const { error } = await supabase.from('articles').insert([articleData]);
        if (error) throw error;
        alert("Artikel baru berhasil diterbitkan!");
      }
      
      router.push("/admin"); 

    } catch (error: any) {
      console.error("Error:", error);
      alert("Gagal menyimpan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-gray-500">
        <Loader2 size={40} className="animate-spin text-red-600 mb-4" />
        <p>Memuat data artikel...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20 px-4">
      <div className="max-w-[1600px] mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-200 transition">
              <ArrowLeft size={24} className="text-gray-600"/>
            </button>
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {editId ? "Edit Article" : "Write New Article"}
                </h1>
                <p className="text-gray-500">
                  {editId ? "Update existing content" : "Create content for JIIPE Website"}
                </p>
            </div>
          </div>
          <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`flex items-center gap-2 px-8 py-2 rounded-lg text-white font-bold shadow-md transition-all ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <Save size={18} /> {loading ? "Saving..." : (editId ? "Update Article" : "Publish Article")}
              </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-200px)]">
          
          {/* KOLOM KIRI: EDITOR */}
          <div className="lg:col-span-3 flex flex-col gap-4 h-full">
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-bold p-4 bg-white border border-gray-200 rounded-xl focus:border-red-600 outline-none placeholder-gray-300 shadow-sm"
              placeholder="Enter Article Title Here..."
            />
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col flex-grow overflow-hidden">
              {/* TOOLBAR EDITOR */}
              <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap items-center gap-1">
                <div className="flex bg-white rounded-lg border border-gray-200 p-1 mr-2">
                    <button
                      type="button"
                      onClick={() => setPreviewMode(false)}
                      className={`px-3 py-1.5 rounded text-sm font-bold flex items-center gap-2 transition-colors ${
                        !previewMode ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <Edit3 size={14} /> Write
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode(true)}
                      className={`px-3 py-1.5 rounded text-sm font-bold flex items-center gap-2 transition-colors ${
                        previewMode ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <Eye size={14} /> Preview
                    </button>
                </div>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                <button type="button" title="Bold" onClick={() => insertTag('<b>', '</b>')} className="p-2 hover:bg-gray-200 rounded text-gray-700">
                  <Bold size={18}/>
                </button>
                <button type="button" title="Italic" onClick={() => insertTag('<i>', '</i>')} className="p-2 hover:bg-gray-200 rounded text-gray-700">
                  <Italic size={18}/>
                </button>
                <button type="button" title="Heading 2" onClick={() => insertTag('<h3>', '</h3>')} className="p-2 hover:bg-gray-200 rounded text-gray-700 flex items-center gap-1">
                  <Heading1 size={18}/>
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <button type="button" title="Align Left" onClick={() => insertTag('<div class="text-left">', '</div>')} className="p-2 hover:bg-gray-200 rounded text-gray-700">
                  <AlignLeft size={18}/>
                </button>
                <button type="button" title="Align Center" onClick={() => insertTag('<div class="text-center">', '</div>')} className="p-2 hover:bg-gray-200 rounded text-gray-700">
                  <AlignCenter size={18}/>
                </button>
                <button type="button" title="Align Right" onClick={() => insertTag('<div class="text-right">', '</div>')} className="p-2 hover:bg-gray-200 rounded text-gray-700">
                  <AlignRight size={18}/>
                </button>
                <button type="button" title="Justify" onClick={() => insertTag('<div class="text-justify">', '</div>')} className="p-2 hover:bg-gray-200 rounded text-gray-700">
                  <AlignJustify size={18}/>
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <button
                  type="button"
                  title="List"
                  onClick={() => insertTag('<ul class="list-disc list-inside space-y-1 ml-4"><li>', '</li></ul>')}
                  className="p-2 hover:bg-gray-200 rounded text-gray-700"
                >
                  <List size={18}/>
                </button>
                <button
                  type="button"
                  title="Link"
                  onClick={() => {
                    const url = prompt("URL:", "https://");
                    if (url) insertTag(`<a href="${url}" class="text-red-600 hover:underline font-medium">`, '</a>');
                  }}
                  className="p-2 hover:bg-gray-200 rounded text-gray-700"
                >
                  <LinkIcon size={18}/>
                </button>
                
                <button
                  type="button"
                  title="Add Image Body"
                  onClick={() => bodyImageInputRef.current?.click()}
                  className={`p-2 hover:bg-red-50 rounded flex items-center gap-2 ${
                    uploadingBodyImg ? 'text-red-400' : 'text-red-600'
                  }`}
                  disabled={uploadingBodyImg}
                >
                  {uploadingBodyImg ? <Loader2 size={18} className="animate-spin"/> : <ImagePlus size={18}/>}
                </button>
                <input
                  type="file"
                  ref={bodyImageInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleBodyImageUpload}
                />
              </div>

              {/* TEXT AREA */}
              <div className="flex-grow relative bg-white h-full overflow-hidden">
                {previewMode ? (
                  <div
                    className="prose prose-lg max-w-none p-8 h-full overflow-y-auto whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: content || "<p class='text-gray-400 italic'>Start writing...</p>" }}
                  />
                ) : (
                  <textarea
                    ref={textareaRef}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-full p-8 outline-none resize-none font-mono text-base text-gray-800 leading-relaxed"
                    placeholder="Write your article here..."
                  />
                )}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: SETTINGS */}
          <div className="space-y-6 h-full overflow-y-auto pb-10">
            
            {/* HOT NEWS */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${isHot ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                        <Flame size={20} fill={isHot ? "currentColor" : "none"} />
                    </div>
                    <div>
                        <span className="block text-sm font-bold text-gray-700">Hot News</span>
                        <span className="text-xs text-gray-500">Pin at top of list</span>
                    </div>
                </div>
                <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isHot}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setIsHot(checked);
                        if (!checked) setHotPriority(null); // reset urutan jika tidak hot
                      }}
                    />
                    <div className={`block w-10 h-6 rounded-full transition ${isHot ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${isHot ? 'translate-x-4' : ''}`}></div>
                </div>
              </label>

              {/* Pilihan urutan Main / Featured */}
              {isHot && (
                <div className="mt-4">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Main / Featured Order
                  </label>
                  <select
                    value={hotPriority ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setHotPriority(val ? parseInt(val, 10) : null);
                    }}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  >
                    <option value="">No Priority (Hot only)</option>
                    <option value="1">1 - MAIN STORY (Paling besar)</option>
                    <option value="2">2 - FEATURED #2</option>
                    <option value="3">3 - FEATURED #3</option>
                    <option value="4">4 - Queued #4</option>
                    <option value="5">5 - Queued #5</option>
                  </select>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Urutan ini dipakai untuk menentukan Main Story & Featured di halaman depan.
                  </p>
                </div>
              )}
            </div>

            {/* PUBLISH DATE */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                <Calendar size={14} /> Publish Date
              </label>
              <input
                type="date"
                required
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 font-bold text-gray-700"
              />
              <p className="text-xs text-gray-400 mt-2">
                Choose date for latepost or scheduling.
              </p>
            </div>

            {/* STATUS */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 font-bold text-gray-700"
              >
                <option value="Published">Published (Live)</option>
                <option value="Draft">Draft (Hidden)</option>
              </select>
            </div>

            {/* CATEGORY */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
              >
                <option>Industry News</option>
                <option>Press Release</option>
                <option>Sustainability</option>
                <option>Events</option>
                <option>Awards</option>
              </select>
            </div>

            {/* SUMMARY */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3">
                Short Summary
              </label>
              <textarea
                required
                rows={5}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 text-sm"
                placeholder="Brief description..."
              />
            </div>

            {/* COVER IMAGE */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3">
                Cover Image
              </label>
              {imagePreview ? (
                <div className="mb-4 relative rounded-lg overflow-hidden border border-gray-200 group">
                  <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover" />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full shadow hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XIcon />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
                  <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 font-medium">Click to upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleCoverImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
