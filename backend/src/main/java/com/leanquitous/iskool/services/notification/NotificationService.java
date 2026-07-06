package com.leanquitous.iskool.services.notification;

import com.leanquitous.iskool.dto.notification.NotificationDtos.*;
import com.leanquitous.iskool.entity.notification.Notification;
import com.leanquitous.iskool.entity.user.User;
import com.leanquitous.iskool.repositories.notification.NotificationRepository;
import com.leanquitous.iskool.repositories.user.UserRepository;
import com.leanquitous.iskool.tenant.TenantContext;
import com.leanquitous.iskool.tenant.TenantValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepo;
    private final UserRepository userRepository;

    public NotificationResponse send(NotificationRequest req) {
        Notification n = Notification.builder().userId(req.getUserId()).title(req.getTitle()).body(req.getBody())
                .channel(req.getChannel()).sentAt(LocalDateTime.now()).isRead(false)
                .schoolId(TenantContext.getCurrentTenant()).build();
        return NotificationResponse.from(notificationRepo.save(n));
    }

    public List<NotificationResponse> getByUser(Long userId) {
        return notificationRepo.findBySchoolIdAndUserIdOrderBySentAtDesc(TenantContext.getCurrentTenant(), userId)
                .stream().map(NotificationResponse::from).toList();
    }

    public List<NotificationResponse> getUnreadByUser(Long userId) {
        return notificationRepo.findBySchoolIdAndUserIdAndIsRead(TenantContext.getCurrentTenant(), userId, false)
                .stream().map(NotificationResponse::from).toList();
    }

    public void markAsRead(Long id) {
        Notification n = notificationRepo.findById(id).orElseThrow(() -> new RuntimeException("Notification not found"));
        TenantValidator.validateOwnership(n.getSchoolId());
        n.setIsRead(true);
        notificationRepo.save(n);
    }

    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepo.findBySchoolIdAndUserIdAndIsRead(
                TenantContext.getCurrentTenant(), userId, false);
        unread.forEach(n -> n.setIsRead(true));
        notificationRepo.saveAll(unread);
    }

    public void broadcastToSchool(String title, String body) {
        Long schoolId = TenantContext.getCurrentTenant();
        if (schoolId == null) return;
        List<User> users = userRepository.findBySchoolId(schoolId);
        List<Notification> notifications = users.stream()
                .<Notification>map(u -> Notification.builder()
                        .userId(u.getId()).title(title).body(body)
                        .channel(Notification.Channel.PUSH).sentAt(LocalDateTime.now()).isRead(false)
                        .schoolId(schoolId).build())
                .toList();
        notificationRepo.saveAll(notifications);
    }
}
