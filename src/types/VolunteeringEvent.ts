import { LatLng } from 'react-native-maps';

export interface VolunteeringEvent {
    id: string;
    name: string;
    description: string;
    volunteersNeeded: number;
    organizerId: string;
    dateTime: Date;
    position: LatLng;
    volunteersIds: string[];
    imageUrl?: string;
}
