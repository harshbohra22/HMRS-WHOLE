package hrms.hrms.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import hrms.hrms.entity.JobAdvertisement;

public interface JobAdvertisementDao extends JpaRepository<JobAdvertisement, Integer> {

	List<JobAdvertisement> findByActiveTrue();

	@Query("""
			select j from JobAdvertisement j
			join j.city c
			join j.jobPosition p
			join j.employer e
			where j.active = true
			and (:q is null or lower(p.title) like lower(concat('%', :q, '%'))
			     or lower(e.companyName) like lower(concat('%', :q, '%')))
			and (:city is null or c.cityName = :city)
			""")
	Page<JobAdvertisement> pageActiveFiltered(@Param("q") String q, @Param("city") String city, Pageable pageable);

	@Query("""
			select j from JobAdvertisement j
			join j.city c
			join j.jobPosition p
			join j.employer e
			where (:q is null or lower(p.title) like lower(concat('%', :q, '%'))
			     or lower(e.companyName) like lower(concat('%', :q, '%')))
			and (:city is null or c.cityName = :city)
			""")
	Page<JobAdvertisement> pageAllFiltered(@Param("q") String q, @Param("city") String city, Pageable pageable);

	List<JobAdvertisement> findByEmployer_IdAndActiveTrue(Integer employerId);

	List<JobAdvertisement> findAllByOrderByApplicationDeadlineAsc();

	@Query("select j from JobAdvertisement j where j.applicationDeadline = :deadline")
	List<JobAdvertisement> findByApplicationDeadline(LocalDate deadline);

}
