import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

import MapView, { EdgePadding, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

import mapMarker from '../images/map-marker.png';
import mapMarkerBlue from '../images/map-marker.png';
import customMapStyle from '../../map-style.json';
import { RectButton } from 'react-native-gesture-handler';
import { StackScreenProps } from '@react-navigation/stack';
import { VolunteeringEventsContext } from '../context/EventsContext';
import { VolunteeringEvent } from '../types/VolunteeringEvent';

export default function EventsMap(props: StackScreenProps<any>) {
    const defaultLocation = {
        coords: {
            latitude: 51.03,
            longitude: -114.093,
            altitude: null,
            accuracy: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
        },
        timestamp: Date.now(),
    };

    const [location, setLocation] = useState<Location.LocationObject>(defaultLocation);
    const [errorMsg, setErrorMsg] = useState<string>();
    const { navigation } = props;
    const events = useContext(VolunteeringEventsContext);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
        })();
    }, []);

    const handleNavigateToCreateEvent = () => {
        navigation.navigate('SelectMapPosition');
    };

    const handleNavigateToEventDetails = (currentEventId: string) => {
        navigation.navigate('EventDetails', { currentEventId });
    };

    const isTeamFull = (event: VolunteeringEvent) => {
        return event.volunteersIds.length === event.volunteersNeeded;
    };

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                initialCamera={{
                    center: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    },
                    pitch: 0,
                    heading: 0,
                    altitude: 1000,
                    zoom: 12,
                }}
                style={styles.mapStyle}
                customMapStyle={customMapStyle}
                showsUserLocation={true}
                rotateEnabled={false}
                toolbarEnabled={false}
                mapPadding={mapEdgePadding}
            >
                {events.value.map((volunteeringEvent) => {
                    return (
                        <Marker
                            key={volunteeringEvent.id}
                            coordinate={{
                                latitude: volunteeringEvent.position.latitude,
                                longitude: volunteeringEvent.position.longitude,
                            }}
                            onPress={(e) => handleNavigateToEventDetails(volunteeringEvent.id)}
                        >
                            <Image
                                resizeMode="contain"
                                style={{ width: 48, height: 54 }}
                                source={isTeamFull(volunteeringEvent) ? mapMarkerBlue : mapMarker}
                            />
                        </Marker>
                    );
                })}
            </MapView>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    {events.value.length ? `${events.value.length} event(s) found` : `No events found`}
                </Text>
                <RectButton style={styles.createvent} onPress={handleNavigateToCreateEvent}>
                    <Feather name="plus" size={20} color="#FFF" />
                </RectButton>
            </View>
        </View>
    );
}

const mapEdgePadding: EdgePadding = {
    top: 64,
    right: 16,
    bottom: 104,
    left: 16,
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    mapStyle: {
        ...StyleSheet.absoluteFillObject,
    },

    footer: {
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 40,

        backgroundColor: '#FFF',
        borderRadius: 16,
        height: 56,
        paddingLeft: 24,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        elevation: 3,
    },

    footerText: {
        fontFamily: 'Nunito_700Bold',
        color: '#8fa7b3',
    },

    createvent: {
        width: 56,
        height: 56,
        backgroundColor: '#00A3FF',
        borderRadius: 16,

        justifyContent: 'center',
        alignItems: 'center',
    },
});
