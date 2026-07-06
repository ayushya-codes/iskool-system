package com.leanquitous.iskool.entity.customization;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "school_customizations",
       uniqueConstraints = @UniqueConstraint(columnNames = {"school_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class SchoolCustomization extends BaseEntity {

    @Column(name = "favicon_url")
    private String faviconUrl;

    @Column(name = "banner_url")
    private String bannerUrl;

    @Column(name = "report_card_logo_url")
    private String reportCardLogoUrl;

    @Column(name = "font_family")
    private String fontFamily;

    @Column(name = "heading_font_family")
    private String headingFontFamily;

    @Column(name = "accent_color")
    private String accentColor;

    @Column(name = "background_color")
    private String backgroundColor;

    @Column(name = "sidebar_color")
    private String sidebarColor;

    @Column(name = "css_overrides", columnDefinition = "TEXT")
    private String cssOverrides;

    @Column(name = "date_format")
    private String dateFormat;

    @Column(name = "time_format")
    private String timeFormat;

    @Column(name = "locale")
    private String locale;

    @Column(name = "enable_finance", nullable = false)
    private Boolean enableFinance;

    @Column(name = "enable_helpdesk", nullable = false)
    private Boolean enableHelpdesk;

    @Column(name = "enable_inventory", nullable = false)
    private Boolean enableInventory;

    @Column(name = "enable_almanac", nullable = false)
    private Boolean enableAlmanac;

    @Column(name = "enable_communication", nullable = false)
    private Boolean enableCommunication;

    @Column(name = "enable_safety", nullable = false)
    private Boolean enableSafety;
}
