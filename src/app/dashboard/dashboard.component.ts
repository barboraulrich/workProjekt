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
import { WeatherReport, WeatherRequest, ReportType} from '../shared/models/weather.model'

@Component({
  selector: 'app-dasboard',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    WeatherTableComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  requestsForm: FormGroup;
  groupedWeatherData: Record<string, WeatherReport[]> = {};
  errorMessage: string | null = null;
  randomNumber: number = 0;


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
    const stations = String(group.get('stations')?.value || '').trim();
    const countries = String(group.get('countries')?.value || '').trim();
    return stations !== "" || countries !== "" ? null : { noLocationSelected: true };
  }

  createBriefing() {
    if (this.requestsForm.valid) {
      const { metar, sigmet, taf, stations, countries } = this.requestsForm.value
      const reportTypes:string[] = this.getReportTypes(metar, sigmet, taf)
      const stationsArray:string[] = this.arrayInput(stations)
      const countriesArray:string[] = this.arrayInput(countries)
      const formattedData: WeatherRequest = this.requestData(reportTypes, stationsArray, countriesArray);

      this.weatherService.getWeatherInformation(formattedData).subscribe({
        next: (response) => {
          this.errorMessage = null;
          if (response && response.result && Array.isArray(response.result)) {
            this.processWeatherData(response.result);
          }
        },
        error: (error) => {
          this.errorMessage = error.message
        }
      });
    }
  }

  private getReportTypes (metar: boolean, sigmet: boolean, taf: boolean): string[] {
    const types:string[] = [];
    if (metar) types.push(ReportType.METAR);
    if (sigmet) types.push(ReportType.SIGMET);
    if (taf) types.push(ReportType.TAF);
    return types;
  }

  private arrayInput(value: string | null): string[] {
    return value ? value.trim().split(/\s+/) : [];
  }

  private requestData(reportTypes: string[], stations: string[], countries: string[]): WeatherRequest {
    this.randomNumber = this.generateRandNum();
    return {
      id: 'query'+this.randomNumber,
      method: 'query',
      params: [
        {
          id: 'briefing'+this.randomNumber,
          reportTypes,
          stations,
          countries
        }
      ]
    };
  }

  processWeatherData(data: WeatherReport[]): void {
    this.groupedWeatherData = {};
    data.forEach(item  => {
      const stationId: string = item.stationId;
      if (!this.groupedWeatherData[stationId]) {
        this.groupedWeatherData[stationId] = [];
      }
      this.groupedWeatherData[stationId].push(item);
    });
  }

  generateRandNum(): number {
    return Math.floor(Math.random() * 99) + 1;
  }
}
