import { Pipe, PipeTransform } from '@angular/core';
import { UserAccess } from '../../../models/user-access.model';

export interface FeaturePermissionGroup {
  name: string;
  value: number;
}

@Pipe({ name: 'groupByFeaturePermission', standalone: true })
export class GroupByFeaturePermissionPipe implements PipeTransform {
  transform(accesses: UserAccess[]): FeaturePermissionGroup[] {
    if (!accesses) return [];
    const grouped: { [key: string]: number } = {};
    accesses.forEach(a => {
      const key = `${a.FeatureId}`;
      const count = (a.CanAdd ? 1 : 0) + (a.CanEdit ? 1 : 0) + (a.CanDelete ? 1 : 0) + (a.CanView ? 1 : 0);
      grouped[key] = (grouped[key] || 0) + count;
    });
    return Object.keys(grouped).map(featureId => ({ name: featureId, value: grouped[featureId] }));
  }
}
