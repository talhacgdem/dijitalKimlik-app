import React, {useEffect, useState} from 'react';
import {Alert, FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useDefaultColor} from '@/hooks/useThemeColor';
import {useGlobalLoading} from "@/contexts/LoadingContext";
import DKContentCard from "@/components/dk/card/ContentCard";
import DKPagination from "@/components/dk/Pagination";
import DKError from "@/components/dk/Error";
import DKButton from "@/components/dk/Button";
import {Content} from '@/types/v2/Content'
import {ContentService} from '@/services/api/ContentService'
import {ContentType} from "@/types/v2/ContentType";
import ContentEditorModal from "@/components/dk/ContentEditorModal";
import ContentViewerModal from "@/components/dk/ContentViewerModal";

interface AdminListViewProps {
    contentType: ContentType;
    isAdmin?: boolean;
}

export default function DKContentListView({contentType, isAdmin = false}: AdminListViewProps) {
    const colors = useDefaultColor();
    const {showLoading, hideLoading} = useGlobalLoading();

    const [data, setData] = useState<Content[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [viewerModalVisible, setViewerModalVisible] = useState(false);
    const [selectedContent, setSelectedContent] = useState<Content | undefined>();

    const loadData = async (page: number = 1, isRefresh: boolean = false) => {
        try {
            if (!isRefresh) {
                showLoading(contentType.name + " yükleniyor...");
            }

            setError(null);
            const response = await ContentService.list({
                per_page: 15,
                page: page,
                content_type_id: contentType.id,
            });

            if (response.success) {
                // Response.data array olarak geliyor (Pageable yapısında)
                setData(Array.isArray(response.data) ? response.data : []);
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

    useEffect(() => {
        loadData();
    }, [contentType.id]);

    const handlePageChange = (page: number) => {
        loadData(page, false);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadData(1, true);
    };


    if (error && data.length === 0) {
        return (
            <DKError errorMessage={error} onPress={() => loadData()}/>
        );
    }

    const handleOpenEditorModal = (content?: Content) => {
        setSelectedContent(content);
        setModalVisible(true);
    }

    const handleOpenViewerModal = (content?: Content) => {
        setSelectedContent(content);
        setViewerModalVisible(true);
    }

    const handleDelete = async (item: Content) => {
        Alert.alert('Sil', 'Bu kaydı silmek istediğinize emin misiniz?', [
            {text: 'İptal', style: 'cancel'},
            {
                text: 'Sil',
                style: 'destructive',
                onPress: async () => {
                    const response = await ContentService.delete(item.id);

                    if (response.success) {
                        Alert.alert('Başarılı', 'Kayıt silindi');
                    }
                }
            }
        ]);
        loadData(1, true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, {color: colors.text}]}>Kayıtlar</Text>
                {isAdmin && (
                    <DKButton
                        icon={{name: "add"}}
                        onPress={() => handleOpenEditorModal()}
                        type={"primary"}
                    />
                )}
            </View>

            <FlatList
                data={data}
                renderItem={({item}) => (
                    <DKContentCard
                        content={item}
                        contentHasImage={contentType.has_image}
                        adminControls={
                            isAdmin
                                ? {
                                    onEdit: () => handleOpenEditorModal(item),
                                    onRemove: () => handleDelete(item),
                                }
                                : undefined
                        }
                        handlePress={isAdmin ? () => {
                        } : () => handleOpenViewerModal(item)}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{paddingBottom: 100}}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[colors.tint]}
                    />
                }
                ListEmptyComponent={
                    <Text style={[styles.emptyText, {color: colors.secondaryText}]}>
                        Görüntülenecek öğe bulunamadı
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

            <ContentEditorModal
                content={selectedContent}
                contentType={contentType}
                modalVisible={modalVisible}
                handleCloseModal={() => {
                    setModalVisible(false);
                    setSelectedContent(undefined);
                }}
                dataLoader={() => loadData(pagination.currentPage)}
            />

            <ContentViewerModal
                content={selectedContent!}
                contentType={contentType}
                modalVisible={viewerModalVisible}
                handleCloseModal={() => {
                    setViewerModalVisible(false);
                    setSelectedContent(undefined);
                }}
            />


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, padding: 16},
    header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16},
    title: {fontSize: 20, fontWeight: 'bold'},
    modalButtons: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 16},
    imagePreview: {width: '100%', height: 200, marginTop: 12, borderRadius: 6},
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
});
