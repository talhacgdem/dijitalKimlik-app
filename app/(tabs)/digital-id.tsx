import {Image, Text, View} from 'react-native';
import {useAuth} from "@/contexts/AuthContext";

export default function DigitalID() {
    let authContext = useAuth();

    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>Dijital Kimlik</Text>
            <Image source={{uri: 'https://api.qrserver.com/v1/create-qr-code/?data=12345678'}} style={{width: 200, height: 200, marginVertical: 20}}/>
            <Text>TC: {authContext.user?.identityNumber}</Text>
            <Text>Ad: {authContext.user?.name}</Text>
        </View>
    );
}