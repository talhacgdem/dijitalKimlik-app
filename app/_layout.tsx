// app/_layout.tsx
import React, {useEffect} from 'react';
import {Stack, useRouter, useSegments} from 'expo-router';
import {AuthProvider, useAuth} from '@/contexts/AuthContext';
import Toast from 'react-native-toast-message';
import * as SplashScreen from 'expo-splash-screen';
import DKLoading from "@/components/dk/Loading";
import {LoadingProvider, useGlobalLoading} from "@/contexts/LoadingContext";

// SplashScreen'in otomatik kapanmasını engelle
SplashScreen.preventAutoHideAsync();

// Yönlendirme kontrolü için özel bileşen
function AuthGuard({children}: { children: React.ReactNode }) {
    const {isAuthenticated, isLoading} = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        // Yükleme tamamlandığında splash screen'i kapat
        if (!isLoading) {
            SplashScreen.hideAsync();
        }
    }, [isLoading]);

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] !== '(tabs)' && segments[0] !== 'modules';

        // Kullanıcı kimlik doğrulaması yapmadıysa ve auth grubunda değilse
        if (!isAuthenticated && !inAuthGroup) {
            // Login sayfasına yönlendir
            router.replace('/(auth)/login');
        }
        // Kullanıcı kimlik doğrulaması yaptıysa ve auth grubundaysa
        else if (isAuthenticated && inAuthGroup) {
            // Ana sayfaya yönlendir (tabs alanına)
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
                <Stack.Screen name="+not-found" options={{title: 'Sayfa Bulunamadı'}}/>
            </Stack>
        </>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <AuthGuard>
                <LoadingProvider>
                    <MainContent/>
                </LoadingProvider>
            </AuthGuard>
            <Toast/>
        </AuthProvider>
    );
}
