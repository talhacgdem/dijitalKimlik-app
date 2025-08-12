// app/modules/AdminKullanicilar.tsx
import React from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from "react-native";

export default function AdminKullanicilar() {

    const loadData = async (page: number = 1, isRefresh: boolean = false) => {
        try {
            if (!isRefresh) {
                showLoading(loadingMessage);
            }

            setError(null);

            const response = await contentApiService.getContents(page);

            if (response.success) {
                setData(response.data);
                setPagination({
                    currentPage: response.meta.current_page,
                    lastPage: response.meta.last_page,
                });
            } else {
                setError(response.message || 'Veriler yüklenemedi');
            }
        } catch (err) {
            setError('Veriler yüklenirken bir hata oluştu');
            console.error(err);
        } finally {
            if (!isRefresh) {
                hideLoading();
            }
            setRefreshing(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Kullanıcı Yönetim Paneli</Text>
            </View>

            <FlatList
                data={users}
                renderItem={renderUserCard}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#2196F3',
        paddingVertical: 16,
        paddingHorizontal: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    listContainer: {
        padding: 16,
    },
});