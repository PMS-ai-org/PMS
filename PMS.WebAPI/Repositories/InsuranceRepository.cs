using Microsoft.EntityFrameworkCore;
using PMS.WebAPI.Data;
using PMS.WebAPI.Models;

namespace PMS.WebAPI.Repositories
{
    public class InsuranceRepository : IInsuranceRepository
    {
        private readonly PmsDbContext _context;

        public InsuranceRepository(PmsDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<InsuranceProvider>> GetProvidersAsync()
        {
            return await _context.InsuranceProviders.ToListAsync();
        }

        public async Task<IEnumerable<InsurancePlan>> GetPlansAsync()
        {
            return await _context.InsurancePlans.ToListAsync();
        }

        public Task<InsuranceProvider?> GetProviderAsync(Guid id)
        {
            return _context.InsuranceProviders.FirstOrDefaultAsync(p => p.id == id);
        }

        // public async Task<IEnumerable<InsurancePlan>> GetPlansByProviderAsync(Guid providerId)
        // {
        //     return await _context.InsurancePlans
        //         .Where(p => p.ProviderId == providerId)
        //         .OrderBy(p => p.Name)
        //         .ToListAsync();
        // }
        
        public Task<InsurancePlan?> GetPlanAsync(Guid id)
        {
            return _context.InsurancePlans.FirstOrDefaultAsync(p => p.id == id);
        }

        public async Task<IEnumerable<PatientInsurance>> GetPatientInsurancesAsync(Guid patientId)
        {
            return await _context.PatientInsurances
                .Include(pi => pi.provider)
                .Include(pi => pi.plan)
                .Where(pi => pi.patientId == patientId)
                .OrderBy(pi => pi.priority)
                .ToListAsync();
        }

        public Task<PatientInsurance?> GetPatientInsuranceAsync(Guid id)
        {
            return _context.PatientInsurances
                .Include(pi => pi.provider)
                .Include(pi => pi.plan)
                .FirstOrDefaultAsync(pi => pi.id == id);
        }

        public async Task<PatientInsurance> AddPatientInsuranceAsync(PatientInsurance entity)
        {
            if (entity.isPrimary)
            {
                var others = await _context.PatientInsurances
                    .Where(pi => pi.patientId == entity.patientId && pi.isPrimary)
                    .ToListAsync();
                foreach (var o in others) o.isPrimary = false;
            }

            // Auto-assign priority if not provided
            if (!entity.priority.HasValue)
            {
                var maxPriority = await _context.PatientInsurances
                    .Where(pi => pi.patientId == entity.patientId)
                    .MaxAsync(pi => (short?)pi.priority) ?? (short)0;
                entity.priority = (short)(maxPriority + 1);
            }

            _context.PatientInsurances.Add(entity);
            // Mark patient as having insurance
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.id == entity.patientId);
            if (patient != null && !patient.hasInsurance.HasValue)
            {
                patient.hasInsurance = true;
                patient.insuranceId = entity.id;

            }
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<PatientInsurance?> UpdatePatientInsuranceAsync(Guid id, PatientInsurance entity)
        {
            var existing = await _context.PatientInsurances.FindAsync(id);
            if (existing == null) return null;

            bool becomingPrimary = entity.isPrimary && !existing.isPrimary;

            existing.patientId = entity.patientId;
            existing.providerId = entity.providerId;
            existing.planId = entity.planId;
            existing.policyNumber = entity.policyNumber;
            existing.memberId = entity.memberId;
            existing.isPrimary = entity.isPrimary;
            existing.effectiveDate = entity.effectiveDate;
            existing.expirationDate = entity.expirationDate;
            existing.priority = entity.priority ?? existing.priority;

            if (becomingPrimary)
            {
                var others = await _context.PatientInsurances
                    .Where(pi => pi.patientId == existing.patientId && pi.id != existing.id && pi.isPrimary)
                    .ToListAsync();
                foreach (var o in others) o.isPrimary = false;
            }

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeletePatientInsuranceAsync(Guid id)
        {
            var existing = await _context.PatientInsurances.FindAsync(id);
            if (existing == null) return false;
            _context.PatientInsurances.Remove(existing);
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.id == existing.patientId);
            if (patient != null && patient.hasInsurance.HasValue && patient.hasInsurance.Value)
            {
                patient.hasInsurance = false;
                patient.insuranceId = null;
            }
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
