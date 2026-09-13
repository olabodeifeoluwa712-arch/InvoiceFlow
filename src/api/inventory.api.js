import axios from 'axios'
import api from './http'
import ApiError from './apiError'

export const addProduct = async (data) => {
    try {
        const payload = data?.data !== undefined ? data.data : data
        const response = await api.post('/inventory/add-product', payload)
        return response
    } catch (error) {
        if(error instanceof ApiError) return {error: error.message}
        return {error: error?.message || 'Failed to add product'}
    }
}

export const getProducts = async () => {
    try {
        const response = await api.get('/inventory/get-products')
        console.log(response)
        return response
    } catch (error) {
        if(error instanceof ApiError) return {error: error.message}
        return {error: error?.message || 'Failed to fetch products'}
    }
}

export const getOneProduct = async (id) => {
    try {
        const response = await api.get(`/inventory/get-product/${id}`)
        return response
    } catch (error) {
        if(error instanceof ApiError) return {error: error.message}
        return {error: error?.message || 'Failed to fetch product'}
    }
}

export const updateProduct = async (id, data) => {
    try {
        const payload = data?.data !== undefined ? data.data : data
        const response = await api.patch(`/inventory/update-product/${id}`, payload)
        return response
    } catch (error) {
        if(error instanceof ApiError) return {error: error.message}
        return {error: error?.message || 'Failed to update product'}
    }
}

export const adjustStock = async (id, data) => {
    try {
        const payload = data?.data !== undefined ? data.data : data
        const response = await api.patch(`/inventory/adjust/${id}`, payload)
        return response
    } catch (error) {
        if(error instanceof ApiError) return {error: error.message}
        return {error: error?.message || 'Failed to adjust stock'}
    }
}

export const deleteProduct = async (id) => {
    try {
        const response = await api.delete(`/inventory/delete-product/${id}`)
        return response
    } catch (error) {
        if(error instanceof ApiError) return {error: error.message}
        return {error: error?.message || 'Failed to delete product'}
    }
}

export const getTotalStockValue = async () => {
    try {
        const response = await api.get('/inventory/total-stock-value')
        console.log('getTotalStockValue API Response:', response)
        return response
    } catch (error) {
        if(error instanceof ApiError) return {error: error.message}
        return {error: error?.message || 'Failed to fetch total stock value'}
    }
}

export const chartData = async () => {
    try {
        const response = await api.get('/inventory/stock')
        console.log(response)
        return { response: response.chartData, error: response.error}
    } catch (error) {
        if(error instanceof ApiError) return {response: [], error: error.message}
        return {response: [], error: error?.message || 'Failed to fetch chart data'}
    }
}

export const getStockHistory = async () => {
    try {
        const response = await api.get('/inventory/history')
        console.log('getStockHistory API response:', response)
        return response
    } catch (error) {
        if(error instanceof ApiError) return {error: error.message}
        return {error: error?.message || 'Failed to fetch stock history'}
    }
}

