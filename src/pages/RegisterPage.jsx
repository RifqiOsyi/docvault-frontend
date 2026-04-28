import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const requirements = [
    { label: 'Minimal 6 karakter', met: form.password.length >= 6 },
    { label: 'Password cocok', met: form.password === form.confirm && form.confirm.length > 0 },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Semua field wajib diisi');
      return;
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Password tidak cocok');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
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
            Mulai simpan<br />dokumenmu<br />hari ini.
          </h2>
          <p className="font-body text-paper/50 text-lg">Gratis. Aman. Selalu tersedia.</p>
        </div>
        <p className="font-body text-paper/30 text-sm">DocVault © 2024</p>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center">
              <FileText size={16} className="text-paper" />
            </div>
            <span className="font-display font-bold text-xl text-ink">DocVault</span>
          </Link>

          <div className="mb-8 animate-fade-in">
            <h1 className="font-display font-bold text-3xl text-ink mb-2">Buat Akun</h1>
            <p className="font-body text-muted">Sudah punya akun?{' '}
              <Link to="/login" className="text-accent hover:underline font-medium">Masuk di sini</Link>
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
              <label className="font-body font-medium text-sm text-ink mb-1.5 block">Nama Lengkap</label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                className="input-field" placeholder="Budi Santoso" autoComplete="name" />
            </div>

            <div>
              <label className="font-body font-medium text-sm text-ink mb-1.5 block">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                className="input-field" placeholder="email@contoh.com" autoComplete="email" />
            </div>

            <div>
              <label className="font-body font-medium text-sm text-ink mb-1.5 block">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} className="input-field pr-12" placeholder="••••••••" autoComplete="new-password" />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="font-body font-medium text-sm text-ink mb-1.5 block">Konfirmasi Password</label>
              <input type="password" name="confirm" value={form.confirm} onChange={handleChange}
                className="input-field" placeholder="••••••••" autoComplete="new-password" />
            </div>

            {form.password.length > 0 && (
              <div className="space-y-1.5">
                {requirements.map(({ label, met }) => (
                  <div key={label} className="flex items-center gap-2">
                    <CheckCircle2 size={14} className={met ? 'text-green-500' : 'text-border'} />
                    <span className={`font-body text-xs ${met ? 'text-green-600' : 'text-muted'}`}>{label}</span>
                  </div>
                ))}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3.5">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
                  Membuat akun...
                </span>
              ) : 'Buat Akun'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
