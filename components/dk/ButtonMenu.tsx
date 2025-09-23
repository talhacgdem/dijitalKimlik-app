import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {MaterialIcons} from "@expo/vector-icons";
import {ColorsCustom} from "@/constants/Colors";
import DKIcon from "@/components/dk/Icon";
import {useRouter} from "expo-router";

interface DKButtonMenuProps {
    key: React.Key | null;
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    pathname: any;
    params?: Record<string, string>;
}

function DKButtonMenu({key, label, icon, pathname, params}: DKButtonMenuProps) {
    const router = useRouter();

    const handlePress = () => {
        router.push({
            pathname: pathname,
            params: params
        });
    };

    return (
        <TouchableOpacity
            key={key}
            onPress={handlePress}
            style={{
                width: '48%',
                marginBottom: 20,
                alignItems: 'center',
            }}
        >
            <View style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 8,
            }}>
                <DKIcon name={icon} size={48} color={ColorsCustom.primary}/>
            </View>
            <Text style={{
                fontSize: 24,
                textAlign: 'center',
            }}>{label}</Text>
        </TouchableOpacity>
    )
}

export default DKButtonMenu;