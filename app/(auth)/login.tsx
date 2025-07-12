import { useAuth } from '@/contexts/AuthContext';
import { View, Text, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

export default function LoginScreen() {
    const { login } = useAuth();
    const [identityNumber, setIdentityNumber] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        login(identityNumber, password)
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Giriş Yap</Text>
            <TextInput placeholder="TC Kimlik No" value={identityNumber} onChangeText={setIdentityNumber} inputMode={"numeric"} style={{ borderWidth: 1, padding: 10, marginBottom: 10 }} />
            <TextInput placeholder="Şifre" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, padding: 10, marginBottom: 20 }} />
            <Button title="Giriş Yap" onPress={handleLogin} />
            <Button title="Şifremi Unuttum" onPress={() => router.push('/forgot-password')} color="gray" />
        </View>
    );
}