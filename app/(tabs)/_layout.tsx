import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Tabs} from 'expo-router';
import {useAuth} from '@/contexts/AuthContext';
import {useDefaultColor} from "@/hooks/useThemeColor";
import DKButton from "@/components/dk/Button";
import DKIcon from "@/components/dk/Icon";
import {AuthService} from "@/services/api";

export default function TabsLayout() {
    const {user, isAdmin, isEmailVerified, logout} = useAuth();
    const colors = useDefaultColor();

    // Email doğrulanmamışsa doğrulama ekranını göster
    if (!isEmailVerified) {
        return (
            <View style={[styles.verificationContainer, {backgroundColor: colors.background}]}>
                <View style={styles.verificationContent}>
                    <DKIcon
                        name="email"
                        size={80}
                        color={colors.primary}
                        style={styles.verificationIcon}
                    />

                    <Text style={[styles.verificationTitle, {color: colors.text}]}>
                        Email Doğrulaması Gerekli
                    </Text>

                    <Text style={[styles.verificationMessage, {color: colors.secondaryText}]}>
                        Uygulamayı kullanabilmek için mail adresinizi doğrulamanız gerekmektedir
                    </Text>

                    <View style={styles.buttonContainer}>
                        <DKButton
                            label="Doğrulama Kodu Talep Et"
                            onPress={() => AuthService.emailVerification(user?.email)}
                            type="primary"
                            style={styles.verificationButton}
                        />

                        <DKButton
                            label="Çıkış Yap"
                            onPress={logout}
                            type="secondary"
                            style={styles.logoutButton}
                        />
                    </View>
                </View>
            </View>
        );
    }

    // Email doğrulanmışsa normal tab navigation'ı göster
    return (
        <Tabs
            screenOptions={{
                headerTitle: 'Sağlık HAK-SEN',
                headerStyle: {backgroundColor: colors.background},
                headerTitleStyle: {color: colors.text},
                headerRight: () => (
                    <DKButton
                        icon={{name: "logout"}}
                        onPress={logout}
                        type={"none"}
                        style={{marginRight: 16}}
                    />
                ),
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.text,
                tabBarShowLabel: false,
                tabBarStyle: {
                    height: 70,
                    paddingBottom: 20,
                    paddingTop: 10,
                    backgroundColor: colors.background,
                },
                tabBarIconStyle: {
                    width: 40,
                    height: 40,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Ana Sayfa',
                    tabBarIcon: ({color}) => (
                        <DKIcon name={"home"} size={32} color={color}/>
                    )
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profil',
                    tabBarIcon: ({color}) => (
                        <DKIcon name={"person"} size={32} color={color}/>
                    )
                }}
            />
            <Tabs.Screen
                name="about"
                options={{
                    title: 'Hakkımızda',
                    tabBarIcon: ({color}) => (
                        <DKIcon name={"info"} size={32} color={color}/>
                    )
                }}
            />
            <Tabs.Screen
                name="admin"
                options={{
                    title: 'Admin',
                    href: isAdmin ? '/admin' : null,
                    tabBarIcon: ({color}) => (
                        <DKIcon name={"admin-panel-settings"} size={32} color={color}/>
                    )
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    verificationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    verificationContent: {
        alignItems: 'center',
        maxWidth: 350,
        width: '100%',
    },
    verificationIcon: {
        marginBottom: 24,
    },
    verificationTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    verificationMessage: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    buttonContainer: {
        width: '100%',
        gap: 12,
    },
    verificationButton: {
        width: '100%',
    },
    logoutButton: {
        width: '100%',
    },
});