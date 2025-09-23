import {Alert, SafeAreaView, Text, TextInput} from 'react-native';
import {useState} from 'react';
import {router} from 'expo-router';
import DKButton from "@/components/dk/Button";

export default function ForgotPasswordScreen() {
    const [identityNumber, setIdentityNumber] = useState('');

    const handleSubmit = () => {
        Alert.alert('Şifre sıfırlama bağlantısı gönderildi.');
        router.back();
    };

    return (
        <SafeAreaView style={{flex: 1, justifyContent: 'center', padding: 16}}>
            <Text style={{fontSize: 20, marginBottom: 20}}>Şifremi Unuttum</Text>
            <TextInput placeholder="E-posta" value={identityNumber} onChangeText={setIdentityNumber}
                       style={{borderWidth: 1, padding: 10, marginBottom: 20}}/>
            <DKButton label={"Gönder"} onPress={handleSubmit} type={"primary"} style={{width: '100%'}}/>
        </SafeAreaView>
    );
}