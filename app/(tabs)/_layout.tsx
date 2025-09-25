import {Tabs} from 'expo-router';
import {useAuth} from '@/contexts/AuthContext';
import {useDefaultColor} from "@/hooks/useThemeColor";
import DKButton from "@/components/dk/Button";
import DKIcon from "@/components/dk/Icon";

export default function TabsLayout() {
    const {isAdmin, logout} = useAuth();
    let colors = useDefaultColor();
    return (
        <Tabs
            screenOptions={{
                headerTitle: 'Sağlık HAK-SEN',
                headerStyle: {backgroundColor: colors.background},
                headerTitleStyle: {color: colors.text},
                headerRight: () => (
                    <DKButton icon={{name: "logout"}} onPress={logout} type={"none"}
                              style={{marginRight: 16}}></DKButton>
                ),
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.text,
                tabBarShowLabel: false,
                tabBarStyle: {
                    height: 70,
                    paddingBottom: 20,
                    paddingTop: 10,
                    backgroundColor: colors.background,
                },
                tabBarIconStyle: {
                    width: 40,
                    height: 40,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Ana Sayfa',
                    tabBarIcon: ({color}) => (
                        <DKIcon name={"home"} size={32} color={color}/>
                    )
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profil',
                    tabBarIcon: ({color}) => (
                        <DKIcon name={"person"} size={32} color={color}/>
                    )
                }}
            />
            <Tabs.Screen
                name="about"
                options={{
                    title: 'Hakkımızda',
                    tabBarIcon: ({color}) => (
                        <DKIcon name={"info"} size={32} color={color}/>
                    )
                }}
            />
            <Tabs.Screen
                name="admin"
                options={{
                    title: 'Admin',
                    href: isAdmin ? '/admin' : null,
                    tabBarIcon: ({color}) => (
                        <DKIcon name={"admin-panel-settings"} size={32} color={color}/>
                    )
                }}
            />
        </Tabs>
    );
}
