import React from 'react';
import GenericListView from "@/components/dk/GenericListView";
import {AnnoucementItem} from "@/types/ContentTypes";
import {getAnnoucements} from "@/services/api/contents";

export default function Duyurular() {
    return (
        <GenericListView<AnnoucementItem>
            fetchData={getAnnoucements}
            emptyMessage="Görüntülenecek duyuru bulunamadı"
            loadingMessage="Duyurular yükleniyor..."
            modalHeader="Duyuru Detay"
        />
    );
}