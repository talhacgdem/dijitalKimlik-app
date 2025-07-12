import React from 'react';
import {getAnnouncements} from '@/services/api/contents';
import {AnnouncementItem} from '@/types/ContentTypes';
import GenericListView from "@/components/dk/GenericListView";

// Haber Kartı Bileşeni
export default function Haberler() {
    return (
        <GenericListView<AnnouncementItem>
            fetchData={getAnnouncements}
            emptyMessage="Görüntülenecek duyuru bulunamadı"
            loadingMessage="Duyurular yükleniyor..."
            modalHeader="Duyuru Detay"
        />
    );
}