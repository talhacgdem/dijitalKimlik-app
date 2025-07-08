// app/components/GenericListView.tsx
import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDefaultColor} from '@/hooks/useThemeColor';
import {MaterialIcons} from '@expo/vector-icons';

export interface GenericItem {
    id: number;
    title: string;
    content: string;
    image?: string;
    created_at: string;

    [key: string]: any;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
    };
    message?: string;
}

interface GenericListViewProps<T extends GenericItem> {
    fetchData: (page: number) => Promise<ApiResponse<T>>;
    renderModalContent?: (item: T) => React.ReactNode;
    cardHeight?: number;
    emptyMessage?: string;
    loadingMessage?: string;
    imageBaseUrl?: string;
    modalHeader?: string;
}

// Genel Kart Bileşeni
const GenericCard = <T extends GenericItem>({
                                                item,
                                                onPress,
                                                cardHeight = 280,
                                                imageBaseUrl
                                            }: {
    item: T;
    onPress: () => void;
    cardHeight?: number;
    imageBaseUrl?: string;
}) => {
    const colors = useDefaultColor();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const truncateContent = (content: string, maxLength: number = 80) => {
        if (content.length <= maxLength) return content;
        return content.substr(0, maxLength) + '...';
    };

    return (
        <TouchableOpacity
            style={[
                styles.card,
                {backgroundColor: colors.cardBackground, height: cardHeight}
            ]}
            onPress={onPress}
        >
            {item.image && (
                <Image
                    source={{uri: `${imageBaseUrl || ''}${item.image}`}}
                    style={styles.image}
                    resizeMode="cover"
                />
            )}
            <View style={styles.cardContent}>
                <Text style={[styles.title, {color: colors.text}]} numberOfLines={2}>
                    {item.title}
                </Text>
                <Text style={[styles.date, {color: colors.secondaryText}]}>
                    {formatDate(item.created_at)}
                </Text>
                <Text style={[styles.content, {color: colors.text}]} numberOfLines={3}>
                    {truncateContent(item.content)}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

// Sabit Sayfalama Bileşeni
const FixedPagination = ({
                             currentPage,
                             lastPage,
                             onPageChange,
                             isLoading
                         }: {
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
    isLoading: boolean;
}) => {
    const colors = useDefaultColor();

    return (
        <View style={[styles.fixedPagination, {backgroundColor: colors.cardBackground}]}>
            <TouchableOpacity
                disabled={currentPage <= 1 || isLoading}
                onPress={() => onPageChange(currentPage - 1)}
                style={[
                    styles.arrowButton,
                    {
                        backgroundColor: (currentPage <= 1 || isLoading) ? colors.inactiveBackground : colors.tint,
                        opacity: (currentPage <= 1 || isLoading) ? 0.5 : 1
                    }
                ]}
            >
                {isLoading && currentPage > 1 ? (
                    <ActivityIndicator size="small" color="#FFFFFF"/>
                ) : (
                    <MaterialIcons name="chevron-left" size={24} color="#FFFFFF"/>
                )}
            </TouchableOpacity>

            <View style={styles.pageInfoContainer}>
                <Text style={[styles.pageInfo, {color: colors.text}]}>
                    {currentPage} / {lastPage}
                </Text>
                {isLoading && (
                    <Text style={[styles.loadingIndicator, {color: colors.secondaryText}]}>
                        Yükleniyor...
                    </Text>
                )}
            </View>

            <TouchableOpacity
                disabled={currentPage >= lastPage || isLoading}
                onPress={() => onPageChange(currentPage + 1)}
                style={[
                    styles.arrowButton,
                    {
                        backgroundColor: (currentPage >= lastPage || isLoading) ? colors.inactiveBackground : colors.tint,
                        opacity: (currentPage >= lastPage || isLoading) ? 0.5 : 1
                    }
                ]}
            >
                {isLoading && currentPage < lastPage ? (
                    <ActivityIndicator size="small" color="#FFFFFF"/>
                ) : (
                    <MaterialIcons name="chevron-right" size={24} color="#FFFFFF"/>
                )}
            </TouchableOpacity>
        </View>
    );
};

// Loading Overlay Bileşeni
const LoadingOverlay = ({visible, message}: { visible: boolean; message: string }) => {
    const colors = useDefaultColor();

    if (!visible) return null;

    return (
        <View style={styles.loadingOverlay}>
            <View style={[styles.loadingCard, {backgroundColor: colors.cardBackground}]}>
                <ActivityIndicator size="large" color={colors.tint}/>
                <Text style={[styles.loadingOverlayText, {color: colors.text}]}>
                    {message}
                </Text>
            </View>
        </View>
    );
};

// Detay Modal Bileşeni
const DetailModal = <T extends GenericItem>({
                                                visible,
                                                item,
                                                onClose,
                                                renderContent,
                                                imageBaseUrl,
                                                modalHeader='Detay'
                                            }: {
    visible: boolean;
    item: T | null;
    onClose: () => void;
    renderContent?: (item: T) => React.ReactNode;
    imageBaseUrl?: string;
    modalHeader?: string;
}) => {
    const colors = useDefaultColor();

    if (!item) return null;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView style={[styles.modalContainer, {backgroundColor: colors.background}]}>
                <View style={[styles.modalHeader, {borderBottomColor: colors.border}]}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <MaterialIcons name="close" size={24} color={colors.text}/>
                    </TouchableOpacity>
                    <Text style={[styles.modalTitle, {color: colors.text}]}>{modalHeader}</Text>
                    <View style={styles.placeholder}/>
                </View>

                <ScrollView style={styles.modalContent}>
                    {item.image && (
                        <Image
                            source={{uri: `${imageBaseUrl || ''}${item.image}`}}
                            style={styles.modalImage}
                            resizeMode="cover"
                        />
                    )}

                    <View style={styles.modalTextContent}>
                        <Text style={[styles.modalItemTitle, {color: colors.text}]}>
                            {item.title}
                        </Text>
                        <Text style={[styles.modalDate, {color: colors.secondaryText}]}>
                            {formatDate(item.created_at)}
                        </Text>

                        {renderContent ? renderContent(item) : (
                            <Text style={[styles.modalItemContent, {color: colors.text}]}>
                                {item.content}
                            </Text>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
};

// Ana Bileşen
export default function GenericListView<T extends GenericItem>({
                                                                   fetchData,
                                                                   renderModalContent,
                                                                   cardHeight = 280,
                                                                   emptyMessage = 'Görüntülenecek öğe bulunamadı',
                                                                   loadingMessage = 'Yükleniyor...',
                                                                   imageBaseUrl = 'https://lapastaia.tr/apiproject/storage/',
                                                                   modalHeader
                                                               }: GenericListViewProps<T>) {
    const colors = useDefaultColor();
    const [data, setData] = useState<T[]>([]);
    const [initialLoading, setInitialLoading] = useState(true); // İlk yükleme
    const [pageLoading, setPageLoading] = useState(false); // Sayfa değişimi yüklemesi
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<T | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
    });

    const loadData = async (page: number = 1, isPageChange: boolean = false) => {
        try {
            if (isPageChange) {
                setPageLoading(true);
            } else if (page === 1 && data.length === 0) {
                setInitialLoading(true);
            }

            setError(null);

            const response = await fetchData(page);

            if (response.success) {
                setData(response.data);
                setPagination({
                    currentPage: response.meta.current_page,
                    lastPage: response.meta.last_page,
                });
            } else {
                setError(response.message || 'Veriler yüklenemedi');
            }
        } catch (err) {
            setError('Veriler yüklenirken bir hata oluştu');
            console.error(err);
        } finally {
            setInitialLoading(false);
            setPageLoading(false);
            setRefreshing(false);
        }
    };

    const handlePageChange = (page: number) => {
        loadData(page, true);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadData(1);
    };

    const handleItemPress = (item: T) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedItem(null);
    };

    useEffect(() => {
        loadData();
    }, []);

    // İlk yükleme ekranı
    if (initialLoading) {
        return (
            <SafeAreaView edges={['bottom']} style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.tint}/>
                    <Text style={[styles.loadingText, {color: colors.text}]}>
                        {loadingMessage}
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    // Hata durumu
    if (error && data.length === 0) {
        return (
            <SafeAreaView edges={['bottom']} style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, {color: colors.error}]}>{error}</Text>
                    <TouchableOpacity
                        style={[styles.retryButton, {backgroundColor: colors.tint}]}
                        onPress={() => loadData()}
                    >
                        <Text style={styles.retryButtonText}>Tekrar Dene</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['bottom']} style={styles.container}>
            <FlatList
                data={data}
                renderItem={({item}) => (
                    <GenericCard
                        item={item}
                        onPress={() => handleItemPress(item)}
                        cardHeight={cardHeight}
                        imageBaseUrl={imageBaseUrl}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={[styles.listContent, {paddingBottom: 100}]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[colors.tint]}
                    />
                }
                ListEmptyComponent={
                    <Text style={[styles.emptyText, {color: colors.secondaryText}]}>
                        {emptyMessage}
                    </Text>
                }
            />

            {/* Sayfa yükleme overlay'i */}
            <LoadingOverlay visible={pageLoading} message="Sayfa yükleniyor..."/>

            {/* Sabit pagination - her zaman görünür */}
            {pagination.lastPage > 1 && (
                <FixedPagination
                    currentPage={pagination.currentPage}
                    lastPage={pagination.lastPage}
                    onPageChange={handlePageChange}
                    isLoading={pageLoading}
                />
            )}

            <DetailModal
                visible={modalVisible}
                item={selectedItem}
                onClose={handleCloseModal}
                renderContent={renderModalContent}
                imageBaseUrl={imageBaseUrl}
                modalHeader={modalHeader}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: 16,
    },
    card: {
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    image: {
        width: '100%',
        height: 140,
    },
    cardContent: {
        padding: 16,
        flex: 1,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
        lineHeight: 22,
    },
    date: {
        fontSize: 12,
        marginBottom: 8,
    },
    content: {
        fontSize: 14,
        lineHeight: 18,
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
    },
    // Loading Overlay Stilleri
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loadingCard: {
        padding: 24,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    loadingOverlayText: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: '500',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    errorText: {
        fontSize: 16,
        marginBottom: 16,
        textAlign: 'center',
    },
    retryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
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
    },
    arrowButton: {
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
    },
    pageInfoContainer: {
        flex: 1,
        alignItems: 'center',
    },
    pageInfo: {
        fontSize: 16,
        fontWeight: '600',
    },
    loadingIndicator: {
        fontSize: 12,
        marginTop: 2,
    },
    emptyText: {
        textAlign: 'center',
        padding: 24,
        fontSize: 16,
    },
    // Modal Stilleri
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
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
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    placeholder: {
        width: 40,
    },
    modalContent: {
        flex: 1,
    },
    modalImage: {
        width: '100%',
        height: 250,
    },
    modalTextContent: {
        padding: 16,
    },
    modalItemTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        lineHeight: 28,
    },
    modalDate: {
        fontSize: 14,
        marginBottom: 16,
    },
    modalItemContent: {
        fontSize: 16,
        lineHeight: 24,
    },
});
