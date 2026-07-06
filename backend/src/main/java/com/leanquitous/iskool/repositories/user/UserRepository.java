package com.leanquitous.iskool.repositories.user;

import com.leanquitous.iskool.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailAndSchoolId(String email, Long schoolId);

    Optional<User> findByEmail(String email);

    List<User> findBySchoolId(Long schoolId);
}
