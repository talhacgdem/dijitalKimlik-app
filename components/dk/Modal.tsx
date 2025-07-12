// Detay Modal Bileşeni
import {useDefaultColor} from "@/hooks/useThemeColor";
import {Modal, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {MaterialIcons} from "@expo/vector-icons";
import React, {ReactNode} from "react";
import {modalStyles} from "@/constants/Styles";


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
                    <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
                        <MaterialIcons name="close" size={24} color={colors.text}/>
                    </TouchableOpacity>
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