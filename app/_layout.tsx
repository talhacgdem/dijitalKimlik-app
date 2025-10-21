// app/_layout.tsx
import React, {useEffect} from 'react';
import {Stack, useRouter, useSegments} from 'expo-router';
import {AuthProvider, useAuth} from '@/contexts/AuthContext';
import * as SplashScreen from 'expo-splash-screen';
import DKLoading from "@/components/dk/Loading";
import {LoadingProvider, useGlobalLoading} from "@/contexts/LoadingContext";
import ToastProvider from "@/contexts/ToastContext";
import {useFonts} from "expo-font";
import {MaterialIcons} from "@expo/vector-icons";

// SplashScreen'in otomatik kapanmasını engelle
SplashScreen.preventAutoHideAsync();

// Font yükleme bileşeni
function FontLoader({children}: { children: React.ReactNode }) {
    const [fontsLoaded, fontError] = useFonts({
        ...MaterialIcons.font,
    });

    useEffect(() => {
        if (fontError) {
            console.error('Font loading error:', fontError);
        }
    }, [fontError]);

    // Font yüklenene kadar loading göster
    if (!fontsLoaded && !fontError) {
        return null;
    }

    return <>{children}</>;
}

// Yönlendirme kontrolü için özel bileşen
function AuthGuard({children}: { children: React.ReactNode }) {
    const {isAuthenticated, isLoading} = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            SplashScreen.hideAsync();
        }
    }, [isLoading]);

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!isAuthenticated && !inAuthGroup) {
            // Kullanıcı giriş yapmamış ve auth sayfasında değil
            router.replace('/(auth)/login');
        } else if (isAuthenticated && inAuthGroup) {
            // Kullanıcı giriş yapmış ama auth sayfasında
            router.replace('/(tabs)');
        }
    }, [isAuthenticated, segments, isLoading, router]);

    return <>{children}</>;
}

function MainContent() {
    const {loading, message} = useGlobalLoading();

    return (
        <>
            <DKLoading visible={loading} message={message}/>
            <Stack screenOptions={{headerShown: false}}>
                <Stack.Screen name="(auth)" options={{headerShown: false}}/>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                <Stack.Screen name="modules" options={{headerShown: false}}/>
                <Stack.Screen name="admin" options={{headerShown: false}}/>
                <Stack.Screen name="+not-found" options={{title: 'Sayfa Bulunamadı'}}/>
            </Stack>
        </>
    );
}

export default function RootLayout() {
    return (
        <FontLoader>
            <ToastProvider>
                <AuthProvider>
                    <AuthGuard>
                        <LoadingProvider>
                            <MainContent/>
                        </LoadingProvider>
                    </AuthGuard>
                </AuthProvider>
            </ToastProvider>
        </FontLoader>
    );
}