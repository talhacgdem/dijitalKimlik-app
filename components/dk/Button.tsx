import React from 'react';
import {ColorValue, Pressable, Text} from 'react-native';
import {MaterialIcons} from "@expo/vector-icons";
import {ColorsCustom} from "@/constants/Colors";
import DKIcon from "@/components/dk/Icon";

interface DKButtonProps {
    type: 'primary' | 'secondary' | 'warning' | 'danger' | 'none' | 'unset';
    label?: string;
    icon?: { name: keyof typeof MaterialIcons.glyphMap, size?: number };
    onPress: () => void;
    style?: any;
    colorBackground?: ColorValue;
    colorText?: ColorValue;
    disabled?: boolean;

    [key: string]: any;
}

function DKButton({type, label, icon, onPress, style, colorBackground, colorText, disabled, ...props}: DKButtonProps) {
    const colors = {
        primary: {
            backgroundColor: ColorsCustom.primary,
            color: ColorsCustom.white
        },
        secondary: {
            backgroundColor: ColorsCustom.inactiveBackground,
            color: ColorsCustom.primary
        },
        warning: {
            backgroundColor: ColorsCustom.warning,
            color: ColorsCustom.text
        },
        danger: {
            backgroundColor: ColorsCustom.error,
            color: ColorsCustom.white
        },
        none: {
            backgroundColor: ColorsCustom.background,
            color: ColorsCustom.primary
        },
        unset: {
            backgroundColor: colorBackground,
            color: colorText
        }
    }

    const currentColors = colors[type];

    return (
        <Pressable
            disabled={disabled}
            style={({pressed}) => [
                (type !== 'unset' && {
                    backgroundColor: currentColors.backgroundColor,
                    borderRadius: 8,
                    padding: 12,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                }),
                {
                    opacity: pressed ? 0.2 : 1
                },
                style,
            ]}
            onPress={onPress}
            {...props}
        >
            {icon && (
                <DKIcon name={icon.name} size={icon.size ?? 24} color={colorText || currentColors.color}></DKIcon>
            )}
            {label && (
                <Text style={{
                    fontWeight: 'bold',
                    color: colorText || currentColors.color,
                }}>{label}</Text>
            )}
        </Pressable>
    )
}

export default DKButton;