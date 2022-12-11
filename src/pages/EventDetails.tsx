import React, { useContext } from 'react';
import { Image, View, ScrollView, Text, StyleSheet, Dimensions, Share, ShareAction } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';

import mapMarkerImg from '../images/map-marker.png';
import customMapStyle from '../../map-style.json';
import BigButton from '../components/BigButton';
import Spacer from '../components/Spacer';
import { VolunteeringEvent } from '../types/VolunteeringEvent';
import { StackScreenProps } from '@react-navigation/stack';
import { formatAMPM } from '../utils';
import { VolunteeringEventsContext } from '../context/EventsContext';

interface EventDetailsRouteParams {
    currentEventId: string;
}
export default function EventDetails({ navigation, route }: StackScreenProps<any>) {
    const { currentEventId } = route.params as EventDetailsRouteParams;
    const events = useContext(VolunteeringEventsContext);
    const currentEvent = events.value.find((event) => event.id === currentEventId) as VolunteeringEvent;
    console.log('current event:', currentEvent);
    const onShare = async () => {
        try {
            const result: ShareAction = await Share.share({
                message: 'volunteam app | Find opportunities to help people in your area',
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            if (error instanceof Error) alert(error.message);
            else alert('Unknown Error');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.imagesContainer}>
                <Image
                    style={styles.image}
                    source={{
                        uri: currentEvent.imageUrl,
                    }}
                />
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.title}>{currentEvent.name}</Text>
                <Text style={styles.organizer}>{`organized by ${currentEvent.organizerId}`}</Text>
                <Text style={styles.description}>{currentEvent.description}</Text>
                <Spacer size={24} />
                <View style={styles.eventInfoRow}>
                    <View style={[styles.eventInfoBox, styles.dateTimeInfo]}>
                        <Feather name="calendar" size={48} color="#00A3FF"></Feather>
                        <Text style={[styles.eventInfoText, styles.dateTimeText]}>
                            {`${new Date(currentEvent.dateTime).toDateString()}\n${formatAMPM(currentEvent.dateTime)}`}
                        </Text>
                    </View>
                    <Spacer horizontal />
                    <View style={[styles.eventInfoBox, styles.volunteerInfo]}>
                        {/* <Feather
                            name="check"
                            size={48}
                            color="#FF8700"
                        ></Feather> */}
                        <Text style={styles.volunteerNumber}>
                            {currentEvent.volunteersIds.length} <Text style={{ fontSize: 24 }}>of</Text>{' '}
                            {currentEvent.volunteersNeeded}
                        </Text>
                        <Text style={[styles.eventInfoText, styles.volunteerText]}>Volunteer(s) needed</Text>
                    </View>
                </View>
                <Spacer size={16} />
                <View style={styles.eventInfoRow}>
                    <BigButton label="Share" color="#00A3FF" featherIconName="share-2" onPress={onShare} />
                    <Spacer horizontal />
                    <BigButton
                        label="Volunteer"
                        color="#FF8700"
                        featherIconName="plus"
                        onPress={() => console.log('volunteer pressed')}
                    />
                </View>

                <Spacer size={24} />
                <View style={styles.horizontalDivider} />
                <Spacer size={24} />

                <View style={styles.mapContainer}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                            ...currentEvent.position,
                            latitudeDelta: 0.004,
                            longitudeDelta: 0.004,
                        }}
                        zoomEnabled={false}
                        pitchEnabled={false}
                        scrollEnabled={false}
                        rotateEnabled={false}
                        style={styles.mapStyle}
                        customMapStyle={customMapStyle}
                    >
                        <Marker coordinate={currentEvent.position}>
                            <Image resizeMode="contain" style={{ width: 48, height: 54 }} source={mapMarkerImg} />
                        </Marker>
                    </MapView>
                </View>
                <Spacer size={16} />
                <BigButton
                    label="Check routes on Google Maps"
                    color="#4D6F80"
                    featherIconName="map-pin"
                    onPress={() => console.log('check routes pressed')}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    imagesContainer: {
        height: 240,
    },

    image: {
        width: Dimensions.get('window').width,
        height: 240,
        resizeMode: 'cover',
    },

    detailsContainer: {
        padding: 24,
        paddingBottom: 40,
    },

    title: {
        color: '#4D6F80',
        fontSize: 24,
        fontFamily: 'Nunito_800ExtraBold',
    },

    organizer: {
        color: '#5C8599',
        fontFamily: 'Nunito_400Regular',
        fontSize: 12,
    },

    description: {
        fontFamily: 'Nunito_600SemiBold',
        color: '#5c8599',
        marginTop: 16,
    },

    eventInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    eventInfoBox: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderWidth: 1,
        borderRadius: 8,
        alignSelf: 'stretch',
        flexGrow: 1,
        flex: 1,
    },

    eventInfoText: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
    },

    dateTimeInfo: {
        backgroundColor: '#E6F6FF',
        borderColor: '#00A3FF',
    },

    dateTimeText: {
        color: '#00A3FF',
    },

    volunteerInfo: {
        backgroundColor: '#F2E6D9',
        borderColor: '#FF8700',
    },

    volunteerNumber: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 32,
        lineHeight: 36,
        color: '#FF8700',
    },

    volunteerText: {
        color: '#FF8700',
    },

    horizontalDivider: {
        width: '100%',
        borderWidth: 0.5,
        borderColor: '#D3E2E5',
    },

    mapContainer: {
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#D3E2E5',
        backgroundColor: '#E6F7FB',
    },

    mapStyle: {
        width: '100%',
        height: 325,
    },

    routeButton: {
        backgroundColor: '#4D6F80',
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 56,
        marginTop: 8,
    },

    separator: {
        height: 0.8,
        width: '100%',
        backgroundColor: '#D3E2E5',
        marginVertical: 40,
    },

    scheduleContainer: {
        marginTop: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    scheduleItem: {
        width: '48%',
        padding: 20,
    },

    scheduleItemBlue: {
        backgroundColor: '#E6F7FB',
        borderWidth: 1,
        borderColor: '#B3DAE2',
        borderRadius: 16,
    },

    scheduleItemGreen: {
        backgroundColor: '#EDFFF6',
        borderWidth: 1,
        borderColor: '#A1E9C5',
        borderRadius: 16,
    },

    scheduleText: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 16,
        lineHeight: 24,
        marginTop: 20,
    },

    scheduleTextBlue: {
        color: '#5C8599',
    },

    scheduleTextGreen: {
        color: '#37C77F',
    },

    contactButton: {
        backgroundColor: '#3CDC8C',
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 56,
        marginTop: 40,
    },

    contactButtonText: {
        fontFamily: 'Nunito_800ExtraBold',
        color: '#FFF',
        fontSize: 16,
        marginLeft: 8,
    },
});
