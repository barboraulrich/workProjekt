import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors, AbstractControl, ValidatorFn
} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {WeatherService} from '../shared/services/weather.service';
import {WeatherTableComponent} from '../weather-table/weather-table.component';

@Component({
  selector: 'app-dasboard',
  imports: [
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    WeatherTableComponent
  ],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  requestsForm: FormGroup;
  groupedWeatherData: { [key: string]: any[] } = {};

  constructor(private fb: FormBuilder,
              private weatherService: WeatherService)
  {
    this.requestsForm = this.fb.group({
      metar: [false],
      sigmet: [false],
      taf: [false],
      stations: ['', [this.codeListValidator(4)]],
      countries: ['', [this.codeListValidator(2)]],
    }, {
      validators: [
        this.checkboxValidator,
        this.locationValidator
      ]
    });
  }

  codeListValidator(codeLength: number): ValidatorFn {
    const pattern = new RegExp(`^([A-Z]{${codeLength}})( [A-Z]{${codeLength}})*$`);
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value?.trim();
      if (!value) return null;
      return pattern.test(value) ? null : { invalidCodeList: true };
    };
  }

  checkboxValidator(group: FormGroup): ValidationErrors | null {
    const metar = group.get('metar')?.value;
    const sigmet = group.get('sigmet')?.value;
    const taf = group.get('taf')?.value;
    return metar || sigmet || taf ? null : { noTypeSelected: true };
  }

  locationValidator(group: FormGroup): ValidationErrors | null {
    const stations = group.get('stations')?.value?.trim();
    const countries = group.get('countries')?.value?.trim();

    return stations || countries ? null : { noLocationSelected: true };
  }

  createBriefing() {
    if (this.requestsForm.valid) {
      const { metar, sigmet, taf, stations, countries } = this.requestsForm.value

      const reportTypes:string[] = this.getTypeMessage(metar, sigmet, taf)
      const stationsArray:string[] = this.arrayInput(stations)
      const countriesArray:string[] = this.arrayInput(countries)

      const formattedData = this.requestData(reportTypes, stationsArray, countriesArray);

      this.weatherService.getWeatherInformation(formattedData).subscribe(
        response => {
          console.log(response);
          if (response && response.result && Array.isArray(response.result)) {
            this.processWeatherData(response.result);
          }
        },
        error => console.log(error.message));
    }
  }

  private getTypeMessage (metar: boolean, sigmet: boolean, taf: boolean): string[] {
    const types:string[] = [];
    if (metar) types.push('METAR');
    if (sigmet) types.push('SIGMET');
    if (taf) types.push('TAF_LONGTAF');
    return types;
  }

  private arrayInput(value: string | null): string[] {
    return value ? value.trim().split(/\s+/) : [];
  }

  private requestData(reportTypes: string[], stations: string[], countries: string[]) :{} {
    return {
      id: 'query01',
      method: 'query',
      params: [
        {
          id: 'briefing01',
          reportTypes,
          stations,
          countries
        }
      ]
    };
  }

  processWeatherData(data: any[]): void {
    this.groupedWeatherData = {};

    data.forEach(item => {
      const stationId = item.stationId || 'unknown';
      if (!this.groupedWeatherData[stationId]) {
        this.groupedWeatherData[stationId] = [];
      }
      this.groupedWeatherData[stationId].push(item);
    });

    console.log('Grouped Weather Data:', this.groupedWeatherData);
  }
}
