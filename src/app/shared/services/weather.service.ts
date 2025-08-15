import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {WeatherApiResponse, WeatherRequest} from '../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  url= 'https://ogcie.iblsoft.com';

  constructor(private http: HttpClient) { }

  getWeatherInformation(request: WeatherRequest):Observable<WeatherApiResponse> {
    return this.http.post<WeatherApiResponse>(`${this.url}/ria/opmetquery`, request)
  }
}
