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
import {ContentItem, ContentResponse} from "@/types/ContentTypes";
import DKCard from "@/components/dk/Card";
import DKPagination from "@/components/dk/Pagination";
import {BASE_STORAGE_URL} from "@/services/api/Endpoints";

interface AdminListViewProps<T extends ContentItem> {
    fetchData: (page: number) => Promise<ContentResponse<T>>;
    createItem: (data: Partial<T>) => Promise<void>;
    updateItem: (item: T, data: Partial<T>) => Promise<ContentResponse<T>>;
    deleteItem: (item: T) => Promise<void>;
    title?: string;
    loadingMessage?: string;
    emptyMessage?: string;
}

export default function AdminListView<T extends ContentItem>({
                                                                 fetchData,
                                                                 createItem,
                                                                 updateItem,
                                                                 deleteItem,
                                                                 title = 'Kayıtlar',
                                                                 loadingMessage = 'Yükleniyor...',
                                                                 emptyMessage = 'Görüntülenecek öğe bulunamadı'
                                                             }: AdminListViewProps<T>) {
    const colors = useDefaultColor();
    const {showLoading, hideLoading} = useGlobalLoading();

    const [data, setData] = useState<T[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<T | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
    });

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<Partial<T>>({});
    const [selectedImage, setSelectedImage] = useState<ImagePickerAsset | null>(null);

    const loadData = async (page: number = 1, isRefresh: boolean = false) => {
        try {
            if (!isRefresh) {
                showLoading(loadingMessage);
            }

            setError(null);

            const response = await fetchData(page);

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

    const handleOpenModal = (item?: T) => {
        if (item) {
            setEditMode(true);
            setFormData(item);
            setSelectedItem(item);
        } else {
            setEditMode(false);
            setFormData({});
            setSelectedItem(null);
        }
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        if (formData.title || formData.content || selectedImage) {
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
                Alert.alert('Hata', 'Başlık ve İçerik alanları boş bırakılamaz!');
                return;
            }

            console.log(selectedImage?.base64);

            const dataToSave = {
                ...formData,
                image: selectedImage?.base64,
            };

            if (editMode && selectedItem != null) {
                await updateItem(selectedItem, dataToSave);
            } else {
                await createItem(dataToSave);
            }

            resetModal();
            await loadData();
        } catch (e) {
            Alert.alert('Hata', 'Kaydetme sırasında bir sorun oluştu.');
        }
    };

    const handleDelete = async (item: T) => {
        Alert.alert('Sil', 'Bu kaydı silmek istediğinize emin misiniz?', [
            {text: 'İptal', style: 'cancel'},
            {
                text: 'Sil',
                style: 'destructive',
                onPress: async () => {
                    await deleteItem(item);
                    await loadData();
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
                    value={formData.title?.toString() || ''}
                    onChange={(text) => setFormData({...formData, title: text})}
                />
                <DKTextInput
                    label="İçerik"
                    multiline={true}
                    value={formData.content?.toString() || ''}
                    onChange={(text) => setFormData({...formData, content: text})}
                />
                <TouchableOpacity style={[styles.imagePickerButton, {backgroundColor: colors.tint}]}
                                  onPress={handlePickImage}>
                    <Text style={{color: 'white'}}>Resim Seç</Text>
                </TouchableOpacity>
                {(formData.image || selectedImage) && (
                    <Image
                        source={{
                            uri: selectedImage ? selectedImage.uri: `${BASE_STORAGE_URL}${formData.image}`
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
    );
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