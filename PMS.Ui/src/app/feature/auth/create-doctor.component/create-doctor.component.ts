import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../core/shared/material.module';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClinicService } from '../../../core/auth/clinic.service';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { LoaderService } from '../../../services/loader.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'pms-create-doctor',
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-doctor.component.html',
  styleUrl: './create-doctor.component.scss'
})
export class CreateDoctorComponent implements OnInit {

  constructor(private clinicService: ClinicService, private loader: LoaderService,
    private router: Router, private snack: MatSnackBar, private dialog: MatDialog) { }

  @ViewChild('siteAccessDialog') siteAccessDialog!: TemplateRef<any>;
  doctorForm!: FormGroup;
  clinics: any[] = [];
  sites: any[] = [];
  roles: any[] = [];
  features: any[] = [];
  displayedColumns: string[] = ['siteName', 'canView', 'canAdd', 'canEdit', 'canDelete'];
  roleText = '';

  ngOnInit(): void {
    this.doctorForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      fullName: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
      specialization: new FormControl('', Validators.required),
      roleId: new FormControl('', Validators.required),
      clinicId: new FormControl('', Validators.required),
      sites: new FormArray([]),
    });

    this.loadMasterData();
  }

  loadMasterData() {
    forkJoin({
      clinics: this.clinicService.getClinics(),
      roles: this.clinicService.getRoles(),
      features: this.clinicService.getFeatures()
    }).subscribe({
      next: ({ clinics, roles, features }) => {
        this.clinics = clinics;
        this.roles = roles;
        this.features = features;
      },
      error: (err) => {
        console.error('Error loading data:', err)
        this.snack.open('Failed to load data. Please try again later.' + (err.error?.message || ''), 'Close', { duration: 3000 });
      }
    });
  }

  onRoleChange(roleId: string) {
    this.roleText = this.roles.find(role => role.roleId === roleId)?.roleName || '';
  }

  onClinicChange(clinicId: string) {
    this.clinicService.getSitesByClinic(clinicId).subscribe(data => {
      this.sites = data.sort((a: any, b: any) => a.name.localeCompare(b.name));
      
    });
  }

  get sitesFormArray(): FormArray {
    return this.doctorForm.get('sites') as FormArray;
  }

  onSitesChange(selectedSiteIds: string[]): void {
    this.sitesFormArray.clear();

  // Sort the selected sites based on site name
  const sortedSites = this.sites
    .filter(s => selectedSiteIds.includes(s.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  sortedSites.forEach(site => {
    const featuresArray = new FormArray(
      this.features.map(f => new FormGroup({
        featureId: new FormControl(f.featureId),
        featureName: new FormControl(f.featureName),
        canView: new FormControl(false),
        canAdd: new FormControl(false),
        canEdit: new FormControl(false),
        canDelete: new FormControl(false)
      }))
    );

       this.sitesFormArray.push(
      new FormGroup({
        siteId: new FormControl(site.id),
        siteName: new FormControl(site.name),
        features: featuresArray
      })
    );
  });
}

  get sitesDataSource() {
    return this.sitesFormArray.controls.slice();
  }


  onSubmit() {
    if (this.doctorForm.valid) {
      this.loader.show();
      const formValue = this.doctorForm.value;
      // Create dictionary of siteId -> feature permissions
      const accessDict: Record<string, any[]> = {}; // siteId -> array of features
      const clinicSitesData: any[] = [];
      formValue.sites.forEach((siteData: any) => {
        clinicSitesData.push({
          clinicId: formValue.clinicId,
          siteId: siteData.siteId
        })
        accessDict[siteData.siteId] = siteData.features.map((featureData: any) => ({
          featureId: featureData.featureId,
          canView: featureData.canView,
          canAdd: featureData.canAdd,
          canEdit: featureData.canEdit,
          canDelete: featureData.canDelete
        }));
      });

      const payload = {
        email: formValue.email,
        fullName: formValue.fullName,
        phoneNumber: formValue.phoneNumber,
        specialization: formValue.specialization,
        roleId: formValue.roleId,
        clinicSites: clinicSitesData,
        access: accessDict // build from UI permissions
      };
      this.clinicService.saveDoctor(payload).subscribe({
        next: () => {
          this.loader.hide();
          this.openDialog();
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Error:', err);
          this.snack.open('Error: ' + (err.error?.message || ''), 'Close', { duration: 3000 });
          this.loader.hide();
        }
      });
    }
  }

  openDialog() {
    this.dialog.open(this.siteAccessDialog, {
      data: {} // optional, if you want to pass data
    });
  }
}
