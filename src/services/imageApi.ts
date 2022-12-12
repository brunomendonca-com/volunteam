import axios, { AxiosResponse } from 'axios';
import { getEnvironentVariable } from '../utils';

const api = axios.create({
    baseURL: 'https://api.imgbb.com/1',
    headers: { 'Content-Type': 'multipart/form-data' },
    params: { key: getEnvironentVariable('IMGBB_API_KEY') },
});

export const uploadImage = (image: string): Promise<AxiosResponse> => {
    const data = new FormData();
    data.append('image', image);

    return api.post('/upload', data);
};
