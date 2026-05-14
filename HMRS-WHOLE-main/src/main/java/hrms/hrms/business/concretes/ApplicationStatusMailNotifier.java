package hrms.hrms.business.concretes;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import hrms.hrms.entity.JobApplication;
import hrms.hrms.entity.JobApplicationStatus;

@Component
public class ApplicationStatusMailNotifier {

	private static final Logger log = LoggerFactory.getLogger(ApplicationStatusMailNotifier.class);

	private final ObjectProvider<JavaMailSender> mailSenderProvider;

	@Value("${app.mail.from:}")
	private String fromAddress;

	public ApplicationStatusMailNotifier(ObjectProvider<JavaMailSender> mailSenderProvider) {
		this.mailSenderProvider = mailSenderProvider;
	}

	public void notifyStatusChange(JobApplication app, JobApplicationStatus previous) {
		String to = app.getJobSeeker().getEmail();
		if (to == null || to.isBlank()) {
			return;
		}
		String subject = "Application #" + app.getId() + " status: " + app.getStatus();
		String body = "Hello,\n\nYour application for the role \""
				+ app.getJobAdvertisement().getJobPosition().getTitle() + "\" at "
				+ app.getJobAdvertisement().getEmployer().getCompanyName()
				+ " has been updated.\n\nPrevious status: " + previous + "\nNew status: " + app.getStatus()
				+ "\n\n— HMRS";

		JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
		if (mailSender == null || fromAddress == null || fromAddress.isBlank()) {
			log.info("[mail disabled] {} -> {}", to, subject);
			return;
		}
		try {
			SimpleMailMessage msg = new SimpleMailMessage();
			msg.setFrom(fromAddress);
			msg.setTo(to);
			msg.setSubject(subject);
			msg.setText(body);
			mailSender.send(msg);
		} catch (Exception e) {
			log.warn("Failed to send status email to {}: {}", to, e.getMessage());
		}
	}
}
