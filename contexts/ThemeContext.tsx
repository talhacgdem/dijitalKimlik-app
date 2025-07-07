import React, {createContext, ReactNode, useContext, useState} from 'react';
import {Colors} from '@/constants/Colors';

interface ThemeContextProps {
    colorScheme: 'light' | 'dark';
    toggleColorScheme: () => void;
    colors: typeof Colors['light'] | typeof Colors['dark'];
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({children}: { children: ReactNode }) => {
    const systemColorScheme = 'light';//useSystemColorScheme(); // 'light' | 'dark' | null
    const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(systemColorScheme ?? 'light');
    const colors = Colors[colorScheme];

    // Tema geçişi
    const toggleColorScheme = async () => {
        setColorScheme((prev) => {
            return prev === 'light' ? 'dark' : 'light';
        });
    };

    return (
        <ThemeContext.Provider value={{colorScheme, toggleColorScheme, colors}}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
};
