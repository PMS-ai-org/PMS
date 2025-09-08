export interface AuditableEntity {
  created_at?: Date | null;
  created_by?: string | null;
  updated_at?: Date | null;
  updated_by?: string |null;
}