// app/components/GenericListView.tsx
import React, {useEffect, useState} from 'react';
import {FlatList, Image, RefreshControl, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDefaultColor} from '@/hooks/useThemeColor';
import DKModal from "@/components/dk/Modal";
import {formatDateString} from "@/utils/DateUtil";
import {useGlobalLoading} from "@/contexts/LoadingContext";
import DKCard from "@/components/dk/Card";
import {BASE_STORAGE_URL} from "@/services/api/Endpoints";
import DKPagination from "@/components/dk/Pagination";
import {modalStyles} from "@/constants/Styles";
import {Content} from "@/types/v2/Content";
import {ContentService} from "@/services/api/v2/ContentService";
import DKDivider from "@/components/dk/Divider";
import DKError from "@/components/dk/Error";
import DKButton from "@/components/dk/Button";


interface GenericListViewProps {
    emptyMessage?: string;
    loadingMessage?: string;
    modalHeader?: string;
    hasImage: boolean;
}

export default function GenericListView({
                                            emptyMessage = 'Görüntülenecek öğe bulunamadı',
                                            loadingMessage = 'Yükleniyor...',
                                            hasImage = false
                                        }: GenericListViewProps) {
    const colors = useDefaultColor();
    const {showLoading, hideLoading} = useGlobalLoading();

    const [data, setData] = useState<Content[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<Content | null>(null);
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

            const response = await ContentService.getContents(20, page, '');

            if (response.success) {
                setData(response.data);
                if (response.meta) {
                    setPagination({
                        currentPage: response.meta.current_page,
                        lastPage: response.meta.last_page,
                    });
                }
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
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    // Hata durumu
    if (error && data.length === 0) {
        return (
            <DKError errorMessage={error} onPress={loadData}/>
        );
    }

    const renderContentItem = (item: ContentItem, hasImage: boolean) => {
        if (hasImage) {
            return (
                <DKCard
                    title={item.title}
                    content={item.content}
                    image={item.image}
                    date={item.created_at}
                    onPress={() => handleItemPress(item)}
                />
            )
        } else {
            return (
                <View style={styles.itemContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <DKButton label={"Detay"} onPress={() => handleItemPress(item)} type={'primary'}></DKButton>
                </View>
            )
        }
    }

    return (
        <SafeAreaView edges={['bottom']} style={styles.container}>
            <FlatList
                data={data}
                renderItem={({item}) => renderContentItem(item, hasImage)}
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
                {hasImage && (
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
                        {formatDateString(selectedItem?.created_at)}
                    </Text>

                    <DKDivider/>

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
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f9f9f9',
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
    },
    detailButton: {
        backgroundColor: '#e44e01',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
