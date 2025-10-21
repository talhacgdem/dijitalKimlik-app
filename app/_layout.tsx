// app/_layout.tsx
import React, {useEffect, useLayoutEffect, useRef} from 'react';
import {Stack, useRouter, useSegments} from 'expo-router';
import {InteractionManager} from 'react-native';
import {AuthProvider, useAuth} from '@/contexts/AuthContext';
import * as SplashScreen from 'expo-splash-screen';
import DKLoading from "@/components/dk/Loading";
import {LoadingProvider, useGlobalLoading} from "@/contexts/LoadingContext";
import ToastProvider from "@/contexts/ToastContext";

SplashScreen.preventAutoHideAsync();

function AuthGuard({children}: { children: React.ReactNode }) {
    const {isAuthenticated, isEmailVerified, isLoading} = useAuth();
    const segments = useSegments();
    const router = useRouter();
    const splashHidden = useRef(false);

    useLayoutEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';
        const isOnLoginPage = segments[1] === 'login';
        const isOnEmailVerification = segments[1] === 'email-verification';

        if (!isAuthenticated && !isOnLoginPage) {
            // Giriş yapmamış ve login sayfasında değil → login'e git
            router.replace('/(auth)/login');
        } else if (isAuthenticated && !isEmailVerified && !isOnEmailVerification) {
            // Giriş yapmış ama email verified değil ve verification sayfasında değil → verification'a git
            router.replace('/(auth)/email-verification');
        } else if (isAuthenticated && isEmailVerified && inAuthGroup) {
            // Her şey OK ama hala auth grubunda → tabs'a yönlendir
            router.replace('/(tabs)');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, isEmailVerified, segments, isLoading]);

    // InteractionManager ile tüm animasyonlar bitince splash'i kapat
    useEffect(() => {
        if (!isLoading && !splashHidden.current) {
            const handle = InteractionManager.runAfterInteractions(() => {
                setTimeout(() => {
                    SplashScreen.hideAsync().catch(() => {});
                    splashHidden.current = true;
                }, 100);
            });

            return () => handle.cancel();
        }
    }, [isLoading]);

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
        <ToastProvider>
            <AuthProvider>
                <AuthGuard>
                    <LoadingProvider>
                        <MainContent/>
                    </LoadingProvider>
                </AuthGuard>
            </AuthProvider>
        </ToastProvider>
    );
}