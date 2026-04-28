import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Upload,
  LogOut,
  Trash2,
  Download,
  X,
  Search,
  Plus,
  File,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  HardDrive,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import api from "../utils/api";
import { formatFileSize, formatDate, FILE_COLORS } from "../utils/format";

const FileIcon = ({ icon, size = 24 }) => {
  const color = FILE_COLORS[icon] || FILE_COLORS.txt;
  const labels = {
    pdf: "PDF",
    word: "DOC",
    excel: "XLS",
    ppt: "PPT",
    image: "IMG",
    txt: "TXT",
    video: "VID",
    audio: "AUD",
    zip: "ZIP",
  };
  return (
    <div
      className="w-10 h-12 rounded flex items-end justify-center pb-1 text-white text-[10px] font-mono font-bold relative overflow-hidden"
      style={{ backgroundColor: color }}
    >
      <div
        className="absolute top-0 right-0 w-3 h-3 bg-black/20"
        style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
      />
      {labels[icon] || "FILE"}
    </div>
  );
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl animate-slide-up
      ${type === "success" ? "bg-ink text-paper" : "bg-red-600 text-white"}`}
    >
      {type === "success" ? (
        <CheckCircle2 size={16} />
      ) : (
        <AlertCircle size={16} />
      )}
      <span className="font-body text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
};

// Komponen Storage Bar
const StorageBar = ({ storage }) => {
  if (!storage) return null;
  const { used, limit, usedPercent } = storage;
  const isWarning = usedPercent >= 80;
  const isDanger = usedPercent >= 95;

  const barColor = isDanger
    ? "bg-red-500"
    : isWarning
      ? "bg-amber-400"
      : "bg-ink";

  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <HardDrive size={16} className="text-muted" />
          <p className="font-body text-muted text-xs">Storage</p>
        </div>
        <p className="font-body text-xs text-muted">
          <span
            className={`font-semibold ${isDanger ? "text-red-500" : isWarning ? "text-amber-500" : "text-ink"}`}
          >
            {formatFileSize(used)}
          </span>{" "}
          / {formatFileSize(limit)}
        </p>
      </div>
      <div className="w-full bg-surface rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(usedPercent, 100)}%` }}
        />
      </div>
      <p
        className={`font-body text-xs mt-2 ${isDanger ? "text-red-500" : isWarning ? "text-amber-500" : "text-muted"}`}
      >
        {isDanger
          ? "⚠ Storage hampir penuh! Hapus beberapa file."
          : isWarning
            ? `⚠ ${usedPercent}% terpakai — sisa ${formatFileSize(limit - used)}`
            : `${usedPercent}% terpakai — sisa ${formatFileSize(limit - used)}`}
      </p>
    </div>
  );
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [storage, setStorage] = useState(null);
  const fileInputRef = useRef(null);     // untuk modal upload
  const dropZoneInputRef = useRef(null); // untuk drop zone / klik area
  const dropRef = useRef(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchStorage = useCallback(async () => {
    try {
      const res = await api.get("/files/storage");
      setStorage(res.data.storage);
    } catch {
      // storage info gagal dimuat, tidak perlu tampilkan error
    }
  }, []);

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/files");
      setFiles(res.data.files || []);
    } catch {
      showToast("Gagal memuat file", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
    fetchStorage();
  }, [fetchFiles, fetchStorage]);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", selectedFile);
    fd.append("description", description);
    try {
      await api.post("/files/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("File berhasil diupload!");
      setSelectedFile(null);
      setDescription("");
      setShowUpload(false);
      // Reset kedua input agar onChange bisa terpicu lagi
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (dropZoneInputRef.current) dropZoneInputRef.current.value = "";
      fetchFiles();
      fetchStorage();
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal upload file", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/files/${id}`);
      showToast("File berhasil dihapus");
      setFiles((prev) => prev.filter((f) => f.id !== id));
      fetchStorage();
    } catch {
      showToast("Gagal menghapus file", "error");
    }
    setDeleteConfirm(null);
  };

  const handleDownload = async (file) => {
    try {
      const res = await api.get(`/files/download/${file.id}`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.originalName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      showToast("Gagal mengunduh file", "error");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setShowUpload(true);
    }
  };

  const filteredFiles = files.filter(
    (f) =>
      f.originalName.toLowerCase().includes(search.toLowerCase()) ||
      f.description?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="min-h-screen bg-paper">
      {/* Navbar */}
      <nav className="border-b border-border bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center">
              <FileText size={16} className="text-paper" />
            </div>
            <span className="font-display font-bold text-xl text-ink">
              DocVault
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="font-body font-medium text-sm text-ink">
                {user?.name}
              </span>
              <span className="font-body text-xs text-muted">
                {user?.email}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-muted hover:text-ink transition-colors font-body text-sm"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="animate-fade-in">
            <h1 className="font-display font-bold text-3xl text-ink">
              Dokumenku
            </h1>
            <p className="font-body text-muted mt-1">
              {files.length} file · {formatFileSize(totalSize)} digunakan
            </p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="btn-primary flex items-center gap-2 animate-fade-in"
          >
            <Plus size={18} />
            Upload File
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {[
            { label: "Total File", value: files.length },
            {
              label: "PDF",
              value: files.filter((f) => f.icon === "pdf").length,
            },
            {
              label: "Dokumen",
              value: files.filter((f) =>
                ["word", "excel", "ppt"].includes(f.icon),
              ).length,
            },
            { label: "Ukuran Total", value: formatFileSize(totalSize) },
          ].map(({ label, value }, i) => (
            <div
              key={i}
              className={`card p-5 animate-fade-in stagger-${i + 1}`}
            >
              <p className="font-body text-muted text-xs mb-1">{label}</p>
              <p className="font-display font-bold text-2xl text-ink">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Storage Bar */}
        <div className="mb-8">
          <StorageBar storage={storage} />
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11"
            placeholder="Cari file berdasarkan nama atau deskripsi..."
          />
        </div>

        {/* Drop zone */}
        <div
          ref={dropRef}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => {
            dropZoneInputRef.current?.click();
          }}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 mb-6
            ${dragOver ? "border-accent bg-accent/5 scale-[1.01]" : "border-border hover:border-muted hover:bg-surface"}`}
        >
          <Upload
            size={28}
            className={`mx-auto mb-3 ${dragOver ? "text-accent" : "text-muted"}`}
          />
          <p className="font-body font-medium text-ink text-sm">
            Drag & drop file ke sini, atau klik untuk memilih
          </p>
          <p className="font-body text-muted text-xs mt-1">
            PDF, Word, Excel, PPT, Gambar, Video, Audio, Arsip — Maks. 100MB per
            file
          </p>
          <input
            ref={dropZoneInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg,.gif,.webp,.mp4,.avi,.mov,.mkv,.mp3,.wav,.ogg,.zip,.rar,.7z,.gz,.json,.csv"
            onChange={(e) => {
              if (e.target.files[0]) {
                setSelectedFile(e.target.files[0]);
                setShowUpload(true);
                e.target.value = ""; // reset agar file yang sama bisa dipilih lagi
              }
            }}
          />
        </div>

        {/* File list */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <RefreshCw size={24} className="text-muted animate-spin" />
            <p className="font-body text-muted">Memuat file...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center">
              <File size={28} className="text-muted" />
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-xl text-ink mb-1">
                {search ? "File tidak ditemukan" : "Belum ada file"}
              </p>
              <p className="font-body text-muted text-sm">
                {search
                  ? "Coba kata kunci lain"
                  : "Upload file pertamamu menggunakan tombol di atas"}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFiles.map((file, i) => (
              <div
                key={file.id}
                className={`card p-4 flex items-center gap-4 hover:shadow-md transition-all duration-200 animate-fade-in`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <FileIcon icon={file.icon} />
                <div className="flex-1 min-w-0">
                  <p className="font-body font-medium text-ink truncate">
                    {file.originalName}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="font-body text-xs text-muted">
                      {formatFileSize(file.size)}
                    </span>
                    <span className="text-border">·</span>
                    <span className="font-body text-xs text-muted">
                      {formatDate(file.uploadedAt)}
                    </span>
                    {file.description && (
                      <>
                        <span className="text-border">·</span>
                        <span className="font-body text-xs text-muted truncate">
                          {file.description}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDownload(file)}
                    className="p-2 rounded-lg text-muted hover:text-ink hover:bg-surface transition-colors"
                    title="Download"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(file)}
                    className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-2xl text-ink">
                Upload File
              </h2>
              <button
                onClick={() => {
                  setShowUpload(false);
                  setSelectedFile(null);
                  setDescription("");
                  if (fileInputRef.current) fileInputRef.current.value = "";
                  if (dropZoneInputRef.current) dropZoneInputRef.current.value = "";
                }}
                className="p-2 rounded-lg text-muted hover:text-ink hover:bg-surface transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Storage info di modal */}
            {storage && (
              <div className="mb-5 p-3 bg-surface rounded-xl">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-body text-xs text-muted flex items-center gap-1">
                    <HardDrive size={12} /> Storage
                  </span>
                  <span className="font-body text-xs text-muted">
                    {formatFileSize(storage.used)} /{" "}
                    {formatFileSize(storage.limit)}
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${storage.usedPercent >= 95 ? "bg-red-500" : storage.usedPercent >= 80 ? "bg-amber-400" : "bg-ink"}`}
                    style={{ width: `${Math.min(storage.usedPercent, 100)}%` }}
                  />
                </div>
                <p className="font-body text-xs text-muted mt-1">
                  Sisa: {formatFileSize(storage.remaining)}
                </p>
              </div>
            )}

            {selectedFile ? (
              <div className="bg-surface rounded-xl p-4 mb-5 flex items-center gap-3">
                <FileText size={20} className="text-accent shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-body font-medium text-ink text-sm truncate">
                    {selectedFile.name}
                  </p>
                  <p className="font-body text-muted text-xs">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-muted hover:text-ink"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all mb-5"
              >
                <Upload size={24} className="mx-auto mb-2 text-muted" />
                <p className="font-body text-ink font-medium text-sm">
                  Klik untuk pilih file
                </p>
                <p className="font-body text-muted text-xs mt-1">
                  Maks. 100MB per file
                </p>
              </div>
            )}

            {/* Hidden input khusus modal */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg,.gif,.webp,.mp4,.avi,.mov,.mkv,.mp3,.wav,.ogg,.zip,.rar,.7z,.gz,.json,.csv"
              onChange={(e) => {
                if (e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                  e.target.value = ""; // reset agar file yang sama bisa dipilih lagi
                }
              }}
            />

            <div className="mb-6">
              <label className="font-body font-medium text-sm text-ink mb-1.5 block">
                Deskripsi{" "}
                <span className="text-muted font-normal">(opsional)</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
                placeholder="Contoh: Laporan bulanan Januari 2024"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowUpload(false);
                  setSelectedFile(null);
                  setDescription("");
                  if (fileInputRef.current) fileInputRef.current.value = "";
                  if (dropZoneInputRef.current) dropZoneInputRef.current.value = "";
                }}
                className="btn-ghost flex-1"
              >
                Batal
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="btn-primary flex-1"
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
                    Mengupload...
                  </span>
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl animate-slide-up">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h2 className="font-display font-bold text-xl text-ink text-center mb-2">
              Hapus File?
            </h2>
            <p className="font-body text-muted text-sm text-center mb-6">
              "
              <span className="text-ink font-medium">
                {deleteConfirm.originalName}
              </span>
              " akan dihapus permanen.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn-ghost flex-1"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="btn-danger flex-1 py-3"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
