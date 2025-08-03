import GenericListView from "@/components/dk/GenericListView";
import {campaignService} from "@/services/api/contents";
import React from "react";

export default function Kampanyalar() {
    return (
        <GenericListView
            contentApiService={campaignService}
            emptyMessage="Görüntülenecek duyuru bulunamadı"
            loadingMessage="Duyurular yükleniyor..."
            modalHeader="Duyuru Detay"
        />
    );
}