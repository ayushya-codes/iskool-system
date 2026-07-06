package com.leanquitous.iskool.repositories.tenant;

import com.leanquitous.iskool.entity.tenant.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SchoolRepository extends JpaRepository<School, Long> {

    Optional<School> findBySubdomain(String subdomain);

    boolean existsBySubdomain(String subdomain);
}
