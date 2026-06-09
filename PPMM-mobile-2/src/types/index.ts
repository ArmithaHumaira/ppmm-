export interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
  created_at?: string;
}

export interface Category {
  id: number;
  category_name: string;
}

export type ReportStatus = 'pending' | 'approved' | 'rejected' | 'selesai' | 'resolved';

export interface PublicReport {
  id: number;
  header: string;
  body: string;
  user_id: number;
  category_id: number;
  image?: string;
  status: ReportStatus;
  created_at: string;
  // Visual/UI helpers (optional, joined from other tables or generated)
  user?: {
    username: string;
    email: string;
  };
  category?: {
    category_name: string;
  };
  latitude?: number;
  longitude?: number;
  location_name?: string;
}

export interface Comment {
  id: number;
  body: string;
  user_id: number;
  public_report_id: number;
  created_at: string;
  user?: {
    username: string;
    email: string;
    role: string;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}
