import React from 'react';
import AdminListView from "@/components/dk/AdminListView";
import {newsService} from "@/services/api/contents";

export default function AdminHaberler() {
    return (
        <AdminListView
            contentApiService={newsService}
            title="Haber Yönetimi"
            dates={false}
        />
    );
}
