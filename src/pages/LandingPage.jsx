import { Link } from "react-router-dom";
import {
  FileText,
  Shield,
  Upload,
  Download,
  Zap,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function LandingPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-paper">
      {/* Nav */}
      <nav className="border-b border-border bg-paper/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center">
              <FileText size={16} className="text-paper" />
            </div>
            <span className="font-display font-bold text-xl text-ink">
              DocVault
            </span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex flex-col items-end">
                  <span className="font-body font-medium text-sm text-ink">
                    {user.name}
                  </span>
                  <span className="font-body text-xs text-muted">
                    {user.email}
                  </span>
                </div>
                <Link
                  to="/dashboard"
                  className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
                >
                  <LayoutDashboard size={15} />
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="btn-ghost text-sm px-4 py-2 flex items-center gap-2"
                >
                  <LogOut size={15} />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm px-4 py-2">
                  Masuk
                </Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">
                  Daftar Gratis
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-8">
          <Zap size={12} className="text-accent" />
          <span className="font-body text-accent text-sm font-medium">
            Platform Penyimpanan Dokumen
          </span>
        </div>
        <h1 className="font-display font-bold text-5xl md:text-7xl text-ink leading-tight mb-6 animate-slide-up">
          Simpan Semua
          <br />
          <span className="text-accent">Dokumenmu</span>
          <br />
          di Satu Tempat
        </h1>
        <p className="font-body text-muted text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-slide-up stagger-1">
          DocVault memudahkan kamu menyimpan, mengorganisasi, dan mengakses
          semua file penting kapan saja. Aman, cepat, dan mudah digunakan.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-2">
          <Link
            to="/register"
            className="btn-primary text-base px-8 py-4 w-full sm:w-auto"
          >
            Mulai Sekarang — Gratis
          </Link>
          <Link
            to="/login"
            className="btn-ghost text-base px-8 py-4 w-full sm:w-auto"
          >
            Sudah Punya Akun?
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: "Aman & Terlindungi",
              desc: "Setiap akun terlindungi dengan autentikasi JWT. File kamu hanya bisa diakses oleh kamu sendiri.",
            },
            {
              icon: Upload,
              title: "Upload Mudah",
              desc: "Drag & drop atau klik untuk upload. Mendukung PDF, Word, Excel, PowerPoint, gambar, dan teks.",
            },
            {
              icon: Download,
              title: "Akses Kapan Saja",
              desc: "Download file kapan pun kamu butuhkan. Terorganisir berdasarkan tanggal upload.",
            },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div
              key={i}
              className={`card p-8 animate-fade-in stagger-${i + 1}`}
            >
              <div className="w-12 h-12 bg-ink rounded-xl flex items-center justify-center mb-5">
                <Icon size={22} className="text-paper" />
              </div>
              <h3 className="font-display font-bold text-xl text-ink mb-3">
                {title}
              </h3>
              <p className="font-body text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* File types */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-ink rounded-2xl p-12 text-center">
          <h2 className="font-display font-bold text-3xl text-paper mb-4">
            Format yang Didukung
          </h2>
          <p className="font-body text-paper/60 mb-8">
            Upload berbagai jenis file hingga 100MB per file
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "PDF",
              "DOCX",
              "XLSX",
              "PPTX",
              "TXT",
              "PNG",
              "JPG",
              "MP4",
              "MP3",
              "ZIP",
            ].map((ext) => (
              <span
                key={ext}
                className="bg-white/10 text-paper font-mono text-sm px-4 py-2 rounded-lg border border-white/20"
              >
                .{ext.toLowerCase()}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-ink rounded flex items-center justify-center">
              <FileText size={12} className="text-paper" />
            </div>
            <span className="font-display font-bold text-ink">DocVault</span>
          </div>
          <p className="font-body text-muted text-sm">
            © 2026 DocVault. Dibuat oleh Rifqi Osyi
          </p>
        </div>
      </footer>
    </div>
  );
}
