import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { RectButton } from 'react-native-gesture-handler';

interface EventDataRouteParams {
    position: { latitude: number; longitude: number };
}

export default function EventData() {
    const route = useRoute();
    const navigation = useNavigation();

    const [open_on_weekends, setOpenOnWeekends] = useState(false);

    const params = route.params as EventDataRouteParams;
    const position = params.position;

    function handleCreateEvent() {
        // todo
    }

    async function handleSelectImages() {
        const { status } =
            await ImagePicker.requestCameraRollPermissionsAsync();

        if (status !== 'granted') {
            alert('Oops! We need permission to access your pictures...');
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        console.log(result);
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ padding: 24 }}
        >
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} />

            <Text style={styles.label}>About</Text>
            <TextInput style={[styles.input, { height: 110 }]} multiline />

            <Text style={styles.label}>Volunteers Needed</Text>
            <TextInput style={styles.input} />

            <Text style={styles.label}>Date and Time</Text>
            <TextInput style={styles.input} />

            <Text style={styles.label}>Picture</Text>
            <TouchableOpacity
                style={styles.imagesInput}
                onPress={handleSelectImages}
            >
                <Feather name="plus" size={24} color="#00A3FF80" />
            </TouchableOpacity>

            <RectButton style={styles.nextButton} onPress={handleCreateEvent}>
                <Text style={styles.nextButtonText}>Save</Text>
            </RectButton>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    title: {
        color: '#5c8599',
        fontSize: 24,
        fontFamily: 'Nunito_700Bold',
        marginBottom: 32,
        paddingBottom: 24,
        borderBottomWidth: 0.8,
        borderBottomColor: '#D3E2E5',
    },

    label: {
        color: '#8fa7b3',
        fontFamily: 'Nunito_600SemiBold',
        marginBottom: 8,
    },

    comment: {
        fontSize: 11,
        color: '#8fa7b3',
    },

    input: {
        backgroundColor: '#fff',
        borderWidth: 1.4,
        borderColor: '#D3E2E5',
        borderRadius: 8,
        height: 56,
        paddingVertical: 18,
        paddingHorizontal: 24,
        marginBottom: 16,
        textAlignVertical: 'top',
    },

    imagesInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderStyle: 'dashed',
        borderColor: '#00A3FF80',
        borderWidth: 1,
        borderRadius: 16,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },

    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
    },

    nextButton: {
        backgroundColor: '#00A3FF',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        height: 56,
        marginTop: 32,
    },

    nextButtonText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 16,
        color: '#FFF',
    },
});
