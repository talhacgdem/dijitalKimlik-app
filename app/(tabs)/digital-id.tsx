import { View, Text, Image } from 'react-native';

export default function DigitalID() {
    const user = {
        name: 'Talha',
        id: '12345678',
        qr: 'https://api.qrserver.com/v1/create-qr-code/?data=12345678'
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Dijital Kimlik</Text>
            <Image source={{ uri: user.qr }} style={{ width: 200, height: 200, marginVertical: 20 }} />
            <Text>Ad: {user.name}</Text>
            <Text>ID: {user.id}</Text>
        </View>
    );
}