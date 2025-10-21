// app/(auth)/email-verification.tsx
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useAuth} from '@/contexts/AuthContext';
import {useDefaultColor} from "@/hooks/useThemeColor";
import DKButton from "@/components/dk/Button";
import DKIcon from "@/components/dk/Icon";
import {AuthService} from "@/services/api";
import {useGlobalLoading} from "@/contexts/LoadingContext";

export default function EmailVerificationScreen() {
    const {user, logout} = useAuth();
    const {showLoading, hideLoading} = useGlobalLoading();
    const colors = useDefaultColor();

    const handleSendVerification = async () => {
        showLoading("Mail gönderiliyor")
        try {
            await AuthService.emailVerification(user?.email);
        } catch (error) {
            console.error('Email verification error:', error);
        }
        hideLoading()
    };

    return (
        <View style={[styles.container, {backgroundColor: colors.background}]}>
            <View style={styles.content}>
                <DKIcon
                    name="email"
                    size={80}
                    color={colors.primary}
                    style={styles.icon}
                />

                <Text style={[styles.title, {color: colors.text}]}>
                    Email Doğrulaması Gerekli
                </Text>

                <Text style={[styles.message, {color: colors.secondaryText}]}>
                    Uygulamayı kullanabilmek için mail adresinizi doğrulamanız gerekmektedir
                </Text>

                <Text style={[styles.email, {color: colors.primary}]}>
                    {user?.email}
                </Text>

                <View style={styles.buttonContainer}>
                    <DKButton
                        label="Doğrulama Kodu Talep Et"
                        onPress={handleSendVerification}
                        type="primary"
                        style={styles.button}
                    />

                    <DKButton
                        label="Çıkış Yap"
                        onPress={logout}
                        type="secondary"
                        style={styles.button}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        alignItems: 'center',
        maxWidth: 350,
        width: '100%',
    },
    icon: {
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 16,
    },
    email: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 32,
    },
    buttonContainer: {
        width: '100%',
        gap: 12,
    },
    button: {
        width: '100%',
    },
});