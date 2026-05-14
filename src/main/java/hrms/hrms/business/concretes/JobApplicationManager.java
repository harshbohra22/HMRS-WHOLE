package hrms.hrms.business.concretes;

import java.util.List;

import org.springframework.stereotype.Service;

import hrms.hrms.business.abstracts.JobApplicationService;
import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.ErrorResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.core.utilities.SuccessDataResult;
import hrms.hrms.core.utilities.SuccessResult;
import hrms.hrms.dto.JobApplicationDto;
import hrms.hrms.dto.request.ApplyJobRequest;
import hrms.hrms.dto.request.UpdateApplicationStatusRequest;
import hrms.hrms.entity.JobAdvertisement;
import hrms.hrms.entity.JobApplication;
import hrms.hrms.entity.JobApplicationStatus;
import hrms.hrms.entity.JobSeeker;
import hrms.hrms.repository.JobAdvertisementDao;
import hrms.hrms.repository.JobApplicationDao;
import hrms.hrms.repository.JobSeekerDao;

@Service
public class JobApplicationManager implements JobApplicationService {

	private final JobApplicationDao jobApplicationDao;
	private final JobAdvertisementDao jobAdvertisementDao;
	private final JobSeekerDao jobSeekerDao;

	public JobApplicationManager(JobApplicationDao jobApplicationDao, JobAdvertisementDao jobAdvertisementDao,
			JobSeekerDao jobSeekerDao) {
		this.jobApplicationDao = jobApplicationDao;
		this.jobAdvertisementDao = jobAdvertisementDao;
		this.jobSeekerDao = jobSeekerDao;
	}

	@Override
	public Result apply(ApplyJobRequest request) {
		JobAdvertisement ad = jobAdvertisementDao.findById(request.getJobAdvertisementId())
				.orElseThrow(() -> new IllegalArgumentException("Job advertisement not found."));
		if (!ad.isActive()) {
			return new ErrorResult("Job advertisement is not active.");
		}

		JobSeeker seeker = jobSeekerDao.findById(request.getJobSeekerId())
				.orElseThrow(() -> new IllegalArgumentException("Job seeker not found."));

		if (jobApplicationDao.findByJobAdvertisement_IdAndJobSeeker_Id(ad.getId(), seeker.getId()).isPresent()) {
			return new ErrorResult("You have already applied to this advertisement.");
		}

		JobApplication app = new JobApplication();
		app.setJobAdvertisement(ad);
		app.setJobSeeker(seeker);
		app.setStatus(JobApplicationStatus.PENDING);

		jobApplicationDao.save(app);
		return new SuccessResult("Application submitted.");
	}

	@Override
	public Result updateStatus(UpdateApplicationStatusRequest request) {
		JobApplication app = jobApplicationDao.findById(request.getApplicationId())
				.orElseThrow(() -> new IllegalArgumentException("Application not found."));
		app.setStatus(request.getStatus());
		jobApplicationDao.save(app);
		return new SuccessResult("Application status updated.");
	}

	@Override
	public DataResult<List<JobApplicationDto>> getByAdvertisement(Integer jobAdvertisementId) {
		var list = jobApplicationDao.findByJobAdvertisement_Id(jobAdvertisementId).stream()
				.map(a -> new JobApplicationDto(a.getId(), a.getJobAdvertisement().getId(), a.getJobSeeker().getId(),
						a.getJobAdvertisement().getJobPosition().getTitle(),
						a.getJobAdvertisement().getEmployer().getCompanyName(), a.getApplicationDate(), a.getStatus()))
				.toList();
		return new SuccessDataResult<>(list, "Applications listed for advertisement.");
	}

	@Override
	public DataResult<List<JobApplicationDto>> getByJobSeeker(Integer jobSeekerId) {
		var list = jobApplicationDao.findByJobSeeker_Id(jobSeekerId).stream()
				.map(a -> new JobApplicationDto(a.getId(), a.getJobAdvertisement().getId(), a.getJobSeeker().getId(),
						a.getJobAdvertisement().getJobPosition().getTitle(),
						a.getJobAdvertisement().getEmployer().getCompanyName(), a.getApplicationDate(), a.getStatus()))
				.toList();
		return new SuccessDataResult<>(list, "Applications listed for job seeker.");
	}

	@Override
	public DataResult<List<JobApplicationDto>> getAll() {
		var list = jobApplicationDao.findAll().stream()
				.map(a -> new JobApplicationDto(a.getId(), a.getJobAdvertisement().getId(), a.getJobSeeker().getId(),
						a.getJobAdvertisement().getJobPosition().getTitle(),
						a.getJobAdvertisement().getEmployer().getCompanyName(), a.getApplicationDate(), a.getStatus()))
				.toList();
		return new SuccessDataResult<>(list, "All applications listed.");
	}
<<<<<<< HEAD

	@Override
	public DataResult<org.springframework.data.domain.Page<JobApplicationDto>> getAllPage(int pageNo, int pageSize) {
		org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(pageNo, pageSize);
		org.springframework.data.domain.Page<JobApplication> page = jobApplicationDao.findAll(pageable);
		org.springframework.data.domain.Page<JobApplicationDto> dtoPage = page.map(a -> new JobApplicationDto(
				a.getId(), a.getJobAdvertisement().getId(), a.getJobSeeker().getId(),
				a.getJobAdvertisement().getJobPosition().getTitle(),
				a.getJobAdvertisement().getEmployer().getCompanyName(), a.getApplicationDate(), a.getStatus()));
		return new SuccessDataResult<>(dtoPage, "Applications listed.");
	}

	@Override
	public DataResult<org.springframework.data.domain.Page<JobApplicationDto>> getByJobSeekerPage(Integer jobSeekerId, int pageNo, int pageSize) {
		org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(pageNo, pageSize, org.springframework.data.domain.Sort.by("applicationDate").descending());
		org.springframework.data.domain.Page<JobApplication> page = jobApplicationDao.findByJobSeeker_Id(jobSeekerId, pageable);
		org.springframework.data.domain.Page<JobApplicationDto> dtoPage = page.map(a -> new JobApplicationDto(
				a.getId(), a.getJobAdvertisement().getId(), a.getJobSeeker().getId(),
				a.getJobAdvertisement().getJobPosition().getTitle(),
				a.getJobAdvertisement().getEmployer().getCompanyName(), a.getApplicationDate(), a.getStatus()));
		return new SuccessDataResult<>(dtoPage, "Job seeker applications listed.");
	}
=======
>>>>>>> 6cb214294d00901c404e8ba0167a2ec15056bda4
}