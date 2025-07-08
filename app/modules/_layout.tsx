// app/modules/_layout.tsx
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDefaultColor } from '@/hooks/useThemeColor';

export default function ModulesLayout() {
    const router = useRouter();
    const colors = useDefaultColor();

    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: colors.background },
                headerTitleStyle: { color: colors.text },
                headerTintColor: colors.text, // Geri butonunun rengi
                headerLeft: () => (
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ marginLeft: 16, marginRight: 16 }}
                    >
                        <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                ),
                headerShown: true, // Header'ı göster
            }}
        >
            <Stack.Screen
                name="oteller"
                options={{ title: 'Oteller' }}
            />
            <Stack.Screen
                name="indirimler"
                options={{ title: 'İndirimler' }}
            />
            <Stack.Screen
                name="haberler"
                options={{ title: 'Haberler' }}
            />
            <Stack.Screen
                name="duyurular"
                options={{ title: 'Duyurular' }}
            />
            <Stack.Screen
                name="bildirimler"
                options={{ title: 'Bildirimler' }}
            />
            <Stack.Screen
                name="egitim"
                options={{ title: 'Eğitim' }}
            />
        </Stack>
    );
}