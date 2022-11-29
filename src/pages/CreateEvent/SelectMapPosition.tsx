import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import MapView, { MapEvent, Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import mapMarkerImg from '../../images/map-marker.png';
import customMapStyle from '../../../map-style.json';
import { RectButton } from 'react-native-gesture-handler';

export default function SelectMapPosition() {
    const navigation = useNavigation();
    const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

    function handleSelectMapPosition(event: MapEvent) {
        setPosition(event.nativeEvent.coordinate);
    }

    function handleNextStep() {
        navigation.navigate('EventData', { position });
    }

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: 51.03,
                    longitude: -114.093,
                    latitudeDelta: 0.008,
                    longitudeDelta: 0.008,
                }}
                onPress={handleSelectMapPosition}
                style={styles.mapStyle}
                customMapStyle={customMapStyle}
            >
                {!!position.latitude && (
                    <Marker icon={mapMarkerImg} coordinate={position}></Marker>
                )}
            </MapView>

            {!!position.latitude && (
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
