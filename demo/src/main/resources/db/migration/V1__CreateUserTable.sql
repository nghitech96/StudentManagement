CREATE TABLE `user`
(
    `id`       CHAR(36)     NOT NULL DEFAULT (UUID()),
    `class_id` CHAR(36)              DEFAULT NULL,
    `name`     VARCHAR(255) NOT NULL,
    `email`    varchar(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)

);

CREATE TABLE `organization`
(
    `id`          CHAR(36)                 NOT NULL DEFAULT (UUID()),
    `parent_id`   CHAR(36)                          DEFAULT NULL,
    `org_type`    ENUM ('SCHOOL', 'CLASS') NOT NULL DEFAULT 'CLASS',
    `head_of_org` CHAR(36)                 Not Null,
    `name`        VARCHAR(255)             NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`parent_id`) REFERENCES `organization` (`id`),
    FOREIGN KEY (`head_of_org`) REFERENCES `user` (`id`)
);
ALTER TABLE `user`
    ADD FOREIGN KEY (`class_id`) REFERENCES `organization` (`id`);

CREATE TABLE `subject`
(
    `id`              CHAR(36)     NOT NULL DEFAULT (UUID()),
    `teacher_id`      CHAR(36)              DEFAULT NULL,
    `organization_id` CHAR(36)              DEFAULT NULL,
    `name`            VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`teacher_id`) REFERENCES `user` (`id`),
    FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`)
);


CREATE TABLE `user_subject`
(
    `id`         CHAR(36) NOT NULL DEFAULT (UUID()),
    `user_id`    CHAR(36) NOT NULL,
    `subject_id` CHAR(36) Not Null,
    `score`      DOUBLE            DEFAULT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
    FOREIGN KEY (`subject_id`) REFERENCES `subject` (`id`)
);

