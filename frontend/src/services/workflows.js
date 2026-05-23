import api from './api';

export const createWorkflow = async (data) => {
  const response = await api.post('/workflows/create', data);
  return response.data;
};

export const getWorkflows = async () => {
  const response = await api.get('/workflows/list');
  return response.data;
};

export const getWorkflow = async (id) => {
  const response = await api.get(`/workflows/${id}`);
  return response.data;
};

export const updateWorkflow = async (id, data) => {
  const response = await api.put(`/workflows/update/${id}`, data);
  return response.data;
};

export const deleteWorkflow = async (id) => {
  const response = await api.delete(`/workflows/delete/${id}`);
  return response.data;
};

export const executeWorkflow = async (id) => {
  const response = await api.post(`/workflows/${id}/execute`);
  return response.data;
};
