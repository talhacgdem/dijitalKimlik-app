import {ScrollView, Text, View} from 'react-native';
import {ContentType, ContentTypeService} from "@/services/api/content";
import React, {useEffect, useState} from "react";
import {useGlobalLoading} from '@/contexts/LoadingContext';
import DKButtonMenu from "@/components/dk/ButtonMenu";
import DKError from "@/components/dk/Error";
import {useFocusEffect} from "expo-router";

export default function Index() {
    const {showLoading, hideLoading} = useGlobalLoading();
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ContentType[]>([]);

    const loadData = async () => {
        try {
            showLoading("Menüler yükleniyor");
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
            hideLoading();

        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [])
    );

    useEffect(() => {
        loadData();
    }, []);

    // Hata durumu
    if (error && data.length === 0) {
        return (
            <DKError errorMessage={error} onPress={loadData}></DKError>
        );
    }

    // @ts-ignore
    return (
        <View style={{
            flex: 1,
            padding: 20,
            backgroundColor: '#fff'
        }}>
            <View style={{marginBottom: 30}}>
                <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 8}}>Hoş Geldiniz</Text>
            </View>

            <ScrollView
                contentContainerStyle={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between'
                }}
                showsVerticalScrollIndicator={false}
            >
                {data.map((item, index) => (
                    <DKButtonMenu
                        key={index}
                        icon={item.icon}
                        label={item.name}
                        pathname={'/modules'}
                        params={{
                            id: item.id.toString(),
                            name: item.name,
                            icon: item.icon,
                            hasImage: item.hasImage.toString()
                        }}
                    ></DKButtonMenu>
                ))}
            </ScrollView>
        </View>
    );
}