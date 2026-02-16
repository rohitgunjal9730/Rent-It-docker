using System.Linq;
using RentIt_admin_services.DTOs;
using RentIt_admin_services.Models;
using RentIt_admin_services.Models.Enums;
using RentIt_admin_services.Repositories.Interfaces;
using RentIt_admin_services.Servises.Interfaces;

namespace RentIt_admin_services.Servises
{
    public class VehicleTypeService : IVehicleTypeService
    {
        private readonly IVehicleTypeRepository _repository;

        public VehicleTypeService(IVehicleTypeRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<VehicleTypeResponse>> GetAllVehicleTypesAsync()
        {
            var vehicleTypes = await _repository.GetAllAsync();
            
            return vehicleTypes.Select(vt => new VehicleTypeResponse
            {
                VehicleTypeId = vt.VehicleTypeId,
                VehicleTypeName = vt.VehicleTypeName ?? string.Empty,
                Rate = vt.Rate ?? 0,
                Deposite = vt.Deposit ?? 0,
                PriceUnit = vt.PriceUnit ?? string.Empty,
                Message = string.Empty
            }).ToList();
        }

        public async Task<VehicleTypeResponse> GetVehicleTypeByIdAsync(int vehicleTypeId)
        {
            var vehicleType = await _repository.GetByIdAsync(vehicleTypeId);
            
            if (vehicleType == null)
            {
                throw new KeyNotFoundException($"Vehicle type with ID {vehicleTypeId} not found");
            }

            return new VehicleTypeResponse
            {
                VehicleTypeId = vehicleType.VehicleTypeId,
                VehicleTypeName = vehicleType.VehicleTypeName ?? string.Empty,
                Rate = vehicleType.Rate ?? 0,
                Deposite = vehicleType.Deposit ?? 0,
                PriceUnit = vehicleType.PriceUnit ?? string.Empty,
                Message = string.Empty
            };
        }

        public async Task<VehicleTypeResponse> AddVehicleTypeAsync(AddVehicleTypeRequest request)
        {
            // Validation: VehicleTypeName cannot be empty
            if (string.IsNullOrWhiteSpace(request.VehicleTypeName))
            {
                throw new ArgumentException("Vehicle type name cannot be empty");
            }

            // Validation: Rate must be greater than 0
            if (request.Rate <= 0)
            {
                throw new ArgumentException("Rate must be greater than 0");
            }

            // Validation: Deposite must be >= 0
            if (request.Deposite < 0)
            {
                throw new ArgumentException("Deposit must be greater than or equal to 0");
            }

            // Validation: PriceUnit must be valid enum value (case-insensitive)
            if (!Enum.TryParse<PriceUnit>(request.PriceUnit, true, out var priceUnitEnum))
            {
                throw new ArgumentException($"Invalid price unit. Valid values are: {string.Join(", ", Enum.GetNames(typeof(PriceUnit)))}");
            }

            // Check for duplicate VehicleTypeId
            if (await _repository.ExistsAsync(request.VehicleTypeId))
            {
                throw new InvalidOperationException($"Vehicle type with ID {request.VehicleTypeId} already exists");
            }

            // Create new VehicleType entity
            var vehicleType = new VehicleType
            {
                VehicleTypeId = request.VehicleTypeId,
                VehicleTypeName = request.VehicleTypeName,
                Rate = request.Rate,
                Deposit = request.Deposite,
                PriceUnit = priceUnitEnum.ToString()
            };

            await _repository.AddAsync(vehicleType);
            await _repository.SaveChangesAsync();

            return new VehicleTypeResponse
            {
                VehicleTypeId = vehicleType.VehicleTypeId,
                VehicleTypeName = vehicleType.VehicleTypeName,
                Rate = vehicleType.Rate ?? 0,
                Deposite = vehicleType.Deposit ?? 0,
                PriceUnit = vehicleType.PriceUnit ?? string.Empty,
                Message = "Vehicle type added successfully"
            };
        }

        public async Task<VehicleTypeResponse> EditVehicleTypeAsync(EditVehicleTypeRequest request)
        {
            // Validation: VehicleTypeName cannot be empty
            if (string.IsNullOrWhiteSpace(request.VehicleTypeName))
            {
                throw new ArgumentException("Vehicle type name cannot be empty");
            }

            // Validation: Rate must be greater than 0
            if (request.Rate <= 0)
            {
                throw new ArgumentException("Rate must be greater than 0");
            }

            // Validation: Deposite must be >= 0
            if (request.Deposite < 0)
            {
                throw new ArgumentException("Deposit must be greater than or equal to 0");
            }

            // Validation: PriceUnit must be valid enum value (case-insensitive)
            if (!Enum.TryParse<PriceUnit>(request.PriceUnit, true, out var priceUnitEnum))
            {
                throw new ArgumentException($"Invalid price unit. Valid values are: {string.Join(", ", Enum.GetNames(typeof(PriceUnit)))}");
            }

            // Check if vehicle type exists
            var vehicleType = await _repository.GetByIdAsync(request.VehicleTypeId);
            if (vehicleType == null)
            {
                throw new KeyNotFoundException($"Vehicle type with ID {request.VehicleTypeId} not found");
            }

            // Update vehicle type properties
            vehicleType.VehicleTypeName = request.VehicleTypeName;
            vehicleType.Rate = request.Rate;
            vehicleType.Deposit = request.Deposite;
            vehicleType.PriceUnit = priceUnitEnum.ToString();

            await _repository.UpdateAsync(vehicleType);
            await _repository.SaveChangesAsync();

            return new VehicleTypeResponse
            {
                VehicleTypeId = vehicleType.VehicleTypeId,
                VehicleTypeName = vehicleType.VehicleTypeName,
                Rate = vehicleType.Rate ?? 0,
                Deposite = vehicleType.Deposit ?? 0,
                PriceUnit = vehicleType.PriceUnit ?? string.Empty,
                Message = "Vehicle type updated successfully"
            };
        }
    }
}
