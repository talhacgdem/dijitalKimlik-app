import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import UserIdCard from "@/components/dk/UserIdCard";
import React, {useState} from "react";
import {modalStyles} from "@/constants/Styles";
import DKModal from "@/components/dk/Modal";
import {useAuth} from "@/contexts/AuthContext";
import DKTextInput from "@/components/dk/TextInput";
import {UserDto} from "@/types/AuthDto";
import DKDatePicker from "@/components/dk/DateInput";
import {useDefaultColor} from "@/hooks/useThemeColor";

export default function ProfileScreen() {
    const colors = useDefaultColor();
    const {user} = useAuth();
    const [formData, setFormData] = useState<Partial<UserDto>>({
        name: user?.name,
        job: user?.job,
        email: user?.email,
        birthDate: user?.birthDate
    });
    const [modalVisible, setModalVisible] = useState(false);

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const updateUser = () => {
        console.log(formData);
    }

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16}}>
            <UserIdCard
                user={user}
                editModeHandler={() => {
                    console.log('profile edit mode');
                    setModalVisible(true);
                }}
            ></UserIdCard>

            <DKModal visible={modalVisible} onClose={handleCloseModal} modalHeader={"Profil Bilgilerini Güncelle"}>


                <View style={modalStyles.textContent}>

                    <DKTextInput
                        label="Ad Soyad"
                        value={formData.name || ''}
                        onChange={(text) => setFormData({...formData, name: text})}
                    />

                    <DKDatePicker
                        label="Doğum Tarihi"
                        value={formData.birthDate || null}
                        onChange={(text) => setFormData({...formData, birthDate: text})}
                    />

                    <DKTextInput
                        label="Unvan"
                        value={formData.job || ''}
                        onChange={(text) => setFormData({...formData, job: text})}
                    />

                    <DKTextInput
                        label="Email"
                        value={formData.email || ''}
                        onChange={(text) => setFormData({...formData, email: text})}
                    />

                    <TouchableOpacity style={[styles.modalButton, {backgroundColor: colors.tint}]} onPress={updateUser}>
                        <Text style={{color: 'white'}}>Güncelle</Text>
                    </TouchableOpacity>
                </View>
            </DKModal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalButton: {padding: 12, borderRadius: 6},
});
