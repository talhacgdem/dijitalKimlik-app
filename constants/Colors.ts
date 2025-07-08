/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    secondaryText: '#687076',
    background: '#fff',
    inactiveBackground: '#aaaaaa',
    cardBackground: '#aaaaaa',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    error: '#FF3B30',
    success: '#08ff00',
    warning: '#ffae00',
    border: '#ffae00',
  },
  dark: {
    text: '#ECEDEE',
    secondaryText: '#687076',
    background: '#151718',
    inactiveBackground: '#aaaaaa',
    cardBackground: '#aaaaaa',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    error: '#FF3B30',
    success: '#08ff00',
    warning: '#ffae00',
    border: '#ffae00',
  },
};
