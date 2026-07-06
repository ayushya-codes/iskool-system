package com.leanquitous.iskool.repositories.notification;

import com.leanquitous.iskool.entity.notification.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findBySchoolIdAndUserIdOrderBySentAtDesc(Long schoolId, Long userId);
    List<Notification> findBySchoolIdAndUserIdAndIsRead(Long schoolId, Long userId, Boolean isRead);
}
