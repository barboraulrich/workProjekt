import {Component, Input, model, OnChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {GroupedWeatherData, WeatherData} from '../shared/models/weather.model';

@Component({
  selector: 'app-weather-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './weather-table.component.html',
  styleUrls: ['./weather-table.component.css']
})

export class WeatherTableComponent implements OnChanges {

  displayedColumns: string[] = ['station', 'datetime', 'data'];
  weatherData: WeatherData[] = [];
  groupedData: GroupedWeatherData = {};

  groupedWeatherData = model<GroupedWeatherData>({});

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(): void {
    this.processGroupedData();
  }

  processGroupedData(): void {
    const data = this.groupedWeatherData();
    if (!data || Object.keys(data).length === 0) {
      this.weatherData = [];
      return;
    }

    const processedData: WeatherData[] = [];

    Object.entries(data).forEach(([stationId, items]) => {
      processedData.push({
        station: stationId,
        type: '',
        datetime: '',
        data: '',
        isStationHeader: true
      });

      items.forEach(item => {
        const weatherItem: WeatherData = {
          station: stationId,
          type: item.queryType,
          datetime: new Date(item.receptionTime).toLocaleString("sk-SK"),
          data: this.colorizeCloudCover(item.text),
          isStationHeader: false
        };

        processedData.push(weatherItem);
      });
    });

    this.weatherData = processedData;
  }

  colorizeCloudCover(text: string): SafeHtml {
    if (!text) return '';
    const cloudRegex = /(BKN|FEW|SCT)(\d{3})/g;

    const colorizedText = text.replace(cloudRegex, (match, prefix, digits) => {
      const number = parseInt(digits, 10);
      const color = number <= 30 ? 'blue' : 'red';
      return `<span style="color: ${color}">${prefix}${digits}</span>`;
    });

    return this.sanitizer.bypassSecurityTrustHtml(colorizedText);
  }
}
