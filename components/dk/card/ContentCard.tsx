import {useDefaultColor} from "@/hooks/useThemeColor";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {formatDateString} from "@/utils/DateUtil";
import {truncateContent} from "@/utils/StringUtils";
import React from "react";
import {imageUrlBuilder} from "@/services/api/Endpoints";
import DKButton from "@/components/dk/Button";
import {Content} from "@/types/v2/Content";

export interface DKCardProps {
    content: Content;
    contentHasImage: boolean;
    handlePress?: () => void;
    adminControls?: {
        onEdit: () => void;
        onRemove: () => void;
    }
}

export default function DKContentCard({content, contentHasImage, adminControls, handlePress}: DKCardProps) {

    const colors = useDefaultColor();

    return (contentHasImage ?
            (
                <TouchableOpacity
                    style={[
                        styles.card,
                        {backgroundColor: colors.cardBackground, height: 300}
                    ]}
                    onPress={handlePress}
                >
                    {content.image && (
                        <Image
                            source={{uri: imageUrlBuilder(content.image)}}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    )}
                    <View style={styles.cardContent}>
                        <Text style={[styles.title, {color: colors.text}]} numberOfLines={2}>
                            {content.title}
                        </Text>
                        <Text style={[styles.date, {color: colors.primary}]}>
                            {formatDateString(content.created_at)}
                        </Text>
                        <Text style={[styles.content, {color: colors.text}]} numberOfLines={3}>
                            {truncateContent(content.content)}
                        </Text>
                    </View>
                    {adminControls && (
                        <View style={{
                            flexDirection: "row",
                            display: "flex",
                            justifyContent: "space-between",
                            paddingTop: 10
                        }}>
                            <DKButton icon={{name: "delete", size: 20}} onPress={adminControls.onRemove} type={'danger'}
                                      style={{padding: 5}}/>
                            <DKButton icon={{name: "edit", size: 20}} onPress={adminControls.onEdit} type={'primary'}
                                      style={{padding: 5}}/>
                        </View>
                    )}

                </TouchableOpacity>) :
            (
                <View style={styles.itemContainer}>
                    <View style={{flex: 1}}>
                        <Text style={{fontSize: 16, fontWeight: '500'}}>{content.title}</Text>
                    </View>
                    {adminControls && (
                        <>
                            <DKButton icon={{name: "edit", size: 20}} onPress={adminControls.onEdit}
                                      type={'primary'}
                                      style={{padding: 5}}/>
                            <View style={{
                                width: 1,
                                height: '100%',
                                backgroundColor: colors.primary,
                                marginHorizontal: 8
                            }}/>
                            <DKButton icon={{name: "delete", size: 20}} onPress={adminControls.onRemove}
                                      type={'danger'}
                                      style={{padding: 5}}/>
                        </>
                    )}
                    {!adminControls && handlePress && (
                        <DKButton label={"Detay"} onPress={handlePress} type={'primary'}></DKButton>
                    )}
                </View>
            )
    );
}
;


const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    image: {
        width: '100%',
        height: 140,
    },
    cardContent: {
        padding: 16,
        flex: 1,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
        lineHeight: 22,
    },
    date: {
        fontSize: 12,
        marginBottom: 8,
    },
    content: {
        fontSize: 14,
        lineHeight: 18,
        flex: 1,
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
    }
});
