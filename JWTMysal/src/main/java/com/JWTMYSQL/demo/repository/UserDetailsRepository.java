package com.JWTMYSQL.demo.repository;

import com.JWTMYSQL.demo.model.UserDetails;
import com.JWTMYSQL.demo.model.UsersDTO;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDetailsRepository extends JpaRepository<UserDetails, Long> {
    UserDetails findByUser_Id(Long userId);
}
