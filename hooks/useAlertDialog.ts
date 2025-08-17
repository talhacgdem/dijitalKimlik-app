// useAlertDialog.ts
import { useState } from 'react';

interface AlertDialogState {
    isOpen: boolean;
    title: string;
    message: string;
    details: string[];
    type: 'error' | 'warning' | 'info';
}

export const useAlertDialog = () => {
    const [alertState, setAlertState] = useState<AlertDialogState>({
        isOpen: false,
        title: '',
        message: '',
        details: [],
        type: 'error'
    });

    const showAlert = (config: Partial<AlertDialogState>) => {
        setAlertState({
            isOpen: true,
            title: config.title || 'Bilgi',
            message: config.message || '',
            details: config.details || [],
            type: config.type || 'error'
        });
    };

    const hideAlert = () => {
        setAlertState(prev => ({ ...prev, isOpen: false }));
    };

    return {
        alertState,
        showAlert,
        hideAlert
    };
};
