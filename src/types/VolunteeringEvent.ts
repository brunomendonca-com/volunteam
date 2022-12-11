import { Coordinate } from './Coordinate';

export interface VolunteeringEvent {
    id: string;
    name: string;
    description: string;
    volunteersNeeded: number;
    organizerId: string;
    dateTime: Date;
    position: Coordinate;
    volunteersIds: string[];
    imageUrl?: string;
}
