package com.rentit.repositories;

import com.rentit.entities.BookingRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRecordRepository extends JpaRepository<BookingRecord, Integer> {
}
