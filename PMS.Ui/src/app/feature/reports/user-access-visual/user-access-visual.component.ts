import { Component, inject } from '@angular/core';
import { ReportsUiService } from '../reports-ui.service';
import { CommonModule } from '@angular/common';
import { GroupByFeaturePermissionPipe } from '../pipes/group-by-feature-permission.pipe';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-user-access-visual',
  standalone: true,
  templateUrl: './user-access-visual.component.html',
  styleUrls: ['./user-access-visual.component.scss'],
  imports: [CommonModule, GroupByFeaturePermissionPipe, NgxChartsModule]
})
export class UserAccessVisualComponent {
    private reportsUiService = inject(ReportsUiService);
    userAccesses$ = this.reportsUiService.getUserAccesses();
}
