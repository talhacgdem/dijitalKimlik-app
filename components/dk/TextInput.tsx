import {TextInput} from "react-native-paper";
import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {useDefaultColor} from "@/hooks/useThemeColor";

export interface DKTextInputProps {
    label: string;
    value: string;
    multiline?: boolean;
    onChange: (text: string) => void;
    error?: boolean;
    helperText?: string;
    leftIcon?: string;
    rightIcon?: string;

    [key: string]: any;
}

export default function DKTextInput({
                                        label,
                                        value,
                                        multiline,
                                        onChange,
                                        error = false,
                                        helperText,
                                        leftIcon,
                                        rightIcon,
                                        ...props
                                    }: DKTextInputProps) {
    const colors = useDefaultColor();

    return (
        <View style={styles.container}>
            <TextInput
                style={[
                    styles.input,
                    error && styles.inputError
                ]}
                placeholder={label}
                label={label}
                value={value}
                multiline={multiline}
                onChangeText={(text) => onChange(text)}
                mode="outlined"
                error={error}
                theme={{
                    colors: {
                        primary: colors.text,
                        error: colors.error || '#F44336',
                    }
                }}
                left={leftIcon && <TextInput.Icon icon={leftIcon}/>}
                right={rightIcon && <TextInput.Icon icon={rightIcon}/>}
                {...props}
            />
            {helperText && (
                <Text style={[
                    styles.helperText,
                    {color: error ? (colors.error || '#F44336') : colors.secondaryText}
                ]}>
                    {helperText}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    input: {
        backgroundColor: 'transparent',
    },
    inputError: {
        // Hata durumu için ek stil
    },
    helperText: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 12,
        lineHeight: 16,
    },
});
