package hrms.hrms.business.abstracts;

import java.util.List;

import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.dto.EmployerDto;
import hrms.hrms.dto.request.EmployerRegisterRequest;

public interface EmployerService {

<<<<<<< HEAD
	DataResult<Integer> register(EmployerRegisterRequest request);
=======
	Result register(EmployerRegisterRequest request);
>>>>>>> 6cb214294d00901c404e8ba0167a2ec15056bda4

	DataResult<List<EmployerDto>> getAll();

}
