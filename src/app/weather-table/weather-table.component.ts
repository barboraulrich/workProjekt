import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface WeatherData {
  station: string;
  type: string;
  datetime: string;
  data: string | SafeHtml;
}

@Component({
  selector: 'app-weather-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './weather-table.component.html',
  styleUrls: ['./weather-table.component.css']
})
export class WeatherTableComponent {
  displayedColumns: string[] = ['station', 'datetime', 'data'];
  weatherData: WeatherData[] = [];
  groupedData: { [key: string]: any[] } = {};

  constructor(private sanitizer: DomSanitizer) {}

  @Input() set weatherDataInput(data: { [key: string]: any[] } | null) {
    if (data && Object.keys(data).length > 0) {
      this.groupedData = data;
      console.log('Grouped Data:', this.groupedData);
      this.processGroupedData();
    }
  }

  processGroupedData(): void {
    this.weatherData = [];
    Object.keys(this.groupedData).forEach(stationId => {
      const items = this.groupedData[stationId];

      items.forEach(item => {
        const weatherItem: WeatherData = {
          station: stationId,
          type: item.queryType || 'UNKNOWN',
          datetime: new Date(item.receptionTime).toLocaleString("sk-SK"),
          data: this.colorizeCloudCover(item.text || item.raw || JSON.stringify(item))
        };

        this.weatherData.push(weatherItem);
      });
    });
  }

  colorizeCloudCover(text: string): SafeHtml {
    if (!text) return '';
    const cloudRegex = /(BKN|FEW|SCT)(\d{3})/g;

    const colorizedText = text.replace(cloudRegex, (match, prefix, digits) => {
      const number = parseInt(digits, 10);
      const color = number <= 30 ? 'blue' : 'red';
      return `<span style="color: ${color};">${prefix}${digits}</span>`;
    });

    return this.sanitizer.bypassSecurityTrustHtml(colorizedText);
  }
}
