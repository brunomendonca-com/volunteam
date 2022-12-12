import { createContext } from 'react';
import { User } from '../types/User';

export type AuthenticationContextObject = {
    value: User | undefined;
    setValue?: (newValue: User) => void;
};

export const AuthenticationContext = createContext<AuthenticationContextObject>({
    value: undefined,
});
