import {useLocalSearchParams} from 'expo-router';
import React from "react";
import AdminListView from "@/components/dk/AdminListView";

export default function ContentPage() {
    const {id, name, hasImage} = useLocalSearchParams<{
        id: string,
        name: string,
        hasImage: string
    }>();


    return (
        <AdminListView
            emptyMessage="Görüntülenecek kayıt bulunamadı"
            loadingMessage={name + " yükleniyor..."}
            hasImage={hasImage === "1"}
            contentTypeId={id}
        />
    );
}