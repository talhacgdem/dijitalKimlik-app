import {StyleSheet} from "react-native";

export const modalStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    closeButton: {
        padding: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop:20
    },
    image: {
        width: '100%',
        height: 250,
    },
    textContent: {
        padding: 16,
    },
    itemTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        lineHeight: 28,
    },
    date: {
        fontSize: 14,
        marginBottom: 16,
    },
    itemContent: {
        fontSize: 16,
        lineHeight: 24,
    },
    modalImage: {
        width: '100%',
        height: 250,
    },
});