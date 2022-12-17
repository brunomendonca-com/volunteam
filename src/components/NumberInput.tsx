import { StyleSheet, TextInput, TextInputProps, View, ViewProps } from 'react-native';
import { useState } from 'react';

type NumberInputProps = {
    value?: number;
    style?: TextInputProps['style'];
    onChangeNumber?: (val: number) => void;
    onBlur?: () => void;
};

export default function NumberInput(props: NumberInputProps) {
    const { onChangeNumber, onBlur, style, value } = props;
    const [internalValue, setInternalValue] = useState<number | undefined>(value);

    const styles = splitStyle(style);

    return (
        <View style={styles.container}>
            <TextInput
                value={getUnsignedText(internalValue)}
                style={styles.field}
                keyboardType="number-pad"
                onBlur={onBlur}
                onChangeText={(val) => {
                    const newVal = val.length && Number(val.replace(/[^0-9]/g, ''));
                    setInternalValue(newVal);
                    onChangeNumber?.(newVal);
                }}
            />
        </View>
    );
}

function splitStyle(style: any) {
    const flattened = StyleSheet.flatten(style);

    const { paddingHorizontal, paddingVertical, fontSize, borderColor, fontFamily, color, ...rest } = flattened || {};

    const container = {
        flexDirection: 'row',
        alignItems: 'stretch',
        borderColor,
        ...rest,
    } as ViewProps['style'];

    const field = {
        color,
        fontFamily,
        fontSize,
        paddingHorizontal,
        paddingVertical,
        flex: 1,
    } as TextInputProps['style'];

    return { container, field };
}

function getUnsignedText(num: number | undefined) {
    return num != null ? Math.abs(num).toString() : num;
}
