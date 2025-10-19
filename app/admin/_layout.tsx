// app/admin/_layout.tsx
import {Stack, useLocalSearchParams, useRouter} from 'expo-router';
import {useDefaultColor} from '@/hooks/useThemeColor';
import DKButton from "@/components/dk/Button";
import {ContentType} from "@/types/v2/ContentType";

export default function ModulesLayout() {
    const router = useRouter();
    const colors = useDefaultColor();

    const {contentTypeData} = useLocalSearchParams<{ contentTypeData: string }>();
    let contentType: ContentType = JSON.parse(contentTypeData)["contentType"] as ContentType;

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
                options={{title: contentType.name + ' (Admin)'}}
            />
        </Stack>
    );
}