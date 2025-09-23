import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {UserDto} from "@/types/AuthDto";
import {formatDate} from "@/utils/DateUtil";

interface UserIdCardProps {
    user: UserDto | null
}

const UserIdCard = ({
                        user
                    }: UserIdCardProps) => {

    return (
        <View style={styles.cardContainer}>
            {/* Modern Başlık */}
            <View style={styles.header}>
                <View style={styles.headerLine}/>
                <Text style={styles.headerText}>KİMLİK KARTI</Text>
                <View style={styles.headerLine}/>
            </View>

            {/* Ana İçerik */}
            <View style={styles.content}>
                {/* Sol Bölüm - Fotoğraf (2/5) */}
                <View style={styles.leftSection}>
                    <View style={styles.photoContainer}>
                        <Image source={{uri: user?.image || 'https://avatar.iran.liara.run/public'}}
                               style={styles.photo}/>
                    </View>
                </View>

                {/* Sağ Bölüm - Bilgiler (3/5) */}
                <View style={styles.rightSection}>
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Ad Soyad</Text>
                        <Text style={styles.value}>{user?.name}</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Kimlik No</Text>
                        <Text style={styles.value}>{user?.identity_number}</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Doğum Tarihi</Text>
                        <Text style={styles.value}>{formatDate(user?.birthDate)}</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Departman</Text>
                        <Text style={styles.value}>{user?.job}</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Email</Text>
                        <Text style={styles.value}>{user?.email}</Text>
                    </View>
                </View>
            </View>

            {/* Dekoratif Elementler */}
            <View style={styles.decorativeCircle1}/>
            <View style={styles.decorativeCircle2}/>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: '90%',
        aspectRatio: 8 / 5,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 12,
        position: 'relative',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    headerLine: {
        height: 2,
        backgroundColor: '#e44e01',
        flex: 1,
        marginHorizontal: 12,
    },
    headerText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1F2937',
        letterSpacing: 1.8,
    },
    content: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'stretch',
    },
    leftSection: {
        width: '40%', // 2/5 oranı
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingRight: 12,
    },
    photoContainer: {
        width: '90%',
        aspectRatio: 3 / 4, // 3:4 oranında fotoğraf
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2.5,
        borderColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
    },
    photo: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    rightSection: {
        width: '60%', // 3/5 oranı
        justifyContent: 'space-between',
        paddingLeft: 8,
        paddingVertical: 4,
    },
    infoItem: {
        marginBottom: 8,
    },
    label: {
        fontSize: 10,
        fontWeight: '500',
        color: '#6B7280',
        marginBottom: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    value: {
        fontSize: 13,
        fontWeight: '600',
        color: '#111827',
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    decorativeCircle1: {
        position: 'absolute',
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#e44e01',
        opacity: 0.05,
        top: -20,
        right: -20,
    },
    decorativeCircle2: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#e44e01',
        opacity: 0.08,
        bottom: -15,
        left: -15,
    },
});

export default UserIdCard;