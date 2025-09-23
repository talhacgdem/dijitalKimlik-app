import {Text} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import React from "react";
import {ColorsCustom} from "@/constants/Colors";
import DKButton from "@/components/dk/Button";

interface DKErrorProps {
    errorMessage: string;
    onPress: () => void;
}

function DKError({errorMessage, onPress}: DKErrorProps) {
    return (
        <SafeAreaView edges={['bottom']} style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16,
        }}>
            <Text style={{
                fontSize: 16,
                marginBottom: 16,
                textAlign: 'center',
                color: ColorsCustom.error
            }}>{errorMessage}</Text>
            <DKButton
                type={"danger"}
                label={"Tekrar Dene"}
                onPress={onPress}
            ></DKButton>
        </SafeAreaView>
    )
}

export default DKError;
