import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useGlobalLoading} from "@/contexts/LoadingContext";
import {useDefaultColor} from "@/hooks/useThemeColor";
import AccordionList, {AccordionItemData} from "@/components/dk/Accordion";
import DKTextInput from "@/components/dk/TextInput";
import DKSwitch from "@/components/dk/Switch";
import DKIcon, {DKIconType} from "@/components/dk/Icon";
import DKButton from "@/components/dk/Button";
import PickerDropdown from "@/components/dk/Pickeronic";
import DKError from "@/components/dk/Error";
import {ContentTypeService} from "@/services/api/ContentTypeService";
import {ContentType} from "@/types/v2/ContentType";

export default function ModuleManager() {
    const colors = useDefaultColor();
    const {showLoading, hideLoading} = useGlobalLoading();

    const [data, setData] = useState<ContentType[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const iconOptions = useMemo(() => [
        'home', 'person', 'settings', 'favorite', 'search',
        'notifications', 'email', 'phone', 'location-on', 'camera',
        'shopping-cart', 'work', 'school', 'restaurant', 'local-hospital',
        'directions-car', 'flight', 'hotel', 'beach-access', 'fitness-center'
    ], []);

    const [newContentType, setNewContentType] = useState<Partial<ContentType>>({
        name: '',
        icon: 'home',
        has_image: false
    });
    const [isAddingNew, setIsAddingNew] = useState(false);

    const updateNewContentTypeField = useCallback((field: keyof ContentType, value: any) => {
        setNewContentType(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const resetNewContentType = useCallback(() => {
        setNewContentType({
            name: '',
            icon: 'home',
            has_image: false
        });
        setIsAddingNew(false);
    }, []);

    const addNewContentType = async () => {
        if (!newContentType.name?.trim()) {
            Alert.alert('Hata', 'Modül adı boş olamaz!');
            return;
        }

        if (newContentType.name.trim().length < 2) {
            Alert.alert('Hata', 'Modül adı en az 2 karakter olmalıdır!');
            return;
        }

        showLoading("Yeni modül ekleniyor...");

        const response = await ContentTypeService.create({
            name: newContentType.name.trim(),
            icon: newContentType.icon || 'home',
            has_image: newContentType.has_image || false
        });

        hideLoading();

        if (response.success) {
            Alert.alert('Başarılı', 'Yeni modül başarıyla eklendi!');
            await loadData();
            resetNewContentType();
        }
    };

    const loadData = async (isRefresh: boolean = false) => {
        try {
            if (!isRefresh) {
                showLoading("Menüler Yükleniyor");
            }

            setError(null);

            const response = await ContentTypeService.list();

            if (response.success) {
                setData(response.data);
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

    const handleRefresh = () => {
        setRefreshing(true);
        loadData(true);
    };

    useEffect(() => {
        loadData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const updateItemField = useCallback((itemId: string, field: keyof ContentType, value: any) => {
        setData(prevData =>
            prevData.map(item =>
                item.id === itemId
                    ? {...item, [field]: value}
                    : item
            )
        );
    }, []);

    const updateItemName = useCallback((itemId: string, newName: string) => {
        updateItemField(itemId, 'name', newName);
    }, [updateItemField]);

    const updateItemIcon = useCallback((itemId: string, newIcon: string) => {
        updateItemField(itemId, 'icon', newIcon);
    }, [updateItemField]);

    const updateItemHasImage = useCallback((itemId: string) => {
        setData(prevData =>
            prevData.map(item =>
                item.id === itemId
                    ? {...item, has_image: !item.has_image}
                    : item
            )
        );
    }, []);

    const updateContentType = useCallback(async (item: ContentType) => {
        showLoading("Güncelleniyor...");

        const response = await ContentTypeService.update(item.id.toString(), {
            name: item.name,
            icon: item.icon,
            has_image: item.has_image,
        });

        hideLoading();

        if (response.success) {
            Alert.alert('Başarılı', 'Modül güncellendi!');
            await loadData();
        } else {
            // Hata durumunda eski veriyi geri yükle
            await loadData();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const deleteContentType = useCallback(async (itemId: string) => {
        Alert.alert(
            'Modül Sil',
            'Bu modülü silmek istediğinize emin misiniz? Bu işlem geri alınamaz!',
            [
                {text: 'İptal', style: 'cancel'},
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: async () => {
                        showLoading("Siliniyor...");

                        const response = await ContentTypeService.delete(itemId.toString());

                        hideLoading();

                        if (response.success) {
                            Alert.alert('Başarılı', 'Modül silindi!');
                            await loadData();
                        }
                    }
                }
            ]
        );
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const renderAccordionContentView = useCallback((item: ContentType) => {
        return (
            <View style={styles.accordionView}>
                <DKTextInput
                    label={"Modül Adı"}
                    value={item.name}
                    onChange={(text) => updateItemName(item.id, text)}
                />
                <DKSwitch
                    label={"Görsel Var Mı?"}
                    value={item.has_image}
                    onChange={() => updateItemHasImage(item.id)}
                />
                <View style={{
                    flexDirection: "row",
                    marginBottom: 16,
                }}>
                    <DKIcon name={item.icon} styles={styles.col}/>
                    <PickerDropdown
                        style={styles.col}
                        selectedValue={item.icon}
                        onValueChange={(value) => updateItemIcon(item.id, value)}
                    >
                        {iconOptions.map((icon) => (
                            <PickerDropdown.Item
                                key={icon}
                                label={icon}
                                icon={icon as DKIconType}
                                value={icon}
                            />
                        ))}
                    </PickerDropdown>
                </View>

                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <DKButton
                            icon={{name: "delete", size: 20}}
                            onPress={() => deleteContentType(item.id)}
                            type={'danger'}
                        />
                        <DKButton
                            label={"Güncelle"}
                            onPress={() => updateContentType(item)}
                            type={'primary'}
                        />
                    </View>

            </View>
        );
    }, [iconOptions, updateItemName, updateItemHasImage, updateItemIcon, deleteContentType, updateContentType]);

    if (error && data.length === 0) {
        return (
            <DKError errorMessage={error} onPress={() => loadData()}/>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[colors.tint]}
                        tintColor={colors.tint}
                        title="Yenileniyor..."
                        titleColor={colors.text}
                    />
                }
            >
                <View style={styles.newContentTypeContainer}>
                    {isAddingNew ? (
                        <View style={styles.newContentTypeForm}>
                            <View style={styles.newContentTypeHeader}>
                                <DKIcon name="add-circle" size={24} color={colors.primary}/>
                                <Text style={[styles.newContentTypeTitle, {color: colors.text}]}>
                                    Yeni Modül Ekle
                                </Text>
                            </View>
                            <DKTextInput
                                label="Modül Adı"
                                value={newContentType.name || ''}
                                onChange={(text) => updateNewContentTypeField('name', text)}
                                placeholder="Örn: Haberler, Etkinlikler..."
                            />

                            <DKSwitch
                                label="Görsel Var Mı?"
                                value={newContentType.has_image || false}
                                onChange={() => updateNewContentTypeField('has_image', !newContentType.has_image)}
                            />

                            <View style={styles.iconPickerContainer}>
                                <Text style={[styles.iconLabel, {color: colors.text}]}>İkon Seçin:</Text>
                                <View style={styles.iconPickerRow}>
                                    <DKIcon name={newContentType.icon || 'home'} styles={styles.iconPreview}/>
                                    <PickerDropdown
                                        style={styles.col}
                                        selectedValue={newContentType.icon || 'home'}
                                        onValueChange={(value) => updateNewContentTypeField('icon', value)}
                                    >
                                        {iconOptions.map((icon) => (
                                            <PickerDropdown.Item
                                                key={icon}
                                                label={icon}
                                                icon={icon as DKIconType}
                                                value={icon}
                                            />
                                        ))}
                                    </PickerDropdown>
                                </View>
                            </View>

                            <View style={styles.buttonRow}>
                                <DKButton
                                    label={"İptal"}
                                    onPress={resetNewContentType}
                                    type={'secondary'}
                                />
                                <DKButton
                                    label={"Ekle"}
                                    onPress={addNewContentType}
                                    type={'primary'}
                                />
                            </View>
                        </View>
                    ) : (
                        <DKButton
                            label={"Yeni Modül Ekle"}
                            icon={{name: "add", size: 20}}
                            onPress={() => setIsAddingNew(true)}
                            type={'primary'}
                        />
                    )}
                </View>
                <View style={styles.content}>
                    <AccordionList
                        data={data.map(item => ({
                            id: item.id,
                            title: item.name,
                            icon: item.icon,
                            content: renderAccordionContentView(item)
                        } as AccordionItemData))}
                        showIcon={true}
                    />
                </View>
            </ScrollView>
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
    deleteButton: {
        backgroundColor: '#e40101',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    customHeader: {
        backgroundColor: '#e8f4fd',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    customContent: {
        backgroundColor: '#fafafa',
    },
    accordionView: {
        width: '100%'
    },
    col: {
        flex: 1,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 60,
    },
    newContentTypeContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        margin: 16,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    newContentTypeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    newContentTypeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    newContentTypeForm: {
        gap: 16,
    },
    iconPickerContainer: {
        marginBottom: 16,
    },
    iconLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    iconPickerRow: {
        flexDirection: "row",
        alignItems: 'center',
        gap: 10,
    },
    iconPreview: {
        flex: 0,
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconPicker: {
        flex: 1,
        minHeight: 50,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    cancelButton: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontWeight: '600',
    },
    addButton: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    showFormButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        gap: 8,
    },
    showFormButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e3f2fd',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        gap: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
    },
});
