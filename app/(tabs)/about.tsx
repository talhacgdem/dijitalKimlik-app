import { View, Text } from 'react-native';

export default function AboutScreen() {
    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 20, marginBottom: 8 }}>Hakkımızda</Text>
            <Text>Adres: İstanbul</Text>
            <Text>Telefon: +90 555 555 55 55</Text>
            <Text>Mail: bilgi@kurum.com</Text>
        </View>
    );
}