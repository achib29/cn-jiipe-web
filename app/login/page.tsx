"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, Loader2, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Kirim Magic Link ke email
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // Pastikan URL ini mengarah ke route callback yang sudah kita perbaiki
          // location.origin otomatis mendeteksi apakah localhost:3000 atau domain asli
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`,
        },
      });

      if (error) throw error;
      
      setSent(true); // Tampilkan pesan sukses jika berhasil

    } catch (error: any) {
      alert('Gagal mengirim link login: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4 border border-red-100">
            <ShieldCheck size={32} className="text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
          <p className="text-gray-500 text-sm mt-1">JIIPE Content Management System</p>
        </div>

        {sent ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center animate-fade-in">
            <h3 className="text-green-800 font-bold text-lg mb-2">Cek Email Anda!</h3>
            <p className="text-green-700 text-sm leading-relaxed">
              Kami telah mengirim link login aman ke <strong>{email}</strong>.<br/>
              Silakan klik link di email tersebut untuk masuk (jangan gunakan browser lain).
            </p>
            <button 
              onClick={() => setSent(false)}
              className="mt-6 text-green-700 hover:text-green-800 text-sm font-bold underline"
            >
              Kirim ulang atau ganti email
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition bg-gray-50 focus:bg-white"
                  placeholder="admin@jiipe.com"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 hover:shadow-red-500/30 transform hover:-translate-y-0.5'}`}
            >
              {loading && <Loader2 size={20} className="animate-spin" />}
              {loading ? "Mengirim Link..." : "Kirim Link"}
            </button>
            
            <p className="text-center text-xs text-gray-400 mt-4">
              Login aman tanpa password via Link.
            </p>
          </form>
        )}

      </div>
    </main>
  );
}