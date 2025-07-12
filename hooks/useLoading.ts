// hooks/useLoading.ts
import {useState} from 'react';

export function useLoading(initialState = false) {
    const [loading, setLoading] = useState(initialState);

    const showLoading = (message?: string) => {
        setLoading(true);
    };

    const hideLoading = () => {
        setLoading(false);
    };

    const withLoading = async <T>(
        asyncFunction: () => Promise<T>,
        loadingMessage?: string
    ): Promise<T> => {
        try {
            showLoading(loadingMessage);
            return await asyncFunction();
        } finally {
            hideLoading();
        }
    };

    return {
        loading,
        showLoading,
        hideLoading,
        withLoading,
    };
}
