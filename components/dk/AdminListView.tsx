import React, {useEffect, useState} from 'react';
import {Alert, FlatList, Image, RefreshControl, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {ImagePickerAsset} from 'expo-image-picker';
import {useDefaultColor} from '@/hooks/useThemeColor';
import DKModal from "@/components/dk/Modal";
import DKTextInput from "@/components/dk/TextInput";
import {useGlobalLoading} from "@/contexts/LoadingContext";
import DKCard from "@/components/dk/Card";
import DKPagination from "@/components/dk/Pagination";
import {BASE_STORAGE_URL} from "@/services/api/Endpoints";
import DKError from "@/components/dk/Error";
import DKButton from "@/components/dk/Button";
import {useAuth} from "@/contexts/AuthContext";
import {Content} from '@/types/v2/Content'
import {ContentService} from '@/services/api/ContentService'


interface AdminListViewProps {
    contentTypeId: string;
    title?: string;
    loadingMessage?: string;
    emptyMessage?: string;
    dates?: boolean;
    hasImage?: boolean;
}

export default function AdminListView({
                                          contentTypeId,
                                          title = 'Kayıtlar',
                                          loadingMessage = 'Yükleniyor...',
                                          emptyMessage = 'Görüntülenecek öğe bulunamadı',
                                          dates = false,
                                          hasImage = true
                                      }: AdminListViewProps) {
    const colors = useDefaultColor();
    const {showLoading, hideLoading} = useGlobalLoading();
    const {user} = useAuth();

    const [data, setData] = useState<Content[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<Content | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
    });

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<{
        title?: string;
        content?: string;
        image?: string;
        start_date?: string;
        end_date?: string;
    }>({});
    const [selectedImage, setSelectedImage] = useState<ImagePickerAsset | null>(null);

    // Kullanıcı admin mi kontrol et
    const isAdmin = user?.user_type === 'admin';

    const loadData = async (page: number = 1, isRefresh: boolean = false) => {
        try {
            if (!isRefresh) {
                showLoading(loadingMessage);
            }

            setError(null);

            const response = await ContentService.list({
                per_page: 15,
                page: page,
                content_type_id: contentTypeId,
            });

            if (response.success) {
                console.log(response)
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
    }, [contentTypeId]);

    const handlePageChange = (page: number) => {
        loadData(page, false);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadData(1, true);
    };

    const handleOpenModal = (item?: Content) => {
        if (!isAdmin) {
            Alert.alert('Yetki Hatası', 'Bu işlem için admin yetkisi gereklidir.');
            return;
        }

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
        if (!isAdmin) {
            Alert.alert('Yetki Hatası', 'Bu işlem için admin yetkisi gereklidir.');
            return;
        }

        if (!formData.title || !formData.content) {
            Alert.alert('Hata', 'Başlık ve İçerik alanları boş bırakılamaz!');
            return;
        }

        const dataToSave: any = {
            content_type_id: contentTypeId,
            title: formData.title,
            content: formData.content,
        };

        // Tarih alanları varsa ekle
        if (dates) {
            if (formData.start_date) dataToSave.start_date = formData.start_date;
            if (formData.end_date) dataToSave.end_date = formData.end_date;
        }

        // Resim varsa ekle
        if (hasImage) {
            if (selectedImage?.base64) {
                // Yeni resim seçildiyse base64 olarak gönder
                dataToSave.image = `data:image/jpeg;base64,${selectedImage.base64}`;
            } else if (formData.image && editMode) {
                // Güncelleme modunda mevcut resim varsa
                dataToSave.image = formData.image;
            }
        }

        if (editMode && selectedItem) {
            // Güncelleme
            const response = await ContentService.update(selectedItem.id, dataToSave);

            if (response.success) {
                Alert.alert('Başarılı', 'Kayıt güncellendi');
                resetModal();
                await loadData(pagination.currentPage);
            }
        } else {
            // Yeni kayıt
            const response = await ContentService.create(dataToSave);

            if (response.success) {
                Alert.alert('Başarılı', 'Kayıt oluşturuldu');
                resetModal();
                await loadData(1); // İlk sayfaya dön
            }
        }
    };

    const handleDelete = async (item: Content) => {
        if (!isAdmin) {
            Alert.alert('Yetki Hatası', 'Bu işlem için admin yetkisi gereklidir.');
            return;
        }

        Alert.alert('Sil', 'Bu kaydı silmek istediğinize emin misiniz?', [
            {text: 'İptal', style: 'cancel'},
            {
                text: 'Sil',
                style: 'destructive',
                onPress: async () => {
                    const response = await ContentService.delete(item.id);

                    if (response.success) {
                        Alert.alert('Başarılı', 'Kayıt silindi');

                        // Eğer sayfada tek kayıt varsa ve ilk sayfa değilse bir önceki sayfaya git
                        if (data.length === 1 && pagination.currentPage > 1) {
                            await loadData(pagination.currentPage - 1);
                        } else {
                            await loadData(pagination.currentPage);
                        }
                    }
                }
            }
        ]);
    };

    const handlePickImage = async () => {
        if (!hasImage) return;

        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('İzin gerekli!', 'Resim seçmek için izin vermelisiniz.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            quality: 0.8,
            aspect: [16, 9],
            base64: true,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0]);
        }
    };

    if (error && data.length === 0) {
        return (
            <DKError errorMessage={error} onPress={() => loadData()}/>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, {color: colors.text}]}>{title}</Text>
                {isAdmin && (
                    <DKButton
                        icon={{name: "add"}}
                        onPress={() => handleOpenModal()}
                        type={"primary"}
                    />
                )}
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
                            // Detay sayfasına gidebilir
                        }}
                        controlItems={isAdmin ? {
                            onEdit: () => handleOpenModal(item),
                            onRemove: () => handleDelete(item)
                        } : undefined}
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

            <DKModal
                modalHeader={editMode ? 'Güncelle' : 'Yeni Kayıt'}
                visible={modalVisible}
                onClose={handleCloseModal}
            >
                <DKTextInput
                    label="Başlık"
                    value={formData.title || ''}
                    onChange={(text) => setFormData({...formData, title: text})}
                    placeholder="Başlık giriniz"
                />
                <DKTextInput
                    label="İçerik"
                    multiline={true}
                    value={formData.content || ''}
                    onChange={(text) => setFormData({...formData, content: text})}
                    placeholder="İçerik giriniz"
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
                {hasImage && (
                    <>
                        <DKButton
                            label={"Resim Seç"}
                            icon={{name: "browse-gallery"}}
                            onPress={handlePickImage}
                            type={"secondary"}
                        />
                        {(formData.image || selectedImage) && (
                            <Image
                                source={{
                                    uri: selectedImage
                                        ? selectedImage.uri
                                        : `${BASE_STORAGE_URL}${formData.image}`
                                }}
                                style={styles.imagePreview}
                            />
                        )}
                    </>
                )}
                <View style={styles.modalButtons}>
                    <DKButton
                        label={editMode ? 'Güncelle' : 'Kaydet'}
                        onPress={handleSave}
                        type={"primary"}
                    />
                </View>
            </DKModal>
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
    }
});
