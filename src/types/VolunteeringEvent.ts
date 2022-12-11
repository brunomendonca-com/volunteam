import { Coordinate } from './Coordinate';
import { User } from './User';

export interface VolunteeringEvent {
    name: string;
    description: string;
    volunteersNeeded: number;
    organizer: User;
    dateTime: Date;
    position: Coordinate;
    volunteers?: User[];
    imageAssetPath?: string;
    imageUrl?: string;
}
