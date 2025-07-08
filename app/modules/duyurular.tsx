import React from 'react';
import {getAnnouncements} from '@/services/api/contents';
import {AnnouncementItem} from '@/types/ContentTypes';
import GenericListView from "@/components/dk/GenericListView";
import { View, Text } from 'react-native';
import {useDefaultColor} from "@/hooks/useThemeColor";

// Haber Kartı Bileşeni
export default function Haberler() {
    let colors = useDefaultColor();
    const renderModalContent = (item: AnnouncementItem) => (
        <View>
            <Text style={{color: colors.text, fontSize: 16, lineHeight: 24, marginBottom: 16}}>
                {item.content}
            </Text>

            {item.discount_percentage && (
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                    padding: 12,
                    backgroundColor: colors.success + '20',
                    borderRadius: 8
                }}>
                    <Text style={{color: colors.text, fontWeight: 'bold'}}>İndirim Oranı:</Text>
                    <Text style={{color: colors.success, fontWeight: 'bold'}}>
                        %{item.discount_percentage}
                    </Text>
                </View>
            )}

            {item.valid_until && (
                <View style={{
                    padding: 12,
                    backgroundColor: colors.warning + '20',
                    borderRadius: 8
                }}>
                    <Text style={{color: colors.text}}>
                        Son Geçerlilik: {new Date(item.valid_until).toLocaleDateString('tr-TR')}
                    </Text>
                </View>
            )}
        </View>
    );

    return (
        <GenericListView<AnnouncementItem>
            fetchData={getAnnouncements}
            emptyMessage="Görüntülenecek duyuru bulunamadı"
            loadingMessage="Duyurular yükleniyor..."
            renderModalContent={renderModalContent}
            modalHeader="Duyuru Detay"
        />
    );
}