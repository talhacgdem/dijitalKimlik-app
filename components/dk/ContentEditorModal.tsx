import DKModal from "@/components/dk/Modal";
import DKTextInput from "@/components/dk/TextInput";
import {Content, ContentAddRequest} from "@/types/v2/Content";
import {useEffect, useState} from "react";
import DKButton from "@/components/dk/Button";
import {ContentType} from "@/types/v2/ContentType";
import * as ImagePicker from "expo-image-picker";
import {Alert, Image, StyleSheet, View} from "react-native";
import {imageUrlBuilder} from "@/services/api/Endpoints";
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

    const [formData, setFormData] = useState<Partial<Content>>({});
    const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);


    useEffect(() => {
        if (content) {
            setFormData(content);
            if (content.image) {
                setSelectedImageUri(imageUrlBuilder(content.image));
            } else {
                setSelectedImageUri(null);
            }
        } else {
            setFormData({});
            setSelectedImageUri(null);
        }
    }, [content]);

    const resetModal = () => {
        setFormData({});
        setSelectedImageUri(null);
    };

    const handlePickImage = async () => {
        if (!contentType.has_image) return;

        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('İzin gerekli!', 'Resim seçmek için izin vermelisiniz.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
            aspect: [16, 9],
        });

        if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0];
            const filename = asset.uri.split('/').pop() || 'photo.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';
            const file = {
                uri: asset.uri,
                type: type,
                name: filename,
            };
            setFormData({...formData, uploadedImage: file as any});
            setSelectedImageUri(asset.uri);
        }
    };


    const handleSave = async () => {
        if (!formData.title || !formData.content) {
            Alert.alert('Hata', 'Başlık ve İçerik alanları boş bırakılamaz!');
            return;
        }

        const payload: ContentAddRequest = {
            content_type_id: contentType.id,
            title: formData.title,
            content: formData.content,
        };

        // if (formData.start_date) payload.start_date = formData.start_date;
        // if (formData.end_date) payload.end_date = formData.end_date;

        // Sadece resim tipi içeriklerde image ekle
        if (contentType.has_image && formData.uploadedImage) {
            payload.image = formData.uploadedImage;
        }

        try {
            if (editMode && formData.id) {
                const response = await ContentService.update(formData.id, payload);
                if (response.success) {
                    Alert.alert('Başarılı', 'Kayıt güncellendi');
                }
            } else {
                const response = await ContentService.create(payload);
                if (response.success) {
                    Alert.alert('Başarılı', 'Kayıt oluşturuldu');
                }
            }
            await dataLoader();
            resetModal();
            handleCloseModal();
        } catch (err) {
            console.error(err);
            Alert.alert('Hata', 'İşlem sırasında bir hata oluştu');
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
                        label="Resim Seç"
                        icon={{name: "browse-gallery"}}
                        onPress={handlePickImage}
                        type="secondary"
                    />
                    {selectedImageUri && (
                        <Image
                            source={{uri: selectedImageUri}}
                            style={styles.imagePreview}
                        />
                    )}
                </>
            )}

            <View style={styles.modalButtons}>
                <DKButton
                    label={editMode ? 'Güncelle' : 'Kaydet'}
                    onPress={handleSave}
                    type="primary"
                />
            </View>
        </DKModal>
    );
}

const styles = StyleSheet.create({
    modalButtons: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 16},
    imagePreview: {width: '100%', height: 200, marginTop: 12, borderRadius: 6},
});
