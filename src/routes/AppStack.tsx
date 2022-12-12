import React, { useEffect, useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const { Navigator, Screen } = createStackNavigator();

import EventsMap from '../pages/EventsMap';
import SelectMapPosition from '../pages/CreateEvent/SelectMapPosition';
import VolunteeringEventData from '../pages/CreateEvent/VolunteeringEventData';
import EventDetails from '../pages/EventDetails';
import Header from '../components/Header';
import { VolunteeringEvent } from '../types/VolunteeringEvent';
import * as api from '../services/api';
import * as caching from '../services/caching';
import { VolunteeringEventsContext, VolunteeringEventsContextObject } from '../context/EventsContext';
import { AuthenticationContext, AuthenticationContextObject } from '../context/AuthenticationContext';
import { User } from '../types/User';

export default function Routes() {
    const [events, setEvents] = useState<VolunteeringEvent[]>([]);
    const [authenticatedUser, setAuthenticatedUser] = useState<User>();

    useEffect(() => {
        caching.getFromNetworkFirst('events', api.getFutureEvents()).then((events) => setEvents(events));

        // TODO get authenticated user from login page
        setAuthenticatedUser({
            name: {
                first: 'Andrei',
                last: 'Cvejić',
            },
            email: 'andrei.cvejic@example.com',
            id: '89ae4e45-ff2b-441b-9e5a-eb42e69485dd',
            mobile: '(563) 589-2999',
        });
    }, []);

    const volunteeringEventsContextObj: VolunteeringEventsContextObject = {
        value: events,
        setValue: setEvents,
    };

    const authenticationContextObj: AuthenticationContextObject = {
        value: authenticatedUser,
        setValue: setAuthenticatedUser,
    };

    return (
        <VolunteeringEventsContext.Provider value={volunteeringEventsContextObj}>
            <AuthenticationContext.Provider value={authenticationContextObj}>
                <NavigationContainer>
                    <Navigator
                        screenOptions={{
                            headerShown: false,
                            cardStyle: { backgroundColor: '#F2F3F5' },
                        }}
                    >
                        <Screen name="EventsMap" component={EventsMap} />

                        <Screen
                            name="SelectMapPosition"
                            component={SelectMapPosition}
                            options={{
                                headerShown: true,
                                header: (props) => <Header title="Add event" {...props} />,
                            }}
                        />

                        <Screen
                            name="EventData"
                            component={VolunteeringEventData}
                            options={{
                                headerShown: true,
                                header: (props) => <Header title="Add Event" {...props} />,
                            }}
                        />

                        <Screen
                            name="EventDetails"
                            component={EventDetails}
                            options={{
                                headerShown: true,
                                header: (props) => <Header title="Event" showCancel={false} {...props} />,
                            }}
                        />
                    </Navigator>
                </NavigationContainer>
            </AuthenticationContext.Provider>
        </VolunteeringEventsContext.Provider>
    );
}
