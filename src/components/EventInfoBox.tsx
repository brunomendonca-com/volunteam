import React from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { VolunteeringStatus } from '../types/VolunteeringEvent';
import { formatAMPM } from '../utils';

interface EventInfoBoxProps {
    dateTimeInfo?: Date;
    volunteeringInfo?: {
        status: VolunteeringStatus | undefined;
        volunteersCount: number | undefined;
        volunteersNeeded: number | undefined;
    };
}

export default function EventInfoBox(props: EventInfoBoxProps) {
    const styles = styling(props);
    const { dateTimeInfo, volunteeringInfo } = props;

    return (
        <>
            {dateTimeInfo && (
                <View style={[styles.eventInfoBox, { backgroundColor: '#E6F6FF', borderColor: '#00A3FF' }]}>
                    <Feather name="calendar" size={48} color="#00A3FF"></Feather>
                    <Text style={[styles.eventInfoText, { color: '#00A3FF' }]}>
                        {`${new Date(dateTimeInfo).toDateString()}\n${formatAMPM(dateTimeInfo)}`}
                    </Text>
                </View>
            )}
            {volunteeringInfo && volunteeringInfo.status === VolunteeringStatus.NOT_APPLIED && (
                <View style={[styles.eventInfoBox, { backgroundColor: '#F2E6D9', borderColor: '#FF8700' }]}>
                    <Text style={[styles.volunteeringNumbers, { color: '#FF8700' }]}>
                        {volunteeringInfo.volunteersCount} <Text style={{ fontSize: 24 }}>of</Text>{' '}
                        {volunteeringInfo.volunteersNeeded}
                    </Text>
                    <Text style={[styles.eventInfoText, { color: '#FF8700' }]}>Volunteer(s) needed</Text>
                </View>
            )}
            {volunteeringInfo && volunteeringInfo.status === VolunteeringStatus.APPLIED && (
                <View style={[styles.eventInfoBox, { backgroundColor: '#E6F6FF', borderColor: '#00A3FF' }]}>
                    <Feather name="check" size={48} color="#00A3FF"></Feather>
                    <Text style={[styles.eventInfoText, { color: '#00A3FF' }]}>Volunteered!</Text>
                </View>
            )}
            {volunteeringInfo && volunteeringInfo.status === VolunteeringStatus.FULL && (
                <View style={[styles.eventInfoBox, { backgroundColor: '#D3E2E6', borderColor: '#8FA7B3' }]}>
                    <Feather name="slash" size={48} color="#8FA7B3"></Feather>
                    <Text style={[styles.eventInfoText, { color: '#8FA7B3' }]}>Team is full!</Text>
                </View>
            )}
        </>
    );
}

const styling = ({ dateTimeInfo, volunteeringInfo }: EventInfoBoxProps) =>
    StyleSheet.create({
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

        volunteeringNumbers: {
            fontFamily: 'Nunito_800ExtraBold',
            fontSize: 32,
            lineHeight: 36,
        },
    });
