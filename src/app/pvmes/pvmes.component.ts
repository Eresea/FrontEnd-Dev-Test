import { NB_ZIPCODE_CHAR } from './../models/pvmes.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Pvmes, NB_SIREN_CHAR, SolarPanelTypes } from '../models/pvmes.model';
import { db_url } from '../../environments/db_access';

// Fake DB url to the PVMES component
const pvmes_url: string = '/pv_mise_en_services';

//Move this to a relevant UI component
interface Alert {
  type: string;
  message: string;
}

@Component({
  selector: 'app-pvmes',
  templateUrl: './pvmes.component.html',
  styleUrls: ['./pvmes.component.scss']
})
export class PvmesComponent implements OnInit {

  // The types of solar panels
  PanelTypes = SolarPanelTypes;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private http: HttpClient) {}

  // Validators
  // Must have exactly 5 characters ::TODO : Check if has to check for only digits
  zipCodeValidator(control: AbstractControl) {
    if(control.value && control.value.length != NB_ZIPCODE_CHAR) {
      return {'zipCodeInvalid': true};
    }
    return null;
  }

  //Must be all digits and have exactly NB_SIREN_CHAR characters
  sirenValidator(control: AbstractControl) {
    let regexp = new RegExp(/^\d+$/);
    if (control.value && (control.value.length != NB_SIREN_CHAR || (!(regexp.test(control.value))))) {
      return {'sirenCodeInvalid': true};
    }
    return null;
  }

  // Regex test of an email address
  emailValidator(control: AbstractControl) {
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    
    if (control.value && !regexp.test(control.value)) {
      return {'emailInvalid': true};
    }
    return null;
  }

  ngOnInit(): void {
    // Setup the ControlGroup
    this.form = this.formBuilder.group({
        companyName: ['Test', Validators.required],
        sirenCode: ['123456789', [this.sirenValidator]],
        customerName: ['Test', Validators.required],
        customerPhone: ['123', Validators.required],
        customerEmail: ['test@gmail.com', [this.emailValidator]],
        address: ['Address1', Validators.required],
        zipCode: ['12345', [this.zipCodeValidator]],
        city: ['Lauris', Validators.required],
        country: ['France', Validators.required],
        installationDate: [new Date(), Validators.required],
        SolarPanels: this.formBuilder.array([])
    });
  }

  // Getting the created solar panels' FormArray
  get SolarPanels(): FormArray {
    return this.form.get("SolarPanels") as FormArray;
  }

  // Create a new solar panel
  newPanel(serial: string, type: string): FormGroup {
    return this.formBuilder.group({
      serial_number: serial,
      type_of: type
    })
  }

  addSolarPanel(serial: number, type: string) {
    this.SolarPanels.push(this.newPanel(serial.toString(), type));
  }
 
  removeSolarPanel(i:number) {
    this.SolarPanels.removeAt(i);
  }

  form: FormGroup = new FormGroup({});
  // Shown alerts
  alerts: Alert[] = [];
  // Title shown at the top of the page
  pageTitle: string = 'PVMES';
  // Selected panel type to add (stored as a string)
  selectedPanelType: string = this.PanelTypes[0].name;
  // The different solar panels keys from the enumerator that are being used in the UI
  // Temporary panel serial number, increasing with each new solar panel
  lastSerialNumber: number = 123456;

  // OnPress event on the SIREN input : Used to only allow numbers & up to 9 characters (NB_SIREN_CHAR = 9)
  OnSirenPress(event: any): boolean {
    if (this.form.value.sirenCode.length >= NB_SIREN_CHAR) return false;
    const charCode = (event.which) ? event.which : event.keyCode;
    // Input character has to be a digit
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false
    } else {
      return true;
    }
  }

  OnSubmit() {

    if (!this.form.valid) {
      //TODO: show invalid input
      this.form.markAllAsTouched();
      this.alerts.push({type: "danger", message: "Invalid PVMES form"});
      return;
    }

    // HTTP query options
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    let pvmes: Pvmes = new Pvmes();
    pvmes.init(this.form);

    // POST query to the fake DB
    // The data sent is the PVMES object of the window
    this.http.post<Pvmes>(db_url + pvmes_url, pvmes, httpOptions) .subscribe(
      val => {
        // Logs the response call with the return value from the DB
        console.log("POST call successful : ", val);
        this.alerts.push({type: "success", message: "PVMES saved successfully"});
      },
      error => {
        this.alerts.push({type: "danger", message: "PVMES failed to save"});
        return;//TODO: handle failure
      }
    );
    // Routes back to the home page
    this.router.navigateByUrl('/home');
  }

  // Event called on adding a new solar panel to the installation
  OnAddPanel() {
    this.addSolarPanel(this.lastSerialNumber, this.selectedPanelType);
    // Increase the fake serial number (Note : This value is not decreased when removing a solar panel from the installation)
    this.lastSerialNumber += 1; 
    console.log(this.SolarPanels);
  }

  DeleteSolarPanel(index: number) {
    this.removeSolarPanel(index)
    // The "lastSerialNumber" value is not decreased when removing a solar panel from the installation
  }
}
