import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Oteller() {
    return (
        <SafeAreaView edges={['bottom']} style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 18 }}>Oteller Modülü</Text>
        </SafeAreaView>
    );
}