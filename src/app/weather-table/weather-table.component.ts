import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

export interface WeatherData {
  station: string;
  type: string;
  datetime: string;
  data: string;
}

@Component({
  selector: 'app-weather-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './weather-table.component.html',
  styleUrls: ['./weather-table.component.css']
})
export class WeatherTableComponent implements OnInit {
  displayedColumns: string[] = ['station', 'datetime', 'data'];
  weatherData: WeatherData[] = [];
  groupedData: { [key: string]: any[] } = {};

  @Input() set weatherDataInput(data: { [key: string]: any[] } | null) {
    if (data && Object.keys(data).length > 0) {
      this.groupedData = data;
      console.log('Grouped Data:', this.groupedData);
      this.processGroupedData();
    }
  }

  ngOnInit(): void {
  }

  processGroupedData(): void {
    this.weatherData = [];
    Object.keys(this.groupedData).forEach(stationId => {
      const items = this.groupedData[stationId];

      items.forEach(item => {

        this.weatherData.push({
          station: stationId,
          type: item.queryType || 'UNKNOWN',
          datetime: new Date(item.receptionTime).toLocaleString("sk-SK"),
          data: item.text || item.raw || JSON.stringify(item)
        });
      });
    });
  }

}
