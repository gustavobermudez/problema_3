package org.example.web.rest;

import org.example.JhipsterSampleApplicationApp;
import org.example.domain.FileContent;
import org.example.domain.ProcessLog;
import org.example.repository.FileContentRepository;
import org.example.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;

import static org.example.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link FileContentResource} REST controller.
 */
@SpringBootTest(classes = JhipsterSampleApplicationApp.class)
public class FileContentResourceIT {

    private static final byte[] DEFAULT_FILE_DATA_CONTENT = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_FILE_DATA_CONTENT = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_FILE_DATA_CONTENT_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_FILE_DATA_CONTENT_CONTENT_TYPE = "image/png";

    @Autowired
    private FileContentRepository fileContentRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restFileContentMockMvc;

    private FileContent fileContent;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final FileContentResource fileContentResource = new FileContentResource(fileContentRepository);
        this.restFileContentMockMvc = MockMvcBuilders.standaloneSetup(fileContentResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FileContent createEntity(EntityManager em) {
        FileContent fileContent = new FileContent()
            .fileDataContent(DEFAULT_FILE_DATA_CONTENT)
            .fileDataContentContentType(DEFAULT_FILE_DATA_CONTENT_CONTENT_TYPE);
        // Add required entity
        ProcessLog processLog;
        if (TestUtil.findAll(em, ProcessLog.class).isEmpty()) {
            processLog = ProcessLogResourceIT.createEntity(em);
            em.persist(processLog);
            em.flush();
        } else {
            processLog = TestUtil.findAll(em, ProcessLog.class).get(0);
        }
        fileContent.setProcessLog(processLog);
        return fileContent;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FileContent createUpdatedEntity(EntityManager em) {
        FileContent fileContent = new FileContent()
            .fileDataContent(UPDATED_FILE_DATA_CONTENT)
            .fileDataContentContentType(UPDATED_FILE_DATA_CONTENT_CONTENT_TYPE);
        // Add required entity
        ProcessLog processLog;
        if (TestUtil.findAll(em, ProcessLog.class).isEmpty()) {
            processLog = ProcessLogResourceIT.createUpdatedEntity(em);
            em.persist(processLog);
            em.flush();
        } else {
            processLog = TestUtil.findAll(em, ProcessLog.class).get(0);
        }
        fileContent.setProcessLog(processLog);
        return fileContent;
    }

    @BeforeEach
    public void initTest() {
        fileContent = createEntity(em);
    }

    @Test
    @Transactional
    public void createFileContent() throws Exception {
        int databaseSizeBeforeCreate = fileContentRepository.findAll().size();

        // Create the FileContent
        restFileContentMockMvc.perform(post("/api/file-contents")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(fileContent)))
            .andExpect(status().isCreated());

        // Validate the FileContent in the database
        List<FileContent> fileContentList = fileContentRepository.findAll();
        assertThat(fileContentList).hasSize(databaseSizeBeforeCreate + 1);
        FileContent testFileContent = fileContentList.get(fileContentList.size() - 1);
        assertThat(testFileContent.getFileDataContent()).isEqualTo(DEFAULT_FILE_DATA_CONTENT);
        assertThat(testFileContent.getFileDataContentContentType()).isEqualTo(DEFAULT_FILE_DATA_CONTENT_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void createFileContentWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = fileContentRepository.findAll().size();

        // Create the FileContent with an existing ID
        fileContent.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restFileContentMockMvc.perform(post("/api/file-contents")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(fileContent)))
            .andExpect(status().isBadRequest());

        // Validate the FileContent in the database
        List<FileContent> fileContentList = fileContentRepository.findAll();
        assertThat(fileContentList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllFileContents() throws Exception {
        // Initialize the database
        fileContentRepository.saveAndFlush(fileContent);

        // Get all the fileContentList
        restFileContentMockMvc.perform(get("/api/file-contents?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(fileContent.getId().intValue())))
            .andExpect(jsonPath("$.[*].fileDataContentContentType").value(hasItem(DEFAULT_FILE_DATA_CONTENT_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].fileDataContent").value(hasItem(Base64Utils.encodeToString(DEFAULT_FILE_DATA_CONTENT))));
    }
    
    @Test
    @Transactional
    public void getFileContent() throws Exception {
        // Initialize the database
        fileContentRepository.saveAndFlush(fileContent);

        // Get the fileContent
        restFileContentMockMvc.perform(get("/api/file-contents/{id}", fileContent.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(fileContent.getId().intValue()))
            .andExpect(jsonPath("$.fileDataContentContentType").value(DEFAULT_FILE_DATA_CONTENT_CONTENT_TYPE))
            .andExpect(jsonPath("$.fileDataContent").value(Base64Utils.encodeToString(DEFAULT_FILE_DATA_CONTENT)));
    }

    @Test
    @Transactional
    public void getNonExistingFileContent() throws Exception {
        // Get the fileContent
        restFileContentMockMvc.perform(get("/api/file-contents/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateFileContent() throws Exception {
        // Initialize the database
        fileContentRepository.saveAndFlush(fileContent);

        int databaseSizeBeforeUpdate = fileContentRepository.findAll().size();

        // Update the fileContent
        FileContent updatedFileContent = fileContentRepository.findById(fileContent.getId()).get();
        // Disconnect from session so that the updates on updatedFileContent are not directly saved in db
        em.detach(updatedFileContent);
        updatedFileContent
            .fileDataContent(UPDATED_FILE_DATA_CONTENT)
            .fileDataContentContentType(UPDATED_FILE_DATA_CONTENT_CONTENT_TYPE);

        restFileContentMockMvc.perform(put("/api/file-contents")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedFileContent)))
            .andExpect(status().isOk());

        // Validate the FileContent in the database
        List<FileContent> fileContentList = fileContentRepository.findAll();
        assertThat(fileContentList).hasSize(databaseSizeBeforeUpdate);
        FileContent testFileContent = fileContentList.get(fileContentList.size() - 1);
        assertThat(testFileContent.getFileDataContent()).isEqualTo(UPDATED_FILE_DATA_CONTENT);
        assertThat(testFileContent.getFileDataContentContentType()).isEqualTo(UPDATED_FILE_DATA_CONTENT_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void updateNonExistingFileContent() throws Exception {
        int databaseSizeBeforeUpdate = fileContentRepository.findAll().size();

        // Create the FileContent

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFileContentMockMvc.perform(put("/api/file-contents")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(fileContent)))
            .andExpect(status().isBadRequest());

        // Validate the FileContent in the database
        List<FileContent> fileContentList = fileContentRepository.findAll();
        assertThat(fileContentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteFileContent() throws Exception {
        // Initialize the database
        fileContentRepository.saveAndFlush(fileContent);

        int databaseSizeBeforeDelete = fileContentRepository.findAll().size();

        // Delete the fileContent
        restFileContentMockMvc.perform(delete("/api/file-contents/{id}", fileContent.getId())
            .accept(TestUtil.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FileContent> fileContentList = fileContentRepository.findAll();
        assertThat(fileContentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
