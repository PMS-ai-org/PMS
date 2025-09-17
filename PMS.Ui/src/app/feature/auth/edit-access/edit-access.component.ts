import { Component, signal, TemplateRef, ViewChild } from '@angular/core';
import { ClinicService } from '../../../core/auth/clinic.service';
import { MaterialModule } from '../../../core/shared/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../../services/loader.service';
@Component({
  selector: 'pms-edit-access',
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './edit-access.component.html',
  styleUrl: './edit-access.component.scss'
})
export class EditAccess {
  @ViewChild('siteAccessDialog') siteAccessDialog!: TemplateRef<any>;
  staffList = signal(new MatTableDataSource());
  selectedStaff: any | null = null;
  patientAccess = signal(new MatTableDataSource());
  displayedColumns: string[] = ['staffName', 'canView', 'canEdit', 'canDelete'];

  siteGroupForm!: FormGroup;
  constructor(private clinicService: ClinicService, private dialog: MatDialog,
    private loader: LoaderService
  ) { }

  ngOnInit(): void {
    this.siteGroupForm = new FormGroup({
      staffArray: new FormArray([])
    });

    this.loadStaff();
  }


  loadStaff() {
    this.loader.show();
    this.clinicService.getStaffList().subscribe((res: any[]) => {
      this.staffList.set(new MatTableDataSource(res));
      this.loader.hide();
    },
      (err) => {
        console.error('Error:', err);
        this.loader.hide();
      });
  }


  get sitesFormArray(): FormArray {
    return this.siteGroupForm.get('staffArray') as FormArray;
  }

  onSelectStaff(staff: any) {
    if (this.dialog.openDialogs.length > 0) {
    return;
    }

    this.selectedStaff = staff;
    this.clinicService.getStaffPermission(staff.userId).subscribe((res: any[]) => {
      this.patientAccess.set(new MatTableDataSource(res));
      this.sitesFormArray.clear();

      const siteData = this.patientAccess().data[0] as any;

      const sites = siteData?.sites as any[];
      sites?.sort((a, b) => a.siteName.localeCompare(b.siteName))?.forEach((id: any) => {
        const featuresArray = new FormArray(
          id?.features.map((f: any) => new FormGroup({
            featureId: new FormControl(f.featureId),
            featureName: new FormControl(f.featureName),
            canView: new FormControl(f.canView),
            canAdd: new FormControl(f.canAdd),
            canEdit: new FormControl(f.canEdit),
            canDelete: new FormControl(f.canDelete),
            userAccessId: new FormControl(f.userAccessId),
          }))
        );

        this.sitesFormArray.push(
          new FormGroup({
            siteId: new FormControl(id.siteId),
            siteName: new FormControl(id.siteName),
            features: featuresArray
          })
        );
      });
      this.openDialog();
    });
  }

  openDialog() {
     // Prevent multiple dialogs from opening
    if (this.dialog.openDialogs.length > 0) {
      return;
    }
    this.dialog.open(this.siteAccessDialog, {
      width: '800px',
      data: {} // optional, if you want to pass data
    });
  }

  get sitesDataSource() {
    return this.sitesFormArray.controls.slice();
  }
  onSubmit() {
    
    const formValue = this.siteGroupForm.value;
    // Create dictionary of siteId -> feature permissions
    const payloadData: any[] = [];

    formValue.staffArray.forEach((staffData: any) => {
      staffData.features.forEach((feature: any) => {
        payloadData.push({
          userAccessId: feature.userAccessId,
          featureId: feature.featureId,
          canView: feature.canView,
          canAdd: feature.canAdd,
          canEdit: feature.canEdit,
          canDelete: feature.canDelete
        });
      });
    });
     this.loader.show();
    this.clinicService.savePermission(payloadData).subscribe((res: any) => {
      this.dialog.closeAll();
       this.loader.hide();
    },(err)=>{
      console.error('Error:', err);
       this.loader.hide();
    });

  }
}


