package hrms.hrms.business.concretes;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import hrms.hrms.business.abstracts.EmployerService;
import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.ErrorResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.core.utilities.SuccessDataResult;
import hrms.hrms.core.utilities.SuccessResult;
import hrms.hrms.dto.EmployerDto;
import hrms.hrms.dto.request.EmployerRegisterRequest;
import hrms.hrms.entity.Employer;
import hrms.hrms.repository.EmployerDao;

@Service
public class EmployerManager implements EmployerService {

	private final EmployerDao employerDao;
	private final PasswordEncoder passwordEncoder;

	public EmployerManager(EmployerDao employerDao, PasswordEncoder passwordEncoder) {
		this.employerDao = employerDao;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
<<<<<<< HEAD
	public DataResult<Integer> register(EmployerRegisterRequest request) {
		if (!request.getPassword().equals(request.getConfirmPassword())) {
			return new hrms.hrms.core.utilities.ErrorDataResult<>(null, "Passwords do not match.");
		}
		if (employerDao.findByEmail(request.getEmail()).isPresent()) {
			return new hrms.hrms.core.utilities.ErrorDataResult<>(null, "Email is already in use.");
=======
	public Result register(EmployerRegisterRequest request) {
		if (!request.getPassword().equals(request.getConfirmPassword())) {
			return new ErrorResult("Passwords do not match.");
		}
		if (employerDao.findByEmail(request.getEmail()).isPresent()) {
			return new ErrorResult("Email is already in use.");
>>>>>>> 6cb214294d00901c404e8ba0167a2ec15056bda4
		}

		Employer e = new Employer();
		e.setCompanyName(request.getCompanyName());
		e.setCompanyWebPage(request.getCompanyWebPage());
		e.setEmail(request.getEmail());
		e.setPhoneNumber(request.getPhoneNumber());
		e.setPassword(passwordEncoder.encode(request.getPassword()));
<<<<<<< HEAD
		e = employerDao.save(e);

		return new hrms.hrms.core.utilities.SuccessDataResult<>(e.getId(), "Employer registered.");
=======
		employerDao.save(e);

		return new SuccessResult("Employer registered.");
>>>>>>> 6cb214294d00901c404e8ba0167a2ec15056bda4
	}

	@Override
	public DataResult<List<EmployerDto>> getAll() {
		var list = employerDao.findAll().stream().map(e -> new EmployerDto(e.getId(), e.getCompanyName(),
				e.getCompanyWebPage(), e.getEmail(), e.getPhoneNumber())).toList();
		return new SuccessDataResult<>(list, "Employers listed.");
	}
}
