import { View, Text, Button, Alert , StyleSheet} from 'react-native';
import UserIdCard from "@/components/dk/UserIdCard";
import React from "react";
import {useDefaultColor} from "@/hooks/useThemeColor";

export default function ProfileScreen() {
    const colors = useDefaultColor();

    return (
        <View style={{ flex: 1, padding: 16}}>
            <View style={{alignItems: 'center', marginTop:50}}>
                <UserIdCard
                    name={"Talha Çiğdem"}
                    profileImage={"https://avatar.iran.liara.run/public"}
                    birthDate={"01/01/1990"}
                    department={"Yazılım Mühendisi"}
                    idNumber={"12345678901"}
                ></UserIdCard>
            </View>

            <View style={{marginTop: 20}}>
                <Text style={[styles.title, {color: colors.text}]}>Profil Güncelleme İşlemleri</Text>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16},
    title: {fontSize: 20, fontWeight: 'bold'},
});