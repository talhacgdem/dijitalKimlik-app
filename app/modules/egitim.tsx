import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';

export default function Egitim() {
    return (
        <SafeAreaView style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 18 }}>Eğitim Modülü</Text>
        </SafeAreaView>
    );
}