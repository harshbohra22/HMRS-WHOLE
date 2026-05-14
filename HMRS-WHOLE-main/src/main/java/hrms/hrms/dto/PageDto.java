package hrms.hrms.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageDto<T> {

	private List<T> content;
	private long totalElements;
	private int totalPages;
	private int number;
	private int size;
}
