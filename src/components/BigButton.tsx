import React from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

interface BigButtonProps {
    label: string;
    color: string;
    featherIconName?: string;
    disabled?: boolean;
    onPress: () => void;
}

export default function BigButton(props: BigButtonProps) {
    const styles = styling(props);
    const { featherIconName, label, color, disabled, onPress } = props;

    return (
        <RectButton style={styles.button} onPress={onPress}>
            {featherIconName && (
                <Feather
                    style={styles.icon}
                    name={featherIconName}
                    size={16}
                    color="#FFF"
                />
            )}
            <Text style={styles.label}>{label}</Text>
        </RectButton>
    );
}

const styling = ({ color, disabled }: BigButtonProps) =>
    StyleSheet.create({
        button: {
            paddingVertical: 14,
            paddingHorizontal: 32,
            backgroundColor: disabled ? color + '80' : color,
            borderRadius: 16,
            height: 56,

            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
            flex: 1,
        },

        icon: {
            marginRight: 8,
        },

        label: {
            fontFamily: 'Nunito_800ExtraBold',
            color: '#FFF',
            fontSize: 15,
        },
    });
