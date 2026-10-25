import { useEffect } from 'react';

export const Alert = ({ type = 'info', message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration <= 0) return undefined;

    const timer = setTimeout(onClose, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return <div className={`alert alert-${type}`}>{message}</div>;
};
