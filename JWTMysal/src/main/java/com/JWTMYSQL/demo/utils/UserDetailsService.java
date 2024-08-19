package com.JWTMYSQL.demo.utils;

import com.JWTMYSQL.demo.model.UserDetails;
import com.JWTMYSQL.demo.repository.UserDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsService {

    @Autowired
    private UserDetailsRepository userDetailsRepository;

    public UserDetails getUserDetailsByUserId(Long userId) {
        return userDetailsRepository.findByUser_Id(userId);
    }
}
