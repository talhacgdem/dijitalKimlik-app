// app/_layout.tsx
import React, {useEffect, useRef} from 'react';
import {Stack, useRouter, useSegments} from 'expo-router';
import {AuthProvider, useAuth} from '@/contexts/AuthContext';
import * as SplashScreen from 'expo-splash-screen';
import DKLoading from "@/components/dk/Loading";
import {LoadingProvider, useGlobalLoading} from "@/contexts/LoadingContext";
import ToastProvider from "@/contexts/ToastContext";


function AuthGuard({children}: { children: React.ReactNode }) {
    const {isAuthenticated, isEmailVerified, loading} = useAuth();
    const segments = useSegments();
    const router = useRouter();
    const splashHidden = useRef(false);
    const navigationDone = useRef(false);

    useEffect(() => {
        if (loading) return;

        // İlk render'da navigation yapma
        if (!navigationDone.current) {
            navigationDone.current = true;
            return;
        }

        const inAuthGroup = segments[0] === '(auth)';
        const isOnLoginPage = segments[1] === 'login';
        const isOnEmailVerification = segments[1] === 'email-verification';

        // Navigation'ı bir sonraki tick'e ertele
        const timer = setTimeout(() => {
            if (!isAuthenticated && !isOnLoginPage) {
                router.replace('/(auth)/login');
            } else if (isAuthenticated && !isEmailVerified && !isOnEmailVerification) {
                router.replace('/(auth)/email-verification');
            } else if (isAuthenticated && isEmailVerified && inAuthGroup) {
                router.replace('/(tabs)');
            }
        }, 0);

        return () => clearTimeout(timer);
    }, [isAuthenticated, isEmailVerified, segments, loading]);
    // InteractionManager ile tüm animasyonlar bitince splash'i kapat
    useEffect(() => {
        if (!loading) {
            // Tüm işlemler bitince splash'i kapat
            const timer = setTimeout(() => {
                if (!splashHidden.current) {
                    SplashScreen.hideAsync().catch(() => {
                    });
                    splashHidden.current = true;
                }
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [loading]);
    // if (loading) {
    //     return (
    //         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'}}>
    //             <ActivityIndicator size="large" color="#007AFF" />
    //         </View>
    //     );
    // }

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
            <LoadingProvider>
                <AuthProvider>
                    <AuthGuard>
                        <MainContent/>
                    </AuthGuard>
                </AuthProvider>
            </LoadingProvider>
        </ToastProvider>
    );
}