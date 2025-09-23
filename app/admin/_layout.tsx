// app/admin/_layout.tsx
import {Stack, useLocalSearchParams, useRouter} from 'expo-router';
import {useDefaultColor} from '@/hooks/useThemeColor';
import DKButton from "@/components/dk/Button";

export default function ModulesLayout() {
    const router = useRouter();
    const colors = useDefaultColor();

    const {name} = useLocalSearchParams<{ name: string }>();

    return (
        <Stack
            screenOptions={{
                headerStyle: {backgroundColor: colors.background},
                headerTitleStyle: {color: colors.text},
                headerTintColor: colors.text, // Geri butonunun rengi
                headerLeft: () => (
                    <DKButton
                        icon={{name:"arrow-back"}}
                        onPress={() => router.back()}
                        type={"none"}
                        style={{marginLeft: 16, marginRight: 16}}
                    ></DKButton>
                ),
                headerShown: true,
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