package hrms.hrms.business.abstracts;

import java.util.List;

import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.dto.JobSeekerDto;
import hrms.hrms.dto.request.JobSeekerRegisterRequest;

public interface JobSeekerService {
	
<<<<<<< HEAD
	DataResult<Integer> register(JobSeekerRegisterRequest request);
=======
	Result register(JobSeekerRegisterRequest request);
>>>>>>> 6cb214294d00901c404e8ba0167a2ec15056bda4

	DataResult<List<JobSeekerDto>> getAll();

}
