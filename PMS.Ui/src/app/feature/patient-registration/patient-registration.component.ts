import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
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
import { Subject, takeUntil, Observable, of, BehaviorSubject } from 'rxjs';
import { finalize, debounceTime, distinctUntilChanged, switchMap, map, filter, tap } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { RepositoryService } from '../../services/repository.service';
import { InsurancePlan, InsuranceProvider, PatientInsurance, PatientInsuranceDto } from '../../models/insurance';

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
    MatProgressBarModule,
    MatDialogModule,
    MatAutocompleteModule
  ],
  templateUrl: './patient-registration.component.html',
  styleUrls: ['./patient-registration.component.scss']
})
export class PatientRegistrationComponent implements OnInit, OnDestroy, AfterViewInit {
  form: FormGroup;
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  genders = ['Male', 'Female', 'Unknown'];
  allergyOptions = ['Pollen', 'Dust', 'Peanuts', 'Seafood', 'Milk', 'Gluten'];
  conditions = ['Diabetes', 'Hypertension (High Blood Pressure)', 'Asthma', 'Heart Disease', 'Chronic Kidney Disease', 'Arthritis', 'Depression / Anxiety', 'Allergies', 'Thyroid Disorder', 'Cancer', 'COPD', 'Migraine', 'Obesity', 'Other'];
  medications = ['Aspirin', 'Metformin', 'Lisinopril', 'Simvastatin', 'Levothyroxine', 'Albuterol', 'Omeprazole', 'Amoxicillin', 'Ibuprofen', 'Acetaminophen', 'Other'];
  calculatedAge = 0;
  ageDisplay: string = '';
  patientId: string | null = '';
  submitting = false;
  savingAnother = false;
  showAllConditions = false;
  showAllMedications = false;
  private requiredFields: string[] = ['firstName','lastName','dateOfBirth'];
  // Responsible person & insurance feature state
  responsibleSearchLoading = false;
  selectedResponsiblePatient?: Patient;
  responsibleFiltered$!: Observable<Patient[]>; // autocomplete data
  responsibleMinLength = 1; // characters before querying
  insuranceForm!: FormGroup;
  providers: InsuranceProvider[] = [];
  otherPolicyHolderResults: Patient[] = [];
  otherPolicyHolderSearchLoading = false;
  selectedOtherPolicyHolder?: Patient;
  @ViewChild('underAgeTpl') underAgeTpl!: TemplateRef<any>;
  @ViewChild(MatAutocompleteTrigger) responsibleAutocompleteTrigger!: MatAutocompleteTrigger;

  // Toggle to optionally show blood group (requirement #9) - could be driven by configuration
  showBloodGroup = false; // US context default hide
  patientData!: Patient;
  private destroy$ = new Subject<void>();
  insurancePlans: InsurancePlan[] = [];
  insuranceProviders: InsuranceProvider[] = [];
  private providersLoaded$ = new BehaviorSubject<boolean>(false);
  private plansLoaded$ = new BehaviorSubject<boolean>(false);
  private insuranceLoaded = false; // prevent double binding
  private selfPatientInsuranceLoaded = false; // track self load vs responsible load
  showResponsibleHolderOption = false; // controls visibility of responsible person in policy holder dropdown
  private originalPatientSnapshot?: Patient; // snapshot used to restore on reset while editing
  private originalInsuranceSnapshot: any | null = null; // raw insurance form values snapshot

  constructor(private fb: FormBuilder, private patientService: PatientService, private router: Router, private route: ActivatedRoute, private snack: MatSnackBar, private toast: ToastService, private dialog: MatDialog, private repoService: RepositoryService) {
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
      notes: [''],
      // New responsible person controls
  // Store as string to match radio values ("true" | "false") so default 'false' selects the "Yes" option
  responsibleIsPatient: ['false'], // 'true' => No (search shown), 'false' => Yes (patient is responsible)
      responsibleSearch: ['', Validators.minLength(3)],
      responsiblePatientId: ['']
    });

    // Secondary Insurance form (separate form group)
    this.insuranceForm = this.fb.group({
      insuranceId : [''],
      policyHolderType: ['Self', Validators.required], // Self | Other
      providerId: ['', Validators.required],
      planId: [''], // becomes required after provider selection
      policyNumber: [''], // required when plan list visible (after provider chosen)
      priority: ['1'], // Primary default
      insuranceType: ['Primary', Validators.required], // Primary | Secondary (mirrors priority but user may see both labels)
      effectiveDate: [new Date(), Validators.required],
      expirationDate: [{ value: this.addOneYear(new Date()), disabled: false }, Validators.required],
      memberId: [''],
      otherPolicyHolderSearch: [''],
      otherPolicyHolderPatientId: ['']
    });
  }

  private addOneYear(d: Date): Date { const nd = new Date(d); nd.setFullYear(nd.getFullYear() + 1); return nd; }

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
            this.loadPatientDetails(patient);
            this.tryLoadExistingInsurance();
          }
        });
    }

    // Auto-calculate age when DOB changes
    this.form.get('dateOfBirth')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.calculateAge());

    // Fetch providers & plans
    this.loadInsuranceProvider();
    this.loadInsurancePlan();

    // Dynamic validation & visibility logic for insurance form
    this.insuranceForm.get('providerId')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(val => {
      const planCtrl = this.insuranceForm.get('planId');
      const policyCtrl = this.insuranceForm.get('policyNumber');
      const priorityCtrl = this.insuranceForm.get('priority');
      if (val) {
        planCtrl?.setValidators([Validators.required]);
        policyCtrl?.setValidators([Validators.required, Validators.minLength(5)]);
        priorityCtrl?.setValidators([Validators.required]);
        // Reset dependent fields when provider changes
        planCtrl?.setValue('', { emitEvent: false });
        policyCtrl?.setValue(this.generatePolicyNumber(val), { emitEvent: false });
      } else {
        planCtrl?.clearValidators();
        policyCtrl?.clearValidators();
        priorityCtrl?.clearValidators();
      }
      planCtrl?.updateValueAndValidity({ emitEvent: false });
      policyCtrl?.updateValueAndValidity({ emitEvent: false });
      priorityCtrl?.updateValueAndValidity({ emitEvent: false });
    });

    this.insuranceForm.get('planId')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(planId => {
      const memberIdCtrl = this.insuranceForm.get('memberId');
      const effectiveCtrl = this.insuranceForm.get('effectiveDate');
      const expirationCtrl = this.insuranceForm.get('expirationDate');
      if (planId) {
        memberIdCtrl?.setValidators([Validators.required, Validators.minLength(5)]);
        if (!memberIdCtrl?.value) memberIdCtrl?.setValue(this.generateMemberId(planId), { emitEvent: false });
        // Ensure expiration date is one year after effective date
        const eff = effectiveCtrl?.value ? new Date(effectiveCtrl.value) : new Date();
        expirationCtrl?.setValue(this.addOneYear(eff), { emitEvent: false });
      } else {
        memberIdCtrl?.clearValidators();
      }
      memberIdCtrl?.updateValueAndValidity({ emitEvent: false });
      expirationCtrl?.updateValueAndValidity({ emitEvent: false });
    });

    this.insuranceForm.get('effectiveDate')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(dt => {
      if (!dt) return;
      const expirationCtrl = this.insuranceForm.get('expirationDate');
      const exp = this.addOneYear(new Date(dt));
      expirationCtrl?.setValue(exp, { emitEvent: false });
    });

    // Keep insuranceType synced with priority (1=Primary,2=Secondary)
    this.insuranceForm.get('priority')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(v => {
      const insType = this.insuranceForm.get('insuranceType');
      if (v === '1') insType?.setValue('Primary', { emitEvent: false });
      else if (v === '2') insType?.setValue('Secondary', { emitEvent: false });
    });
    this.insuranceForm.get('insuranceType')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(v => {
      const pr = this.insuranceForm.get('priority');
      if (v === 'Primary') pr?.setValue('1', { emitEvent: false });
      else if (v === 'Secondary') pr?.setValue('2', { emitEvent: false });
    });

    // Removed obsolete dynamic validator subscriptions for insurance/responsible person fields (controls no longer present)

    // React to policy holder selection (Self or responsible adult GUID)
    this.insuranceForm.get('policyHolderType')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        if (!val) return;
        if (val === 'Self') {
          // User explicitly chose Self; hide responsible option and fully clear insurance fields
          this.showResponsibleHolderOption = false;
          this.resetInsuranceSection(true); // do NOT reload self insurance; leave blank for fresh entry
        } else {
          // assume GUID of responsible patient
          this.showResponsibleHolderOption = true;
          this.resetInsuranceSection(true); // clear current values before load
          this.loadInsuranceForPatient(val as string, false, false);
        }
      });

    // When user selects responsibleIsPatient = No (false), clear responsible selection & insurance holder option
    this.form.get('responsibleIsPatient')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(v => {
        if (v === 'false' || v === false) {
          this.selectedResponsiblePatient = undefined;
          this.showResponsibleHolderOption = false;
          // Force policy holder back to Self and reset all insurance fields
          this.insuranceForm.get('policyHolderType')?.setValue('Self', { emitEvent: true });
          this.resetInsuranceSection(false);
        }
      });
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
    if (!this.originalPatientSnapshot && this.patientId) {
      this.originalPatientSnapshot = { ...patient } as Patient; // shallow copy
    }
  }

  // Autocomplete selection handler
  onResponsibleOptionSelected(event: MatAutocompleteSelectedEvent) {
    const patient: Patient | undefined = event.option.value;
    if (patient) this.selectResponsiblePatient(patient);
  }

  displayResponsible(opt: Patient | string): string {
    return typeof opt === 'string' ? opt : (opt?.full_name || '');
  }

  selectResponsiblePatient(p: Patient) {
    const age = p.age ?? 0;
    if (age < 18) {
      const ref = this.dialog.open(this.underAgeTpl);
      // After dialog close clear selection & field so user must pick another
      ref.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.selectedResponsiblePatient = undefined;
    this.showResponsibleHolderOption = false;
        this.form.get('responsiblePatientId')?.setValue('');
        const searchCtrl = this.form.get('responsibleSearch');
        searchCtrl?.setValue('', { emitEvent: true });
        // Reopen panel for quicker reselection
        setTimeout(() => this.responsibleAutocompleteTrigger?.openPanel(), 0);
      });
      return;
    }
    // Valid adult selection
    this.selectedResponsiblePatient = p;
  this.showResponsibleHolderOption = true;
    this.form.get('responsiblePatientId')?.setValue(p.id || '');
  }

  // Other policy holder search within insurance form
  onOtherPolicyHolderSearch(term: string) {
    this.insuranceForm.get('otherPolicyHolderSearch')?.setValue(term, { emitEvent: false });
    if (!term || term.trim().length < 3) {
      this.otherPolicyHolderResults = [];
      return;
    }
    this.otherPolicyHolderSearchLoading = true;
    this.repoService.search(term.trim(), 1, 10)
      .pipe(finalize(() => this.otherPolicyHolderSearchLoading = false))
      .subscribe({
        next: res => { this.otherPolicyHolderResults = res.results; },
        error: () => { this.otherPolicyHolderResults = []; }
      });
  }

  selectOtherPolicyHolder(p: Patient) {
    this.selectedOtherPolicyHolder = p;
    this.insuranceForm.get('otherPolicyHolderPatientId')?.setValue(p.id || '');
  }

  private loadInsurancePlan() {
    this.repoService.getPlans().subscribe({
      next: plans => { this.insurancePlans = plans; this.plansLoaded$.next(true); this.tryLoadExistingInsurance(); },
      error: () => { this.insurancePlans = []; this.plansLoaded$.next(true); }
    });
  }

  private loadInsuranceProvider() {
    this.repoService.getProviders().subscribe({
      next: providers => { this.insuranceProviders = providers; this.providersLoaded$.next(true); this.tryLoadExistingInsurance(); },
      error: () => { this.insuranceProviders = []; this.providersLoaded$.next(true); }
    });
  }

  private tryLoadExistingInsurance() {
    if (this.insuranceLoaded) return;
    if (!this.patientId) return;
    if (!this.providersLoaded$.value || !this.plansLoaded$.value) return; // wait until lookup data
    this.loadInsuranceForPatient(this.patientId, true, true);
  }

  private loadInsuranceForPatient(patientId: string, markLoaded: boolean = false, isSelf: boolean = false) {
    if (!patientId) return;
    this.repoService.getPatientInsurances(patientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (list: any[]) => {
          if (list && list.length) {
            const primary = list.find(i => i.isPrimary === true) || list[0];
            this.insuranceForm.patchValue({
              insuranceId: primary.id || '',
              providerId: primary.providerId || '',
              planId: primary.planId || '',
              policyNumber: primary.policyNumber || '',
              memberId: primary.memberId || '',
              priority: primary.priority ? String(primary.priority) : (primary.isPrimary ? '1' : '2'),
              insuranceType: (primary.priority === 1 || primary.isPrimary) ? 'Primary' : 'Secondary',
              effectiveDate: primary.effectiveDate ? new Date(primary.effectiveDate) : new Date(),
              expirationDate: primary.expirationDate ? new Date(primary.expirationDate) : this.addOneYear(new Date())
            }, { emitEvent: false });
            if (!this.originalInsuranceSnapshot && this.patientId) {
              this.originalInsuranceSnapshot = this.insuranceForm.getRawValue();
            }
            if (isSelf) this.selfPatientInsuranceLoaded = true;
          } else {
            // No insurance records for chosen holder -> clear
            this.resetInsuranceSection(true);
          }
          if (markLoaded) this.insuranceLoaded = true;
        },
        error: () => { if (markLoaded) this.insuranceLoaded = true; }
      });
  }

  private resetInsuranceSection(keepHolder: boolean = false) {
    const holder = this.insuranceForm.get('policyHolderType')?.value;
    this.insuranceForm.patchValue({
      providerId: '',
      planId: '',
      policyNumber: '',
      memberId: '',
      priority: '1',
      insuranceType: 'Primary',
      effectiveDate: new Date(),
      expirationDate: this.addOneYear(new Date())
    }, { emitEvent: false });
    if (!keepHolder) {
      this.insuranceForm.get('policyHolderType')?.setValue('Self', { emitEvent: false });
    } else {
      // re-apply holder value to retrigger UI if needed
      this.insuranceForm.get('policyHolderType')?.setValue(holder, { emitEvent: false });
    }
  }

  calculateAge() {
    const dob = this.form.get('dateOfBirth')?.value;
    if (!dob) {
      this.calculatedAge = 0;
      this.ageDisplay = '';
      return 0;
    }

    const birthDate = new Date(dob);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      // days in previous month
      const prevMonthDate = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonthDate.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    if (years < 0) years = 0; // safety

    this.calculatedAge = years;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'yr' : 'yrs'}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? 'mo' : 'mos'}`);
  if (days > 0 || parts.length === 0) parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  this.ageDisplay = parts.join(' ');
  }


  onCancel(reset: boolean) {
    if (this.patientId && this.originalPatientSnapshot) {
      // restore patient fields
      this.loadPatientDetails(this.originalPatientSnapshot);
      // restore insurance if captured
      if (this.originalInsuranceSnapshot) {
        this.insuranceForm.reset(this.originalInsuranceSnapshot, { emitEvent: false });
      } else {
        this.resetInsuranceSection(true);
      }
      this.toast.info('Reverted changes');
      return;
    }
    this.resetForm();
    if (reset) this.router.navigate(['/patient/search']);
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.insuranceForm.invalid) { this.insuranceForm.markAllAsTouched(); return; }

    this.submitting = true;
    const data: Patient = this.mapPatientRecord(this.form);

    if (this.insuranceForm.valid && this.insuranceForm.get('planId')?.value?.length) {
      const insuranceData = this.mapInsuranceRecord(this.insuranceForm);
      if (insuranceData) {
        data.insurance = insuranceData;
      }
    }

    // Reuse existing service but keep navigation; show bottom snackbar
    this.patientService.savePatient(data, this.patientId);
    this.submitting = false;
  }

  saveAndAddAnother() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.insuranceForm.invalid) { this.insuranceForm.markAllAsTouched(); return; }
    this.savingAnother = true;
    const data: Patient = this.mapPatientRecord(this.form);

    // Map insurance form values to patient data
    if (this.insuranceForm.valid && this.insuranceForm.get('planId')?.value?.length) {
      const insuranceData = this.mapInsuranceRecord(this.insuranceForm);
      if (insuranceData) {
        data.insurance = insuranceData;
      }
    }

    this.patientService['repo'].addPatient(data).subscribe({
      next: (newPatient) => {
        if (newPatient.id && data.insurance) {
          data.insurance.patientId = newPatient.id;
          this.patientService['repo'].addPatientInsurance(newPatient.id, data.insurance).subscribe({
            next: () => {
              this.toast.success('Patient added successfully with insurance');
            },
            error: (err) => {
              this.toast.error('Error adding patient insurance');
            }
          });
        }
        this.router.navigate(['/patient/profile', newPatient.id]);
        this.toast.success('Patient added successfully');
      },
      error: (err) => {
        this.toast.error('Error adding patient');
      }
    });
  }

  mapInsuranceRecord(data: FormGroup): PatientInsuranceDto | undefined {
    if (data.invalid) return undefined;
    return {
      insuranceId: data.value.insuranceId,
      providerId: data.value.providerId,
      planId: data.value.planId,
      policyNumber: data.value.policyNumber,
      memberId: data.value.memberId,
      isPrimary: data.value.priority === '1',
      effectiveDate: data.value.effectiveDate,
      expirationDate: data.value.expirationDate,
      priority: Number(data.value.priority)
    };
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
    // Reset new fields
    this.form.patchValue({
      // keep string type so radio selects correctly
      responsibleIsPatient: 'false',
      responsibleSearch: '',
      responsiblePatientId: ''
    });
    this.selectedResponsiblePatient = undefined;
    this.insuranceForm.reset({
      policyHolderType: 'Self',
      providerId: '',
      planId: '',
      policyNumber: '',
      priority: '1',
      insuranceType: 'Primary',
      effectiveDate: new Date(),
      expirationDate: this.addOneYear(new Date()),
      memberId: '',
      otherPolicyHolderSearch: '',
      otherPolicyHolderPatientId: ''
    });
    if (!this.patientId) {
      this.originalPatientSnapshot = undefined;
      this.originalInsuranceSnapshot = null;
    }
  }

  ngAfterViewInit() {
    const ctrl = this.form.get('responsibleSearch');
    if (ctrl) {
      this.responsibleFiltered$ = ctrl.valueChanges.pipe(
        debounceTime(150),
        distinctUntilChanged(),
        map(v => typeof v === 'string' ? v.trim() : ''),
        tap(v => { if (v.length < this.responsibleMinLength) { this.responsibleSearchLoading = false; } }),
        switchMap(term => {
          if (term.length < this.responsibleMinLength) return of([] as Patient[]);
          this.responsibleSearchLoading = true;
          return this.repoService.search(term, 1, 10).pipe(
            finalize(() => this.responsibleSearchLoading = false),
            map(res => res.results)
          );
        })
      );

      // Side effect: open/close panel reactively while typing
      this.responsibleFiltered$.pipe(takeUntil(this.destroy$)).subscribe(list => {
        if (!ctrl.value || (typeof ctrl.value === 'string' && ctrl.value.trim().length < this.responsibleMinLength)) {
          if (this.responsibleAutocompleteTrigger?.panelOpen) {
            this.responsibleAutocompleteTrigger.closePanel();
          }
          return;
        }
        if (list && list.length && !this.responsibleAutocompleteTrigger?.panelOpen) {
          // Allow view to settle before opening
          Promise.resolve().then(() => this.responsibleAutocompleteTrigger?.openPanel());
        }
      });
    }
  }

  private generatePolicyNumber(providerId: string): string {
    const prov = this.insuranceProviders.find(p => p.id === providerId);
    const prefix = prov?.name ? prov.name.split(/\s+/).map(w=>w[0]).join('').toUpperCase() : 'POL';
    return `POL-${prefix}-${Math.floor(Math.random()*900+100)}`;
  }

  private generateMemberId(planId: string): string {
    const plan = this.insurancePlans.find(p => p.id === planId);
    const prefix = plan?.name ? plan.name.replace(/[^A-Za-z0-9]/g,'').substring(0,5).toUpperCase() : 'MEM';
    return `MEM-${prefix}-${Math.floor(Math.random()*900+100)}`;
  }
}