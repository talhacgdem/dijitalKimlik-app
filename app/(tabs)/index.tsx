import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Link} from 'expo-router';
import {ContentType, ContentTypeService} from "@/services/api/content";
import React, {useEffect, useState} from "react";
import {useGlobalLoading} from '@/contexts/LoadingContext';
import DKIcon from "@/components/dk/Icon";
import {SafeAreaView} from "react-native-safe-area-context";
import {useDefaultColor} from "@/hooks/useThemeColor";

export default function Index() {
    const {showLoading, hideLoading} = useGlobalLoading();
    const colors = useDefaultColor();
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ContentType[]>([]);


    const loadData = async () => {
        try {
            showLoading("Menüler yükleniyor");
            setError(null);
            const response = await ContentTypeService.getContentTypes();
            if (response.success) {
                setData(response.data);
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
    if (error && data.length === 0) {
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
                <Text style={styles.welcomeText}>Hoş Geldiniz</Text>
            </View>

            <View style={styles.menuGrid}>
                {data.map((item, index) => (
                    <Link key={index} href={{
                        pathname: '/modules',
                        params: {
                            id: item.id.toString(),
                            name: item.name,
                            icon: item.icon,
                            hasImage: item.hasImage.toString()
                        }
                    }} asChild>
                        <TouchableOpacity style={styles.menuItem}>
                            <View style={styles.iconContainer}>
                                <DKIcon name={item.icon}/>
                            </View>
                            <Text style={styles.menuItemText}>{item.name}</Text>
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
