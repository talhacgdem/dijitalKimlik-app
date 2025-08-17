import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Link} from 'expo-router';
import {MaterialIcons} from '@expo/vector-icons';
import {useDefaultColor} from "@/hooks/useThemeColor";

type MenuItemProps = {
    icon: keyof typeof MaterialIcons.glyphMap;
    label: string;
    route: string;
    color?: string;
}

export default function Index() {
    let colors = useDefaultColor();
    const menuItems: MenuItemProps[] = [
        {label: 'Kullanıcılar', icon: 'people', route: '/admin/kullanicilar'},
        {label: 'Duyurular', icon: 'campaign', route: '/admin/duyurular'},
        {label: 'Haberler', icon: 'article', route: '/admin/haberler'},
        {label: 'Kampanyalar', icon: 'local-offer', route: '/admin/kampanyalar'},
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Yönetim Paneli</Text>
            </View>

            <View style={styles.menuGrid}>
                {menuItems.map((item, index) => (
                    <Link key={index} href={item.route as any} asChild>
                        <TouchableOpacity style={styles.menuItem}>
                            <View style={[styles.iconContainer, {backgroundColor: item.color}]}>
                                <MaterialIcons name={item.icon} size={48} color={colors.primary}/>
                            </View>
                            <Text style={styles.menuItemText}>{item.label}</Text>
                        </TouchableOpacity>
                    </Link>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        marginBottom: 30,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subText: {
        fontSize: 16,
        color: '#666',
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    menuItem: {
        width: '48%',
        marginBottom: 20,
        alignItems: 'center',
    },
    iconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    menuItemText: {
        fontSize: 24,
        textAlign: 'center',
    },
});
