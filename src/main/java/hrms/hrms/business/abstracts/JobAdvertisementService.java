package hrms.hrms.business.abstracts;

import java.time.LocalDate;
import java.util.List;

import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.dto.JobAdvertisementDto;
import hrms.hrms.dto.request.CreateJobAdvertisementRequest;

public interface JobAdvertisementService {

	Result add(CreateJobAdvertisementRequest request);

	DataResult<List<JobAdvertisementDto>> getAll();

	DataResult<List<JobAdvertisementDto>> getActive();

	DataResult<List<JobAdvertisementDto>> getActiveByEmployer(Integer employerId);

	DataResult<List<JobAdvertisementDto>> getSortedByDeadlineAsc();

	DataResult<List<JobAdvertisementDto>> getByDeadline(LocalDate date);
<<<<<<< HEAD

	DataResult<org.springframework.data.domain.Page<JobAdvertisementDto>> getPage(int page, int size, boolean activeOnly, String q, String city, boolean sortByDeadline);
=======
>>>>>>> 6cb214294d00901c404e8ba0167a2ec15056bda4
}
