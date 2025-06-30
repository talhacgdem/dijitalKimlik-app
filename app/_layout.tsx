import {Slot} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ThemeProvider, useThemeContext} from '@/contexts/ThemeContext';
import {AuthProvider} from '@/contexts/AuthContext';
import {StatusBar, View} from 'react-native';


function InnerLayout() {
    const {colors, colorScheme} = useThemeContext();
    console.log("Tema güncellendi, yeni arkaplan rengi", colors.background);
    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
                <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}/>
                <Slot/>
            </SafeAreaView>
        </View>
    );
}

export default function RootLayout() {

    return (
        <ThemeProvider>
            <AuthProvider>
                <InnerLayout/>
            </AuthProvider>
        </ThemeProvider>
    );
}