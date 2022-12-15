import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import * as Location from 'expo-location';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import customMapStyle from '../../map-style.json';
import * as MapSettings from '../constants/MapSettings';
import { AuthenticationContext } from '../context/AuthenticationContext';
import { VolunteeringEventsContext } from '../context/EventsContext';
import mapMarkerBlueImg from '../images/map-marker-blue.png';
import mapMarkerGreyImg from '../images/map-marker-grey.png';
import mapMarkerImg from '../images/map-marker.png';
import * as api from '../services/api';
import * as caching from '../services/caching';
import { User } from '../types/User';
import { VolunteeringEvent } from '../types/VolunteeringEvent';

export default function EventsMap(props: StackScreenProps<any>) {
    const { navigation } = props;
    const eventsContext = useContext(VolunteeringEventsContext);
    const events = eventsContext?.value as VolunteeringEvent[];
    const authenticationContext = useContext(AuthenticationContext);
    const currentUser = authenticationContext?.value as User;

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

            await Location.getCurrentPositionAsync().then((currentUserLocation: any) => {
                if (currentUserLocation) {
                    setUserLocation({
                        latitude: currentUserLocation.coords.latitude,
                        longitude: currentUserLocation.coords.longitude,
                    });
                }
            });
        })();
    }, []);

    useFocusEffect(
        useCallback(() => {
            caching.getFromNetworkFirst('events', api.getFutureEvents()).then((newEvents) => {
                eventsContext?.setValue(newEvents);
            });
        }, [])
    );

    useEffect(() => {
        fitMarkersAndUserLocation();
    }, [userLocation, events]);

    const handleNavigateToCreateEvent = () => {
        navigation.navigate('SelectMapPosition', { userLocation });
    };

    const handleNavigateToEventDetails = (currentEventId: string) => {
        navigation.navigate('EventDetails', { currentEventId });
    };

    const handleLogout = async () => {
        AsyncStorage.multiRemove(['userInfo', 'accessToken']).then(() => {
            authenticationContext?.setValue(undefined);
            navigation.navigate('Login');
        });
    };

    const fitMarkersAndUserLocation = () => {
        const eventsAndUserLocations = events.map((event) => event.position);
        eventsAndUserLocations?.push(userLocation);
        mapViewRef.current?.fitToCoordinates(eventsAndUserLocations, {
            edgePadding: MapSettings.EDGE_PADDING,
            animated: false,
        });
    };

    const isEventFull = (event: VolunteeringEvent) => {
        return event.volunteersIds.length === event.volunteersNeeded;
    };

    const userHasAppliedToEvent = (event: VolunteeringEvent) => {
        return event.volunteersIds.includes(currentUser?.id as string);
    };

    const getMarkerImg = (event: VolunteeringEvent) => {
        if (userHasAppliedToEvent(event)) {
            return mapMarkerBlueImg;
        } else if (isEventFull(event)) {
            return mapMarkerGreyImg;
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
                mapPadding={MapSettings.EDGE_PADDING}
                onMapReady={() => {
                    fitMarkersAndUserLocation;
                }}
            >
                {events.map((volunteeringEvent) => {
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
                    {events.length ? `${events.length} event(s) found` : `No events found`}
                </Text>
                <RectButton
                    style={[styles.smallButton, { backgroundColor: '#00A3FF' }]}
                    onPress={handleNavigateToCreateEvent}
                >
                    <Feather name="plus" size={20} color="#FFF" />
                </RectButton>
            </View>
            <RectButton
                style={[styles.logoutButton, styles.smallButton, { backgroundColor: '#4D6F80' }]}
                onPress={handleLogout}
            >
                <Feather name="log-out" size={20} color="#FFF" />
            </RectButton>
        </View>
    );
}

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

    logoutButton: {
        position: 'absolute',
        top: 70,
        right: 24,

        elevation: 3,
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

    smallButton: {
        width: 56,
        height: 56,
        borderRadius: 16,

        justifyContent: 'center',
        alignItems: 'center',
    },
});
