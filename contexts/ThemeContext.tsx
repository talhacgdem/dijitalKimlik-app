import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Appearance } from 'react-native';

interface ThemeContextProps {
    colorScheme: 'light' | 'dark';
    toggleColorScheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const systemColorScheme = Appearance.getColorScheme();
    const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(systemColorScheme ?? 'light');

    const toggleColorScheme = () => {
        setColorScheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
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