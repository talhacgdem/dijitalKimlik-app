import {useLocalSearchParams} from 'expo-router';
import {SafeAreaView} from "react-native-safe-area-context";
import DKHeader from "@/components/dk/Header";
import GenericListView from "@/components/dk/GenericListView";
import React from "react";
import {DKIconType} from "@/components/dk/Icon";

export default function ContentPage() {
    const {id, name, hasImage, icon} = useLocalSearchParams<{
        id: string,
        name: string,
        hasImage: string,
        icon: DKIconType
    }>();

    return (
        <SafeAreaView style={{flex: 1}}>
            <DKHeader
                title={name}
                icon={icon}
            />

            <GenericListView
                contentId={id}
                emptyMessage="Görüntülenecek kayıt bulunamadı"
                loadingMessage={name + " yükleniyor..."}
                modalHeader="Detay"
                hasImage={hasImage === "1"}
            />
        </SafeAreaView>
    );
}