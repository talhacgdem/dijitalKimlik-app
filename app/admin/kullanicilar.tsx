// app/modules/AdminKullanicilar.tsx
import React from 'react';
import AdminListView from "@/components/dk/AdminListView";
import {newsService} from "@/services/api/contents";

export default function AdminKullanicilar() {
    return (
        <AdminListView
            contentApiService={newsService}
            title="Kullanıcı Yönetimi"
            dates={false}
        />
    );
}
