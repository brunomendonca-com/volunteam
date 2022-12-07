import {
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
    ViewProps,
} from 'react-native';

import { useEffect, useState } from 'react';
import { castToNumber } from '../utils';

type NumberInputProps = {
    value?: number;
    style?: TextInputProps['style'];
    onChangeNumber?: (val: number | undefined) => void;
};

export default function NumberInput(props: NumberInputProps) {
    const { onChangeNumber, style, value } = props;
    const [internalValue, setInternalValue] = useState<number | undefined>(
        value
    );

    useEffect(() => {
        setInternalValue(value);
    }, [value]);

    const styles = splitStyle(style);

    return (
        <View style={styles.container}>
            <TextInput
                value={getUnsignedText(internalValue)}
                style={styles.field}
                keyboardType="number-pad"
                onChangeText={(val) => {
                    const numberVal = val && val.replace(/[^0-9]/g, '');
                    const cast = castToNumber(numberVal);
                    const newValue = Number.isNaN(cast) ? undefined : cast;
                    setInternalValue(newValue);
                    onChangeNumber?.(newValue);
                }}
            />
        </View>
    );
}

function splitStyle(style: any) {
    const flattened = StyleSheet.flatten(style);

    const {
        paddingHorizontal,
        paddingVertical,
        fontSize,
        borderColor,
        fontFamily,
        color,
        ...rest
    } = flattened || {};

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
