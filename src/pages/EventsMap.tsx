import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

import MapView, { EdgePadding, LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

import mapMarkerImg from '../images/map-marker.png';
import mapMarkerBlueImg from '../images/map-marker-blue.png';
import mapMarkerGreyImg from '../images/map-marker-grey.png';
import customMapStyle from '../../map-style.json';
import { RectButton } from 'react-native-gesture-handler';
import { StackScreenProps } from '@react-navigation/stack';
import { VolunteeringEventsContext } from '../context/EventsContext';
import { VolunteeringEvent } from '../types/VolunteeringEvent';
import * as MapSettings from '../constants/MapSettings';
import { AuthenticationContext } from '../context/AuthenticationContext';

export default function EventsMap(props: StackScreenProps<any>) {
    const { navigation } = props;
    const events = useContext(VolunteeringEventsContext);
    const currentUser = useContext(AuthenticationContext).value;

    const mapViewRef = useRef<MapView>(null);

    const [userLocation, setUserLocation] = useState<LatLng>(MapSettings.DEFAULT_POSITION);
    const [errorMsg, setErrorMsg] = useState<string>();

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            const currentUserLocation =
                (await Location.getLastKnownPositionAsync()) || (await Location.getCurrentPositionAsync());
            if (currentUserLocation) {
                setUserLocation({
                    latitude: currentUserLocation.coords.latitude,
                    longitude: currentUserLocation.coords.longitude,
                });
            }
        })();
    }, []);

    useEffect(() => {
        fitMarkersAndUserLocation();
    }, [userLocation]);

    const handleNavigateToCreateEvent = () => {
        navigation.navigate('SelectMapPosition', { userLocation });
    };

    const handleNavigateToEventDetails = (currentEventId: string) => {
        navigation.navigate('EventDetails', { currentEventId });
    };

    const fitMarkersAndUserLocation = () => {
        const eventsAndUserLocations = events.value.map((event) => event.position);
        eventsAndUserLocations.push(userLocation);
        mapViewRef.current?.fitToCoordinates(eventsAndUserLocations, { edgePadding: mapEdgePadding, animated: false });
    };

    const isEventFull = (event: VolunteeringEvent) => {
        return event.volunteersIds.length === event.volunteersNeeded;
    };

    const userHasApplied = (event: VolunteeringEvent) => {
        return event.volunteersIds.includes(currentUser?.id as string);
    };

    const getMarkerImg = (event: VolunteeringEvent) => {
        if (isEventFull(event)) {
            return mapMarkerGreyImg;
        } else if (userHasApplied(event)) {
            return mapMarkerBlueImg;
        } else {
            return mapMarkerImg;
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapViewRef}
                provider={PROVIDER_GOOGLE}
                initialRegion={MapSettings.DEFAULT_REGION}
                style={styles.mapStyle}
                customMapStyle={customMapStyle}
                showsMyLocationButton={false}
                showsUserLocation={true}
                rotateEnabled={false}
                toolbarEnabled={false}
                mapPadding={mapEdgePadding}
                onMapReady={fitMarkersAndUserLocation}
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
                                source={getMarkerImg(volunteeringEvent)}
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
