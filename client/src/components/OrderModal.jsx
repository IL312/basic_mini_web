import { useState } from 'react';
import { createOrder, updateOrder } from '@/api/ordersApi';

const EMPTY_FORM = {
  client_id: '',
  title: '',
  order_date: '',
  quantity: '',
  amount: '',
};

const toForm = (order) =>
  order
    ? {
        client_id: String(order.client_id),
        title: order.title,
        order_date: order.order_date,
        quantity: String(order.quantity),
        amount: String(order.amount),
      }
    : EMPTY_FORM;

const validate = (form) => {
  const errors = {};

  if (!form.client_id) {
    errors.client_id = 'Выберите клиента';
  }

  if (!form.title.trim()) {
    errors.title = 'Укажите название заказа';
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(form.order_date)) {
    errors.order_date = 'Укажите дату в формате ГГГГ-ММ-ДД';
  }

  const quantity = Number(form.quantity);

  if (!Number.isInteger(quantity) || quantity <= 0) {
    errors.quantity = 'Количество должно быть целым числом больше 0';
  }

  const amount = Number(form.amount);

  if (!Number.isFinite(amount) || amount < 0) {
    errors.amount = 'Сумма должна быть числом не меньше 0';
  }

  return errors;
};

export const OrderModal = ({ order, clients, onClose, onSuccess, onError }) => {
  const [form, setForm] = useState(() => toForm(order));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validate(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      client_id: Number(form.client_id),
      title: form.title.trim(),
      order_date: form.order_date,
      quantity: Number(form.quantity),
      amount: Number(form.amount),
    };

    setSaving(true);

    try {
      if (order) {
        await updateOrder(order.id, payload);
        onSuccess('Заказ обновлён');
      } else {
        await createOrder(payload);
        onSuccess('Заказ добавлен');
      }

      onClose();
    } catch (error) {
      onError(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3 className="modal-title">{order ? 'Изменить заказ' : 'Добавить заказ'}</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="order-client">Клиент</label>
            <select
              id="order-client"
              name="client_id"
              value={form.client_id}
              onChange={handleChange}
              disabled={saving}
            >
              <option value="">— выберите клиента —</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.full_name}
                </option>
              ))}
            </select>
            {errors.client_id && <p className="form-error">{errors.client_id}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="order-title">Название</label>
            <input
              id="order-title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              disabled={saving}
            />
            {errors.title && <p className="form-error">{errors.title}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="order-date">Дата заказа</label>
            <input
              id="order-date"
              type="date"
              name="order_date"
              value={form.order_date}
              onChange={handleChange}
              disabled={saving}
            />
            {errors.order_date && <p className="form-error">{errors.order_date}</p>}
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="order-quantity">Количество</label>
              <input
                id="order-quantity"
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                min="1"
                step="1"
                disabled={saving}
              />
              {errors.quantity && <p className="form-error">{errors.quantity}</p>}
            </div>
            <div className="form-field">
              <label htmlFor="order-amount">Сумма</label>
              <input
                id="order-amount"
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                disabled={saving}
              />
              {errors.amount && <p className="form-error">{errors.amount}</p>}
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Отмена
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
