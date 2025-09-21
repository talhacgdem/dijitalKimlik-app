import React, {useCallback, useEffect, useState} from 'react';
import {Alert, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useGlobalLoading} from "@/contexts/LoadingContext";
import {ContentType, ContentTypeService} from "@/services/api/content";
import {useDefaultColor} from "@/hooks/useThemeColor";
import AccordionList, {AccordionItemData} from "@/components/dk/Accordion";
import DKTextInput from "@/components/dk/TextInput";
import DKSwitch from "@/components/dk/Switch";
import DKIcon from "@/components/dk/Icon";
import {Picker} from "@react-native-picker/picker";

export default function ModuleManager() {

    const colors = useDefaultColor();
    const {showLoading, hideLoading} = useGlobalLoading();

    const [data, setData] = useState<ContentType[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [newContentType, setNewContentType] = useState<Partial<ContentType>>({
        name: '',
        icon: 'home',
        hasImage: false
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
            hasImage: false
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

        try {
            showLoading("Yeni modül ekleniyor...");

            // API çağrısı
            const response = await ContentTypeService.createContentType({
                name: newContentType.name.trim(),
                icon: newContentType.icon || 'home',
                hasImage: newContentType.hasImage || false
            } as ContentType);

            if (response.success) {
                // Başarılı olursa listeyi yenile
                await loadData();
                resetNewContentType();
                Alert.alert('Başarılı', 'Yeni modül başarıyla eklendi!');
            } else {
                throw new Error(response.message || 'Modül eklenemedi');
            }

        } catch (error) {
            console.error('Ekleme hatası:', error);
            Alert.alert('Hata', 'Modül eklenirken bir hata oluştu!');
        } finally {
            hideLoading();
        }
    };

    const loadData = async (isRefresh: boolean = false) => {
        try {
            if (!isRefresh) {
                showLoading("Menüler Yükleniyor");
            }

            setError(null);

            const response = await ContentTypeService.getContentTypes();

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
    }, []);

    const iconOptions = [
        'home', 'person', 'settings', 'favorite', 'search',
        'notifications', 'email', 'phone', 'location-on', 'camera',
        'shopping-cart', 'work', 'school', 'restaurant', 'local-hospital',
        'directions-car', 'flight', 'hotel', 'beach-access', 'fitness-center'
    ];

    const updateItemField = useCallback((itemId: number, field: keyof ContentType, value: any) => {
        setData(prevData =>
            prevData.map(item =>
                item.id === itemId
                    ? {...item, [field]: value}
                    : item
            )
        );
    }, []);

    const updateItemName = useCallback((itemId: number, newName: string) => {
        updateItemField(itemId, 'name', newName);
    }, [updateItemField]);

    const updateItemIcon = useCallback((itemId: number, newIcon: string) => {
        updateItemField(itemId, 'icon', newIcon);
    }, [updateItemField]);

    const updateItemHasImage = useCallback((itemId: number) => {
        setData(prevData =>
            prevData.map(item =>
                item.id === itemId
                    ? {...item, hasImage: !item.hasImage}
                    : item
            )
        );
    }, []);

    const updateContentType = async (item: ContentType) => {
        try {
            showLoading("Güncelleniyor...");
            console.log('Güncellenecek item:', item);
            await ContentTypeService.updateContentType(item.id, {
                name: item.name,
                icon: item.icon,
                hasImage: item.hasImage,
            })
        } catch (error) {
            console.error('Güncelleme hatası:', error);
            // Hata durumunda eski veriyi geri yükle
            loadData();
        } finally {
            hideLoading();
        }
    };

    const deleteContentType = async (itemid: number) => {
        try {
            showLoading("Siliniyor...");

            console.log('silinecek item:', itemid);

        } catch (error) {
            console.error('Güncelleme hatası:', error);
            loadData();
        } finally {
            hideLoading();
        }
    };


    const renderAccordionContentView = useCallback((item: ContentType) => (
        <View style={styles.accordionView}>
            <DKTextInput
                label={"Modül Adı"}
                value={item.name}
                onChange={(text) => updateItemName(item.id, text)}
            />
            <DKSwitch
                label={"Görsel Var Mı?"}
                value={item.hasImage}
                onChange={() => updateItemHasImage(item.id)}
            />
            <View style={{
                flexDirection: "row",
                marginBottom: 16,
            }}>
                <DKIcon name={item.icon} styles={styles.col}/>
                <Picker
                    style={styles.col}
                    selectedValue={item.icon}
                    onValueChange={(itemValue) => updateItemIcon(item.id, itemValue)}
                >
                    {iconOptions.map((icon) => (
                        <Picker.Item
                            key={icon}
                            label={icon}
                            value={icon}
                        />
                    ))}
                </Picker>
            </View>
            <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                <TouchableOpacity onPress={() => deleteContentType(item.id)}>
                    <DKIcon name={"delete"} size={36} color={"red"}></DKIcon>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        backgroundColor: colors.primary,
                        padding: 12,
                        borderRadius: 8,
                        alignItems: 'center'
                    }}
                    onPress={() => updateContentType(item)}
                >
                    <Text style={{color: 'white', fontWeight: 'bold'}}>Güncelle</Text>
                </TouchableOpacity>
            </View>
        </View>
    ), [updateItemName, updateItemIcon, updateItemHasImage, colors.primary]);


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
                                value={newContentType.hasImage || false}
                                onChange={() => updateNewContentTypeField('hasImage', !newContentType.hasImage)}
                            />

                            <View style={styles.iconPickerContainer}>
                                <Text style={[styles.iconLabel, {color: colors.text}]}>İkon Seçin:</Text>
                                <View style={styles.iconPickerRow}>
                                    <DKIcon name={newContentType.icon || 'home'} styles={styles.iconPreview}/>
                                    <Picker
                                        style={styles.iconPicker}
                                        selectedValue={newContentType.icon || 'home'}
                                        onValueChange={(itemValue) => updateNewContentTypeField('icon', itemValue)}
                                    >
                                        {iconOptions.map((icon) => (
                                            <Picker.Item
                                                key={icon}
                                                label={icon}
                                                value={icon}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            </View>

                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={[styles.cancelButton, {borderColor: colors.text}]}
                                    onPress={resetNewContentType}
                                >
                                    <Text style={[styles.cancelButtonText, {color: colors.text}]}>İptal</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.addButton, {backgroundColor: colors.primary}]}
                                    onPress={addNewContentType}
                                >
                                    <Text style={styles.addButtonText}>Ekle</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={[styles.showFormButton, {backgroundColor: colors.primary}]}
                            onPress={() => setIsAddingNew(true)}
                        >
                            <DKIcon name="add" size={20} color="white"/>
                            <Text style={styles.showFormButtonText}>Yeni Modül Ekle</Text>
                        </TouchableOpacity>
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
    }, accordionView: {
        width: '100%'
    }, col: {
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
        marginBottom: 20,
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
});
