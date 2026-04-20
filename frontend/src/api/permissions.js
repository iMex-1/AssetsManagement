import client from './client'

export const getPermissions = () => client.get('/permissions')
export const getPermission = (id) => client.get(`/permissions/${id}`)
export const createPermission = (data) => client.post('/permissions', data)
export const updatePermission = (id, data) => client.put(`/permissions/${id}`, data)
export const deletePermission = (id) => client.delete(`/permissions/${id}`)
