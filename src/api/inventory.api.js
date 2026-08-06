import axios from 'axios'
import api from './http'
import ApiError from './apiError'

export const addProduct = async ({data}) => {
    try {
        const response = await api.post('/inventory/add-product', {...data})
        return response
    } catch (error) {
        if(error instanceof ApiError) return {error: error.message}
    }
}

export const getProducts = async () => {
    try {
        const response = await api.get('/inventory/get-products')
        return response
    } catch (error) {
        if(error instanceof ApiError) return {error: error.message}
    }
}

export const getOneProduct = async (id) => {
    try {
        const response = await api.get(`/inventory/get-product/${id}`)
        return response
    } catch (error) {
        if(error instanceof ApiError) return {error: error.message}
    }
}

export const updateProduct = async (id) => {
    try {
        const response = await api.patch(`/inventory/update-product/${id}`)
    } catch (error) {
        if(error instanceof ApiError) return {error: error.message}
    }
}

export const deleteProduct = async (id) => {
    try {
        const response = await api.patch(`/inventory/delete-product/${id}`)
    } catch (error) {
        if(error instanceof ApiError) return {error: error.message}
    }
}

