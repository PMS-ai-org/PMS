import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MaterialModule } from './core/shared/material.module';
import { AuthService } from './core/auth/auth.service';
import { SearchPatientResponse, SearchPatientResult } from './services/search-patient.service';
import { SearchPatientComponent } from "./feature/patient-search/search-patient/search-patient.component";

@Component({
  selector: 'pms-root',
  standalone: true,                         
  imports: [RouterOutlet, RouterModule, MaterialModule, SearchPatientComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: { 'class': 'pms-root' }
})
export class AppComponent {
  auth = inject(AuthService);

  // Use the item type, not the response type
  rows: SearchPatientResult[] = [];

  onResults(res: SearchPatientResponse) {
    this.rows = res.items ?? [];
  }

  onPicked(p: SearchPatientResult) {
    console.log('Picked patient:', p);
    // TODO: navigate later: this.router.navigate(['/patients', p.id]);
  }
}
