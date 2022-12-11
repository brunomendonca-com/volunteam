import { LatLng, Region } from 'react-native-maps';

//
// Map Settings
//

export const DEFAULT_POSITION: LatLng = {
    latitude: 51.03,
    longitude: -114.093,
};

export const DEFAULT_DELTA = { latitudeDelta: 0.008, longitudeDelta: 0.008 };

export const DEFAULT_REGION: Region = {
    ...DEFAULT_POSITION,
    ...DEFAULT_DELTA,
};
