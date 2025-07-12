import {TextInput} from "react-native-paper";
import React from "react";

export interface DKTextInputProps {
    label: string;
    value: string;
    multiline?: boolean;
    onChange: (text: string) => void;
}

export default function DKTextInput({label, value, multiline, onChange, ...props}: DKTextInputProps) {
    return (
        <TextInput
            style={{marginBottom: 10}}
            placeholder={label}
            label={label}
            value={value}
            multiline={multiline}
            onChangeText={(text) => onChange(text)}
            mode="outlined"
            {...props}
        />
    );
}