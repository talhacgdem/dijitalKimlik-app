// screens/LoginScreen.tsx
import React, {useState} from 'react';
import {Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-paper';
import {router} from 'expo-router';
import {useAuth} from '@/contexts/AuthContext';
import DKTextInput from '@/components/dk/TextInput';
import {useDefaultColor} from '@/hooks/useThemeColor';
import {validateEmail, validatePassword} from "@/utils/StringUtils";
import {useGlobalLoading} from "@/contexts/LoadingContext";

interface ValidationErrors {
    email?: string;
    password?: string;
}

export default function LoginScreen() {
    const {loading, showLoading, hideLoading} = useGlobalLoading();
    const {login} = useAuth();
    const colors = useDefaultColor();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
        email: false,
        password: false
    });


    const handleEmailChange = (text: string) => {
        setEmail(text);
        if (touched.email) {
            const error = validateEmail(text);
            setErrors(prev => ({...prev, email: error}));
        }
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);

        if (touched.password) {
            const error = validatePassword(text);
            setErrors(prev => ({...prev, password: error}));
        }
    };

    const handleEmailBlur = () => {
        setTouched(prev => ({...prev, email: true}));
        const error = validateEmail(email);
        setErrors(prev => ({...prev, email: error}));
    };

    const handlePasswordBlur = () => {
        setTouched(prev => ({...prev, password: true}));
        const error = validatePassword(password);
        setErrors(prev => ({...prev, password: error}));
    };

    const isFormValid = (): boolean => {
        const identityError = validateEmail(email);
        const passwordError = validatePassword(password);

        setErrors({
            email: identityError,
            password: passwordError
        });

        setTouched({
            email: true,
            password: true
        });

        return !identityError && !passwordError;
    };

    const handleLogin = async () => {
        if (!isFormValid()) {
            return;
        }

        showLoading("Giriş yapılıyor...");

        try {
            await login(email, password);
            // AuthGuard otomatik yönlendirecek, manuel navigation YAPMA
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            hideLoading();
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                            Hoş Geldiniz
                        </Text>
                        <Text style={[styles.subtitle, {color: colors.secondaryText}]}>
                            Hesabınıza giriş yapın
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.formContainer}>
                        <DKTextInput
                            label="Email"
                            value={email}
                            onChange={handleEmailChange}
                            keyboardType="email-address"
                            maxLength={64}
                            onBlur={handleEmailBlur}
                            error={touched.email && !!errors.email}
                            helperText={touched.email ? errors.email : ''}
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
                            labelStyle={[styles.forgotButtonLabel, {color: colors.text}]}
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
