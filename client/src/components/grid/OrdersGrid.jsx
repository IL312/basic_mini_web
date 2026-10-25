import { useCallback, useEffect, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { fetchOrdersPage } from '@/api/ordersApi';
import { formatDate } from '@/utils/formatDate';
import { formatMoney } from '@/utils/formatMoney';
import { gridTheme } from './gridTheme';

const COLUMNS = [
  { headerName: 'ID', field: 'id', width: 90, sortable: false },
  { headerName: 'Клиент', field: 'client_name', flex: 1, minWidth: 180, sortable: false },
  { headerName: 'Название', field: 'title', flex: 2, minWidth: 220, sortable: false },
  {
    headerName: 'Дата',
    field: 'order_date',
    width: 130,
    sortable: false,
    valueFormatter: (params) => formatDate(params.value),
  },
  { headerName: 'Кол-во', field: 'quantity', width: 100, sortable: false },
  {
    headerName: 'Сумма',
    field: 'amount',
    width: 130,
    sortable: false,
    valueFormatter: (params) => formatMoney(params.value),
  },
];

export const OrdersGrid = ({ clientId, refreshKey, onOrderSelected, onError }) => {
  const gridApiRef = useRef(null);
  const mountedRef = useRef(true);
  const clientIdRef = useRef(clientId);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    mountedRef.current = true;
    onErrorRef.current = onError;

    return () => {
      mountedRef.current = false;
    };
  }, [onError]);

  useEffect(() => {
    clientIdRef.current = clientId;

    gridApiRef.current?.deselectAll();
    gridApiRef.current?.purgeInfiniteCache();

    onOrderSelected(null);
  }, [clientId, refreshKey, onOrderSelected]);

  const datasource = useMemo(
    () => ({
      getRows: (params) => {
        const limit = params.endRow - params.startRow;
        const offset = params.startRow;

        fetchOrdersPage(clientIdRef.current, limit, offset)
          .then((page) => {
            if (!mountedRef.current) return;

            params.successCallback(page.data, page.total);
          })
          .catch((error) => {
            if (!mountedRef.current) return;

            params.failCallback();
            onErrorRef.current(error.message);
          });
      },
    }),
    []
  );

  const rowSelection = useMemo(
    () => ({
      mode: 'singleRow',
      checkboxes: false,
      enableClickSelection: true,
    }),
    []
  );

  const handleGridReady = useCallback((event) => {
    gridApiRef.current = event.api;
  }, []);

  const handleSelectionChanged = useCallback(
    (event) => {
      const [selected] = event.api.getSelectedRows();
      onOrderSelected(selected ?? null);
    },
    [onOrderSelected]
  );

  return (
    <div className="grid-container">
      <AgGridReact
        theme={gridTheme}
        rowModelType="infinite"
        cacheBlockSize={30}
        maxBlocksInCache={5}
        datasource={datasource}
        columnDefs={COLUMNS}
        rowSelection={rowSelection}
        onGridReady={handleGridReady}
        onSelectionChanged={handleSelectionChanged}
        overlayLoadingTemplate="<span>Загрузка заказов...</span>"
        overlayNoRowsTemplate="<span>Заказы не найдены</span>"
      />
    </div>
  );
};
