package org.example.web.rest;

import org.example.JhipsterSampleApplicationApp;
import org.example.domain.ProcessLog;
import org.example.repository.ProcessLogRepository;
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
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static org.example.web.rest.TestUtil.sameInstant;
import static org.example.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link ProcessLogResource} REST controller.
 */
@SpringBootTest(classes = JhipsterSampleApplicationApp.class)
public class ProcessLogResourceIT {

    private static final String DEFAULT_FILE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FILE_NAME = "BBBBBBBBBB";

    private static final Double DEFAULT_FILE_VALUE = 1D;
    private static final Double UPDATED_FILE_VALUE = 2D;

    private static final ZonedDateTime DEFAULT_PROCESS_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_PROCESS_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private ProcessLogRepository processLogRepository;

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

    private MockMvc restProcessLogMockMvc;

    private ProcessLog processLog;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ProcessLogResource processLogResource = new ProcessLogResource(processLogRepository);
        this.restProcessLogMockMvc = MockMvcBuilders.standaloneSetup(processLogResource)
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
    public static ProcessLog createEntity(EntityManager em) {
        ProcessLog processLog = new ProcessLog()
            .fileName(DEFAULT_FILE_NAME)
            .fileValue(DEFAULT_FILE_VALUE)
            .processDate(DEFAULT_PROCESS_DATE);
        return processLog;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProcessLog createUpdatedEntity(EntityManager em) {
        ProcessLog processLog = new ProcessLog()
            .fileName(UPDATED_FILE_NAME)
            .fileValue(UPDATED_FILE_VALUE)
            .processDate(UPDATED_PROCESS_DATE);
        return processLog;
    }

    @BeforeEach
    public void initTest() {
        processLog = createEntity(em);
    }

    @Test
    @Transactional
    public void createProcessLog() throws Exception {
        int databaseSizeBeforeCreate = processLogRepository.findAll().size();

        // Create the ProcessLog
        restProcessLogMockMvc.perform(post("/api/process-logs")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(processLog)))
            .andExpect(status().isCreated());

        // Validate the ProcessLog in the database
        List<ProcessLog> processLogList = processLogRepository.findAll();
        assertThat(processLogList).hasSize(databaseSizeBeforeCreate + 1);
        ProcessLog testProcessLog = processLogList.get(processLogList.size() - 1);
        assertThat(testProcessLog.getFileName()).isEqualTo(DEFAULT_FILE_NAME);
        assertThat(testProcessLog.getFileValue()).isEqualTo(DEFAULT_FILE_VALUE);
        assertThat(testProcessLog.getProcessDate()).isEqualTo(DEFAULT_PROCESS_DATE);
    }

    @Test
    @Transactional
    public void createProcessLogWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = processLogRepository.findAll().size();

        // Create the ProcessLog with an existing ID
        processLog.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restProcessLogMockMvc.perform(post("/api/process-logs")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(processLog)))
            .andExpect(status().isBadRequest());

        // Validate the ProcessLog in the database
        List<ProcessLog> processLogList = processLogRepository.findAll();
        assertThat(processLogList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkFileNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = processLogRepository.findAll().size();
        // set the field null
        processLog.setFileName(null);

        // Create the ProcessLog, which fails.

        restProcessLogMockMvc.perform(post("/api/process-logs")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(processLog)))
            .andExpect(status().isBadRequest());

        List<ProcessLog> processLogList = processLogRepository.findAll();
        assertThat(processLogList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllProcessLogs() throws Exception {
        // Initialize the database
        processLogRepository.saveAndFlush(processLog);

        // Get all the processLogList
        restProcessLogMockMvc.perform(get("/api/process-logs?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(processLog.getId().intValue())))
            .andExpect(jsonPath("$.[*].fileName").value(hasItem(DEFAULT_FILE_NAME)))
            .andExpect(jsonPath("$.[*].fileValue").value(hasItem(DEFAULT_FILE_VALUE.doubleValue())))
            .andExpect(jsonPath("$.[*].processDate").value(hasItem(sameInstant(DEFAULT_PROCESS_DATE))));
    }
    
    @Test
    @Transactional
    public void getProcessLog() throws Exception {
        // Initialize the database
        processLogRepository.saveAndFlush(processLog);

        // Get the processLog
        restProcessLogMockMvc.perform(get("/api/process-logs/{id}", processLog.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(processLog.getId().intValue()))
            .andExpect(jsonPath("$.fileName").value(DEFAULT_FILE_NAME))
            .andExpect(jsonPath("$.fileValue").value(DEFAULT_FILE_VALUE.doubleValue()))
            .andExpect(jsonPath("$.processDate").value(sameInstant(DEFAULT_PROCESS_DATE)));
    }

    @Test
    @Transactional
    public void getNonExistingProcessLog() throws Exception {
        // Get the processLog
        restProcessLogMockMvc.perform(get("/api/process-logs/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProcessLog() throws Exception {
        // Initialize the database
        processLogRepository.saveAndFlush(processLog);

        int databaseSizeBeforeUpdate = processLogRepository.findAll().size();

        // Update the processLog
        ProcessLog updatedProcessLog = processLogRepository.findById(processLog.getId()).get();
        // Disconnect from session so that the updates on updatedProcessLog are not directly saved in db
        em.detach(updatedProcessLog);
        updatedProcessLog
            .fileName(UPDATED_FILE_NAME)
            .fileValue(UPDATED_FILE_VALUE)
            .processDate(UPDATED_PROCESS_DATE);

        restProcessLogMockMvc.perform(put("/api/process-logs")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedProcessLog)))
            .andExpect(status().isOk());

        // Validate the ProcessLog in the database
        List<ProcessLog> processLogList = processLogRepository.findAll();
        assertThat(processLogList).hasSize(databaseSizeBeforeUpdate);
        ProcessLog testProcessLog = processLogList.get(processLogList.size() - 1);
        assertThat(testProcessLog.getFileName()).isEqualTo(UPDATED_FILE_NAME);
        assertThat(testProcessLog.getFileValue()).isEqualTo(UPDATED_FILE_VALUE);
        assertThat(testProcessLog.getProcessDate()).isEqualTo(UPDATED_PROCESS_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingProcessLog() throws Exception {
        int databaseSizeBeforeUpdate = processLogRepository.findAll().size();

        // Create the ProcessLog

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProcessLogMockMvc.perform(put("/api/process-logs")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(processLog)))
            .andExpect(status().isBadRequest());

        // Validate the ProcessLog in the database
        List<ProcessLog> processLogList = processLogRepository.findAll();
        assertThat(processLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteProcessLog() throws Exception {
        // Initialize the database
        processLogRepository.saveAndFlush(processLog);

        int databaseSizeBeforeDelete = processLogRepository.findAll().size();

        // Delete the processLog
        restProcessLogMockMvc.perform(delete("/api/process-logs/{id}", processLog.getId())
            .accept(TestUtil.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProcessLog> processLogList = processLogRepository.findAll();
        assertThat(processLogList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
