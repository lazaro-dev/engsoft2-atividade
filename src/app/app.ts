import { Component, computed, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { disabled, email, form, FormField, minLength, required } from '@angular/forms/signals';

interface FormFirstData {
  name: string;
  address: string;
  maritalStatus: string;
  spouse: string;
  hasOwnHouse: boolean;
  hasDriverLicense: boolean;
  category: string;
  vehicle: string;
  vehicleDetails: string;
}

@Component({
  selector: 'app-root',
  imports: [FormField, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {

  buttons = [
    {
      label: 'Clique Aqui',
      disabled: true,
      visible: true,
      action: () => alert('Testando botão')
    },
    {
      label: 'Enabled',
      disabled: false,
      visible: true,
      action: () => this.buttons[0].disabled = !this.buttons[0].disabled
    },
    {
      label: 'Visible',
      disabled: false,
      visible: true,
      action: () => this.buttons[0].visible = !this.buttons[0].visible
    },
    {
      label: 'Alter Caption',
      disabled: false,
      visible: true,
      action: () => this.buttons[0].label = this.buttons[0].label == 'Clique Aqui' ? 'Aqui' : 'Clique Aqui'
    },
  ];

  formModel = signal<FormFirstData>({
    name: '',
    address: '',
    maritalStatus: 'Solteiro',
    spouse: '',
    hasOwnHouse: false,
    hasDriverLicense: false,
    category: '',
    vehicle: '',
    vehicleDetails: ''
  });

  firstForm = form(this.formModel, (schemaPath) => {
    required(schemaPath.name, { message: 'O nome é obrigatório' });
    minLength(schemaPath.name, 3, { message: 'O nome deve ter pelo menos 3 caracteres' });
    disabled(schemaPath.spouse, ({ valueOf }) => {
      console.log(valueOf(schemaPath.maritalStatus));
      return valueOf(schemaPath.maritalStatus) !== 'Casado'
    });
    disabled(schemaPath.category, ({ valueOf }) => !valueOf(schemaPath.hasDriverLicense));
  });

  shortName = signal<string>('');
  messageName = computed(() => this.shortName() != '' ? 'Bonito Nome' : '');


  vehicles = [
    'Topic',
    'Besta',
    'Kombi'
  ];

  maritalStatusList = [
    'Casado',
    'Viuvo',
    'Solteiro',
    'Separado'
  ];

  
  resetSpouse(item: string) {
    if (item !== 'Casado') {
      this.firstForm.spouse().controlValue.set('');
    }
  }
  
  resetVehicleAll() {
    if(this.firstForm.hasDriverLicense().value() === false) {
      this.firstForm.category().controlValue.set('');
      this.firstForm.vehicle().controlValue.set('');
      this.firstForm.vehicleDetails().controlValue.set('');
    }
  }

  resetVehicleDetails() {
    if (this.firstForm.vehicle().value() !== 'Besta') {
      this.firstForm.vehicleDetails().controlValue.set('')
    }
  }

  onBlurName() {
    const value = this.firstForm.name().value() || '';
    this.shortName.set(value.substring(0, 10));
  }
}
