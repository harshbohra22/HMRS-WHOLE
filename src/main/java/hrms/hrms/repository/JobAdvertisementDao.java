package hrms.hrms.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import hrms.hrms.entity.JobAdvertisement;

public interface JobAdvertisementDao extends JpaRepository<JobAdvertisement, Integer> {

	List<JobAdvertisement> findByActiveTrue();

	List<JobAdvertisement> findByEmployer_IdAndActiveTrue(Integer employerId);

	List<JobAdvertisement> findAllByOrderByApplicationDeadlineAsc();

	@Query("select j from JobAdvertisement j where j.applicationDeadline = :deadline")
	List<JobAdvertisement> findByApplicationDeadline(LocalDate deadline);

<<<<<<< HEAD
	@Query("SELECT j FROM JobAdvertisement j WHERE " +
	       "(:activeOnly = false OR j.active = true) AND " +
	       "(:city IS NULL OR :city = '' OR j.city.cityName = :city) AND " +
	       "(:q IS NULL OR :q = '' OR LOWER(j.jobPosition.title) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(j.employer.companyName) LIKE LOWER(CONCAT('%', :q, '%')))")
	org.springframework.data.domain.Page<JobAdvertisement> findWithFilters(
			@org.springframework.data.repository.query.Param("activeOnly") boolean activeOnly, 
			@org.springframework.data.repository.query.Param("city") String city, 
			@org.springframework.data.repository.query.Param("q") String q, 
			org.springframework.data.domain.Pageable pageable);

=======
>>>>>>> 6cb214294d00901c404e8ba0167a2ec15056bda4
}
