import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');

    const handleSubmit = () => {
        Alert.alert('Şifre sıfırlama bağlantısı gönderildi.');
        router.back();
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>Şifremi Unuttum</Text>
            <TextInput placeholder="E-posta" value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 10, marginBottom: 20 }} />
            <Button title="Gönder" onPress={handleSubmit} />
        </View>
    );
}