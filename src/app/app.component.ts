import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AppRoutingModule} from './app.routes';

@Component({
  selector: 'app-root',
  imports: [AppRoutingModule],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'work-project';
}
