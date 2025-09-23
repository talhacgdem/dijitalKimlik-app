import {StyleSheet, Text, View} from 'react-native';
import {useDefaultColor} from '@/hooks/useThemeColor';
import DKButton from './Button';

export interface DKPaginationProps {
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
}

export default function DKPagination({currentPage, lastPage, onPageChange}: DKPaginationProps) {
    const colors = useDefaultColor();

    return (
        <View style={[styles.fixedPagination, {backgroundColor: colors.cardBackground}]}>
            <DKButton
                disabled={currentPage <= 1}
                icon={{name: "chevron-left", size: 24}}
                onPress={() => onPageChange(currentPage - 1)}
                type={'none'}
                style={[
                    styles.arrowButton,
                    {
                        backgroundColor: (currentPage <= 1) ? colors.inactiveBackground : colors.primary
                    }
                ]}
                colorText={"#FFFFFF"}
            />

            <View style={styles.pageInfoContainer}>
                <Text style={[styles.pageInfo, {color: colors.text}]}>
                    {currentPage} / {lastPage}
                </Text>
            </View>

            <DKButton
                disabled={currentPage >= lastPage}
                icon={{name: "chevron-right", size: 24}}
                onPress={() => onPageChange(currentPage + 1)}
                type={'none'}
                style={[
                    styles.arrowButton,
                    {
                        backgroundColor: (currentPage >= lastPage) ? colors.inactiveBackground : colors.primary
                    }
                ]}
                colorText={"#FFFFFF"}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    fixedPagination: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
    }, arrowButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 2,
        padding: 0
    },
    pageInfoContainer: {
        flex: 1,
        alignItems: 'center',
    },
    pageInfo: {
        fontSize: 16,
        fontWeight: '600',
    }
})