import React from 'react';
import AdminUserListView from "@/components/dk/AdminUserListView";
import {usersService} from "@/services/api/user";

export default function AdminKullanicilar() {
    return (
        <AdminUserListView
            userApiService={usersService}
            title="Kullanıcı Yönetimi"
        />
    );
}
