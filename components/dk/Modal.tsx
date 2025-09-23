// Detay Modal Bileşeni
import {useDefaultColor} from "@/hooks/useThemeColor";
import {Modal, ScrollView, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import React, {ReactNode} from "react";
import {modalStyles} from "@/constants/Styles";
import DKButton from "./Button";


interface ModalProps {
    visible: boolean;
    onClose: () => void;
    modalHeader?: string;
    children: ReactNode;
}

export default function DKModal({visible, onClose, modalHeader = 'Detay', children}: ModalProps) {
    const colors = useDefaultColor();


    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView style={[modalStyles.container, {backgroundColor: colors.background}]}>
                <View style={[modalStyles.header, {borderBottomColor: colors.border}]}>
                    <DKButton icon={{name: "close", size: 24}} onPress={onClose} type={'none'}></DKButton>
                    <Text style={[modalStyles.title, {color: colors.text}]}>{modalHeader}</Text>
                    <View style={modalStyles.placeholder}/>
                </View>

                <ScrollView style={modalStyles.content}>
                    {children}
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
};