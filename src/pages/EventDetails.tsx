import React from 'react';
import {
    Image,
    View,
    ScrollView,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';

import mapMarkerImg from '../images/map-marker.png';
import customMapStyle from '../../map-style.json';
import BigButton from '../components/BigButton';
import Spacer from '../components/Spacer';

export default function EventDetails() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.imagesContainer}>
                <ScrollView horizontal pagingEnabled>
                    <Image
                        style={styles.image}
                        source={{
                            uri: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80',
                        }}
                    />
                    <Image
                        style={styles.image}
                        source={{
                            uri: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80',
                        }}
                    />
                    <Image
                        style={styles.image}
                        source={{
                            uri: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80',
                        }}
                    />
                </ScrollView>
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.title}>Food Distribution</Text>
                <Text style={styles.organizer}>organized by Robert Last</Text>
                <Text style={styles.description}>
                    Calgary Drop-In is recruiting volunteers to help with food
                    distribution.
                </Text>
                <Spacer size={24} />
                <View style={styles.eventInfoRow}>
                    <View style={[styles.eventInfoBox, styles.dateTimeInfo]}>
                        <Feather
                            name="calendar"
                            size={40}
                            color="#00A3FF"
                        ></Feather>
                        <Text
                            style={[styles.eventInfoText, styles.dateTimeText]}
                        >
                            Oct 20, 2023
                            {'\n'}
                            11:00 AM
                        </Text>
                    </View>
                    <Spacer horizontal />
                    <View style={[styles.eventInfoBox, styles.volunteerInfo]}>
                        {/* <Feather
                            name="check"
                            size={40}
                            color="#FF8700"
                        ></Feather> */}
                        <Text style={styles.volunteerNumber}>
                            1 <Text style={{ fontSize: 24 }}>of</Text> 10
                        </Text>
                        <Text
                            style={[styles.eventInfoText, styles.volunteerText]}
                        >
                            Volunteer(s) needed
                        </Text>
                    </View>
                </View>
                <Spacer size={16} />
                <View style={styles.eventInfoRow}>
                    <BigButton
                        label="Share"
                        color="#00A3FF"
                        featherIconName="share-2"
                        onPress={() => console.log('share pressed')}
                    />
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
                            latitude: 51.03,
                            longitude: -114.093,
                            latitudeDelta: 0.008,
                            longitudeDelta: 0.008,
                        }}
                        zoomEnabled={false}
                        pitchEnabled={false}
                        scrollEnabled={false}
                        rotateEnabled={false}
                        style={styles.mapStyle}
                        customMapStyle={customMapStyle}
                    >
                        <Marker
                            icon={mapMarkerImg}
                            coordinate={{
                                latitude: 51.03,
                                longitude: -114.093,
                            }}
                        />
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
