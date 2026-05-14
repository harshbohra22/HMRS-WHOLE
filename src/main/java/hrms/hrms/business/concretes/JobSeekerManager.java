package hrms.hrms.business.concretes;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import hrms.hrms.business.abstracts.JobSeekerService;
import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.ErrorResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.core.utilities.SuccessDataResult;
import hrms.hrms.core.utilities.SuccessResult;
import hrms.hrms.dto.JobSeekerDto;
import hrms.hrms.dto.request.JobSeekerRegisterRequest;
import hrms.hrms.entity.JobSeeker;
import hrms.hrms.repository.JobSeekerDao;

@Service
public class JobSeekerManager implements JobSeekerService {

	private final JobSeekerDao jobSeekerDao;
	private final PasswordEncoder passwordEncoder;

	public JobSeekerManager(JobSeekerDao jobSeekerDao, PasswordEncoder passwordEncoder) {
		this.jobSeekerDao = jobSeekerDao;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
<<<<<<< HEAD
	public DataResult<Integer> register(JobSeekerRegisterRequest request) {
		if (!request.getPassword().equals(request.getConfirmPassword())) {
			return new hrms.hrms.core.utilities.ErrorDataResult<>(null, "Passwords do not match.");
		}
		if (jobSeekerDao.findByEmail(request.getEmail()).isPresent()) {
			return new hrms.hrms.core.utilities.ErrorDataResult<>(null, "Email is already in use.");
		}
		if (jobSeekerDao.findByNationalId(request.getNationalId()).isPresent()) {
			return new hrms.hrms.core.utilities.ErrorDataResult<>(null, "National ID is already in use.");
=======
	public Result register(JobSeekerRegisterRequest request) {
		if (!request.getPassword().equals(request.getConfirmPassword())) {
			return new ErrorResult("Passwords do not match.");
		}
		if (jobSeekerDao.findByEmail(request.getEmail()).isPresent()) {
			return new ErrorResult("Email is already in use.");
		}
		if (jobSeekerDao.findByNationalId(request.getNationalId()).isPresent()) {
			return new ErrorResult("National ID is already in use.");
>>>>>>> 6cb214294d00901c404e8ba0167a2ec15056bda4
		}

		JobSeeker js = new JobSeeker();
		js.setName(request.getName());
		js.setLastName(request.getLastName());
		js.setNationalId(request.getNationalId());
		js.setBirthDate(request.getBirthDate());
		js.setEmail(request.getEmail());
		js.setPassword(passwordEncoder.encode(request.getPassword()));
<<<<<<< HEAD
		js = jobSeekerDao.save(js);

		return new hrms.hrms.core.utilities.SuccessDataResult<>(js.getId(), "Job seeker registered.");
=======
		jobSeekerDao.save(js);

		return new SuccessResult("Job seeker registered.");
>>>>>>> 6cb214294d00901c404e8ba0167a2ec15056bda4
	}

	@Override
	public DataResult<List<JobSeekerDto>> getAll() {
		var list = jobSeekerDao.findAll().stream().map(j -> new JobSeekerDto(j.getId(), j.getName(), j.getLastName(),
				j.getNationalId(), j.getBirthDate(), j.getEmail())).toList();
		return new SuccessDataResult<>(list, "Job seekers listed.");
	}

}
