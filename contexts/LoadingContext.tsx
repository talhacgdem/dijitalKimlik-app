// contexts/LoadingContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
    loading: boolean;
    message: string;
    showLoading: (message?: string) => void;
    hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('Yükleniyor...');

    const showLoading = (msg = 'Yükleniyor...') => {
        setMessage(msg);
        setLoading(true);
    };

    const hideLoading = () => {
        setLoading(false);
    };

    return (
        <LoadingContext.Provider value={{
            loading,
            message,
            showLoading,
            hideLoading,
        }}>
            {children}
        </LoadingContext.Provider>
    );
}

export function useGlobalLoading() {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useGlobalLoading must be used within LoadingProvider');
    }
    return context;
}
