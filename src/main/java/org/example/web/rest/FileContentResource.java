package org.example.web.rest;

import org.example.domain.FileContent;
import org.example.repository.FileContentRepository;
import org.example.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * REST controller for managing {@link org.example.domain.FileContent}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FileContentResource {

    private final Logger log = LoggerFactory.getLogger(FileContentResource.class);

    private static final String ENTITY_NAME = "fileContent";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FileContentRepository fileContentRepository;

    public FileContentResource(FileContentRepository fileContentRepository) {
        this.fileContentRepository = fileContentRepository;
    }

    /**
     * {@code POST  /file-contents} : Create a new fileContent.
     *
     * @param fileContent the fileContent to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new fileContent, or with status {@code 400 (Bad Request)} if the fileContent has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/file-contents")
    public ResponseEntity<FileContent> createFileContent(@Valid @RequestBody FileContent fileContent) throws URISyntaxException {
        log.debug("REST request to save FileContent : {}", fileContent);
        if (fileContent.getId() != null) {
            throw new BadRequestAlertException("A new fileContent cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FileContent result = fileContentRepository.save(fileContent);
        return ResponseEntity.created(new URI("/api/file-contents/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /file-contents} : Updates an existing fileContent.
     *
     * @param fileContent the fileContent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fileContent,
     * or with status {@code 400 (Bad Request)} if the fileContent is not valid,
     * or with status {@code 500 (Internal Server Error)} if the fileContent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/file-contents")
    public ResponseEntity<FileContent> updateFileContent(@Valid @RequestBody FileContent fileContent) throws URISyntaxException {
        log.debug("REST request to update FileContent : {}", fileContent);
        if (fileContent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        FileContent result = fileContentRepository.save(fileContent);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, fileContent.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /file-contents} : get all the fileContents.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of fileContents in body.
     */
    @GetMapping("/file-contents")
    public List<FileContent> getAllFileContents(@RequestParam(required = false) String filter) {
        if ("processlog-is-null".equals(filter)) {
            log.debug("REST request to get all FileContents where processLog is null");
            return StreamSupport
                .stream(fileContentRepository.findAll().spliterator(), false)
                .filter(fileContent -> fileContent.getProcessLog() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all FileContents");
        return fileContentRepository.findAll();
    }

    /**
     * {@code GET  /file-contents/:id} : get the "id" fileContent.
     *
     * @param id the id of the fileContent to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the fileContent, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/file-contents/{id}")
    public ResponseEntity<FileContent> getFileContent(@PathVariable Long id) {
        log.debug("REST request to get FileContent : {}", id);
        Optional<FileContent> fileContent = fileContentRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(fileContent);
    }

    /**
     * {@code DELETE  /file-contents/:id} : delete the "id" fileContent.
     *
     * @param id the id of the fileContent to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/file-contents/{id}")
    public ResponseEntity<Void> deleteFileContent(@PathVariable Long id) {
        log.debug("REST request to delete FileContent : {}", id);
        fileContentRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
