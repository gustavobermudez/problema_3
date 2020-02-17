package org.example.repository;

import org.example.domain.FileContent;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the FileContent entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FileContentRepository extends JpaRepository<FileContent, Long> {

}
