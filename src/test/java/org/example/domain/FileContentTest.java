package org.example.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import org.example.web.rest.TestUtil;

public class FileContentTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FileContent.class);
        FileContent fileContent1 = new FileContent();
        fileContent1.setId(1L);
        FileContent fileContent2 = new FileContent();
        fileContent2.setId(fileContent1.getId());
        assertThat(fileContent1).isEqualTo(fileContent2);
        fileContent2.setId(2L);
        assertThat(fileContent1).isNotEqualTo(fileContent2);
        fileContent1.setId(null);
        assertThat(fileContent1).isNotEqualTo(fileContent2);
    }
}
