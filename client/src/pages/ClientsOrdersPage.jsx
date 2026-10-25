import { useCallback, useEffect, useState } from 'react';
import { fetchAllClients } from '@/api/clientsApi';
import { deleteOrder } from '@/api/ordersApi';
import { Alert } from '@/components/Alert';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { OrderModal } from '@/components/OrderModal';
import { ClientsGrid } from '@/components/grid/ClientsGrid';
import { OrdersGrid } from '@/components/grid/OrdersGrid';

export const ClientsOrdersPage = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalOrder, setModalOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchAllClients(controller.signal)
      .then((response) => setClients(response.data))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setAlert({ type: 'error', message: error.message });
        }
      });

    return () => controller.abort();
  }, []);

  const handleCloseAlert = useCallback(() => setAlert(null), []);

  const handleClientSelected = useCallback((client) => {
    setSelectedClient(client);
    setSelectedOrder(null);
  }, []);

  const handleOrderSelected = useCallback((order) => setSelectedOrder(order), []);

  const handleGridError = useCallback((message) => {
    setAlert({ type: 'error', message });
  }, []);

  const handleOpenCreate = () => {
    setModalOrder(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = () => {
    if (selectedOrder) {
      setModalOrder(selectedOrder);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalOrder(null);
  };

  const handleOpenConfirm = () => {
    if (selectedOrder) {
      setIsConfirmOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    setIsConfirmOpen(false);

    try {
      await deleteOrder(selectedOrder.id);
      setSelectedOrder(null);
      setRefreshKey((key) => key + 1);
      setAlert({ type: 'success', message: 'Заказ удалён' });
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  };

  const handleSuccess = useCallback((message) => {
    setAlert({ type: 'success', message });
    setRefreshKey((key) => key + 1);
  }, []);

  return (
    <>
      <section className="card">
        <div className="card-header">
          <h2 className="card-title">Клиенты</h2>
          <p className="card-subtitle">Выберите клиента, чтобы увидеть его заказы</p>
        </div>
        <div className="card-body">
          <ClientsGrid
            onClientSelected={handleClientSelected}
            onError={handleGridError}
          />
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h2 className="card-title">
            {selectedClient ? `Заказы клиента: ${selectedClient.full_name}` : 'Заказы'}
          </h2>
          <p className="card-subtitle">Добавление, изменение и удаление заказов</p>
        </div>

        <div className="card-body">
          <div className="toolbar">
            <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
              Добавить запись
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleOpenEdit}
              disabled={!selectedOrder}
            >
              Изменить
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleOpenConfirm}
              disabled={!selectedOrder}
            >
              Удалить
            </button>
          </div>

          <OrdersGrid
            clientId={selectedClient ? selectedClient.id : null}
            refreshKey={refreshKey}
            onOrderSelected={handleOrderSelected}
            onError={handleGridError}
          />
        </div>
      </section>

      {isModalOpen && (
        <OrderModal
          order={modalOrder}
          clients={clients}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
          onError={handleGridError}
        />
      )}

      {isConfirmOpen && (
        <ConfirmDialog
          message="Удалить выбранный заказ?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsConfirmOpen(false)}
        />
      )}

      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={handleCloseAlert} />
      )}
    </>
  );
};
