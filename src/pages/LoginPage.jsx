import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Email dan password wajib diisi');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan, coba lagi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <FileText size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl text-paper">DocVault</span>
        </Link>
        <div>
          <h2 className="font-display font-bold text-4xl text-paper leading-tight mb-4">
            Selamat datang<br />kembali.
          </h2>
          <p className="font-body text-paper/50 text-lg">Semua dokumenmu menunggumu di sini.</p>
        </div>
        <p className="font-body text-paper/30 text-sm">DocVault © 2024</p>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center">
              <FileText size={16} className="text-paper" />
            </div>
            <span className="font-display font-bold text-xl text-ink">DocVault</span>
          </Link>

          <div className="mb-8 animate-fade-in">
            <h1 className="font-display font-bold text-3xl text-ink mb-2">Masuk</h1>
            <p className="font-body text-muted">Belum punya akun?{' '}
              <Link to="/register" className="text-accent hover:underline font-medium">Daftar sekarang</Link>
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 animate-fade-in">
              <AlertCircle size={16} className="shrink-0" />
              <p className="font-body text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 animate-slide-up">
            <div>
              <label className="font-body font-medium text-sm text-ink mb-1.5 block">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                placeholder="email@contoh.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="font-body font-medium text-sm text-ink mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="input-field pr-12"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3.5">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
                  Memproses...
                </span>
              ) : 'Masuk'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
