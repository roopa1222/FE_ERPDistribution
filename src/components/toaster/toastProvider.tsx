import type { ReactNode } from 'react';
import type { VariantType } from 'notistack';

// eslint-disable-next-line import/no-extraneous-dependencies
import { useSnackbar } from 'notistack';
import React, { useMemo, useCallback, createContext } from 'react';

// Define the context type for showToast
type ToastContextType = {
  showToast: (message: string, variant: VariantType, duration?: number) => void;
};

// Default no-op function for showToast to avoid undefined context
const defaultShowToast = (message: string, variant: VariantType, duration = 3000) => {
  // No-op function (default behavior if context is not provided)
};

// Create the context with a default value
const ToastContext = createContext<ToastContextType>({
  showToast: defaultShowToast, // Providing default no-op behavior
});

const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();

  // Defining showToast using useCallback to ensure stability
  const showToast = useCallback(
    (message: string, variant: VariantType, duration = 3000) => {
      enqueueSnackbar(message, { variant, autoHideDuration: duration });
    },
    [enqueueSnackbar]
  );

  // Memoizing the value passed to the context provider to avoid unnecessary re-renders
  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export { ToastContext, ToastProvider };
