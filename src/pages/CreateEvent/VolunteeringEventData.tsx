import { useActionSheet } from '@expo/react-native-action-sheet';
import { Feather } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import BigButton from '../../components/BigButton';
import NumberInput from '../../components/NumberInput';
import Spacer from '../../components/Spacer';
import { formatBytes } from '../../utils';

type Coordinates = {
    latitude: number;
    longitude: number;
};

type EventDataRouteParams = {
    position: Coordinates;
};

type UploadedImage = {
    filename: string;
    size: number;
    url: string;
};

type Event = {
    name: string;
    description: string;
    volunteers: number;
    dateTime: Date;
    position: Coordinates;
    imageAssetUri?: string;
    imageUrl?: string;
};

export default function EventData({
    navigation,
    route,
}: StackScreenProps<any>) {
    const { position } = route.params as EventDataRouteParams;
    const { showActionSheetWithOptions } = useActionSheet();

    const [eventFormValue, setEventFormValue] = useState<Event>({
        name: '',
        description: '',
        volunteers: 0,
        dateTime: new Date(),
        position,
    });

    const [uploadedImage, setUploadedImage] = useState<
        UploadedImage | undefined
    >();
    const [isUploading, setIsUploading] = useState<boolean>(false);

    useEffect(() => {
        setEventFormValue({ ...eventFormValue, imageUrl: uploadedImage?.url });
    }, [uploadedImage]);

    const [datePickerVisibility, setDatePickerVisibility] =
        useState<boolean>(false);

    const onDateSelected = (value: Date) => {
        setEventFormValue({ ...eventFormValue, dateTime: value });
        setDatePickerVisibility(false);
    };

    const [timePickerVisibility, setTimePickerVisibility] =
        useState<boolean>(false);

    const onTimeSelected = (newTime: Date) => {
        const newDateTime = getEventDateWithNewTime(newTime);
        setEventFormValue({ ...eventFormValue, dateTime: newDateTime });
        setTimePickerVisibility(false);
    };

    const getEventDateWithNewTime = (time: Date) =>
        new Date(
            new Date(eventFormValue.dateTime).setHours(
                time.getHours(),
                time.getMinutes(),
                0,
                0
            )
        );

    const handleCreateEvent = () => {
        // TODO persist event
        console.log('New Event:', eventFormValue);
        navigation.navigate('EventsMap');
    };

    const handleSelectImages = async () => {
        const options = ['Take Photo...', 'Choose from Library...', 'Cancel'];
        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex: 2,
                title: 'Choose an action',
            },
            (selectedIndex) => {
                switch (selectedIndex) {
                    case 0:
                        openCamera();
                        break;
                    case 1:
                        openImagePicker();
                        break;
                }
            }
        );
    };

    const imagePickerOptions: ImagePicker.ImagePickerOptions = {
        allowsEditing: true,
        quality: 1,
        allowsMultipleSelection: false,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        exif: true,
        base64: true,
    };

    const openImagePicker = async () => {
        // Ask the user for the permission to access the media library
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You've refused to allow this appp to access your photos!");
            return;
        }

        try {
            const response = await ImagePicker.launchImageLibraryAsync(
                imagePickerOptions
            );
            if (!response.canceled) {
                persistImage(response.assets[0]);
            }
        } catch {}
    };

    const openCamera = async () => {
        // Ask the user for the permission to access the camera
        const permissionResult =
            await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You've refused to allow this appp to access your camera!");
            return;
        }

        try {
            const response = await ImagePicker.launchCameraAsync(
                imagePickerOptions
            );
            if (!response.canceled) {
                persistImage(response.assets[0]);
            }
        } catch {}
    };

    const persistImage = (imageAsset: ImagePicker.ImagePickerAsset) => {
        setEventFormValue({ ...eventFormValue, imageAssetUri: imageAsset.uri });
        // TODO persist image
        const apiKey = '16e1e82b21ec9f8cbddaff80f386c2f3';
        const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;
        const data = new FormData();
        data.append('image', imageAsset.base64 as string);
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };

        setIsUploading(true);
        axios
            .post(url, data, config)
            .then((res) => {
                const { image, url, size } = res.data.data;
                const { filename } = image;

                setUploadedImage({ filename, size, url });
                setIsUploading(false);
            })
            .catch((error) => {
                setIsUploading(false);
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            });
    };

    const removeImage = () => {
        setEventFormValue({ ...eventFormValue, imageAssetUri: '' });
        setUploadedImage(undefined);
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ padding: 24 }}
        >
            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                onChangeText={(name) => {
                    setEventFormValue({ ...eventFormValue, name });
                }}
            />
            <Text style={styles.label}>About</Text>
            <TextInput
                style={[styles.input, { height: 110 }]}
                multiline
                maxLength={300}
                textAlignVertical="top"
                onChangeText={(description) => {
                    setEventFormValue({
                        ...eventFormValue,
                        description,
                    });
                }}
                onBlur={() => {}}
            />
            <Text style={styles.label}>Volunteers Needed</Text>
            <NumberInput
                style={styles.input}
                onChangeNumber={(volunteers) =>
                    setEventFormValue({ ...eventFormValue, volunteers })
                }
            />
            <Text style={styles.label}>Date and Time</Text>
            <View style={{ flexDirection: 'row' }}>
                <TextInput
                    style={[
                        styles.input,
                        { flex: 1, flexGrow: 1, textAlign: 'center' },
                    ]}
                    onPressOut={() => setDatePickerVisibility(true)}
                    value={eventFormValue.dateTime.toDateString()}
                ></TextInput>
                <Spacer horizontal />
                <TextInput
                    style={[styles.input, { flex: 1, flexGrow: 1 }]}
                    textAlign="center"
                    onPressOut={() => setTimePickerVisibility(true)}
                    value={eventFormValue.dateTime.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    })}
                ></TextInput>
            </View>
            <DateTimePickerModal
                isVisible={datePickerVisibility}
                mode="date"
                minimumDate={new Date()}
                onConfirm={onDateSelected}
                onCancel={() => setDatePickerVisibility(false)}
            />
            <DateTimePickerModal
                isVisible={timePickerVisibility}
                mode="time"
                date={eventFormValue.dateTime}
                onConfirm={onTimeSelected}
                onCancel={() => setTimePickerVisibility(false)}
            />
            <Text style={styles.label}>Picture</Text>
            <Spinner
                visible={isUploading}
                textContent={'Uploading...'}
                textStyle={styles.spinnerText}
                size={'small'}
            />
            {uploadedImage ? (
                <View style={styles.imageContainer}>
                    <View style={styles.imageGroup}>
                        <Image
                            source={{
                                uri: eventFormValue.imageAssetUri,
                            }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                        <View>
                            <Text style={styles.label}>
                                {uploadedImage?.filename}
                                {'\n'}
                                {uploadedImage?.size &&
                                    formatBytes(uploadedImage.size)}
                            </Text>
                        </View>
                    </View>

                    <BorderlessButton onPress={removeImage}>
                        <Feather name="x" size={24} color="#FF003A" />
                    </BorderlessButton>
                </View>
            ) : (
                <TouchableOpacity
                    style={styles.imageInput}
                    onPress={handleSelectImages}
                >
                    <Feather name="plus" size={24} color="#00A3FF80" />
                </TouchableOpacity>
            )}
            <BigButton
                onPress={handleCreateEvent}
                label="Save"
                color="#00A3FF"
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    spinnerText: {
        fontSize: 16,
        fontFamily: 'Nunito_700Bold',
        color: '#fff',
    },

    label: {
        color: '#8fa7b3',
        fontFamily: 'Nunito_600SemiBold',
        marginBottom: 8,
    },

    input: {
        backgroundColor: '#fff',
        borderWidth: 1.4,
        borderColor: '#D3E2E5',
        borderRadius: 8,
        height: 56,
        paddingTop: 16,
        paddingBottom: 16,
        paddingHorizontal: 24,
        marginBottom: 16,
        color: '#5C8599',
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 15,
    },

    imageInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderStyle: 'dashed',
        borderColor: '#00A3FF80',
        borderWidth: 1,
        borderRadius: 8,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },

    imageContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderStyle: 'solid',
        borderColor: '#00A3FF80',
        borderWidth: 1,
        borderRadius: 8,
        height: 112,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        padding: 8,
        paddingRight: 16,
    },

    imageGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    image: {
        height: '100%',
        width: undefined,
        aspectRatio: 1,
        borderRadius: 4,
        marginRight: 8,
    },
});
