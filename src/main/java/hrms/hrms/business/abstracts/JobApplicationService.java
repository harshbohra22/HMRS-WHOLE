package hrms.hrms.business.abstracts;

import java.util.List;

import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.dto.JobApplicationDto;
import hrms.hrms.dto.request.ApplyJobRequest;
import hrms.hrms.dto.request.UpdateApplicationStatusRequest;

public interface JobApplicationService {

	Result apply(ApplyJobRequest request);

	Result updateStatus(UpdateApplicationStatusRequest request);

	DataResult<List<JobApplicationDto>> getByAdvertisement(Integer jobAdvertisementId);

	DataResult<List<JobApplicationDto>> getByJobSeeker(Integer jobSeekerId);
	
	DataResult<List<JobApplicationDto>> getAll();
<<<<<<< HEAD

	DataResult<org.springframework.data.domain.Page<JobApplicationDto>> getAllPage(int pageNo, int pageSize);

	DataResult<org.springframework.data.domain.Page<JobApplicationDto>> getByJobSeekerPage(Integer jobSeekerId, int pageNo, int pageSize);
=======
>>>>>>> 6cb214294d00901c404e8ba0167a2ec15056bda4
}
