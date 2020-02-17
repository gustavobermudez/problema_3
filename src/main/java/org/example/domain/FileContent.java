package org.example.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;

/**
 * A FileContent.
 */
@Entity
@Table(name = "file_content")
public class FileContent implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    @Lob
    @Column(name = "file_data_content", nullable = false)
    private byte[] fileDataContent;

    @Column(name = "file_data_content_content_type", nullable = false)
    private String fileDataContentContentType;

    @OneToOne(mappedBy = "fileDataContent")
    @JsonIgnore
    private ProcessLog processLog;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getFileDataContent() {
        return fileDataContent;
    }

    public FileContent fileDataContent(byte[] fileDataContent) {
        this.fileDataContent = fileDataContent;
        return this;
    }

    public void setFileDataContent(byte[] fileDataContent) {
        this.fileDataContent = fileDataContent;
    }

    public String getFileDataContentContentType() {
        return fileDataContentContentType;
    }

    public FileContent fileDataContentContentType(String fileDataContentContentType) {
        this.fileDataContentContentType = fileDataContentContentType;
        return this;
    }

    public void setFileDataContentContentType(String fileDataContentContentType) {
        this.fileDataContentContentType = fileDataContentContentType;
    }

    public ProcessLog getProcessLog() {
        return processLog;
    }

    public FileContent processLog(ProcessLog processLog) {
        this.processLog = processLog;
        return this;
    }

    public void setProcessLog(ProcessLog processLog) {
        this.processLog = processLog;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FileContent)) {
            return false;
        }
        return id != null && id.equals(((FileContent) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "FileContent{" +
            "id=" + getId() +
            ", fileDataContent='" + getFileDataContent() + "'" +
            ", fileDataContentContentType='" + getFileDataContentContentType() + "'" +
            "}";
    }
}
