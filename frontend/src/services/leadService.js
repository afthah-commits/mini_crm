import api from './api'

export const getDashboard = async () => {
  const { data } = await api.get('/dashboard')
  return data
}

export const getLeads = async (params) => {
  const { data } = await api.get('/leads', { params })
  return data
}

export const createLead = async (payload) => {
  const { data } = await api.post('/leads', payload)
  return data
}

export const updateLead = async (leadId, payload) => {
  const { data } = await api.put(`/leads/${leadId}`, payload)
  return data
}

export const deleteLead = async (leadId) => {
  await api.delete(`/leads/${leadId}`)
}

export const addLeadNote = async (leadId, payload) => {
  const { data } = await api.post(`/leads/${leadId}/notes`, payload)
  return data
}

export const getTodayFollowUps = async () => {
  const { data } = await api.get('/leads/followups/today')
  return data
}

export const getOverdueFollowUps = async () => {
  const { data } = await api.get('/leads/followups/overdue')
  return data
}
