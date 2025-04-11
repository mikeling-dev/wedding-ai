declare module "country-state-city" {
  export interface ICountry {
    name: string;
    isoCode: string;
    currency?: string;
    phonecode: string;
    flag: string;
  }

  export interface IState {
    name: string;
    isoCode: string;
    countryCode: string;
  }

  export interface ICity {
    name: string;
    countryCode: string;
    stateCode: string;
  }

  export const Country: {
    getAllCountries(): ICountry[];
    getCountryByCode(code: string): ICountry | undefined;
  };

  export const State: {
    getAllStates(): IState[];
    getStatesOfCountry(countryCode: string): IState[];
    getStateByCode(stateCode: string): IState | undefined;
    getStateByCodeAndCountry(
      stateCode: string,
      countryCode: string
    ): IState | undefined;
  };

  export const City: {
    getAllCities(): ICity[];
    getCitiesOfState(countryCode: string, stateCode: string): ICity[];
    getCitiesOfCountry(countryCode: string): ICity[];
  };
}
