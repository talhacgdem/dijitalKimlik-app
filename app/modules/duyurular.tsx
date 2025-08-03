import React from 'react';
import GenericListView from "@/components/dk/GenericListView";
import {annoucenmentService} from "@/services/api/contents";

export default function Duyurular() {
    return (
        <GenericListView
            contentApiService={annoucenmentService}
            emptyMessage="Görüntülenecek duyuru bulunamadı"
            loadingMessage="Duyurular yükleniyor..."
            modalHeader="Duyuru Detay"
        />
    );
}