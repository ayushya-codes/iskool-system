package com.leanquitous.iskool.dto.notification;

import com.leanquitous.iskool.entity.notification.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

public class NotificationDtos {

    @Data @Builder @AllArgsConstructor
    public static class NotificationResponse {
        private Long id; private Long userId; private String title; private String body;
        private Notification.Channel channel; private LocalDateTime sentAt; private Boolean isRead;
        public static NotificationResponse from(Notification n) {
            return NotificationResponse.builder().id(n.getId()).userId(n.getUserId()).title(n.getTitle()).body(n.getBody())
                    .channel(n.getChannel()).sentAt(n.getSentAt()).isRead(n.getIsRead()).build();
        }
    }
    @Data
    public static class NotificationRequest {
        private Long userId; private String title; private String body; private Notification.Channel channel;
    }
}
