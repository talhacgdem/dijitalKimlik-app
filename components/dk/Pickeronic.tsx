import React, {Children, cloneElement, ReactElement, ReactNode, useRef, useState} from 'react';
import {Modal, ScrollView, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle,} from 'react-native';
import DKIcon, {DKIconType} from "@/components/dk/Icon";

// TypeScript Interfaces
export interface PickerDropdownProps {
    children: ReactNode;
    selectedValue?: any;
    onValueChange?: (value: any, label?: string) => void;
    placeholder?: string;
    disabled?: boolean;
    maxHeight?: number;
    style?: ViewStyle;
    dropdownStyle?: ViewStyle;
    itemStyle?: ViewStyle;
    textStyle?: TextStyle;
    placeholderStyle?: TextStyle;
}

export interface PickerItemProps {
    label?: string;
    value: any;
    icon?: DKIconType
    style?: ViewStyle;
    onPress?: (value: any, label?: string) => void;
}

// PickerDropdown.Item component
const PickerItem: React.FC<PickerItemProps> = ({
                                                   label,
                                                   value,
                                                   icon,
                                                   style,
                                                   onPress
                                               }) => {
    return (
        <TouchableOpacity
            style={[styles.item, style]}
            onPress={() => onPress && onPress(value, label)}
        >
            <View style={{flexDirection: "row", alignItems: "center"}}>
                {icon && (<DKIcon name={icon} size={24}/>)}
                <Text>{label}</Text>
            </View>
        </TouchableOpacity>
    );
};

// Ana PickerDropdown component
const PickerDropdown: React.FC<PickerDropdownProps> & { Item: typeof PickerItem } = ({
                                                                                         children,
                                                                                         selectedValue,
                                                                                         onValueChange,
                                                                                         placeholder = "Seçim yapın",
                                                                                         style,
                                                                                         dropdownStyle,
                                                                                         itemStyle,
                                                                                         textStyle,
                                                                                         placeholderStyle,
                                                                                         disabled = false,
                                                                                         maxHeight = 300,
                                                                                     }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [dropdownTop, setDropdownTop] = useState(0);
    const [dropdownLeft, setDropdownLeft] = useState(0);
    const [dropdownWidth, setDropdownWidth] = useState(0);

    // Ref tipini düzelt
    const buttonRef = useRef<View>(null);

    const toggleDropdown = (): void => {
        if (disabled) return;

        if (isVisible) {
            setIsVisible(false);
        } else {
            openDropdown();
        }
    };

    const openDropdown = (): void => {
        if (buttonRef.current) {
            buttonRef.current.measure((
                _fx: number,
                _fy: number,
                width: number,
                height: number,
                px: number,
                py: number
            ) => {
                setDropdownTop(py + height);
                setDropdownLeft(px);
                setDropdownWidth(width);
                setIsVisible(true);
            });
        }
    };

    const onItemPress = (value: any, label?: string): void => {
        setIsVisible(false);
        onValueChange && onValueChange(value, label);
    };

    // Children'ları işle ve props ekle
    const renderItems = (): ReactNode => {
        return Children.map(children, (child, index) => {
            // ReactElement olup olmadığını kontrol et
            if (React.isValidElement<PickerItemProps>(child) && child.type === PickerItem) {
                // @ts-ignore
                return cloneElement(child as ReactElement<PickerItemProps>, {
                    key: child.props.value || index,
                    onPress: onItemPress,
                    style: [itemStyle, child.props.style],
                });
            }
        });
    };

    // Seçili değerin label'ını bul
    const getSelectedLabel = (): string => {
        if (!selectedValue) return placeholder;

        let selectedLabel = placeholder;

        Children.forEach(children, (child) => {
            if (React.isValidElement<PickerItemProps>(child) &&
                child.type === PickerItem &&
                child.props.value === selectedValue) {
                selectedLabel = child.props.label || placeholder;
            }
        });

        return selectedLabel;
    };

    return (
        <View style={style}>
            <TouchableOpacity
                ref={buttonRef}
                style={[
                    styles.button,
                    disabled && styles.buttonDisabled,
                ]}
                onPress={toggleDropdown}
                disabled={disabled}
            >
                <Text
                    style={[
                        styles.buttonText,
                        !selectedValue && styles.placeholderText,
                        !selectedValue && placeholderStyle,
                        selectedValue && textStyle,
                        disabled && styles.disabledText,
                    ]}
                >
                    {getSelectedLabel()}
                </Text>
                <Text style={[styles.arrow, disabled && styles.disabledText]}>
                    {isVisible ? '▲' : '▼'}
                </Text>
            </TouchableOpacity>

            <Modal
                visible={isVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setIsVisible(false)}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    onPress={() => setIsVisible(false)}
                >
                    <View
                        style={[
                            styles.dropdown,
                            {
                                top: dropdownTop,
                                left: dropdownLeft,
                                width: dropdownWidth,
                                maxHeight: maxHeight,
                            },
                            dropdownStyle,
                        ]}
                    >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled
                        >
                            {renderItems()}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        minHeight: 48,
    },
    buttonDisabled: {
        backgroundColor: '#f5f5f5',
        borderColor: '#e0e0e0',
    },
    buttonText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    placeholderText: {
        color: '#999',
    },
    disabledText: {
        color: '#ccc',
    },
    arrow: {
        fontSize: 12,
        color: '#666',
        marginLeft: 8,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    dropdown: {
        position: 'absolute',
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1000,
    },
    item: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#eee',
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
});

// PickerItem'ı PickerDropdown'a bağla
PickerDropdown.Item = PickerItem;

export default PickerDropdown;

// Ek TypeScript Interfaces
export type PickerValueChangeCallback = (value: any, label?: string) => void;

export interface PickerOption {
    value: any;
    label: string;
    disabled?: boolean;
    icon?: ReactNode;
}

export interface PickerDropdownRef {
    open: () => void;
    close: () => void;
    isOpen: () => boolean;
}

export interface TypedPickerDropdownProps<T = any> extends Omit<PickerDropdownProps, 'selectedValue' | 'onValueChange'> {
    selectedValue?: T;
    onValueChange?: (value: T, label?: string) => void;
}

export interface TypedPickerItemProps<T = any> extends Omit<PickerItemProps, 'value' | 'onPress'> {
    value: T;
    onPress?: (value: T, label?: string) => void;
}

/*
Kullanım Örneği:

import React, { useState } from 'react';
import { View, Text } from 'react-native';
import PickerDropdown from './PickerDropdown';

const App: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();

  return (
      <View style={{ padding: 20, paddingTop: 100 }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Şehir Seçin:</Text>
          <PickerDropdown
              selectedValue={selectedCity}
              onValueChange={(value, label) => {
                  setSelectedCity(value);
                  console.log('Seçilen:', value, label);
              }}
              placeholder="Şehir seçin..."
              style={{ marginBottom: 20 }}
          >
              <PickerDropdown.Item label="İstanbul" value="istanbul" />
              <PickerDropdown.Item label="Ankara" value="ankara" />
              <PickerDropdown.Item label="İzmir" value="izmir" />
              <PickerDropdown.Item label="Bursa" value="bursa" />
              <PickerDropdown.Item label="Antalya" value="antalya" />
          </PickerDropdown>

          <Text style={{ fontSize: 18, marginBottom: 10, marginTop: 30 }}>Renk Seçin:</Text>
          <PickerDropdown
              selectedValue={selectedColor}
              onValueChange={setSelectedColor}
              placeholder="Renk seçin..."
              style={{ marginBottom: 20 }}
          >
              <PickerDropdown.Item value="red">
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{
                          width: 20,
                          height: 20,
                          backgroundColor: 'red',
                          marginRight: 10,
                          borderRadius: 10
                      }} />
                      <Text>Kırmızı</Text>
                  </View>
              </PickerDropdown.Item>

              <PickerDropdown.Item value="blue">
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{
                          width: 20,
                          height: 20,
                          backgroundColor: 'blue',
                          marginRight: 10,
                          borderRadius: 10
                      }} />
                      <Text>Mavi</Text>
                  </View>
              </PickerDropdown.Item>

              <PickerDropdown.Item value="green">
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{
                          width: 20,
                          height: 20,
                          backgroundColor: 'green',
                          marginRight: 10,
                          borderRadius: 10
                      }} />
                      <Text>Yeşil</Text>
                  </View>
              </PickerDropdown.Item>
          </PickerDropdown>

          {selectedCity && (
              <Text style={{ marginTop: 20 }}>Seçilen şehir: {selectedCity}</Text>
          )}
          {selectedColor && (
              <Text>Seçilen renk: {selectedColor}</Text>
          )}
      </View>
  );
};

export default App;
*/