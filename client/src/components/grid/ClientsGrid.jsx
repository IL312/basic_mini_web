import { useCallback, useEffect, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { fetchClientsPage } from '@/api/clientsApi';
import { formatDate } from '@/utils/formatDate';
import { formatMoney } from '@/utils/formatMoney';
import { gridTheme } from './gridTheme';

const COLUMNS = [
  { headerName: 'ID', field: 'id', width: 90, sortable: false },
  { headerName: 'ФИО', field: 'full_name', flex: 2, minWidth: 220, sortable: false },
  { headerName: 'Город', field: 'city', flex: 1, minWidth: 180, sortable: false },
  {
    headerName: 'Дата рождения',
    field: 'birth_date',
    width: 150,
    sortable: false,
    valueFormatter: (params) => formatDate(params.value),
  },
  { headerName: 'Баллы', field: 'loyalty_points', width: 110, sortable: false },
  {
    headerName: 'Скидка, %',
    field: 'discount',
    width: 110,
    sortable: false,
    valueFormatter: (params) => formatMoney(params.value),
  },
];

export const ClientsGrid = ({ onClientSelected, onError }) => {
  const mountedRef = useRef(true);
  const onClientSelectedRef = useRef(onClientSelected);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    mountedRef.current = true;
    onClientSelectedRef.current = onClientSelected;
    onErrorRef.current = onError;

    return () => {
      mountedRef.current = false;
    };
  }, [onClientSelected, onError]);

  const datasource = useMemo(
    () => ({
      getRows: (params) => {
        const limit = params.endRow - params.startRow;
        const offset = params.startRow;

        fetchClientsPage(limit, offset)
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

  const handleSelectionChanged = useCallback((event) => {
    const [selected] = event.api.getSelectedRows();
    onClientSelectedRef.current(selected ?? null);
  }, []);

  return (
    <div className="grid-container-large">
      <AgGridReact
        theme={gridTheme}
        rowModelType="infinite"
        cacheBlockSize={30}
        maxBlocksInCache={5}
        datasource={datasource}
        columnDefs={COLUMNS}
        rowSelection={rowSelection}
        onSelectionChanged={handleSelectionChanged}
        overlayLoadingTemplate="<span>Загрузка клиентов...</span>"
        overlayNoRowsTemplate="<span>Клиенты не найдены</span>"
      />
    </div>
  );
};
