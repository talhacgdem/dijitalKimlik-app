import React from 'react';
import AdminListView from "@/components/dk/AdminListView";
import {campaignService} from "@/services/api/contents";

export default function AdminKampanyalar() {
    return (
        <AdminListView
            contentApiService={campaignService}
            title="Kampanya Yönetimi"
            dates={true}
        />
    );
}
