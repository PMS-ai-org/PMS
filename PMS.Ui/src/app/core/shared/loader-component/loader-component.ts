import { Component } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { of } from 'rxjs';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'pms-loader-component',
  imports: [MaterialModule],
  templateUrl: './loader-component.html',
  styleUrl: './loader-component.scss'
})
export class LoaderComponent {

  loading$ = of(false);

  constructor(private loaderService: LoaderService) {
    this.loading$ = this.loaderService.loading$;
  }
}
