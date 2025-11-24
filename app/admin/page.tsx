"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  FileText,
  CheckCircle,
  ArrowUpDown,
  Flame,
  LogOut,
} from "lucide-react";

interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  date: string;
  status?: string;
  is_hot?: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("dateDesc");

  // --- FUNGSI LOGOUT ---
  const handleLogout = () => {
    // Paksa browser pindah ke /logout (full request, bukan fetch/RSC)
    window.location.href = "/logout";
  };

  // FETCH DATA
  const fetchArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("articles").select("*");

    if (error) {
      console.error(error);
    } else if (data) {
      // Smart Sorting (Client Side)
      const sortedData = [...data].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        switch (sortBy) {
          case "dateDesc":
            return (dateB || b.id) - (dateA || a.id);
          case "dateAsc":
            return (dateA || a.id) - (dateB || b.id);
          case "titleAsc":
            return a.title.localeCompare(b.title);
          case "titleDesc":
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });
      setArticles(sortedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, [sortBy]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this article?")) {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (!error) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
      } else {
        alert("Failed to delete");
      }
    }
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Content Dashboard
            </h1>
            <p className="text-gray-500">Manage your news and articles</p>
          </div>

          <div className="flex gap-3">
            {/* TOMBOL LOGOUT */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-xl font-bold transition-all shadow-sm"
            >
              <LogOut size={18} /> Logout
            </button>

            <Link href="/admin/add">
              <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all">
                <Plus size={20} /> Create New
              </button>
            </Link>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3 flex-grow">
            <Search className="text-gray-400 ml-2" size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              className="flex-grow outline-none text-gray-700 placeholder-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3 min-w-[200px]">
            <ArrowUpDown className="text-gray-400 ml-2" size={18} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full outline-none text-gray-700 bg-transparent cursor-pointer font-medium"
            >
              <option value="dateDesc">Newest Date</option>
              <option value="dateAsc">Oldest Date</option>
              <option value="titleAsc">Title (A-Z)</option>
              <option value="titleDesc">Title (Z-A)</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-5 text-sm font-bold text-gray-500 uppercase">
                  Title
                </th>
                <th className="p-5 text-sm font-bold text-gray-500 uppercase">
                  Category
                </th>
                <th className="p-5 text-sm font-bold text-gray-500 uppercase">
                  Status
                </th>
                <th className="p-5 text-sm font-bold text-gray-500 uppercase">
                  Date
                </th>
                <th className="p-5 text-sm font-bold text-gray-500 uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-10 text-center text-gray-500"
                  >
                    Loading data...
                  </td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-10 text-center text-gray-500"
                  >
                    No articles found.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr
                    key={article.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-5 font-bold text-gray-800 max-w-xs">
                      <div className="flex items-center gap-2">
                        {article.is_hot && (
                          <span
                            className="bg-orange-100 text-orange-600 p-1 rounded"
                            title="Hot News"
                          >
                            <Flame size={14} fill="currentColor" />
                          </span>
                        )}
                        <span className="truncate">{article.title}</span>
                      </div>
                    </td>
                    <td className="p-5 text-sm text-gray-600">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold uppercase">
                        {article.category}
                      </span>
                    </td>
                    <td className="p-5">
                      {article.status === "Draft" ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full w-fit">
                          <FileText size={12} /> Draft
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit">
                          <CheckCircle size={12} /> Published
                        </span>
                      )}
                    </td>
                    <td className="p-5 text-sm text-gray-500">
                      {article.date}
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/news/${article.slug}`} target="_blank">
                          <button
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                        </Link>
                        <Link href={`/admin/add?edit=${article.id}`}>
                          <button
                            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
