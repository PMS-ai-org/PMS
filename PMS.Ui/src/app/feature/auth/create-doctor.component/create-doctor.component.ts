import { Component, OnInit, signal } from '@angular/core';
import { MaterialModule } from '../../../core/shared/material.module';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClinicService } from '../../../core/auth/clinic.service';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'pms-create-doctor',
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-doctor.component.html',
  styleUrl: './create-doctor.component.scss'
})
export class CreateDoctorComponent implements OnInit {

  constructor(private clinicService: ClinicService) { }

  doctorForm!: FormGroup;
  clinics: any[] = [];
  sites: any[] = [];
  roles: any[] = [];
  features: any[] = [];
  displayedColumns: string[] = ['siteName', 'canView', 'canAdd', 'canEdit', 'canDelete'];
  roleText = '';

  ngOnInit(): void {
    this.doctorForm = new FormGroup({
      username: new FormControl('', Validators.required),
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

        console.log({ clinics, roles, features });
      },
      error: (err) => console.error('Error loading data:', err)
    });
  }

  onRoleChange(roleId: string) {
    this.roleText = this.roles.find(role => role.roleId === roleId)?.roleName || '';
  }

  onClinicChange(clinicId: string) {
    this.clinicService.getSitesByClinic(clinicId).subscribe(data => {
      this.sites = data;
    });
  }

  get sitesFormArray(): FormArray {
    return this.doctorForm.get('sites') as FormArray;
  }

  onSitesChange(selectedSiteIds: string[]): void {
    this.sitesFormArray.clear();

    selectedSiteIds.forEach(id => {
      const site = this.sites.find(s => s.id === id);
      if (site) {
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
      }
    });
  }

  get sitesDataSource() {
    return this.sitesFormArray.controls.slice();
  }


  onSubmit() {
    if (this.doctorForm.valid) {
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
        username: formValue.username,
        email: formValue.email,
        fullName: formValue.fullName,
        phoneNumber: formValue.phoneNumber,
        specialization: formValue.specialization,
        roleId: formValue.roleId,
        clinicSites: clinicSitesData,
        access: accessDict // build from UI permissions
      };
      this.clinicService.saveDoctor(payload).subscribe({
        next: () => alert('Doctor registered successfully!'),
        error: (err) => console.error('Error:', err)
      });
    }
  }
}
