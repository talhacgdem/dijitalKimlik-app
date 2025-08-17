// AlertDialog.tsx
import React from 'react';

interface AlertDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    details?: string[];
    type?: 'error' | 'warning' | 'info';
    onClose: () => void;
}

export const DKAlertDialog: React.FC<AlertDialogProps> = ({
                                                            isOpen,
                                                            title,
                                                            message,
                                                            details = [],
                                                            type = 'error',
                                                            onClose
                                                        }) => {
    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'error':
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    icon: 'text-red-400',
                    button: 'bg-red-600 hover:bg-red-700'
                };
            case 'warning':
                return {
                    bg: 'bg-yellow-50',
                    border: 'border-yellow-200',
                    icon: 'text-yellow-400',
                    button: 'bg-yellow-600 hover:bg-yellow-700'
                };
            default:
                return {
                    bg: 'bg-blue-50',
                    border: 'border-blue-200',
                    icon: 'text-blue-400',
                    button: 'bg-blue-600 hover:bg-blue-700'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    {/* Header */}
                    <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${styles.bg}`}>
                        <svg
                            className={`h-6 w-6 ${styles.icon}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>

                    {/* Title */}
                    <div className="mt-5 text-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {title}
                        </h3>

                        {/* Message */}
                        <div className="mt-2 px-7 py-3">
                            <p className="text-sm text-gray-500 mb-3">
                                {message}
                            </p>

                            {/* Error Details List */}
                            {details.length > 0 && (
                                <div className={`mt-3 p-3 rounded-md ${styles.bg} ${styles.border}`}>
                                    <h4 className="text-sm font-medium text-gray-800 mb-2">
                                        Detaylar:
                                    </h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        {details.map((detail, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-gray-400 mt-2 mr-2"></span>
                                                <span>{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Button */}
                        <div className="items-center px-4 py-3">
                            <button
                                onClick={onClose}
                                className={`px-4 py-2 ${styles.button} text-white text-base font-medium rounded-md w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2`}
                            >
                                Tamam
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
