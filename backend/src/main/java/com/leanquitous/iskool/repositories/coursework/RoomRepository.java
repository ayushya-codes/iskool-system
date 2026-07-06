package com.leanquitous.iskool.repositories.coursework;

import com.leanquitous.iskool.entity.coursework.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findBySchoolId(Long schoolId);
}
