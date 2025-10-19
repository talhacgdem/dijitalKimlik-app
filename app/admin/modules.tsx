import {useLocalSearchParams} from 'expo-router';
import React from "react";
import ContentListView from "@/components/dk/ContentListView";
import {ContentType} from "@/types/v2/ContentType";

export default function ContentPage() {
    const {contentTypeData} = useLocalSearchParams<{ contentTypeData: string }>();
    let contentType: ContentType = JSON.parse(contentTypeData)["contentType"] as ContentType;
    return (<ContentListView contentType={contentType} isAdmin={true}/>);
}