export interface AuditableEntity {
  created_at?: Date | null;
  created_by: string;
  updated_at?: Date | null;
  updated_by: string;
}