import {Tabs} from 'expo-router';
import {MaterialIcons} from '@expo/vector-icons';
import {useAuth} from '@/contexts/AuthContext';
import {TouchableOpacity} from 'react-native';
import {useDefaultColor} from "@/hooks/useThemeColor";

export default function TabsLayout() {
    const {logout, user} = useAuth();
    let colors = useDefaultColor();
    return (
        <Tabs
            screenOptions={{
                headerTitle: 'Sağlık HAK-SEN',
                headerStyle: {backgroundColor: colors.background},
                headerTitleStyle: {color: colors.text},
                headerRight: () => (
                    <TouchableOpacity onPress={logout} style={{marginRight: 16}}>
                        <MaterialIcons name="logout" size={24} color={colors.text}/>
                    </TouchableOpacity>
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
                        <MaterialIcons
                            name="home"
                            size={32}
                            color={color}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profil',
                    tabBarIcon: ({color}) => (
                        <MaterialIcons
                            name="person"
                            size={32}
                            color={color}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="about"
                options={{
                    title: 'Hakkımızda',
                    tabBarIcon: ({color}) => (
                        <MaterialIcons
                            name="info"
                            size={32}
                            color={color}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="admin"
                options={{
                    title: 'Admin',
                    href: user?.is_admin ? '/admin' : null,
                    tabBarIcon: ({color}) => (
                        <MaterialIcons
                            name="admin-panel-settings"
                            size={32}
                            color={color}
                        />
                    )
                }}
            />
        </Tabs>
    );
}
