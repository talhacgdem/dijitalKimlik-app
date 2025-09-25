import React, {useEffect, useState} from 'react';
import {Alert, FlatList, Image, RefreshControl, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {ImagePickerAsset} from 'expo-image-picker';
import {useDefaultColor} from '@/hooks/useThemeColor';
import DKModal from "@/components/dk/Modal";
import DKTextInput from "@/components/dk/TextInput";
import {useGlobalLoading} from "@/contexts/LoadingContext";
import DKPagination from "@/components/dk/Pagination";
import {BASE_STORAGE_URL} from "@/services/api/Endpoints";
import {UserApiService} from '@/services/api/user';
import {UserDto} from '@/types/AuthDto';
import {NewUserRequest, UpdateUserRequest} from '@/types/UserTypes';
import DKUserCard from "@/components/dk/CardUser";
import DKError from "@/components/dk/Error";
import DKButton from './Button';

interface AdminUserListViewProps {
    userApiService: UserApiService;
    title?: string;
    loadingMessage?: string;
    emptyMessage?: string;
}

export default function AdminUserListView({
                                              userApiService,
                                              title = 'Kullanıcı Yönetimi',
                                              loadingMessage = 'Kullanıcılar yükleniyor...',
                                              emptyMessage = 'Henüz kullanıcı bulunmuyor'
                                          }: AdminUserListViewProps) {
    const colors = useDefaultColor();
    const {showLoading, hideLoading} = useGlobalLoading();

    const [data, setData] = useState<UserDto[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<UserDto | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
    });

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<Partial<NewUserRequest & UpdateUserRequest>>({});
    const [selectedImage, setSelectedImage] = useState<ImagePickerAsset | null>(null);

    const loadData = async (page: number = 1, isRefresh: boolean = false) => {
        try {
            if (!isRefresh) {
                showLoading(loadingMessage);
            }

            setError(null);

            const response = await userApiService.getUsers(page);

            if (response.success) {
                setData(response.data);
                setPagination({
                    currentPage: response.meta.current_page,
                    lastPage: response.meta.last_page,
                });
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

    const handleOpenModal = (item?: UserDto) => {
        if (item) {
            setEditMode(true);
            setFormData({
                name: item.name,
                phone: item.job,
                email: item.email,
                job: item.job,
                image: item.image,
            });
            setSelectedItem(item);
        } else {
            setEditMode(false);
            setFormData({
                identity_number: null,
                name: null,
                phone: null,
                email: null,
                job: null,
                image: null,
                password: null
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

        const dataToSave = {
            identity_number: formData.identity_number,
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            job: formData.job,
            image: selectedImage?.base64 || formData.image,
            password: formData.password
        };

        if (editMode && selectedItem != null) {
            const updateData: Partial<UpdateUserRequest> = dataToSave;
            await userApiService.updateUser(selectedItem.identity_number, updateData);
        } else {
            const createData: Partial<NewUserRequest> = dataToSave;
            await userApiService.createUser(createData);
        }

        resetModal();
        await loadData();
    };

    const handleDelete = async (item: UserDto) => {
        Alert.alert('Kullanıcıyı Sil', 'Bu kullanıcıyı silmek istediğinize emin misiniz?', [
            {text: 'İptal', style: 'cancel'},
            {
                text: 'Sil',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await userApiService.deleteUser(item.identity_number);
                        await loadData();
                    } catch (e) {
                        Alert.alert('Hata', 'Silme sırasında bir sorun oluştu.');
                        console.error(e);
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
                <DKButton label={"+ Kullanıcı Ekle"} onPress={handleOpenModal} type={'primary'}></DKButton>
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
                keyExtractor={(item) => item.identity_number}
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

                {!editMode && (
                    <DKTextInput
                        label="Kimlik Numarası"
                        value={formData.identity_number || ''}
                        onChange={(text) => setFormData({...formData, identity_number: text})}
                        maxLength={11}
                        keyboardType="numeric"
                    />
                )}

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

                <DKTextInput
                    label="Şifre"
                    value={formData.password || ''}
                    onChange={(text) => setFormData({...formData, password: text})}
                    secureTextEntry={true}
                />

                {(formData.image || selectedImage) && (
                    <Image
                        source={{
                            uri: selectedImage ? selectedImage.uri : `${BASE_STORAGE_URL}${formData.image}`
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
