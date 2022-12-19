import axios, { AxiosResponse } from 'axios';
import { VolunteeringEvent } from '../types/VolunteeringEvent';
import { parseDateFieldFromJSONResponse } from '../utils';

const api = axios.create({
    // Before running your 'json-server', get your computer's IP address and
    // update your baseURL to `http://your_ip_address_here:3333` and then run:
    // `npx json-server --watch db.json --port 3333 --host your_ip_address_here`
    //
    // To access your server online without running json-server locally,
    // you can set your baseURL to:
    // `https://my-json-server.typicode.com/<your-github-username>/<your-github-repo>`
    //
    // To use `my-json-server`, make sure your `db.json` is located at the repo root.

    baseURL: 'http://10.0.0.176:3333',
});

export const authenticateUser = (email: string, password: string): Promise<AxiosResponse> => {
    return api.post(`/login`, { email, password });
};

export const getFutureEvents = (): Promise<any> => {
    const currentDateTime = new Date(Date.now());
    return api
        .get('/events', { params: { dateTime_gte: currentDateTime } })
        .then((response) => {
            return parseDateFieldFromJSONResponse(response.data, 'dateTime');
        })
        .catch((error) => console.warn(error));
};

export const getUserDetails = (userId: string): Promise<AxiosResponse> => {
    return api.get(`/users/${userId}`);
};

export const createEvent = (event: VolunteeringEvent): Promise<AxiosResponse> => {
    return api.post(`/events`, event);
};

export const updateVolunteers = (event: VolunteeringEvent, userId: string): Promise<AxiosResponse> => {
    const volunteersIds = [...event.volunteersIds];
    volunteersIds.push(userId);
    return api.patch(`/events/${event.id}`, { volunteersIds });
};
