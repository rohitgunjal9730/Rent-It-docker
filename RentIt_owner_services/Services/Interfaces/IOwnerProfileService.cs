using System.Collections.Generic;
using System.Threading.Tasks;
using RentIt_owner_services.DTOs;

namespace RentIt_owner_services.Services.Interfaces
{
    public interface IOwnerProfileService
    {
        Task<OwnerProfileDTO> GetOwnerProfile(int userId);
        Task<bool> UpdateOwnerProfile(int userId, UpdateProfileDTO updateDto);
        Task<IEnumerable<CityDTO>> GetCities();
        Task<IEnumerable<AreaDTO>> GetAreasByCity(int cityId);
    }
}
