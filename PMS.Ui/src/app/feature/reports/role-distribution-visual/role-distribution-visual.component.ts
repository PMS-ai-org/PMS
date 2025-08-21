import { Component, inject } from '@angular/core';
import { ReportsUiService } from '../reports-ui.service';
import { CommonModule } from '@angular/common';
import { GroupByRolePipe } from '../pipes/group-by-role.pipe';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-role-distribution-visual',
  standalone: true,
  templateUrl: './role-distribution-visual.component.html',
  styleUrls: ['./role-distribution-visual.component.scss'],
  imports: [CommonModule, GroupByRolePipe, NgxChartsModule]
})
export class RoleDistributionVisualComponent {
    private reportsUiService = inject(ReportsUiService);
    roles$ = this.reportsUiService.getRoles();
}
