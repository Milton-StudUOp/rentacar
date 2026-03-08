import api from '../lib/api';

export interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
}

export const notificationsService = {
    getAll: async () => {
        const response = await api.get<Notification[]>('/notifications');
        return response.data;
    },

    getUnreadCount: async () => {
        const response = await api.get<{ count: number }>('/notifications/unread-count');
        return response.data;
    },

    markAsRead: async (id: number) => {
        const response = await api.patch<Notification>(`/notifications/${id}/read`);
        return response.data;
    },

    markAllAsRead: async () => {
        const response = await api.patch<{ count: number }>('/notifications/read-all');
        return response.data;
    }
};
