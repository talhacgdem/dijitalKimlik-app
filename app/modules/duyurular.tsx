import React from 'react';
import {Text} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

// Haber Kartı Bileşeni
export default function Duyurular() {
    return (
        <SafeAreaView edges={['bottom']} style={{flex: 1, padding: 16}}>
            <Text style={{fontSize: 18}}>Duyurular Modülü</Text>
        </SafeAreaView>
    );
}