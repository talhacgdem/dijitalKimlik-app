// components/dk/TextInput.tsx
import React from "react";
import {StyleSheet, Switch, View, Text} from "react-native";
import {useDefaultColor} from "@/hooks/useThemeColor";
import {Label} from "@react-navigation/elements";

export interface DKSwitchProps {
    label: string;
    value: boolean;
    onChange: (text: boolean) => void;

    [key: string]: any;
}

export default function DKSwitch({
                                     label,
                                     value,
                                     onChange,
                                     error = false,
                                     helperText,
                                     onRightIconPress,
                                     ...props
                                 }: DKSwitchProps) {
    const colors = useDefaultColor();

    return (
        <View style={styles.container}>
            <Text>{label}</Text>
            <Switch
                style={[
                    styles.input,
                    error && styles.inputError,
                    {
                        borderColor: colors.primary
                    }
                ]}
                value={value}
                onChange={() => onChange(!value)}
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginBottom: 16,
        justifyContent: "space-between",
        alignItems: "center"
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
