export const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
  <div className="modal-overlay">
    <div className="modal modal-narrow">
      <h3 className="modal-title">Подтверждение</h3>
      <p className="modal-text">{message}</p>
      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Отмена
        </button>
        <button type="button" className="btn btn-danger" onClick={onConfirm}>
          Подтвердить
        </button>
      </div>
    </div>
  </div>
);
