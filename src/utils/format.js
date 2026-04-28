export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getFileExtension = (filename) => {
  return filename.split('.').pop().toUpperCase();
};

export const FILE_ICONS = {
  pdf: '📄',
  word: '📝',
  excel: '📊',
  ppt: '📊',
  image: '🖼️',
  txt: '📃'
};

export const FILE_COLORS = {
  pdf: '#EF4444',
  word: '#2563EB',
  excel: '#16A34A',
  ppt: '#EA580C',
  image: '#9333EA',
  video: '#0891B2',
  audio: '#DB2777',
  zip: '#CA8A04',
  txt: '#6B7280'
};
