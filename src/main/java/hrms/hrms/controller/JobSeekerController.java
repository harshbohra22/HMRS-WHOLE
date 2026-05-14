package hrms.hrms.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hrms.hrms.business.abstracts.JobSeekerService;
import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.dto.JobSeekerDto;
import hrms.hrms.dto.request.JobSeekerRegisterRequest;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/candidateController")
public class JobSeekerController {

	private final JobSeekerService jobSeekerService;

	public JobSeekerController(JobSeekerService jobSeekerService) {
		this.jobSeekerService = jobSeekerService;
	}

	@PostMapping("/register")
<<<<<<< HEAD
	public DataResult<Integer> register(@Valid @RequestBody JobSeekerRegisterRequest request) {
=======
	public Result register(@Valid @RequestBody JobSeekerRegisterRequest request) {
>>>>>>> 6cb214294d00901c404e8ba0167a2ec15056bda4
		return jobSeekerService.register(request);
	}

	@GetMapping("/getAll")
	public DataResult<List<JobSeekerDto>> getAll() {
		return jobSeekerService.getAll();
	}

}
