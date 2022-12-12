import AsyncStorage from '@react-native-async-storage/async-storage';

export const getFromNetworkFirst = async <T>(key: string, request: Promise<T>): Promise<T> => {
    try {
        const response = await request;
        setInCache(key, response);
        return response;
    } catch (e) {
        console.error(e);
        return getFromCache<T>(key);
    }
};

const setInCache = (key: string, value: any) => {
    const jsonValue = JSON.stringify(value);
    return AsyncStorage.setItem(key, jsonValue);
};

const getFromCache = async <T>(key: string): Promise<T> => {
    const json = await AsyncStorage.getItem(key);
    return await (json != null ? Promise.resolve(JSON.parse(json)) : Promise.reject(`Key "${key}" not in cache`));
};
