import React, {useEffect, useState} from 'react';
import {Alert, FlatList, Image, RefreshControl, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {ImagePickerAsset} from 'expo-image-picker';
import {useDefaultColor} from '@/hooks/useThemeColor';
import {useGlobalLoading} from "@/contexts/LoadingContext";
import {imageUrlBuilder} from "@/services/api/Endpoints";
import {UserService} from '@/services/api/UserService';
import {User, UserCreateRequest, UserUpdateRequest} from '@/types/v2/User';
import DKButton from '@/components/dk/Button';
import DKError from "@/components/dk/Error";
import DKModal from "@/components/dk/Modal";
import DKPagination from "@/components/dk/Pagination";
import DKTextInput from "@/components/dk/TextInput";
import DKUserCard from "@/components/dk/card/UserCard";

interface AdminUserListViewProps {
    title?: string;
    loadingMessage?: string;
    emptyMessage?: string;
}

export default function AdminUserListView({
                                              title = 'Kullanıcı Yönetimi',
                                              loadingMessage = 'Kullanıcılar yükleniyor...',
                                              emptyMessage = 'Henüz kullanıcı bulunmuyor'
                                          }: AdminUserListViewProps) {
    const colors = useDefaultColor();
    const {showLoading, hideLoading} = useGlobalLoading();

    const [data, setData] = useState<User[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<User | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
    });

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<Partial<UserCreateRequest & UserUpdateRequest>>({});
    const [selectedImage, setSelectedImage] = useState<ImagePickerAsset | null>(null);

    const loadData = async (page: number = 1, isRefresh: boolean = false) => {
        try {
            if (!isRefresh) {
                showLoading(loadingMessage);
            }

            setError(null);

            const response = await UserService.list({page: page});

            if (response.success) {
                setData(response.data);
                if (response.meta) {
                    setPagination({
                        currentPage: response.meta.current_page,
                        lastPage: response.meta.last_page,
                    });
                }
            } else {
                setError(response.message || 'Kullanıcılar yüklenemedi');
            }
        } catch (err) {
            setError('Kullanıcılar yüklenirken bir hata oluştu');
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
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const handlePageChange = (page: number) => {
        loadData(page, false);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadData(1, true);
    };

    const handleOpenModal = (item?: User) => {
        if (item) {
            setEditMode(true);
            setFormData({
                name: item.name,
                phone: item.phone,
                email: item.email,
                job: item.job,
                image: item.image,
            });
            setSelectedItem(item);
        } else {
            setEditMode(false);
            setFormData({
                identity_number: '',
                name: '',
                phone: '',
                email: '',
                job: '',
                image: '',
                password: ''
            });
            setSelectedItem(null);
        }
        setSelectedImage(null);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        const hasChanges = formData.name || formData.email || selectedImage;

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
            showLoading(editMode ? 'Kullanıcı güncelleniyor...' : 'Kullanıcı oluşturuluyor...');

            // Form validasyonu
            if (!formData.name || !formData.email) {
                Alert.alert('Hata', 'Ad ve email alanları zorunludur.');
                return;
            }

            if (!editMode && !formData.password) {
                Alert.alert('Hata', 'Yeni kullanıcı için şifre zorunludur.');
                return;
            }

            if (editMode && selectedItem) {
                // Update işlemi - JSON olarak gönder
                const updateData: UserUpdateRequest = {
                    identity_number: formData.identity_number || '',
                    name: formData.name || '',
                    phone: formData.phone || '',
                    email: formData.email || '',
                    job: formData.job || '',
                };

                const response = await UserService.update(selectedItem.id, updateData);

                if (response.success) {
                    Alert.alert('Başarılı', 'Kullanıcı başarıyla güncellendi.');
                } else {
                    Alert.alert('Hata', response.message || 'Güncelleme sırasında bir hata oluştu.');
                    return;
                }
            } else {
                // Create işlemi - FormData olarak gönder
                const createData: UserCreateRequest = {
                    name: formData.name || '',
                    phone: formData.phone || '',
                    email: formData.email || '',
                    job: formData.job || '',
                    password: formData.password || '',
                };

                const response = await UserService.create(createData);

                if (response.success) {
                    Alert.alert('Başarılı', 'Kullanıcı başarıyla oluşturuldu.');
                } else {
                    Alert.alert('Hata', response.message || 'Oluşturma sırasında bir hata oluştu.');
                    return;
                }
            }

            resetModal();
            await loadData();
        } catch (error) {
            console.error('Save error:', error);
            Alert.alert('Hata', 'İşlem sırasında bir hata oluştu.');
        } finally {
            hideLoading();
        }
    };

    const handleDelete = async (item: User) => {
        Alert.alert('Kullanıcıyı Sil', 'Bu kullanıcıyı silmek istediğinize emin misiniz?', [
            {text: 'İptal', style: 'cancel'},
            {
                text: 'Sil',
                style: 'destructive',
                onPress: async () => {
                    try {
                        showLoading('Kullanıcı siliniyor...');
                        const response = await UserService.delete(item.id);

                        if (response.success) {
                            Alert.alert('Başarılı', 'Kullanıcı başarıyla silindi.');
                            await loadData();
                        } else {
                            Alert.alert('Hata', response.message || 'Silme sırasında bir hata oluştu.');
                        }
                    } catch (e) {
                        Alert.alert('Hata', 'Silme sırasında bir sorun oluştu.');
                        console.error(e);
                    } finally {
                        hideLoading();
                    }
                }
            }
        ]);
    };

    if (error && data.length === 0) {
        return (
            <DKError errorMessage={error} onPress={loadData}></DKError>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, {color: colors.text}]}>{title}</Text>
                <DKButton label={"+ Kullanıcı Ekle"} onPress={() => handleOpenModal()} type={'primary'}></DKButton>
            </View>

            <FlatList
                data={data}
                renderItem={({item}) => (
                    <DKUserCard
                        user={item}
                        onPress={() => {
                        }}
                        controlItems={{
                            onEdit: () => handleOpenModal(item),
                            onRemove: () => handleDelete(item)
                        }}
                    />
                )
                }
                keyExtractor={(item) => item.id}
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
                modalHeader={editMode ? 'Kullanıcıyı Güncelle' : 'Yeni Kullanıcı'}
                visible={modalVisible}
                onClose={handleCloseModal}
            >

                {/*<DKTextInput*/}
                {/*    label="Kimlik Numarası"*/}
                {/*    value={formData.identity_number || ''}*/}
                {/*    onChange={(text) => setFormData({...formData, identity_number: text})}*/}
                {/*    maxLength={11}*/}
                {/*    keyboardType="numeric"*/}
                {/*/>*/}

                <DKTextInput
                    label="Ad"
                    value={formData.name || ''}
                    onChange={(text) => setFormData({...formData, name: text})}
                    placeholder="Talha Çiğdem"
                />

                <DKTextInput
                    label="Telefon"
                    value={formData.phone || ''}
                    onChange={(text) => setFormData({...formData, phone: text})}
                    keyboardType="phone-pad"
                />

                <DKTextInput
                    label="E-mail"
                    value={formData.email || ''}
                    onChange={(text) => setFormData({...formData, email: text})}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <DKTextInput
                    label="Meslek"
                    value={formData.job || ''}
                    onChange={(text) => setFormData({...formData, job: text})}
                    placeholder="Yazılım Mühendisi"
                />

                {!editMode && (
                    <DKTextInput
                        label="Şifre"
                        value={formData.password || ''}
                        onChange={(text) => setFormData({...formData, password: text})}
                        secureTextEntry
                        placeholder="Minimum 6 karakter"
                    />
                )}

                {(formData.image || selectedImage) && (
                    <Image
                        source={{
                            uri: selectedImage ? selectedImage.uri : (formData.image ? imageUrlBuilder(formData.image) : undefined)
                        }}
                        style={styles.imagePreview}
                    />
                )}

                <View style={styles.modalButtons}>
                    <DKButton label={editMode ? "Güncelle" : "Kaydet"} onPress={handleSave} type={'primary'}></DKButton>
                </View>
            </DKModal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, padding: 16},
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
    },
    title: {fontSize: 20, fontWeight: 'bold'},
    addButton: {paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6},
    addButtonText: {color: 'white', fontWeight: 'bold'},
    modalButtons: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 16},

    modalButton: {padding: 12, borderRadius: 6, flex: 1},
    imagePreview: {
        width: 200,
        height: 266, // 3:4 aspect ratio
        marginTop: 12,
        borderRadius: 6,
        alignSelf: 'center'
    },
    emptyText: {
        textAlign: 'center',
        padding: 24,
        fontSize: 16,
    }
});