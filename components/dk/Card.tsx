import {useDefaultColor} from "@/hooks/useThemeColor";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {formatDateString} from "@/utils/DateUtil";
import {truncateContent} from "@/utils/StringUtils";
import React from "react";
import {BASE_STORAGE_URL} from "@/services/api/Endpoints";
import {MaterialIcons} from "@expo/vector-icons";

export interface DKCardProps {
    title: string;
    content: string;
    image?: string;
    date: string;
    onPress: () => void;
    cardHeight?: number;
    controlItems?: {
        onEdit: () => void,
        onRemove: () => void
    }
}

export default function DKCard({title, content, image, date, onPress, cardHeight = 300, controlItems}: DKCardProps) {

    const colors = useDefaultColor();

    return (
        <TouchableOpacity
            style={[
                styles.card,
                {backgroundColor: colors.cardBackground, height: cardHeight}
            ]}
            onPress={controlItems == null ? onPress : () => {}}
        >
            {image && (
                <Image
                    source={{uri: `${BASE_STORAGE_URL}${image}`}}
                    style={styles.image}
                    resizeMode="cover"
                />
            )}
            <View style={styles.cardContent}>
                <Text style={[styles.title, {color: colors.text}]} numberOfLines={2}>
                    {title}
                </Text>
                <Text style={[styles.date, {color: colors.primary}]}>
                    {formatDateString(date)}
                </Text>
                <Text style={[styles.content, {color: colors.text}]} numberOfLines={3}>
                    {truncateContent(content)}
                </Text>
            </View>
            {controlItems && (
                <View style={{
                    flexDirection:"row",
                    display:"flex",
                    justifyContent:"space-between",
                    padding:10
                }}>
                    <TouchableOpacity onPress={() => controlItems.onRemove()}>
                        <MaterialIcons name="delete" size={32} color="black"/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => controlItems.onEdit()}>
                        <MaterialIcons name="edit" size={32} color={colors.primary}/>
                    </TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
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
    }
});
