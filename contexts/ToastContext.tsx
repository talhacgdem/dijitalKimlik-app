import React, { useState, useCallback, useEffect } from 'react';
import DKToast from '@/components/dk/Toast';
import { toastManager } from '@/services/ToastManager';

interface ToastConfig {
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration: number;
    position: 'top' | 'center' | 'bottom';
}

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toastConfig, setToastConfig] = useState<ToastConfig>({
        visible: false,
        message: '',
        type: 'info',
        duration: 3000,
        position: 'center',
    });

    const showToast = useCallback((config: Partial<Omit<ToastConfig, 'visible'>>) => {
        setToastConfig(prev => ({
            ...prev,
            ...config,
            visible: true,
        }));
    }, []);

    const hideToast = useCallback(() => {
        setToastConfig(prev => ({ ...prev, visible: false }));
    }, []);

    useEffect(() => {
        // ToastManager'a callback'i kaydet
        toastManager.setShowToastCallback(showToast);
    }, [showToast]);

    return (
        <>
            {children}
        <DKToast
    {...toastConfig}
    onHide={hideToast}
    />
    </>
);
};

export default ToastProvider;
