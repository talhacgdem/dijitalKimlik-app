// app/components/GenericListView.tsx
import React, {useEffect, useState} from 'react';
import {FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDefaultColor} from '@/hooks/useThemeColor';
import DKModal from "@/components/dk/Modal";
import {formatDate} from "@/utils/DateUtil";
import {useGlobalLoading} from "@/contexts/LoadingContext";
import DKCard from "@/components/dk/Card";
import {BASE_STORAGE_URL} from "@/services/api/Endpoints";
import DKPagination from "@/components/dk/Pagination";
import {modalStyles} from "@/constants/Styles";
import {ContentItem} from "@/types/ContentTypes";
import {ContentApiService} from "@/services/api/contents";


interface GenericListViewProps {
    contentApiService: ContentApiService;
    emptyMessage?: string;
    loadingMessage?: string;
    modalHeader?: string;
}

export default function GenericListView({
                                            contentApiService,
                                            emptyMessage = 'Görüntülenecek öğe bulunamadı',
                                            loadingMessage = 'Yükleniyor...'
                                        }: GenericListViewProps) {
    const colors = useDefaultColor();
    const {showLoading, hideLoading} = useGlobalLoading();

    const [data, setData] = useState<ContentItem[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
    });

    const loadData = async (page: number = 1, isRefresh: boolean = false) => {
        try {
            // Refresh değilse global loading göster
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

    const handlePageChange = (page: number) => {
        loadData(page, false);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadData(1, true);
    };

    const handleItemPress = (item: ContentItem) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedItem(null);
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
        <SafeAreaView edges={['bottom']} style={styles.container}>
            <FlatList
                data={data}
                renderItem={({item}) => (
                    <DKCard
                        title={item.title}
                        content={item.content}
                        image={item.image}
                        date={item.created_at}
                        onPress={() => handleItemPress(item)}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={[styles.listContent, {paddingBottom: 100}]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[colors.tint]}
                    />
                }
                ListEmptyComponent={
                    <Text style={[styles.emptyText, {color: colors.secondaryText}]}>
                        {emptyMessage}
                    </Text>
                }
            />

            {pagination.lastPage > 1 && (
                <DKPagination
                    currentPage={pagination.currentPage}
                    lastPage={pagination.lastPage}
                    onPageChange={handlePageChange}
                />
            )}

            <DKModal visible={modalVisible} onClose={handleCloseModal}>
                {selectedItem?.image && (
                    <Image
                        source={{uri: `${BASE_STORAGE_URL}${selectedItem?.image}`}}
                        style={modalStyles.modalImage}
                        resizeMode="cover"
                    />
                )}

                <View style={modalStyles.textContent}>
                    <Text style={[modalStyles.itemTitle, {color: colors.text}]}>
                        {selectedItem?.title}
                    </Text>
                    <Text style={[modalStyles.date, {color: colors.secondaryText}]}>
                        {formatDate(selectedItem?.created_at)}
                    </Text>

                    <View>
                        <Text style={{color: colors.text, fontSize: 16, lineHeight: 24, marginBottom: 16}}>
                            {selectedItem?.content}
                        </Text>
                    </View>
                </View>
            </DKModal>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: 16,
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
