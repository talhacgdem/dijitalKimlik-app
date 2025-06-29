import { Colors } from '../constants/Colors';
import { useThemeContext } from '../contexts/ThemeContext';

const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

const fontSizes = {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
};

const borderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
};

export function useTheme() {
    const { colorScheme } = useThemeContext();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

    return {
        colors,
        spacing,
        fontSizes,
        borderRadius,
    };
}