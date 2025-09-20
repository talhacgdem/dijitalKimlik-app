import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function DKDivider() {
    return <View style={styles.hr} />;
}

const styles = StyleSheet.create({
    hr: {
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginTop: 10,
        marginBottom: 20,
    },
});