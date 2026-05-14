package hrms.hrms.business.abstracts;

import java.util.List;

import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.dto.JobApplicationDto;
import hrms.hrms.dto.PageDto;
import hrms.hrms.dto.request.ApplyJobRequest;
import hrms.hrms.dto.request.UpdateApplicationStatusRequest;
import hrms.hrms.entity.JobApplicationStatus;

public interface JobApplicationService {

	Result apply(ApplyJobRequest request);

	Result updateStatus(UpdateApplicationStatusRequest request);

	DataResult<List<JobApplicationDto>> getByAdvertisement(Integer jobAdvertisementId);

	DataResult<List<JobApplicationDto>> getByJobSeeker(Integer jobSeekerId);
	
	DataResult<List<JobApplicationDto>> getAll();

	DataResult<PageDto<JobApplicationDto>> getByJobSeekerPage(Integer jobSeekerId, int page, int size);

	DataResult<PageDto<JobApplicationDto>> getAllPage(int page, int size);

	/**
	 * Returns the current status of the given application,
	 * or null if the application does not exist.
	 */
	JobApplicationStatus getStatusById(Integer applicationId);
}
