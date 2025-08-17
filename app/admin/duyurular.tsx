import React from 'react';
import AdminListView from "@/components/dk/AdminListView";
import {annoucenmentService} from "@/services/api/contents";

export default function AdminDuyurular() {
    return (
        <AdminListView
            contentApiService={annoucenmentService}
            title="Duyuru Yönetimi"
            dates={false}
        />
    );
}
