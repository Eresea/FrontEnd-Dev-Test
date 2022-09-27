import { FormArray, FormGroup } from '@angular/forms';

export interface InstallationAddress {
    street: string,
    city: string,
    zip_code: string,
    country: string
}

// Number of digits making up a SIREN code
export const NB_SIREN_CHAR = 9;
export const NB_ZIPCODE_CHAR = 5;
// types of solar panels
export const SolarPanelTypes = [
    {name: 'Photovolatic', id: 0},
    {name: 'Hybrid', id: 1},
  ];

export interface SolarPanel {
    type_of: number,
    serial_number: string,
}

export class Company {
    id: number = 0;
    name: string = "";
    siren_code: string = "";

    constructor() {
        this.id = 0;
        this.name = "";
        this.siren_code = "";
    }
}

export class Customer {
    id: number = 0;
    name: string = "";
    email: string = "";
    phone: string = "";

    constructor() {
        this.id = 0;
        this.name = "";
        this.email = "";
        this.phone = "";
    }
}

// Procès verbal de mise en service
export class Pvmes {
    // Date of the installation
    installation_date: Date | null = null;
    // company information
    company: Company = new Company();
    // customer information
    customer: Customer = new Customer();
    // address of the installation
    address: InstallationAddress = {street: "", city: "", zip_code: "", country: ""};
    // array of the solar panels used in the installation
    solar_panels_attributes: SolarPanel[] = [];
    

    constructor() {
        this.address = {street: "", city: "", zip_code: "", country: ""};
        this.solar_panels_attributes = [];
        this.installation_date = null;
    }

    init(controlValues: FormGroup) {
        this.installation_date = controlValues.get("installationDate")?.value;
        this.company.name = controlValues.get("companyName")?.value;
        this.company.siren_code = controlValues.get('sirenCode')?.value;
        this.customer.name = controlValues.get('customerName')?.value;
        this.customer.email = controlValues.get('customerEmail')?.value;
        this.customer.phone = controlValues.get('customerPhone')?.value;
        this.address.street = controlValues.get('address')?.value;
        this.address.zip_code = controlValues.get('zipCode')?.value;
        this.address.city = controlValues.get('city')?.value;
        this.address.country = controlValues.get('country')?.value;
        let solarPanels: FormArray = controlValues.get('SolarPanels') as FormArray;
        solarPanels.controls.forEach(solarPanelControl => {
            let solarPanelGroup: FormGroup = solarPanelControl as FormGroup;
            let solarPanel: SolarPanel = ({ type_of: 0,// default value of Photovoltaic
                                            serial_number: solarPanelGroup.get('serial_number')?.value });
            //TODO simplify this
            for (let i in SolarPanelTypes) {
                if (SolarPanelTypes[i].name == solarPanelGroup.get('type_of')?.value) {
                    solarPanel.type_of = SolarPanelTypes[i].id;
                }
            }
            this.solar_panels_attributes.push(solarPanel);
        });
    }
}