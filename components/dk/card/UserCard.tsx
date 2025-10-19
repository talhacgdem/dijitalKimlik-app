import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BASE_STORAGE_URL} from '@/services/api/Endpoints';
import {useDefaultColor} from '@/hooks/useThemeColor';
import DKButton from "@/components/dk/Button";
import {User} from "@/types/v2/User";

interface UserCardProps {
    user: User;
    onPress?: (user: User) => void;
    controlItems?: {
        onEdit: () => void;
        onRemove: () => void;
    };
}

export default function DKUserCard({user, onPress, controlItems}: UserCardProps) {
    const colors = useDefaultColor();

    return (
        <TouchableOpacity
            style={[styles.cardContainer, {backgroundColor: colors.background}]}
            onPress={() => onPress?.(user)}
            activeOpacity={0.7}
        >
            {/* Sol Sütun - Fotoğraf (%20) */}
            <View style={styles.imageContainer}>
                <Image
                    source={
                        user.image
                            ? {uri: `${BASE_STORAGE_URL}${user.image}`}
                            : {uri: 'https://avatar.iran.liara.run/public'}
                    }
                    style={styles.profileImage}
                    resizeMode="cover"
                />
            </View>

            {/* Sağ Sütun - Kullanıcı Bilgileri (%80) */}
            <View style={styles.infoContainer}>
                <View style={styles.headerRow}>
                    <Text style={[styles.fullName, {color: colors.text}]}>
                        {user.name}
                    </Text>

                    {controlItems && (
                        <View style={styles.actions}>
                            <DKButton label={"Düzenle"} onPress={controlItems.onEdit} type={'primary'}></DKButton>
                            <DKButton label={"Sil"} onPress={controlItems.onRemove} type={'danger'}></DKButton>
                        </View>
                    )}
                </View>

                <View style={styles.infoRow}>
                    <Text style={[styles.label, {color: colors.secondaryText}]}>Kimlik No:</Text>
                    <Text style={[styles.value, {color: colors.text}]}>{user.identity_number}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={[styles.label, {color: colors.secondaryText}]}>Telefon:</Text>
                    <Text style={[styles.value, {color: colors.text}]}>telefon</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={[styles.label, {color: colors.secondaryText}]}>E-mail:</Text>
                    <Text style={[styles.value, {color: colors.text}]} numberOfLines={1}>
                        {user.email}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={[styles.label, {color: colors.secondaryText}]}>Meslek:</Text>
                    <Text style={[styles.value, {color: colors.text}]}>{user.job}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 12,
        marginBottom: 16,
        padding: 16,
        flexDirection: 'row',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    imageContainer: {
        width: '20%',
        maxWidth: '20%',
        marginRight: 16,
    },
    profileImage: {
        width: '100%',
        aspectRatio: 3 / 4,
        borderRadius: 8,
        backgroundColor: '#e0e0e0',
    },
    infoContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    fullName: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    actionButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 4,
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        minWidth: 80,
    },
    value: {
        fontSize: 14,
        flex: 1,
    },
});
