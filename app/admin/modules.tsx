import {useLocalSearchParams} from 'expo-router';
import {createContentService} from "@/services/api/content";
import {SafeAreaView} from "react-native-safe-area-context";
import DKHeader from "@/components/dk/Header";
import React from "react";
import {MaterialIcons} from "@expo/vector-icons";
import AdminListView from "@/components/dk/AdminListView";

export default function ContentPage() {
    const {id, name, hasImage, icon} = useLocalSearchParams<{
        id: string,
        name: string,
        hasImage: string,
        icon: keyof typeof MaterialIcons.glyphMap
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