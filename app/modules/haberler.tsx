// app/modules/haberler.tsx
import React from 'react';
import {newsService} from '@/services/api/contents';
import GenericListView from "@/components/dk/GenericListView";

// Haber Kartı Bileşeni
export default function Haberler() {
    return (
        <GenericListView
            contentApiService={newsService}
            emptyMessage="Görüntülenecek haber bulunamadı"
            loadingMessage="Haberler yükleniyor..."
            modalHeader="Haber Detay"
        />
    );
}