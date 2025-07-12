// components/Toast.tsx - Tamamen yeniden yazılmış versiyon
import React, {useCallback, useEffect, useRef} from 'react';
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
}

const DKToast: React.FC<DKToastProps> = ({
                                             visible,
                                             message,
                                             type = 'info',
                                             duration = 3000,
                                             position = 'center',
                                             onHide,
                                             showIcon = true,
                                             customIcon
                                         }) => {
    const colors = useDefaultColor();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const translateYAnim = useRef(new Animated.Value(50)).current;

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

            // Otomatik gizleme
            if (duration > 0) {
                const timer = setTimeout(() => {
                    hideToast();
                }, duration);

                return () => clearTimeout(timer);
            }
        }
    }, [visible, duration, fadeAnim, scaleAnim, translateYAnim, hideToast]);

    const getPositionStyle = (): StyleProp<ViewStyle> => {
        const screenHeight = Dimensions.get('window').height;

        switch (position) {
            case 'top':
                return {
                    top: 100,
                    alignSelf: 'center'
                };
            case 'bottom':
                return {
                    bottom: 100,
                    alignSelf: 'center'
                };
            default: // center
                return {
                    top: screenHeight / 2 - 50,
                    alignSelf: 'center'
                };
        }
    };

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                getPositionStyle(),
                {
                    backgroundColor: typeConfig.backgroundColor,
                    opacity: fadeAnim,
                    transform: [
                        { scale: scaleAnim },
                        { translateY: translateYAnim }
                    ],
                }
            ]}
            pointerEvents="box-none" // Alt katmandaki elementlere dokunmaya izin ver
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
                    <Text style={[
                        styles.message,
                        { color: typeConfig.textColor }
                    ]}>
                        {message}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        maxWidth: Dimensions.get('window').width * 0.9,
        minWidth: 200,
        borderRadius: 12,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        zIndex: 9999, // En üstte görünmesi için
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        marginRight: 12,
    },
    message: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        flex: 1,
        lineHeight: 20,
    },
});

export default DKToast;