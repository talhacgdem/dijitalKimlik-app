import DKModal from "@/components/dk/Modal";
import {Content} from "@/types/v2/Content";
import React from "react";
import {ContentType} from "@/types/v2/ContentType";
import {Image, Text, View} from "react-native";
import {imageUrlBuilder} from "@/services/api/Endpoints";
import {modalStyles} from "@/constants/Styles";
import {formatDateString} from "@/utils/DateUtil";
import DKDivider from "@/components/dk/Divider";
import {useDefaultColor} from "@/hooks/useThemeColor";

export interface ContentViewerModalProps {
    content: Content;
    contentType: ContentType;
    modalVisible: boolean;
    handleCloseModal: () => void;
}

export default function ContentViewerModal({
                                               content,
                                               contentType,
                                               modalVisible,
                                               handleCloseModal
                                           }: ContentViewerModalProps) {
    const colors = useDefaultColor();

    return (
        <DKModal visible={modalVisible} onClose={handleCloseModal}>
            {contentType.has_image && (
                <Image
                    source={{uri: imageUrlBuilder(content?.image)}}
                    style={modalStyles.modalImage}
                    resizeMode="cover"
                />
            )}

            <View style={modalStyles.textContent}>
                <Text style={[modalStyles.itemTitle, {color: colors.text}]}>
                    {content?.title}
                </Text>
                <Text style={[modalStyles.date, {color: colors.secondaryText}]}>
                    {formatDateString(content?.created_at)}
                </Text>

                <DKDivider/>

                <View>
                    <Text style={{color: colors.text, fontSize: 16, lineHeight: 24, marginBottom: 16}}>
                        {content?.content}
                    </Text>
                </View>
            </View>
        </DKModal>
    );
}
