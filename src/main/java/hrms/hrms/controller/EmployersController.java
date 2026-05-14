package hrms.hrms.controller;

import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hrms.hrms.business.abstracts.EmployerService;
import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.dto.EmployerDto;
import hrms.hrms.dto.request.EmployerRegisterRequest;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/employers")
public class EmployersController {

	private final EmployerService employerService;

	public EmployersController(EmployerService employerService) {
		this.employerService = employerService;
	}

	@PostMapping("/register")
<<<<<<< HEAD
	public DataResult<Integer> register(@Valid @RequestBody EmployerRegisterRequest request) {
=======
	public Result register(@Valid @RequestBody EmployerRegisterRequest request) {
>>>>>>> 6cb214294d00901c404e8ba0167a2ec15056bda4
		return employerService.register(request);
	}

	@GetMapping("/getAll")
	public DataResult<List<EmployerDto>> getAll() {
		return employerService.getAll();
	}

}
