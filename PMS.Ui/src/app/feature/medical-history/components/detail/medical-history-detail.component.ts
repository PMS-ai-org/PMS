import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MedicalHistoryService } from '../../services/medical-history.service';
import { MedicalHistory } from '../../models/medical-history.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'pms-medical-history-detail',
  templateUrl: './medical-history-detail.component.html',
  imports: [
    CommonModule,
    FormsModule,
    // RouterModule.forChild(routes)
  ]
})
export class MedicalHistoryDetailComponent implements OnInit {
  record?: MedicalHistory;

  constructor(
    private route: ActivatedRoute,
    private service: MedicalHistoryService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.getById(id).subscribe(data => this.record = data);
    }
  }
}
