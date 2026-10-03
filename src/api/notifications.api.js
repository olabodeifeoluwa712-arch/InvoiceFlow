import http from "./http";
import ApiError from "./apiError";

export const getNotifications = async (type) => {
    try {

        const response = await http.get(`/notifications/${type}`);
        return response;
    } catch (error) {
       if (error instanceof ApiError) return {error: error.message}
    }
};

export const markAsRead = async (id, type) => {
    try {
        const response = await http.patch(`/notifications/read/${id}/${type}`);
        return response;
    } catch (error) {
        return { error: error?.message || 'Failed to mark notification as read' };
    }
};

export const markAllAsRead = async (type) => {
    try {
        const response = await http.patch(`/notifications/read-all/${type}`);
        return response;
    } catch (error) {
        return { error: error?.message || 'Failed to mark all as read' };
    }
};

export const deleteNotification = async (id) => {
    try {
        const response = await http.delete(`/notifications/delete/${id}`);
        return response;
    } catch (error) {
        return { error: error?.message || 'Failed to delete notification' };
    }
};

export const clearAllNotifications = async () => {
    try {
        const response = await http.delete('/notifications/delete-all');
        return response;
    } catch (error) {
        return { error: error?.message || 'Failed to clear all notifications' };
    }
};
