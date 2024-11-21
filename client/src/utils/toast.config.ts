import { ToastOptions } from 'react-toastify';

export const toastConfig: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  style: {
    borderRadius: '8px',
    fontWeight: '500',
  }
};

export const successToast: ToastOptions = {
  ...toastConfig,
  style: {
    ...toastConfig.style,
    background: '#4caf50',
    color: 'white',
  }
};

export const errorToast: ToastOptions = {
  ...toastConfig,
  style: {
    ...toastConfig.style,
    background: '#f44336',
    color: 'white',
  }
};

export const warningToast: ToastOptions = {
  ...toastConfig,
  style: {
    ...toastConfig.style,
    background: '#ff9800',
    color: 'white',
  }
}; 