import { request } from './http';

export const fetchClientsPage = (limit, offset) =>
  request(`/clients?limit=${limit}&offset=${offset}`);

export const fetchAllClients = (signal) =>
  request('/clients/all', { signal });
