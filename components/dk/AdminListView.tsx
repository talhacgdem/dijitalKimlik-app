// app/components/AdminListView.tsx
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDefaultColor} from '@/hooks/useThemeColor';
import {MaterialIcons} from '@expo/vector-icons';
import DKModal from "@/components/dk/Modal";
import DKTextInput from "@/components/dk/TextInput";

export interface AdminItem {
    id: number;
    title: string;
    content: string;

    [key: string]: any;
}

interface ApiResponse<T> {
    success: boolean;
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
    };
    message?: string;
}

interface AdminListViewProps<T extends AdminItem> {
    fetchData: (page: number) => Promise<ApiResponse<T>>;
    createItem: (data: Partial<T>) => Promise<void>;
    updateItem: (id: number, data: Partial<T>) => Promise<void>;
    deleteItem: (id: number) => Promise<void>;
    title?: string;
}

export default function AdminListView<T extends AdminItem>({
                                                               fetchData,
                                                               createItem,
                                                               updateItem,
                                                               deleteItem,
                                                               title = 'Kayıtlar'
                                                           }: AdminListViewProps<T>) {
    const colors = useDefaultColor();
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<Partial<T>>({});
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [pagination, setPagination] = useState({currentPage: 1, lastPage: 1});

    const loadData = async (page = 1) => {
        setLoading(true);
        try {
            const response = await fetchData(page);
            if (response.success) {
                setData(response.data);
                setPagination({
                    currentPage: response.meta.current_page,
                    lastPage: response.meta.last_page,
                });
            }
        } catch (e) {
            Alert.alert('Hata', 'Veriler yüklenirken bir sorun oluştu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleOpenModal = (item?: T) => {
        if (item) {
            setEditMode(true);
            setFormData(item);
            setSelectedItemId(item.id);
        } else {
            setEditMode(false);
            setFormData({});
            setSelectedItemId(null);
        }
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setEditMode(false);
        setFormData({});
        setSelectedItemId(null);
        setModalVisible(false);
    };

    const handleSave = async () => {
        try {
            if (editMode && selectedItemId != null) {
                await updateItem(selectedItemId, formData);
            } else {
                await createItem(formData);
            }
            setModalVisible(false);
            await loadData();
        } catch (e) {
            Alert.alert('Hata', 'Kaydetme sırasında bir sorun oluştu.');
        }
    };

    const handleDelete = async (id: number) => {
        Alert.alert('Sil', 'Bu kaydı silmek istediğinize emin misiniz?', [
            {text: 'İptal', style: 'cancel'},
            {
                text: 'Sil',
                style: 'destructive',
                onPress: async () => {
                    await deleteItem(id);
                    await loadData();
                }
            }
        ]);
    };

    const renderItem = ({item}: { item: T }) => (
        <View style={[styles.itemCard, {backgroundColor: colors.cardBackground}]}>
            <View style={{flex: 1}}>
                <Text style={[styles.itemTitle, {color: colors.text}]}>{item.title}</Text>
                <Text style={{color: colors.secondaryText}}>{item.content}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleOpenModal(item)}>
                    <MaterialIcons name="edit" size={24} color={colors.tint}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <MaterialIcons name="delete" size={24} color="red"/>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, {color: colors.text}]}>{title}</Text>
                <TouchableOpacity style={[styles.addButton, {backgroundColor: colors.tint}]}
                                  onPress={() => handleOpenModal()}>
                    <Text style={styles.addButtonText}>+ Ekle</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={colors.tint} style={{marginTop: 20}}/>
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{paddingBottom: 100}}
                />
            )}

            <DKModal modalHeader={editMode ? 'Güncelle' : 'Yeni Kayıt'} visible={modalVisible} onClose={handleCloseModal}>
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
});
