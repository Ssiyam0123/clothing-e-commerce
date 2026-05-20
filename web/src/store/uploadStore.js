import { create } from 'zustand';

export const useUploadStore = create((set) => ({
  progress: 0,
  isUploading: false,
  uploadName: '',
  setProgress: (progress) => set({ progress }),
  startUpload: (name = 'Saving changes...') => set({ isUploading: true, progress: 0, uploadName: name }),
  endUpload: () => set({ isUploading: false, progress: 0, uploadName: '' }),
}));
