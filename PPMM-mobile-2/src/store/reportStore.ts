import { create } from 'zustand';
import api from '../api/axios';
import { PublicReport, Category, Comment, ReportStatus } from '../types';
import { Platform } from 'react-native';
import { useAuthStore } from './authStore';

interface ReportState {
  reports: PublicReport[];
  myReports: PublicReport[];
  categories: Category[];
  currentReport: PublicReport | null;
  comments: Comment[];
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;

  fetchReports: (filters?: { categoryId?: number; search?: string }) => Promise<void>;
  fetchMyReports: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchReportDetails: (id: number) => Promise<void>;
  createReport: (
    header: string,
    body: string,
    categoryId: number,
    imageUri?: string,
    location?: { latitude: number; longitude: number; name?: string }
  ) => Promise<boolean>;
  fetchComments: (reportId: number) => Promise<void>;
  addComment: (reportId: number, body: string) => Promise<boolean>;
  clearError: () => void;
}

export const useReportStore = create<ReportState>((set, get) => ({
  reports: [],
  myReports: [],
  categories: [],
  currentReport: null,
  comments: [],
  isLoading: false,
  isActionLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchReports: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      let url = '/reports';
      const params: any = {};
      if (filters?.categoryId) {
        params.category_id = filters.categoryId;
      }
      if (filters?.search) {
        params.search = filters.search;
      }
      
      const response = await api.get<any[]>(url, { params });
      // Map flat backend properties to nested objects expected by TS types
      const mappedReports = response.data.map((r: any) => ({
        ...r,
        user: r.user ? r.user : { username: r.username || 'Warga', email: '' },
        category: r.category ? r.category : { category_name: r.category_name || 'Laporan' }
      }));
      // Sort reports by created_at descending (latest first)
      const sortedReports = mappedReports.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      set({ reports: sortedReports, error: null });
    } catch (err: any) {
      console.error('Error fetching reports:', err);
      set({ error: 'Gagal memuat laporan. Silakan coba lagi.' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMyReports: async () => {
    set({ isLoading: true, error: null });
    try {
      // Backend endpoint to get logged in user's reports. 
      // If it doesn't exist, we fallback to filtering reports by user_id locally or fetching from '/reports/my'
      try {
        const response = await api.get<any[]>('/reports/my');
        const mapped = response.data.map((r: any) => ({
          ...r,
          user: r.user ? r.user : { username: r.username || 'Warga', email: '' },
          category: r.category ? r.category : { category_name: r.category_name || 'Laporan' }
        }));
        const sorted = mapped.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        set({ myReports: sorted });
      } catch (e) {
        // Fallback: If '/reports/my' is not supported, we fetch all reports and filter by current user locally
        console.warn('API /reports/my failed, falling back to local filter.');
        const currentUser = useAuthStore.getState().user;
        const filtered = get().reports.filter((r) => r.user_id === currentUser?.id || r.user?.username === currentUser?.username);
        set({ myReports: filtered });
      }
    } catch (err: any) {
      console.error('Error fetching user reports:', err);
      set({ error: 'Gagal memuat riwayat laporan Anda.' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const response = await api.get<Category[]>('/categories');
      set({ categories: response.data });
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Fallback categories from SQL if API fails
      set({
        categories: [
          { id: 1, category_name: 'Infrastruktur' },
          { id: 2, category_name: 'Kebersihan' },
          { id: 3, category_name: 'Keamanan' },
          { id: 4, category_name: 'Fasilitas Umum' },
          { id: 5, category_name: 'Pelayanan Publik' },
        ],
      });
    }
  },

  fetchReportDetails: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<any>(`/reports/${id}`);
      const rawData = response.data;
      const mappedReport: PublicReport = {
        ...rawData,
        user: rawData.user ? rawData.user : { username: rawData.username || 'Warga', email: '' },
        category: rawData.category ? rawData.category : { category_name: rawData.category_name || 'Laporan' }
      };
      set({ currentReport: mappedReport, error: null });
    } catch (err: any) {
      console.error(`Error fetching report details for id ${id}:`, err);
      set({ error: 'Gagal memuat detail laporan.' });
    } finally {
      set({ isLoading: false });
    }
  },

  createReport: async (header, body, categoryId, imageUri, location) => {
    set({ isActionLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('header', header);
      formData.append('body', body);
      formData.append('category_id', String(categoryId));

      if (imageUri) {
        const filename = imageUri.split('/').pop() || 'complaint_image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        // We cast to any for React Native FormData file compatibility
        formData.append('image', {
          uri: Platform.OS === 'android' ? imageUri : imageUri.replace('file://', ''),
          name: filename,
          type,
        } as any);
      }

      if (location) {
        formData.append('latitude', String(location.latitude));
        formData.append('longitude', String(location.longitude));
        if (location.name) {
          formData.append('location_name', location.name);
        }
      }

      await api.post('/reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Refetch reports list after successful post
      get().fetchReports();
      return true;
    } catch (err: any) {
      console.error('Error creating report:', err);
      const errorMsg = err.response?.data?.message || 'Gagal mengirim laporan. Silakan periksa data Anda.';
      set({ error: errorMsg });
      return false;
    } finally {
      set({ isActionLoading: false });
    }
  },

  fetchComments: async (reportId) => {
    try {
      const response = await api.get<any[]>(`/comments/${reportId}`);
      const mappedComments: Comment[] = response.data.map((c: any) => ({
        ...c,
        user: c.user ? c.user : { username: c.username || 'Anonim', email: '', role: 'user' }
      }));
      set({ comments: mappedComments });
    } catch (err) {
      console.error(`Error fetching comments for report ${reportId}:`, err);
      // Fallback empty comments if endpoint is not fully ready
      set({ comments: [] });
    }
  },

  addComment: async (reportId, body) => {
    set({ isActionLoading: true, error: null });
    try {
      await api.post('/comments', { body, public_report_id: reportId });
      // Refetch comments list
      get().fetchComments(reportId);
      return true;
    } catch (err: any) {
      console.error(`Error adding comment to report ${reportId}:`, err);
      const errorMsg = err.response?.data?.message || 'Gagal menambahkan komentar.';
      set({ error: errorMsg });
      return false;
    } finally {
      set({ isActionLoading: false });
    }
  },
}));
