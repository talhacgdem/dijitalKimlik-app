// components/dk/DKDatePicker.tsx
import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import { StyleSheet, Text, View, Platform } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDefaultColor } from "@/hooks/useThemeColor";

export interface DKDatePickerProps {
    label: string;
    value: Date | null;
    onChange: (date: Date | null) => void;
    error?: boolean;
    helperText?: string;
    leftIcon?: string;
    mode?: 'date' | 'time' | 'datetime';
    minimumDate?: Date;
    maximumDate?: Date;
    locale?: string;
    dateFormat?: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
    [key: string]: any;
}

export default function DKDatePicker({
                                         label,
                                         value,
                                         onChange,
                                         error = false,
                                         helperText,
                                         leftIcon = "calendar",
                                         mode = 'date',
                                         minimumDate,
                                         maximumDate,
                                         locale = 'tr-TR',
                                         dateFormat = 'DD/MM/YYYY',
                                         ...props
                                     }: DKDatePickerProps) {
    const colors = useDefaultColor();
    const [show, setShow] = useState(false);

    // Tarihi formatla
    const formatDate = (date: Date | null): string => {
        if (!date) return '';

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        switch (mode) {
            case 'time':
                return `${hours}:${minutes}`;
            case 'datetime':
                switch (dateFormat) {
                    case 'MM/DD/YYYY':
                        return `${month}/${day}/${year} ${hours}:${minutes}`;
                    case 'YYYY-MM-DD':
                        return `${year}-${month}-${day} ${hours}:${minutes}`;
                    default:
                        return `${day}/${month}/${year} ${hours}:${minutes}`;
                }
            default: // date
                switch (dateFormat) {
                    case 'MM/DD/YYYY':
                        return `${month}/${day}/${year}`;
                    case 'YYYY-MM-DD':
                        return `${year}-${month}-${day}`;
                    default:
                        return `${day}/${month}/${year}`;
                }
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShow(false);
        }

        if (selectedDate) {
            onChange(selectedDate);
        }
    };

    const showDatePicker = () => {
        setShow(true);
    };

    const hideDatePicker = () => {
        setShow(false);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={[
                    styles.input,
                    error && styles.inputError,
                    {
                        borderColor: colors.primary
                    }
                ]}
                placeholder={label}
                label={label}
                value={formatDate(value)}
                mode="outlined"
                error={error}
                editable={false}
                onTouchStart={showDatePicker}
                theme={{
                    colors: {
                        primary: colors.primary || colors.text,
                        error: colors.error || '#F44336',
                        onSurfaceVariant: colors.secondaryText || '#666',
                        outline: colors.border || '#E0E0E0',
                    }
                }}
                left={leftIcon ? <TextInput.Icon color={colors.primary} icon={leftIcon} /> : undefined}
                right={
                    <TextInput.Icon
                        icon="chevron-down"
                        color={colors.primary}
                        onPress={showDatePicker}
                        forceTextInputFocus={false}
                    />
                }
                {...props}
            />

            {helperText && (
                <Text style={[
                    styles.helperText,
                    { color: error ? (colors.error || '#F44336') : colors.secondaryText }
                ]}>
                    {helperText}
                </Text>
            )}

            {show && (
                <DateTimePicker
                    value={value || new Date()}
                    mode={mode}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    minimumDate={minimumDate}
                    maximumDate={maximumDate}
                    locale={locale}
                    onTouchCancel={hideDatePicker}
                />
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