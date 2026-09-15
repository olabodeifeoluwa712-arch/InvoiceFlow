import http from './http'
import ApiError from './apiError'

export const getAllUsers = async () => {
    try {
        const response = await http.get("/superadmin/")
        const users = response?.users ?? response?.data ?? (Array.isArray(response) ? response : [])
        return { success: true, data: users }
    } catch (err) {
        if (err instanceof ApiError) return { success: false, error: err.message }
        return { success: false, error: err?.message || 'Failed to fetch users' }
    }
}

export const addUser = async (data) => {
    try {
        const payload = data?.newRow !== undefined ? data.newRow : (data?.data !== undefined ? data.data : data)
        const response = await http.post("/superadmin/add-user", payload)
        if (!response) return { success: false, error: 'Failed to add user' }
        const user = response?.user ?? response?.data ?? response
        return { success: true, data: user }
    } catch (err) {
        if (err instanceof ApiError) return { success: false, error: err.message }
        return { success: false, error: err?.message || 'Failed to add user' }
    }
}

export const deleteUser = async (id) => {
    try {
        const response = await http.delete(`/superadmin/delete-user/${id}`)
        if (!response) return { success: false, error: 'Failed to delete user' }
        return { success: true, data: response }
    } catch (err) {
        if (err instanceof ApiError) return { success: false, error: err.message }
        return { success: false, error: err?.message || 'Failed to delete user' }
    }
}