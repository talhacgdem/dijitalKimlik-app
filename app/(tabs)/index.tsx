import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import { router } from 'expo-router';

const MODULES = [
    { id: 'oteller', title: 'Oteller', icon: 'hotel' },
    { id: 'egitim', title: 'Eğitim', icon: 'school' },
    { id: 'duyurular', title: 'Duyurular', icon: 'campaign' },
    { id: 'haberler', title: 'Haberler', icon: 'article' },
    { id: 'bildirimler', title: 'Bildirimler', icon: 'notifications' },
    { id: 'indirimler', title: 'İndirimler', icon: 'local-offer' },
];

export default function HomeScreen() {
    const { colors, spacing, borderRadius } = useTheme();

    return (
        <FlatList
            data={MODULES}
            numColumns={2}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: spacing.md, backgroundColor: colors.background }}
            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: spacing.md }}
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => router.push(`/modules/${item.id}`)}
                    style={{
                        backgroundColor: colors.background,
                        flex: 0.48,
                        aspectRatio: 1,
                        borderRadius: borderRadius.md,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <MaterialIcons name={item.icon} size={32} color={colors.text} />
                    <Text style={{ color: colors.text, marginTop: spacing.sm }}>{item.title}</Text>
                </TouchableOpacity>
            )}
        />
    );
}
