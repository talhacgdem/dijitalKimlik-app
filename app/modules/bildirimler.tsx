// app/modules/AdminHaberler.tsx
import React from 'react';
import {NewsItem} from '@/types/ContentTypes';
import AdminListView from "@/components/dk/AdminListView";
import {createNews, deleteNews, getNews, updateNews} from "@/services/api/contents";

export default function AdminHaberler() {
    return (

        <AdminListView<NewsItem>
            fetchData={getNews}
            createItem={createNews}
            updateItem={updateNews}
            deleteItem={deleteNews}
            title="Haber Yönetimi"
        />

    );
}
