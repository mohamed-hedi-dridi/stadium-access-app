import { useState, useCallback } from 'react';
import { SweetAlertProps } from './SweetAlert';

export interface SweetAlertOptions {
  title?: string;
  text?: string;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  allowOutsideClick?: boolean;
  showCloseButton?: boolean;
}

export interface SweetAlertHook {
  showAlert: (options: SweetAlertOptions) => Promise<boolean>;
  showSuccess: (title: string, text?: string) => Promise<boolean>;
  showError: (title: string, text?: string) => Promise<boolean>;
  showWarning: (title: string, text?: string) => Promise<boolean>;
  showInfo: (title: string, text?: string) => Promise<boolean>;
  showConfirm: (title: string, text?: string) => Promise<boolean>;
  alertProps: SweetAlertProps;
}

export const useSweetAlert = (): SweetAlertHook => {
  const [alertProps, setAlertProps] = useState<SweetAlertProps>({
    visible: false,
  });

  const showAlert = useCallback((options: SweetAlertOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setAlertProps({
        visible: true,
        ...options,
        onConfirm: () => {
          resolve(true);
        },
        onCancel: () => {
          resolve(false);
        },
        onClose: () => {
          setAlertProps(prev => ({ ...prev, visible: false }));
          resolve(false);
        },
      });
    });
  }, []);

  const showSuccess = useCallback((title: string, text?: string): Promise<boolean> => {
    return showAlert({
      title,
      text,
      icon: 'success',
      confirmButtonColor: '#27ae60',
    });
  }, [showAlert]);

  const showError = useCallback((title: string, text?: string): Promise<boolean> => {
    return showAlert({
      title,
      text,
      icon: 'error',
      confirmButtonColor: '#e74c3c',
    });
  }, [showAlert]);

  const showWarning = useCallback((title: string, text?: string): Promise<boolean> => {
    return showAlert({
      title,
      text,
      icon: 'warning',
      confirmButtonColor: '#f39c12',
    });
  }, [showAlert]);

  const showInfo = useCallback((title: string, text?: string): Promise<boolean> => {
    return showAlert({
      title,
      text,
      icon: 'info',
      confirmButtonColor: '#3498db',
    });
  }, [showAlert]);

  const showConfirm = useCallback((title: string, text?: string): Promise<boolean> => {
    return showAlert({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });
  }, [showAlert]);

  return {
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    alertProps,
  };
};
