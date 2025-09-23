import React from 'react';
import {Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import { WebView } from 'react-native-webview';
import {MaterialIcons} from '@expo/vector-icons';
import DKIcon from "@/components/dk/Icon";

function AboutScreen() {
    // Şirket bilgileri
    const companyInfo = {
        name: 'Şirket Adı',
        description: 'Biz, müşterilerimize en kaliteli hizmeti sunmak için çalışan deneyimli bir ekibiz. 2020 yılından beri sektörde faaliyet göstermekteyiz.',
        address: 'Atatürk Mahallesi, Teknoloji Caddesi No:123, Beyoğlu/İstanbul',
        phone: '+90 212 123 45 67',
        email: 'info@sirketadi.com',
        website: 'www.sirketadi.com',
        workingHours: 'Pazartesi - Cuma: 09:00 - 18:00',
        coordinates: {
            latitude: 41.0082,
            longitude: 28.9784,
        },
    };

    const handlePhoneCall = () => {
        Linking.openURL(`tel:${companyInfo.phone}`);
    };

    const handleEmail = () => {
        Linking.openURL(`mailto:${companyInfo.email}`);
    };

    const handleWebsite = () => {
        Linking.openURL(`https://${companyInfo.website}`);
    };

    const handleDirections = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${companyInfo.coordinates.latitude},${companyInfo.coordinates.longitude}`;
        Linking.openURL(url);
    };

    const handleSocialMedia = (platform : string) => {
        let url = '';
        switch(platform) {
            case 'facebook':
                url = 'https://www.facebook.com/yourpage';
                break;
            case 'instagram':
                url = 'https://www.instagram.com/yourpage';
                break;
            case 'twitter':
                url = 'https://www.twitter.com/yourpage';
                break;
            case 'linkedin':
                url = 'https://www.linkedin.com/company/yourcompany';
                break;
        }
        if (url) {
            Linking.openURL(url);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Hakkımızda</Text>
                </View>

                {/* Şirket Tanıtımı */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Kimiz?</Text>
                    <Text style={styles.description}>{companyInfo.description}</Text>
                </View>

                {/* Harita */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Konumumuz</Text>
                    <View style={styles.mapContainer}>
                        <WebView
                            style={styles.map}
                            source={{
                                html: `
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48331.05414894815!2d29.407929683730693!3d40.790809445174865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cb205f3249c86d%3A0xa377ce0f80ed1f85!2sT%C3%BCbitak%20Marmara%20Teknokent!5e0!3m2!1str!2str!4v1755457186516!5m2!1str!2str" width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                `
                            }}
                        />
                    </View>
                </View>

                {/* İletişim Bilgileri */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>İletişim Bilgileri</Text>

                    {/* Adres */}
                    <View style={styles.contactItem}>
                        <DKIcon name={"location-on"} size={24} color={"#007AFF"}/>
                        <View style={styles.contactTextContainer}>
                            <Text style={styles.contactLabel}>Adres</Text>
                            <Text style={styles.contactText}>{companyInfo.address}</Text>
                        </View>
                    </View>




                    {/* Çalışma Saatleri */}
                    <View style={styles.contactItem}>
                        <DKIcon name={"access-time"} size={24} color={"#007AFF"}/>
                        <View style={styles.contactTextContainer}>
                            <Text style={styles.contactLabel}>Çalışma Saatleri</Text>
                            <Text style={styles.contactText}>{companyInfo.workingHours}</Text>
                        </View>
                    </View>
                </View>

                {/* Hızlı İletişim Butonları */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Hızlı İletişim</Text>
                    <View style={styles.quickContactContainer}>

                    </View>
                </View>

                {/* Sosyal Medya */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sosyal Medya</Text>
                    <View style={styles.socialMediaContainer}>

                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#e44e01',
        paddingVertical: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    section: {
        backgroundColor: '#fff',
        marginVertical: 10,
        marginHorizontal: 15,
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    mapContainer: {
        position: 'relative',
        borderRadius: 10,
        overflow: 'hidden',
    },
    map: {
        width: '100%',
        height: 200,
    },
    directionsButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: '#007AFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    directionsText: {
        color: '#fff',
        marginLeft: 5,
        fontSize: 12,
        fontWeight: '600',
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    contactTextContainer: {
        marginLeft: 15,
        flex: 1,
    },
    contactLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    contactText: {
        fontSize: 16,
        color: '#666',
        lineHeight: 22,
    },
    clickableText: {
        color: '#007AFF',
        textDecorationLine: 'underline',
    },
    quickContactContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    quickContactButton: {
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 40,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    quickContactText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 5,
    },
    socialMediaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    socialButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f0f0f0',
    },
});

// Bu satır çok önemli - eksik olan bu!
export default AboutScreen;
