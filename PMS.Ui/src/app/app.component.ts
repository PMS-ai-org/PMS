import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MaterialModule } from './core/shared/material.module';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'pms-root',
  imports: [RouterOutlet, RouterModule, MaterialModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: { 'class': 'pms-root' }
})
export class AppComponent {
 auth = inject(AuthService);
}
