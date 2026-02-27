import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL, timeout: 15000 });

// Attach token from localStorage
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('gt_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('gt_token');
        }
        return Promise.reject(err);
    }
);

// ─── Destinations ────────────────────────────────────────────
export const destinationsApi = {
    list: (params?: Record<string, any>) => api.get('/destinations', { params }),
    featured: () => api.get('/destinations/featured'),
    detail: (slug: string) => api.get(`/destinations/${slug}`),
    create: (data: any) => api.post('/destinations', data),
    update: (id: string, data: any) => api.put(`/destinations/${id}`, data),
    delete: (id: string) => api.delete(`/destinations/${id}`),
};

// ─── Packages ────────────────────────────────────────────────
export const packagesApi = {
    list: (params?: Record<string, any>) => api.get('/packages', { params }),
    detail: (id: string) => api.get(`/packages/${id}`),
    create: (data: any) => api.post('/packages', data),
    update: (id: string, data: any) => api.put(`/packages/${id}`, data),
};

// ─── Bookings ────────────────────────────────────────────────
export const bookingsApi = {
    create: (data: any) => api.post('/bookings', data),
    verifyPayment: (id: string, data: any) => api.post(`/bookings/${id}/verify-payment`, data),
    myBookings: () => api.get('/bookings/my'),
    detail: (id: string) => api.get(`/bookings/${id}`),
    all: (params?: Record<string, any>) => api.get('/bookings', { params }),
    updateStatus: (id: string, data: any) => api.patch(`/bookings/${id}/status`, data),
};

// ─── Leads ───────────────────────────────────────────────────
export const leadsApi = {
    create: (data: any) => api.post('/leads', data),
    list: (params?: Record<string, any>) => api.get('/leads', { params }),
    updateStatus: (id: string, data: any) => api.patch(`/leads/${id}/status`, data),
};

// ─── Auth ────────────────────────────────────────────────────
export const authApi = {
    register: (data: any) => api.post('/auth/register', data),
    login: (data: any) => api.post('/auth/login', data),
    me: () => api.get('/auth/me'),
};

// ─── Users ───────────────────────────────────────────────────
export const usersApi = {
    profile: () => api.get('/users/profile'),
    updateProfile: (data: any) => api.patch('/users/profile', data),
    changePassword: (data: any) => api.patch('/users/change-password', data),
};

// ─── AI ──────────────────────────────────────────────────────
export const aiApi = {
    generateItinerary: (data: any) => api.post('/ai/itinerary', data),
    suggestAddOns: (data: any) => api.post('/ai/suggest-addons', data),
    chat: (data: any) => api.post('/ai/chat', data),
    generateDescription: (data: any) => api.post('/ai/description', data),
    generateFaqs: (data: any) => api.post('/ai/faqs', data),
};

// ─── Admin ───────────────────────────────────────────────────
export const adminApi = {
    stats: () => api.get('/admin/stats'),
    revenueChart: (period?: string) => api.get('/admin/revenue-chart', { params: { period } }),
    users: (params?: Record<string, any>) => api.get('/admin/users', { params }),
    userDetail: (id: string) => api.get(`/admin/users/${id}`),
    blockUser: (id: string, isBlocked: boolean) => api.patch(`/admin/users/${id}/block`, { isBlocked }),
};

// ─── Vendors ─────────────────────────────────────────────────
export const vendorsApi = {
    list: (params?: Record<string, any>) => api.get('/vendors', { params }),
    detail: (id: string) => api.get(`/vendors/${id}`),
    create: (data: any) => api.post('/vendors', data),
    update: (id: string, data: any) => api.put(`/vendors/${id}`, data),
    addContactLog: (id: string, data: any) => api.post(`/vendors/${id}/contact-log`, data),
};

// ─── Reviews ─────────────────────────────────────────────────
export const reviewsApi = {
    create: (data: any) => api.post('/reviews', data),
    list: (params?: Record<string, any>) => api.get('/reviews', { params }),
    pending: () => api.get('/reviews/pending'),
    approve: (id: string) => api.patch(`/reviews/${id}/approve`, {}),
};

export default api;
