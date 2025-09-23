import {View} from 'react-native';
import UserIdCard from "@/components/dk/UserIdCard";
import React from "react";
import {useAuth} from "@/contexts/AuthContext";

export default function ProfileScreen() {
    const {user} = useAuth();


    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16}}>
            <UserIdCard
                user={user}
            ></UserIdCard>
        </View>
    );
}
