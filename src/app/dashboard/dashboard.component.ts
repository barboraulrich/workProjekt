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
    }, {
      validators: this.atLeastOneTypeValidator
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

  atLeastOneTypeValidator(group: FormGroup): ValidationErrors | null {
    const metar = group.get('metar')?.value;
    const sigmet = group.get('sigmet')?.value;
    const taf = group.get('taf')?.value;

    return metar || sigmet || taf ? null : { noTypeSelected: true };
  }

  createBriefing() {
    if (this.requestsForm.valid) {
      const { metar, sigmet, taf, stations, countries } = this.requestsForm.value;

      const reportTypes = [];
      if (metar) reportTypes.push('METAR');
      if (sigmet) reportTypes.push('SIGMET');
      if (taf) reportTypes.push('TAF_LONGTAF');

      const stationsArray = stations ? stations.trim().split(/\s+/) : [];
      const countriesArray = countries ? countries.trim().split(/\s+/) : [];

      const formattedData = {
        id: "briefing01",
        reportTypes: reportTypes,
        stations: stationsArray,
        countries: countriesArray
      };

      console.log(formattedData);
    } else {
      // Mark all fields as touched to trigger validation messages
      this.requestsForm.markAllAsTouched();
    }
  }
}
