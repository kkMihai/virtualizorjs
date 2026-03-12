// VPS operation constants
export const VPS_CONSTANTS = {
  // Rebuild operation requires reos=1 flag
  REBUILD_REOS_FLAG: 1,
  // Migrate operation requires migrate=1 flag
  MIGRATE_FLAG: 1,
  // Migrate operation requires migrate_but=1 flag
  MIGRATE_BUT_FLAG: 1,
} as const;
