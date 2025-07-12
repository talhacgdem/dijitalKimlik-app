// app/modules/haberler.tsx
import React from 'react';
import {getNews} from '@/services/api/contents';
import {NewsItem} from '@/types/ContentTypes';
import GenericListView from "@/components/dk/GenericListView";

// Haber Kartı Bileşeni
export default function Haberler() {
    return (
        <GenericListView<NewsItem>
            fetchData={getNews}
            emptyMessage="Görüntülenecek haber bulunamadı"
            loadingMessage="Haberler yükleniyor..."
            modalHeader="Haber Detay"
        />
    );
}