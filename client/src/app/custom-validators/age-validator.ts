import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ageValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const age = control.value;
    if (isNaN(age) || age < 18) {
      return { invalidAge: true };
    }
    return null;
  };
}
