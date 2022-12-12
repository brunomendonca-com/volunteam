import 'react-native-get-random-values';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Feather } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useContext, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';
import { LatLng } from 'react-native-maps';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { v4 as uuidv4 } from 'uuid';
import BigButton from '../../components/BigButton';
import NumberInput from '../../components/NumberInput';
import Spacer from '../../components/Spacer';
import { AuthenticationContext } from '../../context/AuthenticationContext';
import * as api from '../../services/api';
import * as imageApi from '../../services/imageApi';
import { UploadedImage } from '../../types/UploadedImage';
import { User } from '../../types/User';
import { VolunteeringEvent } from '../../types/VolunteeringEvent';
import { addHours, formatBytes, updateDateWithNewTime } from '../../utils';

interface VolunteeringEventDataRouteParams {
    position: LatLng;
}

interface FormData {
    name: string;
    description: string;
    volunteersNeeded: number;
    dateTime: Date;
}

export default function VolunteeringEventData({ navigation, route }: StackScreenProps<any>) {
    const currentUser = useContext(AuthenticationContext)?.value as User;
    const { position } = route.params as VolunteeringEventDataRouteParams;
    const { showActionSheetWithOptions } = useActionSheet();
    const [eventFormValue, setEventFormValue] = useState<FormData>({
        name: '',
        description: '',
        volunteersNeeded: 0,
        // If the user creates a new event with the current time, it will not be displayed in the map because
        // the event will be in the past when the user navigates back to the map.
        // We are adding hours to the minimum date to prevent this.
        dateTime: addHours(new Date(), 2),
    });

    const [uploadedImage, setUploadedImage] = useState<UploadedImage>();
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const [datePickerVisibility, setDatePickerVisibility] = useState<boolean>(false);

    const onDateSelected = (value: Date) => {
        setEventFormValue({ ...eventFormValue, dateTime: value });
        setDatePickerVisibility(false);
    };

    const [timePickerVisibility, setTimePickerVisibility] = useState<boolean>(false);

    const onTimeSelected = (newTime: Date) => {
        const newDateTime = updateDateWithNewTime(eventFormValue.dateTime, newTime);
        setEventFormValue({ ...eventFormValue, dateTime: newDateTime });
        setTimePickerVisibility(false);
    };

    const handleCreateEvent = () => {
        const newEvent: VolunteeringEvent = {
            ...eventFormValue,
            id: uuidv4(),
            position,
            organizerId: currentUser?.id,
            volunteersIds: [],
            imageUrl: uploadedImage?.url,
        };
        setIsUploading(true);
        api.createEvent(newEvent).then(() => {
            setIsUploading(false);
            navigation.navigate('EventsMap');
        });
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
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You've refused to allow this appp to access your photos!");
            return;
        }

        try {
            const response = await ImagePicker.launchImageLibraryAsync(imagePickerOptions);
            if (!response.canceled) {
                persistImage(response.assets[0]);
            }
        } catch {}
    };

    const openCamera = async () => {
        // Ask the user for the permission to access the camera
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You've refused to allow this appp to access your camera!");
            return;
        }

        try {
            const response = await ImagePicker.launchCameraAsync(imagePickerOptions);
            if (!response.canceled) {
                persistImage(response.assets[0]);
            }
        } catch {}
    };

    const persistImage = (imageAsset: ImagePicker.ImagePickerAsset) => {
        if (imageAsset.base64) {
            setIsUploading(true);

            imageApi
                .uploadImage(imageAsset.base64)
                .then((res) => {
                    const { image, url, size } = res.data.data;
                    const { filename } = image;
                    const newUploadedImage: UploadedImage = {
                        filename,
                        size,
                        url,
                    };
                    setUploadedImage(newUploadedImage);
                    setIsUploading(false);
                })
                .catch((error) => {
                    setIsUploading(false);
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        console.log(error.response.data);
                        console.log(error.response.status);
                    }
                });
        }
    };

    const removeImage = () => {
        setUploadedImage(undefined);
    };

    return (
        <KeyboardAwareScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
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
                    setEventFormValue({
                        ...eventFormValue,
                        volunteersNeeded: volunteers,
                    })
                }
            />
            <Text style={styles.label}>Date and Time</Text>
            <View style={{ flexDirection: 'row' }}>
                <TextInput
                    style={[styles.input, { flex: 1, flexGrow: 1, textAlign: 'center' }]}
                    onPressOut={() => setDatePickerVisibility(true)}
                    value={eventFormValue?.dateTime?.toDateString()}
                ></TextInput>
                <Spacer horizontal />
                <TextInput
                    style={[styles.input, { flex: 1, flexGrow: 1 }]}
                    textAlign="center"
                    onPressOut={() => setTimePickerVisibility(true)}
                    value={eventFormValue?.dateTime?.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    })}
                ></TextInput>
            </View>
            <DateTimePickerModal
                isVisible={datePickerVisibility}
                mode="date"
                minimumDate={eventFormValue.dateTime}
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
            <Spinner visible={isUploading} textContent={'Uploading...'} textStyle={styles.spinnerText} size={'small'} />
            {uploadedImage ? (
                <View style={styles.imageContainer}>
                    <View style={styles.imageGroup}>
                        <Image
                            source={{
                                uri: uploadedImage.url,
                            }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                        <View>
                            <Text style={styles.label}>
                                {uploadedImage?.filename}
                                {'\n'}
                                {uploadedImage?.size && formatBytes(uploadedImage.size)}
                            </Text>
                        </View>
                    </View>

                    <BorderlessButton onPress={removeImage}>
                        <Feather name="x" size={24} color="#FF003A" />
                    </BorderlessButton>
                </View>
            ) : (
                <TouchableOpacity style={styles.imageInput} onPress={handleSelectImages}>
                    <Feather name="plus" size={24} color="#00A3FF80" />
                </TouchableOpacity>
            )}
            <BigButton onPress={handleCreateEvent} label="Save" color="#00A3FF" />
        </KeyboardAwareScrollView>
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
