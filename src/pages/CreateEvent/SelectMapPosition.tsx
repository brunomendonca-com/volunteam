import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text, Image } from 'react-native';
import MapView, { Marker, MapPressEvent, PROVIDER_GOOGLE, LatLng } from 'react-native-maps';

import mapMarkerImg from '../../images/map-marker.png';
import customMapStyle from '../../../map-style.json';
import { RectButton } from 'react-native-gesture-handler';
import { StackScreenProps } from '@react-navigation/stack';
import * as MapSettings from '../../constants/MapSettings';

interface SelectMapPositionRouteParams {
    userLocation: LatLng;
}

export default function SelectMapPosition({ navigation, route }: StackScreenProps<any>) {
    const { userLocation } = route.params as SelectMapPositionRouteParams;
    const [eventPosition, setEventPosition] = useState<LatLng>();

    function handleSelectMapPosition(event: MapPressEvent) {
        setEventPosition(event.nativeEvent.coordinate);
    }

    function handleNextStep() {
        navigation.navigate('EventData', { position: eventPosition });
    }

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                    ...MapSettings.DEFAULT_DELTA,
                }}
                onPress={handleSelectMapPosition}
                style={styles.mapStyle}
                customMapStyle={customMapStyle}
            >
                {eventPosition && (
                    <Marker coordinate={eventPosition}>
                        <Image resizeMode="contain" style={{ width: 48, height: 54 }} source={mapMarkerImg} />
                    </Marker>
                )}
            </MapView>

            {eventPosition && (
                <RectButton style={styles.nextButton} onPress={handleNextStep}>
                    <Text style={styles.nextButtonText}>Next</Text>
                </RectButton>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },

    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },

    disabled: {
        opacity: 0.5,
    },

    nextButton: {
        backgroundColor: '#00A3FF',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        height: 56,

        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 40,
    },

    nextButtonText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 16,
        color: '#FFF',
    },
});
