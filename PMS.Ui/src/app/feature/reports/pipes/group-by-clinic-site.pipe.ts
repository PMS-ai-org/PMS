import { Pipe, PipeTransform } from '@angular/core';
import { Appointment } from '../../../models/appointment.model';

export interface ClinicSiteGroup {
  name: string;
  value: number;
}

@Pipe({ name: 'groupByClinicSite', standalone: true })
export class GroupByClinicSitePipe implements PipeTransform {
  transform(appointments: Appointment[]): ClinicSiteGroup[] {
    if (!appointments) return [];
    const grouped: { [key: string]: number } = {};
    appointments.forEach(a => {
      const key = `${a.clinic_id || 'Unknown'} - ${a.site_id || 'Unknown'}`;
      grouped[key] = (grouped[key] || 0) + 1;
    });
    return Object.keys(grouped).map(key => ({ name: key, value: grouped[key] }));
  }
}
