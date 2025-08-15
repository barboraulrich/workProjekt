import { SafeHtml } from '@angular/platform-browser';

export interface WeatherRequest {
    id: string,
    method: string,
    params: [
      {
        id: string,
        reportTypes: string[],
        stations: string[],
        countries: string[]
      }
    ]
}

export interface WeatherData {
  station: string;
  type: string;
  datetime: string;
  data: SafeHtml;
  isStationHeader?: boolean;
}


export interface WeatherReport {
  placeId: string;
  queryType: ReportType;
  receptionTime: string;
  refs: string[];
  reportTime: string;
  reportType: string;
  stationId: string;
  text: string;
  textHTML: string;
  validFrom?: string;
  validTo?: string;
}

export interface WeatherApiResponse  {
  error: string | null;
  id: string;
  result: WeatherReport[];
}

export type GroupedWeatherData = {
  [stationId: string]: WeatherReport[];
}

export enum ReportType {
  METAR = 'METAR',
  SIGMET = 'SIGMET',
  TAF = 'TAF'
}
