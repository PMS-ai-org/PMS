import { Pipe, PipeTransform } from '@angular/core';
import { Role } from '../../../models/role.model';

export interface RoleGroup {
  name: string;
  value: number;
}

@Pipe({ name: 'groupByRole', standalone: true })
export class GroupByRolePipe implements PipeTransform {
  transform(roles: Role[]): RoleGroup[] {
    if (!roles) return [];
    const grouped: { [key: string]: number } = {};
    roles.forEach(r => {
      const role = r.RoleName || 'Unknown';
      grouped[role] = (grouped[role] || 0) + 1;
    });
    return Object.keys(grouped).map(role => ({ name: role, value: grouped[role] }));
  }
}
