import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
  FormControl,
  ValidationErrors, AbstractControl, ValidatorFn
} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-dasboard',
  imports: [
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule
  ],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  requestsForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.requestsForm = this.fb.group({
      metar: [false],
      sigmet: [false],
      taf: [false],
      stations: ['', [Validators.required, this.codeListValidator(4)]],
      countries: ['', [Validators.required, this.codeListValidator(2)]],
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

  createBriefing() {
    if (this.requestsForm.valid) {
    console.log("som tu");
    const { metar, sigmet, taf, stations, countries } = this.requestsForm.value;
    const messageTypes = [];
    if (metar) messageTypes.push('METAR');
    if (sigmet) messageTypes.push('SIGMET');
    if (taf) messageTypes.push('TAF');
    }
    console.log(this.requestsForm.value);
  }
}
