package com.JWTMYSQL.demo.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "Users")
public class UsersDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date dob;
}
