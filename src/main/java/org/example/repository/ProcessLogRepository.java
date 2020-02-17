package org.example.repository;

import org.example.domain.ProcessLog;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the ProcessLog entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProcessLogRepository extends JpaRepository<ProcessLog, Long> {

}
