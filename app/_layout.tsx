import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useThemeContext } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { StatusBar, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import {useTheme} from "@/config/theme";

function InnerLayout() {
    const { colorScheme } = useThemeContext();
    const {colors} = useTheme();
    const isDark = colorScheme === 'dark';
    const backgroundColor = colors.background;

    return (
        <View style={{ flex: 1, backgroundColor }}>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
                <Slot />
            </SafeAreaView>
        </View>
    );
}

export default function RootLayout() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            await SplashScreen.preventAutoHideAsync();
            await new Promise((res) => setTimeout(res, 2000));
            setReady(true);
            await SplashScreen.hideAsync();
        }

        prepare();
    }, []);

    if (!ready) return null;

    return (
        <ThemeProvider>
            <AuthProvider>
                <InnerLayout />
            </AuthProvider>
        </ThemeProvider>
    );
}