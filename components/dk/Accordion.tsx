// AccordionListSimple.tsx
import React, {ReactElement, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import Animated, {interpolate, useAnimatedStyle, useSharedValue, withTiming,} from 'react-native-reanimated';
import DKIcon from "@/components/dk/Icon";

export interface AccordionItemData {
    id: number;
    title: string;
    icon?: keyof typeof MaterialIcons.glyphMap;
    content: ReactElement;
}

export interface AccordionItemProps {
    item: AccordionItemData;
    isExpanded: boolean;
    onToggle: () => void;
    iconColor?: string;
    showIcon?: boolean;
}

export interface AccordionListProps {
    data: AccordionItemData[];
    multipleExpanded?: boolean;
    showIcon?: boolean;
}

const accordionAnimationDuration = 800;

const AccordionItem: React.FC<AccordionItemProps> = ({
                                                         item,
                                                         isExpanded,
                                                         onToggle,
                                                         iconColor = '#333',
                                                         showIcon = true
                                                     }) => {
    const progress = useSharedValue(isExpanded ? 1 : 0);

    React.useEffect(() => {
        progress.value = withTiming(isExpanded ? 1 : 0, {
            duration: accordionAnimationDuration,
        });
    }, [isExpanded, progress]);

    const animatedStyle = useAnimatedStyle(() => ({
        maxHeight: interpolate(progress.value, [0, 1], [0, 500]), // Sabit max height
        opacity: interpolate(progress.value, [0, 0.3, 1], [0, 0.5, 1]),
    }));

    const iconAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                rotate: `${interpolate(progress.value, [0, 1], [0, 180])}deg`,
            },
        ],
    }));

    return (
        <View style={styles.accordionItem}>
            <TouchableOpacity
                style={styles.header}
                activeOpacity={0.7}
                onPress={onToggle}
            >
                {showIcon && (
                    <Animated.View style={iconAnimatedStyle}>
                        <DKIcon
                            name="arrow-drop-down"
                            size={24}
                            color={iconColor}
                        />
                    </Animated.View>
                )}
                <Text style={styles.headerText}>{item.title}</Text>

            </TouchableOpacity>

            <Animated.View style={[styles.contentContainer, animatedStyle]}>
                <View style={styles.content}>
                    <Text style={styles.contentText}>{item.content}</Text>
                </View>
            </Animated.View>
        </View>
    );
};

const AccordionList: React.FC<AccordionListProps> = ({
                                                         data,
                                                         multipleExpanded = false,
                                                         showIcon = true
                                                     }) => {
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

    const toggleItem = (index: number): void => {
        setExpandedItems(prevExpanded => {
            const newExpanded = new Set(prevExpanded);

            if (multipleExpanded) {
                if (newExpanded.has(index)) {
                    newExpanded.delete(index);
                } else {
                    newExpanded.add(index);
                }
            } else {
                if (newExpanded.has(index)) {
                    newExpanded.clear();
                } else {
                    newExpanded.clear();
                    newExpanded.add(index);
                }
            }

            return newExpanded;
        });
    };

    return (
        <View style={styles.container}>
            {data.map((item, index) => (
                <AccordionItem
                    key={item.id || index}
                    item={item}
                    isExpanded={expandedItems.has(index)}
                    onToggle={() => toggleItem(index)}
                    showIcon={showIcon}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    accordionItem: {
        marginBottom: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    headerText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    contentContainer: {
        overflow: 'hidden',
    },
    content: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    contentText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
});

export default AccordionList;
