package org.example.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import org.example.web.rest.TestUtil;

public class ProcessLogTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProcessLog.class);
        ProcessLog processLog1 = new ProcessLog();
        processLog1.setId(1L);
        ProcessLog processLog2 = new ProcessLog();
        processLog2.setId(processLog1.getId());
        assertThat(processLog1).isEqualTo(processLog2);
        processLog2.setId(2L);
        assertThat(processLog1).isNotEqualTo(processLog2);
        processLog1.setId(null);
        assertThat(processLog1).isNotEqualTo(processLog2);
    }
}
