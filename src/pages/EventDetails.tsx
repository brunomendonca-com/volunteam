import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import customMapStyle from '../../map-style.json';
import BigButton from '../components/BigButton';
import EventInfoBox from '../components/EventInfoBox';
import Spacer from '../components/Spacer';
import { AuthenticationContext } from '../context/AuthenticationContext';
import { VolunteeringEventsContext } from '../context/EventsContext';
import mapMarkerImg from '../images/map-marker.png';
import * as api from '../services/api';
import * as caching from '../services/caching';
import { User } from '../types/User';
import { VolunteeringEvent, VolunteeringStatus } from '../types/VolunteeringEvent';
import { openShareActionsMenu } from '../utils';

interface EventDetailsRouteParams {
    currentEventId: string;
}
export default function EventDetails({ navigation, route }: StackScreenProps<any>) {
    const { currentEventId } = route.params as EventDetailsRouteParams;
    const [organizer, setOrganizer] = useState<User>();
    const events = useContext(VolunteeringEventsContext).value;
    const currentUser = useContext(AuthenticationContext).value as User;
    const currentEvent = events.find((event) => event.id === currentEventId) as VolunteeringEvent;
    const currentStatus = getCurrentEventStatus(currentEvent, currentUser);

    useEffect(() => {
        caching
            .getFromNetworkFirst(currentEvent.organizerId, api.getUserDetails(currentEvent.organizerId))
            .then((response) => {
                console.log(response.data);
                if (response.status === 200) {
                    setOrganizer(response.data);
                }
            })
            .catch((error) => console.warn(error));
    }, []);

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
                <Text style={styles.organizer}>{`organized by ${organizer?.name.first} ${organizer?.name.last}`}</Text>
                <Text style={styles.description}>{currentEvent.description}</Text>
                <Spacer size={24} />
                <View style={styles.eventInfoRow}>
                    <EventInfoBox dateTimeInfo={currentEvent.dateTime} />
                    <Spacer horizontal />
                    <EventInfoBox
                        volunteeringInfo={{
                            status: currentStatus,
                            volunteersCount: currentEvent.volunteersIds.length,
                            volunteersNeeded: currentEvent.volunteersNeeded,
                        }}
                    />
                </View>
                <Spacer size={16} />
                {currentStatus !== VolunteeringStatus.FULL && (
                    <>
                        <View style={styles.eventInfoRow}>
                            <BigButton
                                label="Share"
                                color="#00A3FF"
                                featherIconName="share-2"
                                onPress={openShareActionsMenu}
                            />
                            {currentStatus === VolunteeringStatus.APPLIED && (
                                <>
                                    <Spacer horizontal />
                                    <BigButton
                                        label="Call"
                                        color="#00A3FF"
                                        featherIconName="phone"
                                        onPress={() => console.log('call pressed')}
                                    />
                                    <Spacer horizontal />
                                    <BigButton
                                        label="Text"
                                        color="#00A3FF"
                                        featherIconName="message-circle"
                                        onPress={() => console.log('text pressed')}
                                    />
                                </>
                            )}
                            {currentStatus === VolunteeringStatus.NOT_APPLIED && (
                                <>
                                    <Spacer horizontal />
                                    <BigButton
                                        label="Volunteer"
                                        color="#FF8700"
                                        featherIconName="plus"
                                        onPress={() => console.log('volunteer pressed')}
                                    />
                                </>
                            )}
                        </View>
                        <Spacer size={24} />
                    </>
                )}

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
        fontSize: 14,
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

const getCurrentEventStatus = (currentEvent: VolunteeringEvent, currentUser: User): VolunteeringStatus => {
    if (currentEvent.volunteersNeeded === currentEvent.volunteersIds.length) {
        return VolunteeringStatus.FULL;
    } else if (currentEvent.volunteersIds.includes(currentUser.id)) {
        return VolunteeringStatus.APPLIED;
    } else {
        return VolunteeringStatus.NOT_APPLIED;
    }
};
