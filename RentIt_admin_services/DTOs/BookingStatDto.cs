namespace RentIt_admin_services.DTOs
{
    public class BookingStatDto
    {
        public string Period { get; set; } = string.Empty; // e.g., 2026-01-01 or 2026-01
        public int Count { get; set; }
    }
}
