package hrms.hrms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import hrms.hrms.entity.JobApplication;

public interface JobApplicationDao extends JpaRepository<JobApplication, Integer> {


    Optional<JobApplication> findByJobAdvertisement_IdAndJobSeeker_Id(Integer jobAdvertisementId, Integer jobSeekerId);

    List<JobApplication> findByJobAdvertisement_Id(Integer jobAdvertisementId);

    List<JobApplication> findByJobSeeker_Id(Integer jobSeekerId);
<<<<<<< HEAD

    org.springframework.data.domain.Page<JobApplication> findByJobSeeker_Id(Integer jobSeekerId, org.springframework.data.domain.Pageable pageable);
=======
>>>>>>> 6cb214294d00901c404e8ba0167a2ec15056bda4
}