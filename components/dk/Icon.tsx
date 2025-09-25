import {useDefaultColor} from "@/hooks/useThemeColor";
import {MaterialIcons} from "@expo/vector-icons";
import {ColorValue} from "react-native";

export interface DKIconProps {
    name: string;
    size?: number;
    color?: ColorValue;
    [key: string]: any;
}

export default function DKIcon({name, size = 48, color = '', ...props}: DKIconProps) {

    const colors = useDefaultColor();

    let iconName: DKIconType = 'folder';
    if (name in MaterialIcons.glyphMap) {
        iconName = name as DKIconType;
    }

    return (<MaterialIcons name={iconName} size={size} color={color || colors.primary} {...props}/>);
}

export type DKIconType = keyof typeof MaterialIcons.glyphMap;