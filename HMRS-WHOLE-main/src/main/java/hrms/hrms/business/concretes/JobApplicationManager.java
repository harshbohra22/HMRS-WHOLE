package hrms.hrms.business.concretes;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hrms.hrms.business.abstracts.ChatService;
import hrms.hrms.business.abstracts.JobApplicationService;
import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.ErrorResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.core.utilities.SuccessDataResult;
import hrms.hrms.core.utilities.SuccessResult;
import hrms.hrms.dto.ChatMessageDto;
import hrms.hrms.dto.JobApplicationDto;
import hrms.hrms.dto.PageDto;
import hrms.hrms.dto.request.ApplyJobRequest;
import hrms.hrms.dto.request.SendMessageRequest;
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

	private static final String WELCOME_TEXT = """
			Your application was received. Next step: AI screening — send any message here (for example, a short introduction) to begin. \
			A human recruiter may join later in this same thread.""";

	private final JobApplicationDao jobApplicationDao;
	private final JobAdvertisementDao jobAdvertisementDao;
	private final JobSeekerDao jobSeekerDao;
	private final ChatService chatService;
	private final SimpMessagingTemplate messagingTemplate;
	private final ApplicationStatusMailNotifier mailNotifier;

	public JobApplicationManager(JobApplicationDao jobApplicationDao, JobAdvertisementDao jobAdvertisementDao,
			JobSeekerDao jobSeekerDao, ChatService chatService, SimpMessagingTemplate messagingTemplate,
			ApplicationStatusMailNotifier mailNotifier) {
		this.jobApplicationDao = jobApplicationDao;
		this.jobAdvertisementDao = jobAdvertisementDao;
		this.jobSeekerDao = jobSeekerDao;
		this.chatService = chatService;
		this.messagingTemplate = messagingTemplate;
		this.mailNotifier = mailNotifier;
	}

	@Override
	@Transactional
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

		SendMessageRequest welcome = new SendMessageRequest();
		welcome.setApplicationId(app.getId());
		welcome.setSenderId(0);
		welcome.setSenderType("SYSTEM");
		welcome.setSenderName("HMRS");
		welcome.setContent(WELCOME_TEXT);
		ChatMessageDto savedWelcome = chatService.saveMessage(welcome);
		messagingTemplate.convertAndSend("/topic/chat/" + app.getId(), savedWelcome);

		return new SuccessDataResult<>(app.getId(), "Application submitted.");
	}

	@Override
	@Transactional
	public Result updateStatus(UpdateApplicationStatusRequest request) {
		JobApplication app = jobApplicationDao.findById(request.getApplicationId())
				.orElseThrow(() -> new IllegalArgumentException("Application not found."));
		JobApplicationStatus previous = app.getStatus();
		app.setStatus(request.getStatus());
		jobApplicationDao.save(app);
		mailNotifier.notifyStatusChange(app, previous);
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

	@Override
	public DataResult<PageDto<JobApplicationDto>> getByJobSeekerPage(Integer jobSeekerId, int page, int size) {
		PageRequest pr = PageRequest.of(Math.max(0, page), Math.min(Math.max(size, 1), 50),
				Sort.by("applicationDate").descending());
		Page<JobApplication> pg = jobApplicationDao.findByJobSeeker_Id(jobSeekerId, pr);
		return mapPage(pg);
	}

	@Override
	public DataResult<PageDto<JobApplicationDto>> getAllPage(int page, int size) {
		PageRequest pr = PageRequest.of(Math.max(0, page), Math.min(Math.max(size, 1), 50),
				Sort.by("applicationDate").descending());
		Page<JobApplication> pg = jobApplicationDao.findAll(pr);
		return mapPage(pg);
	}

	private DataResult<PageDto<JobApplicationDto>> mapPage(Page<JobApplication> pg) {
		PageDto<JobApplicationDto> dto = new PageDto<>(
				pg.getContent().stream()
						.map(a -> new JobApplicationDto(a.getId(), a.getJobAdvertisement().getId(),
								a.getJobSeeker().getId(), a.getJobAdvertisement().getJobPosition().getTitle(),
								a.getJobAdvertisement().getEmployer().getCompanyName(), a.getApplicationDate(),
								a.getStatus()))
						.toList(),
				pg.getTotalElements(),
				pg.getTotalPages(),
				pg.getNumber(),
				pg.getSize());
		return new SuccessDataResult<>(dto, "Applications page.");
	}

	@Override
	public JobApplicationStatus getStatusById(Integer applicationId) {
		return jobApplicationDao.findById(applicationId)
				.map(JobApplication::getStatus)
				.orElse(null);
	}
}
