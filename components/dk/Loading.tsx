import React from 'react';
import {ActivityIndicator, Modal, StyleSheet, Text, View,} from 'react-native';
import {useDefaultColor} from '@/hooks/useThemeColor';

interface LoadingProps {
    visible: boolean;
    message?: string;
    overlay?: boolean;
    size?: 'small' | 'large';
    loadingColor?: string;
}

export default function DKLoading({
                                      visible,
                                      message = 'Yükleniyor...',
                                      overlay = true,
                                      size = 'large',
                                      loadingColor = 'red'
                                  }: LoadingProps) {
    const colors = useDefaultColor();

    if (!visible) return null;

    const LoadingContent = () => (
        <View style={[
            styles.container,
            overlay && styles.overlayContainer,
            {backgroundColor: overlay ? 'rgba(0,0,0,0.5)' : 'transparent'}
        ]}>
            <View style={[
                styles.loadingBox,
                {backgroundColor: colors.background}
            ]}>
                <ActivityIndicator
                    size={size}
                    color={loadingColor}
                    style={styles.spinner}
                />
                {message && (
                    <Text style={[
                        styles.message,
                        {color: colors.text}
                    ]}>
                        {message}
                    </Text>
                )}
            </View>
        </View>
    );

    if (overlay) {
        return (
            <Modal
                transparent
                visible={visible}
                animationType="fade"
            >
                <LoadingContent/>
            </Modal>
        );
    }

    return <LoadingContent/>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
    },
    loadingBox: {
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        minWidth: 120,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    spinner: {
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '500',
    },
});