import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import {
    useFonts,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';

import AppStack from './src/routes/AppStack';
import { api } from './src/services/api';
import { VolunteeringEventsContext, VolunteeringEventsContextObject } from './src/context/EventsContext';
import { VolunteeringEvent } from './src/types/VolunteeringEvent';

export default function App() {
    const [events, setEvents] = useState<VolunteeringEvent[]>([]);

    useEffect(() => {
        const currentDateTime = new Date(Date.now());
        api.get('/events', { params: { dateTime_gte: currentDateTime } })
            .then((response) => {
                if (response.status === 200) {
                    // TODO parse date from response
                    setEvents(
                        response.data.map((event: VolunteeringEvent): VolunteeringEvent => {
                            return { ...event, dateTime: new Date(event.dateTime) };
                        })
                    );
                }
            })
            .catch((error) => console.warn(error));
    }, []);

    const volunteeringEventsContextObj: VolunteeringEventsContextObject = {
        value: events,
        setValue: setEvents,
    };

    const [fontsLoaded] = useFonts({
        Nunito_400Regular,
        Nunito_600SemiBold,
        Nunito_700Bold,
        Nunito_800ExtraBold,
    });

    if (!fontsLoaded) {
        return null;
    } else {
        return (
            <>
                <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" />
                <ActionSheetProvider>
                    <VolunteeringEventsContext.Provider value={volunteeringEventsContextObj}>
                        <AppStack />
                    </VolunteeringEventsContext.Provider>
                </ActionSheetProvider>
            </>
        );
    }
}
