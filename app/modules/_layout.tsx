import {useLocalSearchParams} from 'expo-router';
import {SafeAreaView} from "react-native-safe-area-context";
import DKHeader from "@/components/dk/Header";
import React from "react";
import ContentListView from "@/components/dk/ContentListView";
import {ContentType} from "@/types/v2/ContentType";

export default function ContentPage() {

    const {contentTypeData} = useLocalSearchParams<{ contentTypeData: string }>();
    let contentType: ContentType = JSON.parse(contentTypeData) as ContentType;

    return (
        <SafeAreaView style={{flex: 1}}>
            <DKHeader
                title={contentType.name}
                icon={contentType.icon}
            />
            <ContentListView contentType={contentType}/>
        </SafeAreaView>
    );
}