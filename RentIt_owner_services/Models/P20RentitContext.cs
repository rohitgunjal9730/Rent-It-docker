using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace RentIt_owner_services.Models;

public partial class P20RentitContext : DbContext
{
    public P20RentitContext()
    {
    }

    public P20RentitContext(DbContextOptions<P20RentitContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Area> Areas { get; set; }

    public virtual DbSet<Booking> Bookings { get; set; }

    public virtual DbSet<BookingRecord> BookingRecords { get; set; }

    public virtual DbSet<Brand> Brands { get; set; }

    public virtual DbSet<City> Cities { get; set; }

    public virtual DbSet<FuelType> FuelTypes { get; set; }

    public virtual DbSet<Model> Models { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<SecurityQuestion> SecurityQuestions { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Vehicle> Vehicles { get; set; }

    public virtual DbSet<VehicleImage> VehicleImages { get; set; }

    public virtual DbSet<VehicleType> VehicleTypes { get; set; }

        // Hardcoded connection removed - using DI from Program.cs instead
        // => optionsBuilder.UseMySql("server=localhost;port=3306;user=root;password=root;database=p20_rentit", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.2.0-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Area>(entity =>
        {
            entity.HasKey(e => e.AreaId).HasName("PRIMARY");

            entity.ToTable("area");

            entity.HasIndex(e => e.CityId, "city_id_fk_idx");

            entity.Property(e => e.AreaId).HasColumnName("area_id");
            entity.Property(e => e.AreaName)
                .HasMaxLength(255)
                .HasColumnName("area_name");
            entity.Property(e => e.CityId).HasColumnName("city_id");
            entity.Property(e => e.Pincode)
                .HasMaxLength(255)
                .HasColumnName("pincode");

            entity.HasOne(d => d.City).WithMany(p => p.Areas)
                .HasForeignKey(d => d.CityId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("city_id_fk");
        });

        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(e => e.BookingId).HasName("PRIMARY");

            entity.ToTable("booking");

            entity.HasIndex(e => e.UserId, "user_id_fk_idx");

            entity.HasIndex(e => e.VehicleId, "vehicle_id_fk_idx");

            entity.Property(e => e.BookingId).HasColumnName("booking_id");
            entity.Property(e => e.BookingDate)
                .HasColumnType("datetime")
                .HasColumnName("booking_date");
            entity.Property(e => e.BookingStatus)
                .HasDefaultValueSql("'PENDING'")
                .HasColumnType("enum('PENDING','SUCCESS','FAILED','REFUNDED')")
                .HasColumnName("booking_status");
            entity.Property(e => e.EndDate).HasColumnName("end_date");
            entity.Property(e => e.PaidAmount)
                .HasPrecision(10, 2)
                .HasColumnName("paid_amount");
            entity.Property(e => e.PaymentStatus)
                .HasDefaultValueSql("'PENDING'")
                .HasColumnType("enum('PENDING','SUCCESS','FAILED','REFUNDED')")
                .HasColumnName("payment_status");
            entity.Property(e => e.StartingDate).HasColumnName("starting_date");
            entity.Property(e => e.TotalAmount)
                .HasPrecision(10, 2)
                .HasColumnName("total_amount");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.VehicleId).HasColumnName("vehicle_id");
            entity.Property(e => e.PickupTime).HasColumnName("pickup_time");
            entity.Property(e => e.ReturnTime).HasColumnName("return_time");
            entity.Property(e => e.DepositAmount).HasColumnName("deposit_amount");

            entity.HasOne(d => d.User).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("user_id_fk");

            entity.HasOne(d => d.Vehicle).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.VehicleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("vehicle_id_fk");
        });

        modelBuilder.Entity<BookingRecord>(entity =>
        {
            entity.HasKey(e => e.RecordId).HasName("PRIMARY");

            entity.ToTable("booking_record");

            entity.HasIndex(e => e.BookingId, "fk_br_booking");

            entity.Property(e => e.RecordId).HasColumnName("record_id");
            entity.Property(e => e.ActionDatetime)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("action_datetime");
            entity.Property(e => e.BookingId).HasColumnName("booking_id");
            entity.Property(e => e.VehicleStatus)
                .HasColumnType("enum('Booked','Picked','Returned','Cancelled')")
                .HasColumnName("vehicle_status");

            entity.HasOne(d => d.Booking).WithMany(p => p.BookingRecords)
                .HasForeignKey(d => d.BookingId)
                .HasConstraintName("fk_br_booking");
        });

        modelBuilder.Entity<Brand>(entity =>
        {
            entity.HasKey(e => e.BrandId).HasName("PRIMARY");

            entity.ToTable("brands");

            entity.Property(e => e.BrandId)
                .ValueGeneratedNever()
                .HasColumnName("brand_id");
            entity.Property(e => e.Brand1)
                .HasMaxLength(45)
                .HasColumnName("brand");
        });

        modelBuilder.Entity<City>(entity =>
        {
            entity.HasKey(e => e.CityId).HasName("PRIMARY");

            entity.ToTable("city");

            entity.Property(e => e.CityId).HasColumnName("city_id");
            entity.Property(e => e.CityName)
                .HasMaxLength(255)
                .HasColumnName("city_name");
        });

        modelBuilder.Entity<FuelType>(entity =>
        {
            entity.HasKey(e => e.FuelId).HasName("PRIMARY");

            entity.ToTable("fuel_type");

            entity.Property(e => e.FuelId)
                .ValueGeneratedNever()
                .HasColumnName("fuel_id");
            entity.Property(e => e.FuelType1)
                .HasMaxLength(45)
                .HasColumnName("fuel_type");
        });

        modelBuilder.Entity<Model>(entity =>
        {
            entity.HasKey(e => e.ModelId).HasName("PRIMARY");

            entity.ToTable("models");

            entity.HasIndex(e => e.BrandId, "model_id_fk");

            entity.Property(e => e.ModelId).HasColumnName("model_id");
            entity.Property(e => e.BrandId).HasColumnName("brand_id");
            entity.Property(e => e.Model1)
                .HasMaxLength(45)
                .HasColumnName("model");

            entity.HasOne(d => d.Brand).WithMany(p => p.Models)
                .HasForeignKey(d => d.BrandId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("model_id_fk");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PRIMARY");

            entity.ToTable("payment");

            entity.HasIndex(e => e.BookingId, "fk_payment_booking_idx");

            entity.Property(e => e.PaymentId).HasColumnName("payment_id");
            entity.Property(e => e.BookingId).HasColumnName("booking_id");
            entity.Property(e => e.PaymentAmount)
                .HasPrecision(10, 2)
                .HasColumnName("payment_amount");
            entity.Property(e => e.PaymentDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("payment_date");
            entity.Property(e => e.PaymentMethod)
                .HasColumnType("enum('UPI','Card','NetBanking','Cash')")
                .HasColumnName("payment_method");
            entity.Property(e => e.PaymentStatus)
                .HasDefaultValueSql("'Pending'")
                .HasColumnType("enum('Pending','Success','Failed','Refunded')")
                .HasColumnName("payment_status");
            entity.Property(e => e.PaymentType)
                .HasColumnType("enum('DEPOSIT','FINAL','REFUND')")
                .HasColumnName("payment_type");
            entity.Property(e => e.TransactionId)
                .HasMaxLength(100)
                .HasColumnName("transaction_id");

            entity.HasOne(d => d.Booking).WithMany(p => p.Payments)
                .HasForeignKey(d => d.BookingId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_payment_booking");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PRIMARY");

            entity.ToTable("role");

            entity.Property(e => e.RoleId)
                .ValueGeneratedNever()
                .HasColumnName("role_id");
            entity.Property(e => e.RoleName)
                .HasMaxLength(255)
                .HasColumnName("role_name");
        });

        modelBuilder.Entity<SecurityQuestion>(entity =>
        {
            entity.HasKey(e => e.QuestionId).HasName("PRIMARY");

            entity.ToTable("security_question");

            entity.Property(e => e.QuestionId)
                .ValueGeneratedNever()
                .HasColumnName("question_id");
            entity.Property(e => e.Question)
                .HasMaxLength(255)
                .HasColumnName("question");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PRIMARY");

            entity.ToTable("user");

            entity.HasIndex(e => e.Email, "UKob8kqyqqgmefl0aco34akdtpe").IsUnique();

            entity.HasIndex(e => e.AreaId, "area_id_fk_idx");

            entity.HasIndex(e => e.DrivingLicenceNo, "driving_licence_no_UNIQUE").IsUnique();

            entity.HasIndex(e => e.PanNo, "pan_no_UNIQUE").IsUnique();

            entity.HasIndex(e => e.QuestionId, "question_id_fk_idx");

            entity.HasIndex(e => e.RoleId, "role_id_fk_idx");

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Address)
                .HasMaxLength(255)
                .HasColumnName("address");
            entity.Property(e => e.AdharNo)
                .HasMaxLength(255)
                .HasColumnName("adhar_no");
            entity.Property(e => e.Answer)
                .HasMaxLength(255)
                .HasColumnName("answer");
            entity.Property(e => e.ApprovalStatus)
                .HasColumnType("enum('APPROVED','REJECTED')")
                .HasColumnName("approval_status");
            entity.Property(e => e.AreaId).HasColumnName("area_id");
            entity.Property(e => e.DrivingLicenceNo).HasColumnName("driving_licence_no");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.Fname)
                .HasMaxLength(255)
                .HasColumnName("fname");
            entity.Property(e => e.IsActive)
                .HasColumnType("varchar(50)")
                .HasColumnName("is_active");
            entity.Property(e => e.Lname)
                .HasMaxLength(255)
                .HasColumnName("lname");
            entity.Property(e => e.Mname)
                .HasMaxLength(255)
                .HasColumnName("mname");
            entity.Property(e => e.PanNo).HasColumnName("pan_no");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .HasColumnName("password");
            entity.Property(e => e.Phone)
                .HasMaxLength(255)
                .HasColumnName("phone");
            entity.Property(e => e.QuestionId).HasColumnName("question_id");
            entity.Property(e => e.RoleId).HasColumnName("role_id");

            entity.HasOne(d => d.Area).WithMany(p => p.Users)
                .HasForeignKey(d => d.AreaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("area_id_fk");

            entity.HasOne(d => d.Question).WithMany(p => p.Users)
                .HasForeignKey(d => d.QuestionId)
                .HasConstraintName("question_id_fk");

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("role_id_fk");
        });

        modelBuilder.Entity<Vehicle>(entity =>
        {
            entity.HasKey(e => e.VehicleId).HasName("PRIMARY");

            entity.ToTable("vehicle");

            entity.HasIndex(e => e.FuelTypeId, "fuel_id_fk_idx");

            entity.HasIndex(e => e.ModelId, "idx_vehicle_model_id");

            entity.HasIndex(e => e.OwnerId, "owner_id_fk_idx");

            entity.HasIndex(e => e.VehicleNumber, "vehicle_number_UNIQUE").IsUnique();

            entity.HasIndex(e => e.VehicleRcNumber, "vehicle_rc_number_UNIQUE").IsUnique();

            entity.HasIndex(e => e.VehicleTypeId, "vehicle_type_id_fk_idx");

            entity.Property(e => e.VehicleId).HasColumnName("vehicle_id");
            entity.Property(e => e.Ac).HasColumnName("ac");
            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .HasColumnName("description");
            entity.Property(e => e.FuelTypeId).HasColumnName("fuel_type_id");
            entity.Property(e => e.ModelId).HasColumnName("model_id");
            entity.Property(e => e.OwnerId).HasColumnName("owner_id");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'ACTIVE'")
                .HasColumnType("enum('ACTIVE','BLOCKED','MAINTENANCE')")
                .HasColumnName("status");
            entity.Property(e => e.VehicleNumber).HasColumnName("vehicle_number");
            entity.Property(e => e.VehicleRcNumber).HasColumnName("vehicle_rc_number");
            entity.Property(e => e.VehicleTypeId).HasColumnName("vehicle_type_id");

            entity.HasOne(d => d.FuelType).WithMany(p => p.Vehicles)
                .HasForeignKey(d => d.FuelTypeId)
                .HasConstraintName("fk_vehicle_fuel_type");

            entity.HasOne(d => d.Model).WithMany(p => p.Vehicles)
                .HasForeignKey(d => d.ModelId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_vehicle_model");

            entity.HasOne(d => d.Owner).WithMany(p => p.Vehicles)
                .HasForeignKey(d => d.OwnerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("owner_id_fk");

            entity.HasOne(d => d.VehicleType).WithMany(p => p.Vehicles)
                .HasForeignKey(d => d.VehicleTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("vehicle_type_id_fk");
        });

        modelBuilder.Entity<VehicleImage>(entity =>
        {
            entity.HasKey(e => e.VehicleImageId).HasName("PRIMARY");

            entity.ToTable("vehicle_image");

            entity.HasIndex(e => e.VehicleId, "vehicle_id_fk_idx");

            entity.Property(e => e.VehicleImageId).HasColumnName("vehicle_image_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Image)
                .HasColumnType("blob")
                .HasColumnName("image");
            entity.Property(e => e.IsPrimary).HasColumnName("is_primary");
            entity.Property(e => e.VehicleId).HasColumnName("vehicle_id");

            entity.HasOne(d => d.Vehicle).WithMany(p => p.VehicleImages)
                .HasForeignKey(d => d.VehicleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("vehicle_id_fk_i");
        });

        modelBuilder.Entity<VehicleType>(entity =>
        {
            entity.HasKey(e => e.VehicleTypeId).HasName("PRIMARY");

            entity.ToTable("vehicle_type");

            entity.HasIndex(e => e.VehicleTypeName, "vehicle_type_name_UNIQUE").IsUnique();

            entity.Property(e => e.VehicleTypeId).HasColumnName("vehicle_type_id");
            entity.Property(e => e.Deposit).HasColumnName("deposit");
            entity.Property(e => e.PriceUnit)
                .HasDefaultValueSql("'PER_DAY'")
                .HasColumnType("enum('PER_DAY','PER_HOUR')")
                .HasColumnName("price_unit");
            entity.Property(e => e.Rate).HasColumnName("rate");
            entity.Property(e => e.VehicleTypeName).HasColumnName("vehicle_type_name");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
