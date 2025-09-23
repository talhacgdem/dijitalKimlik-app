import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import {router} from 'expo-router';
import DKButton from "@/components/dk/Button";
import DKIcon from "@/components/dk/Icon";

interface CustomHeaderProps {
    title: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    backgroundColor?: string;
    textColor?: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    rightComponent?: React.ReactNode;
}

const DKHeader: React.FC<CustomHeaderProps> = ({
                                                   title,
                                                   icon = null,
                                                   backgroundColor = '#fff',
                                                   textColor = '#000',
                                                   showBackButton = true,
                                                   onBackPress,
                                                   rightComponent
                                               }) => {

    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            router.back();
        }
    };

    return (
        <>

            <View style={[styles.header, {backgroundColor}]}>
                {/* Sol taraf - Back button */}
                <View style={styles.leftContainer}>
                    {showBackButton && (
                        <DKButton icon={{name: "arrow-back", size: 24}} onPress={handleBackPress} type={'none'}/>
                    )}
                </View>

                {/* Orta - Title */}
                <View style={styles.centerContainer}>
                    {icon && (
                        <DKIcon name={icon} size={36} color={textColor}/>
                    )}
                    <Text style={[styles.title, {color: textColor}]} numberOfLines={1}>
                        {title}
                    </Text>
                </View>

                {/* Sağ taraf - Custom component */}
                <View style={styles.rightContainer}>
                    {rightComponent}
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    statusBarSpacer: {
        width: '100%',
    },
    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 4,
        elevation: 4, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
    },
    leftContainer: {
        width: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    rightContainer: {
        width: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default DKHeader;