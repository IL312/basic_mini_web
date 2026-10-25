import { request } from './http';

export const fetchOrdersPage = (clientId, limit, offset) => {
  const params = new URLSearchParams({ limit, offset });

  if (clientId) params.set('clientId', clientId);

  return request(`/orders?${params}`);
};

export const fetchOrderById = (id) => request(`/orders/${id}`);

export const createOrder = (data) =>
  request('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateOrder = (id, data) =>
  request(`/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteOrder = (id) =>
  request(`/orders/${id}`, {
    method: 'DELETE',
  });
