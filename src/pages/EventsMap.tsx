import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

import mapMarkerImg from '../images/map-marker.png';
import customMapStyle from '../../map-style.json';
import { RectButton } from 'react-native-gesture-handler';

export default function EventsMap() {
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
    const [location, setLocation] =
        useState<Location.LocationObject>(defaultLocation);
    const [errorMsg, setErrorMsg] = useState<string>();
    const navigation = useNavigation();

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

    function handleNavigateToCreateEvent() {
        navigation.navigate('SelectMapPosition');
    }

    function handleNavigateToEventDetails() {
        navigation.navigate('EventDetails');
    }

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
                showsCompass={true}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                <Marker
                    icon={mapMarkerImg}
                    coordinate={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    }}
                    onPress={handleNavigateToEventDetails}
                ></Marker>
            </MapView>

            <View style={styles.footer}>
                <Text style={styles.footerText}>2 events found</Text>
                <RectButton
                    style={styles.createvent}
                    onPress={handleNavigateToCreateEvent}
                >
                    <Feather name="plus" size={20} color="#FFF" />
                </RectButton>
            </View>
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

    footer: {
        position: 'absolute',
        left: 24,
        right: 80,
        bottom: 44,

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
