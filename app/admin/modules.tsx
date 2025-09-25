import {useLocalSearchParams} from 'expo-router';
import {createContentService} from "@/services/api/content";
import React from "react";
import AdminListView from "@/components/dk/AdminListView";

export default function ContentPage() {
    const {id, name, hasImage} = useLocalSearchParams<{
        id: string,
        name: string,
        hasImage: string
    }>();

    const service = createContentService(id, name);

    return (
        <AdminListView
            contentApiService={service}
            emptyMessage="Görüntülenecek kayıt bulunamadı"
            loadingMessage={name + " yükleniyor..."}
            hasImage={hasImage === "1"}
        />
    );
}