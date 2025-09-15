import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from '../../core/shared/material.module';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // legacy usage (to be removed)
import { ToastService } from '../../services/toast.service';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-patient-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonModule,
    MaterialModule,
  MatTableModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatChipsModule,
  MatProgressBarModule
  ],
  templateUrl: './patient-registration.component.html',
  styleUrls: ['./patient-registration.component.scss']
})
export class PatientRegistrationComponent implements OnInit, OnDestroy {
  form: FormGroup;
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  genders = ['Male', 'Female', 'Unknown'];
  allergyOptions = ['Pollen', 'Dust', 'Peanuts', 'Seafood', 'Milk', 'Gluten'];
  conditions = ['Diabetes', 'Hypertension (High Blood Pressure)', 'Asthma', 'Heart Disease', 'Chronic Kidney Disease', 'Arthritis', 'Depression / Anxiety', 'Allergies', 'Thyroid Disorder', 'Cancer', 'COPD', 'Migraine', 'Obesity', 'Other'];
  medications = ['Aspirin', 'Metformin', 'Lisinopril', 'Simvastatin', 'Levothyroxine', 'Albuterol', 'Omeprazole', 'Amoxicillin', 'Ibuprofen', 'Acetaminophen', 'Other'];
  calculatedAge = 0;
  patientId: string | null = '';
  submitting = false;
  savingAnother = false;
  showAllConditions = false;
  showAllMedications = false;
  private requiredFields: string[] = ['firstName','lastName','dateOfBirth'];

  // Toggle to optionally show blood group (requirement #9) - could be driven by configuration
  showBloodGroup = false; // US context default hide
  patientData!: Patient;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private patientService: PatientService, private router: Router, private route: ActivatedRoute, private snack: MatSnackBar, private toast: ToastService) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      dateOfBirth: ['', [Validators.required, this.dateValidator]],
      age: [{ value: '', disabled: true }],
      gender: [''],
      phone: ['', [Validators.pattern(/^(\d{3}-\d{3}-\d{4}|\d{10})$/)]],
      email: ['', [Validators.email]],
      // Address broken into parts (req #4)
      addressLine: [''],
      city: [''],
      state: [''],
  zip: ['', [Validators.minLength(6), Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)]],
      bloodGroup: [''],
      allergies: [[]],
      conditions: [[]],
      medications: [[]],
      notes: ['']
    });
  }

  // Snapshot computed helpers
  get fullName(): string {
    const f = this.form?.get('firstName')?.value || '';
    const l = this.form?.get('lastName')?.value || '';
    return (f + ' ' + l).trim();
  }

  get displayConditions(): string {
    const list: string[] = this.form?.get('conditions')?.value || [];
    if (!list.length) return '—';
    return list.length > 3 ? `${list.slice(0,3).join(', ')} +${list.length - 3} more` : list.join(', ');
  }

  get displayMedications(): string {
    const list: string[] = this.form?.get('medications')?.value || [];
    if (!list.length) return '—';
    return list.length > 3 ? `${list.slice(0,3).join(', ')} +${list.length - 3} more` : list.join(', ');
  }

  get initials(): string {
    if (!this.fullName) return '?';
    const parts = this.fullName.split(' ').filter(p=>p);
    return parts.slice(0,2).map(p=>p[0].toUpperCase()).join('');
  }

  get conditionsList(): string[] { return this.form?.get('conditions')?.value || []; }
  get medicationsList(): string[] { return this.form?.get('medications')?.value || []; }

  get conditionsVisible(): string[] {
    return this.showAllConditions ? this.conditionsList : this.conditionsList.slice(0,6);
  }

  get medicationsVisible(): string[] {
    return this.showAllMedications ? this.medicationsList : this.medicationsList.slice(0,6);
  }

  toggleConditions() { this.showAllConditions = !this.showAllConditions; }
  toggleMedications() { this.showAllMedications = !this.showAllMedications; }

  get addressSummary(): string | null {
    const parts = ['addressLine','city','state','zip'].map(k=>this.form.get(k)?.value).filter((x:string)=>!!x);
    return parts.length ? parts.join(', ') : null;
  }

  get completionPercent(): number {
    const completed = this.requiredFields.filter(f => !!this.form.get(f)?.value).length;
    return Math.round((completed/this.requiredFields.length)*100);
  }

  get zipCtrl() { return this.form.get('zip'); }

  copy(value: string | null | undefined, label: string) {
    if (!value) { return; }
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(value).then(()=>{
      this.toast.info(`${label} copied`);
      });
    }
  }

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id');

    if (this.patientId) {
      this.patientService.loadPatientById(this.patientId);
      this.patientService.patients$
        .pipe(takeUntil(this.destroy$))
        .subscribe(patient => {
          if (patient) {
            this.patientData = patient;
            this.loadPatientDetails(patient)
          }
        });
    }

    // Auto-calculate age when DOB changes
    this.form.get('dateOfBirth')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.calculateAge());

  // Removed obsolete dynamic validator subscriptions for insurance/responsible person fields (controls no longer present)
  }

  loadPatientDetails(patient: Patient) {
    const [firstName, ...rest] = patient.full_name?.split(' ') || ['', ''];
    const lastName = rest.join(' ');

    // Parse combined address back into parts if present
    const addrParts = (patient.address || '').split(',').map(p => p.trim());
    const [addressLine, city, state, zip] = [addrParts[0] || '', addrParts[1] || '', addrParts[2] || '', addrParts[3] || ''];

    this.form.patchValue({
      firstName,
      lastName,
      dateOfBirth: patient.dob,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      addressLine,
      city,
      state,
      zip,
      age: patient.age,
      conditions: patient.conditions || [],
      medications: patient.medications || [],
      notes: patient.notes,
    });
    this.calculatedAge = patient.age || 0;
  }

  calculateAge() {
    const dob = this.form.get('dateOfBirth')?.value;
    if (!dob) {
      this.calculatedAge = 0;
      return 0;
    }

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // Adjust if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    this.calculatedAge = age;
  }


  onCancel(reset: boolean) {
  this.resetForm();
  if (reset) this.router.navigate(['/patient/search']);
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    const data: Patient = this.mapPatientRecord(this.form);
    // Reuse existing service but keep navigation; show bottom snackbar
    this.patientService.savePatient(data, this.patientId);
    this.submitting = false;
  }

  saveAndAddAnother() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.savingAnother = true;
    const data: Patient = this.mapPatientRecord(this.form);
    // Manually call repository to control toast timing
    const obs$ = this.patientId
      ? this.patientService['repo'].updatePatient(this.patientId, data)
      : this.patientService['repo'].addPatient(data);

    (obs$ as any)
      .pipe(finalize(() => this.savingAnother = false))
      .subscribe(
        () => {
          this.toast.success('Saved. You can add another.');
          this.resetForm();
          this.patientId = null;
        },
        () => {
          this.toast.error('Save failed. Please try again.');
        }
      );
  }

  mapPatientRecord(data: FormGroup): Patient {
    const patientData: Patient = {
      full_name: `${data.value.firstName} ${data.value.lastName}`.trim(),
      dob: data.value.dateOfBirth ? data.value.dateOfBirth : undefined,
      gender: data.value.gender,
      phone: data.value.phone,
      email: data.value.email,
      address: this.combineAddress(data),
      age: this.calculatedAge,
      conditions: data.value.conditions ?? null,
      medications: data.value.medications ?? null,
      notes: data.value.notes ?? null,
    } as Patient;
    if (this.patientId) {
      patientData.id = this.patientId;
      (patientData as any).created_at = this.patientData?.created_at; // preserve legacy field name if used
      (patientData as any).updated_at = new Date();
    }
    return patientData;
  }

  private combineAddress(fg: FormGroup): string {
    const parts = [fg.value.addressLine, fg.value.city, fg.value.state, fg.value.zip].filter(p => !!p);
    return parts.length ? parts.join(', ') : '';
  }

  dateValidator(control: AbstractControl) {
    if (!control.value) return null;
    const val = new Date(control.value);
    return isNaN(val.getTime()) ? { invalidDate: true } : null;
  }

  getConditionsTooltip(): string {
    const v = this.form.get('conditions')?.value as string[];
    return v && v.length ? v.join(', ') : 'Select medical conditions';
  }

  getAllergiesTooltip(): string {
    const v = this.form.get('allergies')?.value as string[];
    return v && v.length ? v.join(', ') : 'Select allergies';
  }

  getMedicationsTooltip(): string {
    const v = this.form.get('medications')?.value as string[];
    return v && v.length ? v.join(', ') : 'Select medications';
  }

  onPhoneInput(e: Event) {
    const ctrl = this.form.get('phone');
    if (!ctrl) return;
    let digits = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, '').substring(0, 10);
    if (digits.length > 6) {
      digits = digits.replace(/(\d{3})(\d{3})(\d{1,4})/, '$1-$2-$3');
    } else if (digits.length > 3) {
      digits = digits.replace(/(\d{3})(\d{1,3})/, '$1-$2');
    }
    ctrl.setValue(digits, { emitEvent: false });
  }

  onDobInput(event: Event) {
    // Only apply if user is typing manually (matDatepicker still allowed)
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/[^0-9]/g, '').substring(0, 8);
    if (v.length >= 5) {
      v = v.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
    } else if (v.length >= 3) {
      v = v.replace(/(\d{2})(\d{1,2})/, '$1/$2');
    }
    input.value = v;
  }

  onZipInput(event: Event) {
    const ctrl = this.form.get('zip');
    if (!ctrl) return;
    let digits = (event.target as HTMLInputElement).value.replace(/[^0-9]/g, '');
    if (digits.length > 10) digits = digits.substring(0,10);
  ctrl.setValue(digits, { emitEvent: false });
  ctrl.updateValueAndValidity({ emitEvent: false });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private resetForm() {
    this.form.reset({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      age: '',
      gender: '',
      phone: '',
      email: '',
      addressLine: '',
      city: '',
      state: '',
      zip: '',
      bloodGroup: '',
      allergies: [],
      conditions: [],
      medications: [],
      notes: ''
    });
    this.calculatedAge = 0;
    // Ensure select/multi-select controls emit changes for UI refresh
    ['allergies','conditions','medications'].forEach(c => {
      const ctrl = this.form.get(c);
      if (ctrl) ctrl.setValue([], { emitEvent: true });
    });
  }
}