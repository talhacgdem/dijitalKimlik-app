import {FlatList, Text, TouchableOpacity} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import {Href, router} from 'expo-router';
import {useThemeContext} from "@/contexts/ThemeContext";

type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

const MODULES: { id: string; title: string; icon: MaterialIconName; href: Href }[] = [
    {id: 'oteller', title: 'Oteller', icon: 'hotel', href: '/modules/oteller'},
    {id: 'egitim', title: 'Eğitim', icon: 'school', href: '/modules/egitim'},
    {id: 'duyurular', title: 'Duyurular', icon: 'campaign', href: '/modules/duyurular'},
    {id: 'haberler', title: 'Haberler', icon: 'article', href: '/modules/haberler'},
    {id: 'bildirimler', title: 'Bildirimler', icon: 'notifications', href: '/modules/bildirimler'},
    {id: 'indirimler', title: 'İndirimler', icon: 'local-offer', href: '/modules/indirimler'},
];

export default function HomeScreen() {
    const {colors} = useThemeContext();

    return (
        <FlatList
            data={MODULES}
            numColumns={2}
            keyExtractor={(item) => item.id}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            renderItem={({item}) => (
                <TouchableOpacity
                    onPress={() => router.push(item.href)}
                    style={{
                        flex: 0.48,
                        aspectRatio: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <MaterialIcons name={item.icon} size={32} color={colors.text}/>
                    <Text style={{color: colors.text}}>{item.title}</Text>
                </TouchableOpacity>
            )}
        />
    );
}
