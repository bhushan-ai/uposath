declare module 'country-state-city' {
    export interface ICountry {
        name: string;
        isoCode: string;
        flag: string;
        phonecode: string;
        currency: string;
        latitude: string;
        longitude: string;
        timezones: Array<{
            zoneName: string;
            gmtOffset: number;
            gmtOffsetName: string;
            abbreviation: string;
            tzName: string;
        }>;
    }
    export interface IState {
        name: string;
        isoCode: string;
        countryCode: string;
        latitude: string;
        longitude: string;
    }
    export interface ICity {
        name: string;
        countryCode: string;
        stateCode: string;
        latitude: string;
        longitude: string;
    }
    export class Country {
        static getAllCountries(): ICountry[];
        static getCountryByCode(countryCode: string): ICountry | undefined;
    }
    export class State {
        static getAllStates(): IState[];
        static getStatesOfCountry(countryCode: string): IState[];
        static getStateByCodeAndCountry(stateCode: string, countryCode: string): IState | undefined;
    }
    export class City {
        static getAllCities(): ICity[];
        static getCitiesOfState(countryCode: string, stateCode: string): ICity[];
        static getCitiesOfCountry(countryCode: string): ICity[];
    }
}

declare module 'tz-lookup' {
    function lookup(lat: number, lon: number): string;
    export default lookup;
}
