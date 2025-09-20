import React, {useEffect, useState} from 'react';
import {
    Alert,
    FlatList,
    Image,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {ImagePickerAsset} from 'expo-image-picker';
import {useDefaultColor} from '@/hooks/useThemeColor';
import DKModal from "@/components/dk/Modal";
import DKTextInput from "@/components/dk/TextInput";
import {useGlobalLoading} from "@/contexts/LoadingContext";
import DKCard from "@/components/dk/Card";
import DKPagination from "@/components/dk/Pagination";
import {BASE_STORAGE_URL} from "@/services/api/Endpoints";
import {ContentItem, NewContentRequest, UpdateContentRequest} from "@/types/ContentTypes";
import {ContentService} from "@/services/api/content";

interface AdminListViewProps {
    contentApiService: ContentService;
    title?: string;
    loadingMessage?: string;
    emptyMessage?: string;
    dates?: boolean;
    hasImage: boolean;
}

export default function AdminListView({
                                          contentApiService,
                                          title = 'Kayıtlar',
                                          loadingMessage = 'Yükleniyor...',
                                          emptyMessage = 'Görüntülenecek öğe bulunamadı',
                                          dates = false,
                                          hasImage
                                      }: AdminListViewProps) {
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

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<Partial<NewContentRequest & UpdateContentRequest>>({});
    const [selectedImage, setSelectedImage] = useState<ImagePickerAsset | null>(null);

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

    useEffect(() => {
        loadData().then(r => console.log("admin load data", r));
    }, []);

    const handlePageChange = (page: number) => {
        loadData(page, false);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadData(1, true);
    };

    const handleOpenModal = (item?: ContentItem) => {
        if (item) {
            setEditMode(true);
            setFormData({
                title: item.title,
                content: item.content,
                image: item.image,
                start_date: item.start_date || '',
                end_date: item.end_date || '',
            });
            setSelectedItem(item);
        } else {
            setEditMode(false);
            setFormData({
                title: '',
                content: '',
                image: '',
                start_date: '',
                end_date: '',
            });
            setSelectedItem(null);
        }
        setSelectedImage(null);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        const hasChanges = formData.title || formData.content || selectedImage;

        if (hasChanges) {
            Alert.alert(
                'Uyarı',
                'Kaydedilmemiş değişiklikler var. Çıkmak istediğinizden emin misiniz?',
                [
                    {text: 'Hayır', style: 'cancel'},
                    {text: 'Evet', onPress: () => resetModal()},
                ]
            );
        } else {
            resetModal();
        }
    };

    const resetModal = () => {
        setEditMode(false);
        setFormData({});
        setSelectedItem(null);
        setSelectedImage(null);
        setModalVisible(false);
    };

    const handleSave = async () => {
        try {
            if (!formData.title || !formData.content) {
                Alert.alert('Hata', 'Başlık, İçerik alanları boş bırakılamaz!');
                return;
            }

            const dataToSave = {
                title: formData.title,
                content: formData.content,
                start_date: formData.start_date,
                end_date: formData.end_date,
                image: selectedImage?.base64 || formData.image,
            };

            if (editMode && selectedItem != null) {
                const updateData: Partial<UpdateContentRequest> = dataToSave;
                await contentApiService.updateContent(selectedItem.id, updateData);
            } else {
                const createData: Partial<NewContentRequest> = dataToSave;
                await contentApiService.createContent(createData);
            }

            resetModal();
            await loadData();
        } catch (e) {
            Alert.alert('Hata', 'Kaydetme sırasında bir sorun oluştu.');
            console.error(e);
        }
    };

    const handleDelete = async (item: ContentItem) => {
        Alert.alert('Sil', 'Bu kaydı silmek istediğinize emin misiniz?', [
            {text: 'İptal', style: 'cancel'},
            {
                text: 'Sil',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await contentApiService.deleteContent(item.id);
                        await loadData();
                    } catch (e) {
                        Alert.alert('Hata', 'Silme sırasında bir sorun oluştu.');
                        console.error(e);
                    }
                }
            }
        ]);
    };

    const handlePickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('İzin gerekli!', 'Resim seçmek için izin vermelisiniz.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            quality: 1,
            aspect: [16, 9],
            base64: true,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0]);
        }
    };

    if (error && data.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
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
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, {color: colors.text}]}>{title}</Text>
                <TouchableOpacity style={[styles.addButton, {backgroundColor: colors.primary}]}
                                  onPress={() => handleOpenModal()}>
                    <Text style={styles.addButtonText}>+ Ekle</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={data}
                renderItem={({item}) => (
                    <DKCard
                        title={item.title}
                        content={item.content}
                        image={item.image}
                        date={item.created_at}
                        onPress={() => {
                        }}
                        controlItems={{
                            onEdit: () => handleOpenModal(item),
                            onRemove: () => handleDelete(item)
                        }}
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

            <DKModal modalHeader={editMode ? 'Güncelle' : 'Yeni Kayıt'} visible={modalVisible}
                     onClose={handleCloseModal}>
                <DKTextInput
                    label="Başlık"
                    value={formData.title || ''}
                    onChange={(text) => setFormData({...formData, title: text})}
                />
                <DKTextInput
                    label="İçerik"
                    multiline={true}
                    value={formData.content || ''}
                    onChange={(text) => setFormData({...formData, content: text})}
                />
                {dates && (
                    <>
                        <DKTextInput
                            label="Başlangıç Tarihi (YYYY-MM-DD)"
                            value={formData.start_date || ''}
                            onChange={(text) => setFormData({...formData, start_date: text})}
                            placeholder="2024-01-01"
                        />
                        <DKTextInput
                            label="Bitiş Tarihi (YYYY-MM-DD)"
                            value={formData.end_date || ''}
                            onChange={(text) => setFormData({...formData, end_date: text})}
                            placeholder="2024-12-31"
                        />
                    </>
                )}
                <TouchableOpacity style={[styles.imagePickerButton, {backgroundColor: colors.tint}]}
                                  onPress={handlePickImage}>
                    <Text style={{color: 'white'}}>Resim Seç</Text>
                </TouchableOpacity>
                {(formData.image || selectedImage) && (
                    <Image
                        source={{
                            uri: selectedImage ? selectedImage.uri : `${BASE_STORAGE_URL}${formData.image}`
                        }}
                        style={styles.imagePreview}
                    />
                )}
                <View style={styles.modalButtons}>
                    <TouchableOpacity style={[styles.modalButton, {backgroundColor: colors.tint}]}
                                      onPress={handleSave}>
                        <Text style={{color: 'white'}}>{editMode ? 'Güncelle' : 'Kaydet'}</Text>
                    </TouchableOpacity>
                </View>
            </DKModal>
        </SafeAreaView>
    )
        ;
}

const styles = StyleSheet.create({
    container: {flex: 1, padding: 16},
    header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16},
    title: {fontSize: 20, fontWeight: 'bold'},
    addButton: {paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6},
    addButtonText: {color: 'white', fontWeight: 'bold'},
    itemCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        elevation: 2,
    },
    itemTitle: {fontSize: 16, fontWeight: '600'},
    actions: {flexDirection: 'row', gap: 12},
    modalContainer: {flex: 1, padding: 16},
    modalTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 12},
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 8,
        marginBottom: 12,
    },
    modalButtons: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 16},
    modalButton: {padding: 12, borderRadius: 6},
    imagePickerButton: {padding: 12, borderRadius: 6, marginTop: 12},
    imagePreview: {width: 200, height: 200, marginTop: 12, borderRadius: 6},
    emptyText: {
        textAlign: 'center',
        padding: 24,
        fontSize: 16,
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
});