// screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import DKTextInput from '@/components/dk/TextInput';
import { useDefaultColor } from '@/hooks/useThemeColor';
import { useLoading } from "@/hooks/useLoading";
import { isValidTCKN } from "@/utils/StringUtils";

interface ValidationErrors {
    identityNumber?: string;
    password?: string;
}

export default function LoginScreen() {
    const { login } = useAuth();
    const { loading } = useLoading();
    const colors = useDefaultColor();
    const [identityNumber, setIdentityNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<{ identityNumber: boolean; password: boolean }>({
        identityNumber: false,
        password: false
    });

    const validateIdentityNumber = (value: string): string | undefined => {
        if (!value.trim()) {
            return 'TC Kimlik No zorunludur';
        }
        if (!/^\d+$/.test(value)) {
            return 'TC Kimlik No sadece rakam içermelidir';
        }
        if (value.length !== 11) {
            return 'TC Kimlik No 11 hane olmalıdır';
        }
        if (!isValidTCKN(value)) {
            return 'Geçersiz TC Kimlik No';
        }
        return undefined;
    };

    const validatePassword = (value: string): string | undefined => {
        if (!value.trim()) {
            return 'Şifre zorunludur';
        }
        if (value.length < 6) {
            return 'Şifre en az 6 karakter olmalıdır';
        }
        return undefined;
    };

    const handleIdentityNumberChange = (text: string) => {
        const numericText = text.replace(/[^0-9]/g, '');
        const limitedText = numericText.slice(0, 11);

        setIdentityNumber(limitedText);

        if (touched.identityNumber) {
            const error = validateIdentityNumber(limitedText);
            setErrors(prev => ({ ...prev, identityNumber: error }));
        }
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);

        if (touched.password) {
            const error = validatePassword(text);
            setErrors(prev => ({ ...prev, password: error }));
        }
    };

    const handleIdentityNumberBlur = () => {
        setTouched(prev => ({ ...prev, identityNumber: true }));
        const error = validateIdentityNumber(identityNumber);
        setErrors(prev => ({ ...prev, identityNumber: error }));
    };

    const handlePasswordBlur = () => {
        setTouched(prev => ({ ...prev, password: true }));
        const error = validatePassword(password);
        setErrors(prev => ({ ...prev, password: error }));
    };

    const isFormValid = (): boolean => {
        const identityError = validateIdentityNumber(identityNumber);
        const passwordError = validatePassword(password);

        setErrors({
            identityNumber: identityError,
            password: passwordError
        });

        setTouched({
            identityNumber: true,
            password: true
        });

        return !identityError && !passwordError;
    };

    const handleLogin = async () => {
        if (isFormValid()) {
            try {
                await login(identityNumber, password);
            } catch (error) {
                console.error('Login error:', error);
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
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
                        <Text style={[styles.title, { color: colors.text }]}>
                            Hoş Geldiniz
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
                            Hesabınıza giriş yapın
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.formContainer}>
                        <DKTextInput
                            label="TC Kimlik No"
                            value={identityNumber}
                            onChange={handleIdentityNumberChange}
                            keyboardType="numeric"
                            maxLength={11}
                            onBlur={handleIdentityNumberBlur}
                            error={touched.identityNumber && !!errors.identityNumber}
                            helperText={touched.identityNumber ? errors.identityNumber : ''}
                            leftIcon="account"
                        />

                        <DKTextInput
                            label="Şifre"
                            value={password}
                            onChange={handlePasswordChange}
                            secureTextEntry={!showPassword}
                            onBlur={handlePasswordBlur}
                            error={touched.password && !!errors.password}
                            helperText={touched.password ? errors.password : ''}
                            leftIcon="lock"
                            rightIcon={showPassword ? "eye-off" : "eye"}
                            onRightIconPress={togglePasswordVisibility}
                        />
                    </View>

                    {/* Buttons */}
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
                            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                        </Button>

                        <Button
                            mode="text"
                            onPress={() => router.push('/forgot-password')}
                            style={styles.forgotButton}
                            labelStyle={[styles.forgotButtonLabel, { color: colors.text }]}
                        >
                            Şifremi Unuttum
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
    },
    forgotButton: {
        marginTop: 8,
    },
    forgotButtonLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
});
