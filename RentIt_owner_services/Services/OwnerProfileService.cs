using Microsoft.EntityFrameworkCore;
using RentIt_owner_services.DTOs;
using RentIt_owner_services.Models;
using RentIt_owner_services.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RentIt_owner_services.Services
{
    public class OwnerProfileService : IOwnerProfileService
    {
        private readonly P20RentitContext _context;

        public OwnerProfileService(P20RentitContext context)
        {
            _context = context;
        }

        public async Task<OwnerProfileDTO> GetOwnerProfile(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Area)
                    .ThenInclude(a => a.City)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null) return null;

            return new OwnerProfileDTO
            {
                UserId = user.UserId,
                Fname = user.Fname,
                Mname = user.Mname,
                Lname = user.Lname,
                Email = user.Email,
                Phone = user.Phone,
                DrivingLicenceNo = user.DrivingLicenceNo,
                AdharNo = user.AdharNo,
                PanNo = user.PanNo,
                Address = user.Address,
                AreaId = user.AreaId,
                AreaName = user.Area?.AreaName,
                CityId = user.Area?.CityId ?? 0,
                CityName = user.Area?.City?.CityName,
                Pincode = user.Area?.Pincode,
                ApprovalStatus = user.ApprovalStatus
            };
        }

        public async Task<bool> UpdateOwnerProfile(int userId, UpdateProfileDTO updateDto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            user.Phone = updateDto.Phone;
            user.Address = updateDto.Address;
            user.AreaId = updateDto.AreaId;

            _context.Users.Update(user);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<CityDTO>> GetCities()
        {
            return await _context.Cities
                .Select(c => new CityDTO
                {
                    CityId = c.CityId,
                    CityName = c.CityName
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<AreaDTO>> GetAreasByCity(int cityId)
        {
            return await _context.Areas
                .Where(a => a.CityId == cityId)
                .Select(a => new AreaDTO
                {
                    AreaId = a.AreaId,
                    AreaName = a.AreaName,
                    Pincode = a.Pincode,
                    CityId = a.CityId
                })
                .ToListAsync();
        }
    }
}
