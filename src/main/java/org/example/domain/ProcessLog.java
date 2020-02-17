package org.example.domain;

import io.swagger.annotations.ApiModel;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * Reward.
 */
@ApiModel(description = "Reward.")
@Entity
@Table(name = "process_log")
public class ProcessLog implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_value")
    private Double fileValue;

    @Column(name = "process_date")
    private ZonedDateTime processDate;

    @OneToOne
    @JoinColumn(unique = true)
    private FileContent fileDataContent;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public ProcessLog fileName(String fileName) {
        this.fileName = fileName;
        return this;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Double getFileValue() {
        return fileValue;
    }

    public ProcessLog fileValue(Double fileValue) {
        this.fileValue = fileValue;
        return this;
    }

    public void setFileValue(Double fileValue) {
        this.fileValue = fileValue;
    }

    public ZonedDateTime getProcessDate() {
        return processDate;
    }

    public ProcessLog processDate(ZonedDateTime processDate) {
        this.processDate = processDate;
        return this;
    }

    public void setProcessDate(ZonedDateTime processDate) {
        this.processDate = processDate;
    }

    public FileContent getFileDataContent() {
        return fileDataContent;
    }

    public ProcessLog fileDataContent(FileContent fileContent) {
        this.fileDataContent = fileContent;
        return this;
    }

    public void setFileDataContent(FileContent fileContent) {
        this.fileDataContent = fileContent;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProcessLog)) {
            return false;
        }
        return id != null && id.equals(((ProcessLog) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "ProcessLog{" +
            "id=" + getId() +
            ", fileName='" + getFileName() + "'" +
            ", fileValue=" + getFileValue() +
            ", processDate='" + getProcessDate() + "'" +
            "}";
    }
}
