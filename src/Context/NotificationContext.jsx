import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { useAuth } from './AuthContext'
import {
  getNotifications as apiGetNotifications,
  markAsRead as apiMarkAsRead,
  markAllAsRead as apiMarkAllAsRead,
  deleteNotification as apiDeleteNotification,
  clearAllNotifications as apiClearAllNotifications,
} from '../api/notifications.api'

const NotificationContext = createContext(null)

const normalizeNotification = (item) => {
  const id = item._id || item.id || `notif-${Math.random()}`
  const createdDate = item.createdAt ? new Date(item.createdAt) : item.timestamp ? new Date(item.timestamp) : new Date()

  const diffMs = Date.now() - createdDate.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  let timeStr = 'Just now'
  if (diffDays > 0) timeStr = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  else if (diffHours > 0) timeStr = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  else if (diffMins > 0) timeStr = `${diffMins} min${diffMins > 1 ? 's' : ''} ago`

  const category = (item.category || item.type || 'inventory').toLowerCase()
  let notifType = 'info'
  if (item.productType) {
    const pType = String(item.productType).toLowerCase()
    if (pType.includes('out') || pType.includes('low') || pType.includes('write')) notifType = 'warning'
    else if (pType.includes('in') || pType.includes('add')) notifType = 'success'
  } else if (item.type) {
    notifType = item.type
  }

  return {
    id,
    _id: id,
    title: item.title || item.productType || (item.category ? item.category.toUpperCase() : 'Notification'),
    message: item.message || item.details || `${item.productType || 'Notification'} item recorded`,
    time: item.time || timeStr,
    timestamp: createdDate.toISOString(),
    category,
    type: notifType,
    read: Boolean(item.read ?? item.isRead ?? false),
    roles: item.roles || ['all'],
    quantity: item.quantity,
    price: item.price,
    raw: item,
  }
}

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const userRole = (currentUser?.role || 'user').toLowerCase()
  const [isLoading, setIsLoading] = useState(false)
  const [notifications, setNotifications] = useState([])

  // Fetch notifications from API without local storage
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true)
    try {
      const type = currentUser?.role?.toLowerCase() || 'user'
      console.log(type)
      const response = await apiGetNotifications(type)
      console.log('Notifications API response:', response)
      let apiItems = []

      if (response && !response.error) {
        if (Array.isArray(response)) {
          apiItems = response.notifications
        } else if (response?.data && Array.isArray(response.data)) {
          apiItems = response.notifications
        } else {
          apiItems = response.notifications
        }
      }
      console.log("apiItems",apiItems)

      if (apiItems.length > 0) {
        const normalized = apiItems.map(normalizeNotification)
        console.log("Normalized",normalized)
        setNotifications(normalized)
      } else {
        setNotifications([])
      }
    } catch (err) {
      console.error('Error fetching notifications from API:', err)
    } finally {
      setIsLoading(false)
    }
  }, [currentUser?.role])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    )
    try {
      const type = currentUser?.role?.toLowerCase() || 'user'
      await apiMarkAllAsRead(type)
    } catch (e) {
      console.error('Failed to mark all as read on server', e)
    }
  }, [currentUser?.role])

  // Execute fetchNotifications on mount
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Filter notifications relevant to current user role
  const roleNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (!n.roles || n.roles.length === 0) return true
      return n.roles.includes(userRole) || n.roles.includes('all') || userRole === 'admin'
    })
  }, [notifications, userRole])

  const unreadCount = useMemo(() => {
    return roleNotifications.filter((n) => !n.read).length
  }, [roleNotifications])

  const markAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id || n._id === id ? { ...n, read: true } : n))
    )
    const type = currentUser?.role?.toLowerCase() || 'user'
    try {
      await apiMarkAsRead(id, type)
    } catch (e) {
      console.error('Failed to mark notification as read on server', e)
    }
  }

  const markAsUnread = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id || n._id === id ? { ...n, read: false } : n))
    )
  }

  const deleteNotification = async (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id && n._id !== id))
    try {
      await apiDeleteNotification(id)
    } catch (e) {
      console.error('Failed to delete notification on server', e)
    }
  }

  const clearAllNotifications = async () => {
    setNotifications([])
    try {
      await apiClearAllNotifications()
    } catch (e) {
      console.error('Failed to clear notifications on server', e)
    }
  }

  const addNotification = (newNotif) => {
    const item = {
      id: `n-${Date.now()}`,
      title: newNotif.title || 'Notification',
      message: newNotif.message || '',
      time: 'Just now',
      timestamp: new Date().toISOString(),
      category: newNotif.category || 'system',
      type: newNotif.type || 'info',
      read: false,
      roles: newNotif.roles || ['all'],
    }
    setNotifications((prev) => [item, ...prev])
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications: roleNotifications,
        allRawNotifications: notifications,
        unreadCount,
        isLoading,
        refreshNotifications: fetchNotifications,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        addNotification,
        userRole,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
