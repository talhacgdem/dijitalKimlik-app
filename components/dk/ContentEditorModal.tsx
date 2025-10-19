import DKModal from "@/components/dk/Modal";
import DKTextInput from "@/components/dk/TextInput";
import {Content} from "@/types/v2/Content";
import {useEffect, useState} from "react";
import DKButton from "@/components/dk/Button";
import {ContentType} from "@/types/v2/ContentType";
import * as ImagePicker from "expo-image-picker";
import {ImagePickerAsset} from "expo-image-picker";
import {Alert, Image, StyleSheet, View} from "react-native";
import {BASE_STORAGE_URL} from "@/services/api/Endpoints";
import {ContentService} from "@/services/api";

export interface ContentEditorModalProps {
    content?: Content;
    contentType: ContentType;
    modalVisible: boolean;
    handleCloseModal: () => void;
    dataLoader: () => Promise<void>;
}

export default function ContentEditorModal({
                                               content,
                                               contentType,
                                               modalVisible,
                                               handleCloseModal,
                                               dataLoader
                                           }: ContentEditorModalProps) {

    const editMode = !!content;
    useEffect(() => {
        if (content) {
            setFormData(content);
        } else {
            setFormData({});
        }
    }, [content]);

    let dates = false;

    const [formData, setFormData] = useState<Partial<Content>>({});
    const [selectedImage, setSelectedImage] = useState<ImagePickerAsset | null>(null);

    const resetModal = () => {
        setFormData({});
        setSelectedImage(null);
    };

    const handleSave = async () => {

        if (!formData.title || !formData.content) {
            Alert.alert('Hata', 'Başlık ve İçerik alanları boş bırakılamaz!');
            return;
        }

        const dataToSave: any = {
            content_type_id: contentType.id,
            title: formData.title,
            content: formData.content,
        };

        // Tarih alanları varsa ekle
        if (dates) {
            if (formData.start_date) dataToSave.start_date = formData.start_date;
            if (formData.end_date) dataToSave.end_date = formData.end_date;
        }

        // Resim varsa ekle
        if (contentType.has_image) {
            if (selectedImage?.base64) {
                // Yeni resim seçildiyse base64 olarak gönder
                dataToSave.image = `data:image/jpeg;base64,${selectedImage.base64}`;
            } else if (formData.image) {
                // Güncelleme modunda mevcut resim varsa
                dataToSave.image = formData.image;
            }
        }

        if (formData.id) {
            // Güncelleme
            const response = await ContentService.update(formData.id, dataToSave);

            if (response.success) {
                Alert.alert('Başarılı', 'Kayıt güncellendi');
                resetModal();
                await dataLoader()
            }
        } else {
            // Yeni kayıt
            const response = await ContentService.create(dataToSave);

            if (response.success) {
                Alert.alert('Başarılı', 'Kayıt oluşturuldu');
                resetModal();
                await dataLoader();
            }
        }
    };


    const handlePickImage = async () => {
        if (!contentType.has_image) return;

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

    return (
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
            {contentType.has_image && (
                <>
                    <DKButton
                        label={"Resim Seç"}
                        icon={{name: "browse-gallery"}}
                        onPress={handlePickImage}
                        type={"secondary"}
                    />
                    {(formData.image || selectedImage) && (
                        <Image
                            source={{uri: selectedImage ? selectedImage.uri : `${BASE_STORAGE_URL}${formData.image}`}}
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