import {Tabs} from 'expo-router';
import {MaterialIcons} from '@expo/vector-icons';
import {useAuth} from '@/contexts/AuthContext';
import {TouchableOpacity} from 'react-native';
import {useDefaultColor} from "@/hooks/useThemeColor";

export default function TabsLayout() {
    const {logout} = useAuth();
    let colors = useDefaultColor();
    return (
        <Tabs
            screenOptions={{
                headerTitle: 'Sağlık HAK SEN',
                headerStyle: {backgroundColor: colors.background},
                headerTitleStyle: {color: colors.text},
                headerRight: () => (
                    <TouchableOpacity onPress={logout} style={{marginRight: 16}}>
                        <MaterialIcons name="logout" size={24} color={colors.text}/>
                    </TouchableOpacity>
                ),
                tabBarActiveTintColor: colors.text,
                tabBarInactiveTintColor: colors.tabIconSelected,
                tabBarShowLabel: false,
                tabBarStyle: {
                    height: 70, // Tab bar yüksekliğini artırın
                    paddingBottom: 20, // Alt boşluğu ayarlayın
                    paddingTop: 10, // Üst boşluğu ayarlayın
                },
                tabBarIconStyle: {
                    width: 40, // İkon alanını genişletin
                    height: 40, // İkon alanını yükseltin
                },

            }}
        >
            <Tabs.Screen name="index"
                         options={{title: 'Ana Sayfa', tabBarIcon: () => <MaterialIcons name="home" size={32}/>}}/>
            <Tabs.Screen name="profile"
                         options={{title: 'Profil', tabBarIcon: () => <MaterialIcons name="person" size={32}/>}}/>
            <Tabs.Screen name="digital-id"
                         options={{title: 'Dijital ID', tabBarIcon: () => <MaterialIcons name="qr-code" size={32}/>}}/>
            <Tabs.Screen name="about"
                         options={{title: 'Hakkımızda', tabBarIcon: () => <MaterialIcons name="info" size={32}/>}}/>
        </Tabs>
    );
}