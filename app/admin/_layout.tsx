// app/admin/_layout.tsx
import {Stack, useLocalSearchParams, useRouter} from 'expo-router';
import {TouchableOpacity} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import {useDefaultColor} from '@/hooks/useThemeColor';

export default function ModulesLayout() {
    const router = useRouter();
    const colors = useDefaultColor();

    const {id, name, hasImage, icon} = useLocalSearchParams<{
        id: string,
        name: string,
        hasImage: string,
        icon: keyof typeof MaterialIcons.glyphMap
    }>();

    return (
        <Stack
            screenOptions={{
                headerStyle: {backgroundColor: colors.background},
                headerTitleStyle: {color: colors.text},
                headerTintColor: colors.text, // Geri butonunun rengi
                headerLeft: () => (
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{marginLeft: 16, marginRight: 16}}
                    >
                        <MaterialIcons name="arrow-back" size={24} color={colors.text}/>
                    </TouchableOpacity>
                ),
                headerShown: true, // Header'ı göster
            }}
        >
            <Stack.Screen
                name="kullanicilar"
                options={{title: 'Kullanıcı Yönetimi'}}
            />
            <Stack.Screen
                name="module_manager"
                options={{title: 'Modül Yönetimi'}}
            />
            <Stack.Screen
                name="modules"
                options={{title: name + ' (Admin)'}}
            />
        </Stack>
    );
}