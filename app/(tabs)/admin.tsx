import {RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Link} from 'expo-router';
import {MaterialIcons} from '@expo/vector-icons';
import {useDefaultColor} from "@/hooks/useThemeColor";
import React, {useEffect, useState} from "react";
import {ContentTypeService} from "@/services/api/content";
import {useGlobalLoading} from "@/contexts/LoadingContext";
import {SafeAreaView} from "react-native-safe-area-context";
import DKDivider from '@/components/dk/Divider';

type MenuItemProps = {
    icon: keyof typeof MaterialIcons.glyphMap;
    label: string;
    route: string;
    static: boolean;
    color?: string;
    contentTypeId?: number;
    contentTypeHasImage: boolean;
}

export default function Index() {
    let colors = useDefaultColor();
    const {showLoading, hideLoading} = useGlobalLoading();
    const [error, setError] = useState<string | null>(null);

    const [menuItems, setMenuItems] = useState<MenuItemProps[]>([]);

    const staticMenuItems: MenuItemProps[] = [
        {
            label: 'Kullanıcılar',
            icon: 'people',
            route: '/admin/kullanicilar',
            static: true,
            contentTypeHasImage: false,
        },
        {
            label: 'Modüller',
            icon: 'view-module',
            route: '/admin/module_manager',
            static: true,
            contentTypeHasImage: false,
        }
    ];

    const loadData = async () => {
        try {

            showLoading("Menüler yükleniyor");
            setError(null);
            const response = await ContentTypeService.getContentTypes();
            if (response.success) {
                const dynamicItems: MenuItemProps[] = response.data.map((item) => ({
                    label: item.name,
                    icon: item.icon,
                    route: '/admin/modules',
                    static: false,
                    contentTypeId: item.id,
                    contentTypeHasImage: item.hasImage.toString() === 'true',
                }));

                const menusfinal = [...staticMenuItems, ...dynamicItems];

                setMenuItems(menusfinal);
            } else {
                setError(response.message || 'Veriler yüklenemedi');
            }
        } catch (err) {
            setError('Veriler yüklenirken bir hata oluştu');
            console.error(err);
        } finally {
            hideLoading();

        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Hata durumu
    if (error) {
        return (
            <SafeAreaView edges={['bottom']} style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, {color: colors.error}]}>{error}</Text>
                    <TouchableOpacity
                        style={[styles.retryButton, {backgroundColor: colors.tint}]}
                        onPress={() => loadData()}
                    >
                        <Text style={styles.retryButtonText}>Tekrar Dene</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Yönetim Paneli</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.menuGrid}
                showsVerticalScrollIndicator={false}
            >

                    {menuItems.filter(item => item.static).map((item, index) => (
                        <Link key={index} href={item.route as any} asChild>
                            <TouchableOpacity style={styles.menuItem}>
                                <View style={[styles.iconContainer, {backgroundColor: item.color}]}>
                                    <MaterialIcons name={item.icon} size={48} color={colors.primary}/>
                                </View>
                                <Text style={styles.menuItemText}>{item.label}</Text>
                            </TouchableOpacity>
                        </Link>
                    ))}

                    <View style={{width: '100%', marginVertical: 8}}>
                        <DKDivider/>
                    </View>

                    {menuItems.filter(item => !item.static).map((item, index) => (
                        <Link key={index} href={{
                            pathname: "/admin/modules",
                            params: {
                                id: item.contentTypeId,
                                name: item.label,
                                icon: item.icon,
                                hasImage: item.contentTypeHasImage.toString()
                            }
                        }} asChild>
                            <TouchableOpacity style={styles.menuItem}>
                                <View style={[styles.iconContainer, {backgroundColor: item.color}]}>
                                    <MaterialIcons name={item.icon} size={48} color={colors.primary}/>
                                </View>
                                <Text style={styles.menuItemText}>{item.label}</Text>
                            </TouchableOpacity>
                        </Link>
                    ))}

            </ScrollView>
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    errorText: {
        fontSize: 16,
        marginBottom: 16,
        textAlign: 'center',
    },
    retryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        padding: 24,
        fontSize: 16,
    }
});
