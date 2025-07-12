import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    View,
    Text,
    Animated,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    StyleProp,
    ViewStyle
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDefaultColor } from '@/hooks/useThemeColor';

interface DKToastProps {
    visible: boolean;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    position?: 'top' | 'center' | 'bottom';
    onHide?: () => void;
    showIcon?: boolean;
    customIcon?: React.ReactNode;
    maxLines?: number; // Maksimum satır sayısı
}

const DKToast: React.FC<DKToastProps> = ({
                                             visible,
                                             message,
                                             type = 'info',
                                             duration = 3000,
                                             position = 'center',
                                             onHide,
                                             showIcon = true,
                                             customIcon,
                                             maxLines = 3 // Varsayılan 3 satır
                                         }) => {
    const colors = useDefaultColor();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const translateYAnim = useRef(new Animated.Value(50)).current;
    const [textHeight, setTextHeight] = useState(0);

    const memoizedOnHide = useCallback(() => {
        onHide?.();
    }, [onHide]);

    const getTypeConfig = () => {
        switch (type) {
            case 'success':
                return {
                    backgroundColor: '#4CAF50',
                    icon: 'check-circle',
                    textColor: '#FFFFFF'
                };
            case 'error':
                return {
                    backgroundColor: '#F44336',
                    icon: 'error',
                    textColor: '#FFFFFF'
                };
            case 'warning':
                return {
                    backgroundColor: '#FF9800',
                    icon: 'warning',
                    textColor: '#FFFFFF'
                };
            default: // info
                return {
                    backgroundColor: colors.cardBackground,
                    icon: 'info',
                    textColor: colors.text
                };
        }
    };

    const typeConfig = getTypeConfig();

    // Mesaj uzunluğuna göre süreyi ayarla
    const getDynamicDuration = () => {
        if (duration <= 0) return 0; // Manuel kapatma

        const baseTime = 3000;
        const wordsCount = message.split(' ').length;
        const readingTime = Math.max(baseTime, wordsCount * 300); // Kelime başına 300ms

        return Math.min(readingTime, 8000); // Maksimum 8 saniye
    };

    const hideToast = useCallback(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 0.8,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(translateYAnim, {
                toValue: position === 'top' ? -50 : 50,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start(() => {
            memoizedOnHide();
        });
    }, [fadeAnim, scaleAnim, translateYAnim, memoizedOnHide, position]);

    useEffect(() => {
        if (visible) {
            // Giriş animasyonu
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.spring(translateYAnim, {
                    toValue: 0,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                })
            ]).start();

            // Dinamik süre ile otomatik gizleme
            const dynamicDuration = getDynamicDuration();
            if (dynamicDuration > 0) {
                const timer = setTimeout(() => {
                    hideToast();
                }, dynamicDuration);

                return () => clearTimeout(timer);
            }
        }
    }, [visible, message, fadeAnim, scaleAnim, translateYAnim, hideToast, getDynamicDuration]);

    const getPositionStyle = (): StyleProp<ViewStyle> => {
        const screenHeight = Dimensions.get('window').height;

        switch (position) {
            case 'top':
                return {
                    position: 'absolute',
                    top: 60, // Status bar'dan biraz aşağı
                    left: 0,
                    right: 0,
                    alignItems: 'center'
                };
            case 'bottom':
                return {
                    position: 'absolute',
                    bottom: 100,
                    left: 0,
                    right: 0,
                    alignItems: 'center'
                };
            default: // center
                return {
                    position: 'absolute',
                    top: screenHeight / 2 - (textHeight / 2) - 50, // Metin yüksekliğine göre ortalama
                    left: 0,
                    right: 0,
                    alignItems: 'center'
                };
        }
    };

    // Metin yüksekliğini ölç
    const onTextLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
        setTextHeight(height);
    };

    if (!visible) return null;
    return (
        <View style={[styles.overlay, getPositionStyle()]} pointerEvents="box-none">
            <Animated.View
                style={[
                    styles.container,
                    {
                        backgroundColor: typeConfig.backgroundColor,
                        opacity: fadeAnim,
                        transform: [
                            { scale: scaleAnim },
                            { translateY: translateYAnim }
                        ],
                    }
                ]}
            >
                <TouchableWithoutFeedback onPress={hideToast}>
                    <View style={styles.content}>
                        {showIcon && (
                            <View style={styles.iconContainer}>
                                {customIcon || (
                                    <MaterialIcons
                                        name={typeConfig.icon as any}
                                        size={24}
                                        color={typeConfig.textColor}
                                    />
                                )}
                            </View>
                        )}
                        <Text
                            style={[
                                styles.message,
                                { color: typeConfig.textColor }
                            ]}
                            numberOfLines={maxLines}
                            onLayout={onTextLayout}
                        >
                            {message}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 9999,
    },
    container: {
        maxWidth: Dimensions.get('window').width * 0.9,
        minWidth: Dimensions.get('window').width * 0.7,
        borderRadius: 12,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'flex-start', // Üstten hizala
        padding: 16,
        minHeight: 56, // Minimum yükseklik
    },
    iconContainer: {
        marginRight: 12,
        marginTop: 2, // Icon'u biraz aşağı kaydır
    },
    message: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'left',
        flex: 1,
    },
});

export default DKToast;
