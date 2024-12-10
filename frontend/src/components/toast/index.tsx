import { useToast } from '../../context/ToastContext';

type ToastProps = {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
};

const Toast = ({ message, type = 'info', onClose }: ToastProps) => {
  const { closeToast } = useToast();
  const alertClass =
    type === 'success'
      ? 'alert alert-success'
      : type === 'error'
        ? 'alert alert-error'
        : type === 'warning'
          ? 'alert alert-warning'
          : 'alert alert-info';

  const closeHandler = () => {
    if (onClose) {
      onClose();
    }
    closeToast();
  };

  return (
    <div
      className={`fixed bottom-4 right-4 w-fit alert ${alertClass} shadow-lg transition-all duration-300`}
    >
      <span>{message}</span>
      {onClose && (
        <button
          className="btn btn-sm btn-circle btn-outline"
          onClick={closeHandler}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Toast;
