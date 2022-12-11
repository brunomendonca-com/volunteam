import { createContext } from 'react';
import { VolunteeringEvent } from '../types/VolunteeringEvent';

export type VolunteeringEventsContextObject = {
    value: VolunteeringEvent[];
    setValue?: (newValue: VolunteeringEvent[]) => void;
};

export const VolunteeringEventsContext = createContext<VolunteeringEventsContextObject>({
    value: [],
});
