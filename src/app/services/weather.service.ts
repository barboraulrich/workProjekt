import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  getWeatherInformation(formData: any):Observable<any> {
    console.log(formData, 'getWeatherInformation');
    return this.http.post<any>('https://ogcie.iblsoft.com/ria/opmetquery', formData)
  }
}
