import GenericListView from "@/components/dk/GenericListView";
import {getCampaigns} from "@/services/api/contents";
import React from "react";
import {CampaignItem} from "@/types/ContentTypes";

export default function Kampanyalar() {
    return (
        <GenericListView<CampaignItem>
            fetchData={getCampaigns}
            emptyMessage="Görüntülenecek duyuru bulunamadı"
            loadingMessage="Duyurular yükleniyor..."
            modalHeader="Duyuru Detay"
        />
    );
}