// screens/LoginScreen.tsx
import React, {useState} from 'react';
import {Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-paper';
import DKTextInput from '@/components/dk/TextInput';
import {useDefaultColor} from '@/hooks/useThemeColor';
import {AuthService} from "@/services/api";
import {useGlobalLoading} from "@/contexts/LoadingContext";

export default function ForgotPassword() {
    const colors = useDefaultColor();
    const [email, setEmail] = useState('');
    const {loading, showLoading, hideLoading} = useGlobalLoading();

    const handleLogin = async () => {
        showLoading("Gönderiliyor")
        await AuthService.forgotPassword(email);
        hideLoading()
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, {backgroundColor: colors.background}]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Ana İçerik Konteyner - Dikey Ortalama */}
                <View style={styles.contentContainer}>
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('@/assets/icon.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Başlık */}
                    <View style={styles.titleContainer}>
                        <Text style={[styles.title, {color: colors.text}]}>
                            Şifrenizi mi unuttunuz?
                        </Text>
                        <Text style={[styles.subtitle, {color: colors.secondaryText}]}>
                            Mail adresiniz geçerliyse bir şifre sıfırlama bağlantısı göndereceğiz
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.formContainer}>
                        <DKTextInput
                            label="Email"
                            value={email}
                            onChange={(text) => setEmail(text)}
                            keyboardType="email-address"
                            maxLength={64}
                            leftIcon="account"
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            buttonColor={colors.primary}
                            mode="contained"
                            onPress={handleLogin}
                            loading={loading}
                            disabled={loading}
                            style={styles.loginButton}
                            contentStyle={styles.loginButtonContent}
                            labelStyle={styles.loginButtonLabel}
                        >
                            Şifre Sıfırla
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center', // Dikey ortalama
        minHeight: '100%',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 300,
        height: 300,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.7,
    },
    formContainer: {
        marginBottom: 32,
    },
    buttonContainer: {
        marginBottom: 24,
    },
    loginButton: {
        marginBottom: 16,
        borderRadius: 12,
    },
    loginButtonContent: {
        paddingVertical: 8,
    },
    loginButtonLabel: {
        fontSize: 16,
        fontWeight: '600',
    }
});
