import api from "./http";
import ApiError from './apiError.js';

/**
 * Add a new team member via POST /admin/team
 * @param {Object} data - Payload object or { payload: {...} }
 */
export const addTeam = async (data = {}) => {
    try {
        const payload = data?.payload !== undefined ? data.payload : (data?.data !== undefined ? data.data : data);
        const response = await api.post('/business/team/add', payload);
        const member = response?.data ?? response?.member ?? response;
        return { status: true, success: true, data: member, response };
    } catch (err) {
        if (err instanceof ApiError) {
            return { status: false, success: false, message: err.message, error: err.message };
        }
        return { status: false, success: false, message: err?.message || 'internal server error', error: err?.message || 'internal server error' };
    }
};

/**
 * Get all team members via GET /admin/team
 * @param {Object} params - Query params or { payload: {...} }
 */
export const getTeam = async (params = {}) => {
    try {
        const payload = params?.payload !== undefined ? params.payload : params;
        const response = await api.get('/business/team', { params: payload });
        const data = response?.data ?? response?.team ?? response?.members ?? (Array.isArray(response) ? response : []);
        return { status: true, success: true, data, response };
    } catch (err) {
        if (err instanceof ApiError) {
            return { status: false, success: false, message: err.message, error: err.message };
        }
        return { status: false, success: false, message: err?.message || 'internal server error', error: err?.message || 'internal server error' };
    }
};

/**
 * Remove team member via DELETE /admin/team/:id
 * @param {Object|string} data - { id } or { payload: { id } } or ID string
 */
export const removeTeam = async (data = {}) => {
    try {
        const id = typeof data === 'string' || typeof data === 'number' ? data : (data?.id || data?.payload?.id);
        const response = await api.delete(`/business/team/delete/${id}`);
        return { status: true, success: true, data: response, response };
    } catch (err) {
        if (err instanceof ApiError) {
            return { status: false, success: false, message: err.message, error: err.message };
        }
        return { status: false, success: false, message: err?.message || 'internal server error', error: err?.message || 'internal server error' };
    }
};

/**
 * Update team member via PUT /admin/team/:id
 * @param {Object} data - Update payload or { payload: {...} }
 */
export const updateTeam = async (data = {}) => {
    try {
        const payload = data?.payload !== undefined ? data.payload : data;
        const id = payload?.id || payload?._id || data?.id;
        const response = await api.put(`/business/team/update/${id}`, payload);
        const updated = response?.data ?? response?.member ?? response;
        return { status: true, success: true, data: updated, response };
    } catch (err) {
        if (err instanceof ApiError) {
            return { status: false, success: false, message: err.message, error: err.message };
        }
        return { status: false, success: false, message: err?.message || 'internal server error', error: err?.message || 'internal server error' };
    }
};

const businessApi = { addTeam, getTeam, removeTeam, updateTeam };

export default businessApi;
