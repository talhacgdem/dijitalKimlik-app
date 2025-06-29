import {Tabs} from 'expo-router';
import {MaterialIcons} from '@expo/vector-icons';
import {useAuth} from '../../contexts/AuthContext';
import {TouchableOpacity} from 'react-native';
import {useTheme} from '../../config/theme';
import {useThemeContext} from "../../contexts/ThemeContext";

export default function TabsLayout() {
    const {logout} = useAuth();
    const {toggleColorScheme} = useThemeContext();
    const {colors} = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerTitle: 'Dijital Kimlik App',
                headerStyle: {backgroundColor: colors.background},
                headerTitleStyle: {color: colors.text},
                headerLeft: () => (
                    <TouchableOpacity onPress={logout} style={{marginLeft: 16}}>
                        <MaterialIcons name="logout" size={24} color={colors.text}/>
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <TouchableOpacity onPress={toggleColorScheme} style={{marginRight: 16}}>
                        <MaterialIcons name="brightness-6" size={24} color={colors.text}/>
                    </TouchableOpacity>
                ),
                tabBarActiveTintColor: colors.tabIconSelected,
                tabBarInactiveTintColor: colors.tabIconDefault,
            }}
        >
            <Tabs.Screen name="index"
                         options={{title: 'Ana Sayfa', tabBarIcon: () => <MaterialIcons name="home" size={24}/>}}/>
            <Tabs.Screen name="profile"
                         options={{title: 'Profil', tabBarIcon: () => <MaterialIcons name="person" size={24}/>}}/>
            <Tabs.Screen name="digital-id"
                         options={{title: 'Dijital ID', tabBarIcon: () => <MaterialIcons name="qr-code" size={24}/>}}/>
            <Tabs.Screen name="about"
                         options={{title: 'Hakkımızda', tabBarIcon: () => <MaterialIcons name="info" size={24}/>}}/>
        </Tabs>
    );
}