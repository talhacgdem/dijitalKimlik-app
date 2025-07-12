// services/ToastManager.ts
interface ToastConfig {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    position?: 'top' | 'center' | 'bottom';
}

class ToastManager {
    private static instance: ToastManager;
    private showToastCallback: ((config: ToastConfig) => void) | null = null;

    static getInstance(): ToastManager {
        if (!ToastManager.instance) {
            ToastManager.instance = new ToastManager();
        }
        return ToastManager.instance;
    }

    // Toast gösterme callback'ini kaydet
    setShowToastCallback(callback: (config: ToastConfig) => void): void {
        this.showToastCallback = callback;
    }

    // Toast gösterme metodları
    show(config: ToastConfig): void {
        if (this.showToastCallback) {
            this.showToastCallback(config);
        }
    }

    success(message: string, options?: Partial<ToastConfig>): void {
        this.show({ message, type: 'success', ...options });
    }

    error(message: string, options?: Partial<ToastConfig>): void {
        this.show({ message, type: 'error', ...options });
    }

    warning(message: string, options?: Partial<ToastConfig>): void {
        this.show({ message, type: 'warning', ...options });
    }

    info(message: string, options?: Partial<ToastConfig>): void {
        this.show({ message, type: 'info', ...options });
    }
}

export const toastManager = ToastManager.getInstance();
