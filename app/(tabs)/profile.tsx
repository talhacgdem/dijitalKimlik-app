import { View, Text, Button, Alert } from 'react-native';

export default function ProfileScreen() {
    const changePassword = () => {
        Alert.alert('Başarılı', 'Şifreniz güncellendi.');
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Profil Sayfası</Text>
            <Button title="Şifre Değiştir" onPress={changePassword} />
        </View>
    );
}