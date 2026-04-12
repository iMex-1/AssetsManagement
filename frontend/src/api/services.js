import client from './client'

export const getServices = () => client.get('/services')
