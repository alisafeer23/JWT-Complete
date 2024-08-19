package com.JWTMYSQL.demo.repository;

import com.JWTMYSQL.demo.model.Users;
import com.JWTMYSQL.demo.model.UsersDTO;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UsersDTO, Long> {
    UsersDTO findByUsername(String username);
}