package com.JWTMYSQL.demo.controller;

import com.JWTMYSQL.demo.model.*;
import com.JWTMYSQL.demo.repository.UserRepository;
import com.JWTMYSQL.demo.repository.UserDetailsRepository;
import com.JWTMYSQL.demo.utils.JwtTokenUtil;
import com.JWTMYSQL.demo.utils.UserDetailsService;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Controller
@RequestMapping
public class OurController {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserDetailsRepository userDetailsRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");

    @PostMapping("/register")
    public ResponseEntity<Object> registerUser(@RequestBody Users user) {
        System.out.println("Received user: " + user); // Debugging statement
        UsersDTO usersDTO = new UsersDTO();
        usersDTO.setUsername(user.getUsername());
        usersDTO.setEmail(user.getEmail());

        if (user.getEmail() == null || user.getDob() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and Date of Birth cannot be null");
        }

        try {
            // Parsing the date in the ISO format
            Date dob = DATE_FORMAT.parse(user.getDob());
            usersDTO.setDob(dob);

            String hashedPassword = bCryptPasswordEncoder.encode(user.getPassword());
            usersDTO.setPassword(hashedPassword);

            UsersDTO savedUser = userRepository.save(usersDTO);

            UserDetails userDetails = new UserDetails();
            userDetails.setUser(savedUser);
            userDetails.setContact(user.getContact());
            userDetails.setAddress(user.getAddress());
            userDetails.setArea(user.getArea());
            userDetails.setCity(user.getCity());
            userDetailsRepository.save(userDetails);

            return ResponseEntity.ok("User Was Saved");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/generate-token")
    public ResponseEntity<Object> generateToken(@RequestBody TokenReqRes tokenReqRes) {
        UsersDTO databaseUser = userRepository.findByUsername(tokenReqRes.getUsername());
        if (databaseUser == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Sorry, User Does Not Exist");
        }
        if (bCryptPasswordEncoder.matches(tokenReqRes.getPassword(), databaseUser.getPassword())) {
            String token = jwtTokenUtil.generateToken(tokenReqRes.getUsername());
            String refreshToken = jwtTokenUtil.generateRefreshToken(tokenReqRes.getUsername());
            tokenReqRes.setToken(token);
            tokenReqRes.setRefreshToken(refreshToken);
            tokenReqRes.setExpirationTime("3600 Sec"); // You might want to implement this method properly
            return ResponseEntity.ok(tokenReqRes);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Password Doesn't Match. Verify");
        }
    }
    @PostMapping("/validate-token")
    public ResponseEntity<Object> validateToken(@RequestBody TokenReqRes tokenReqRes) {
        return ResponseEntity.ok(jwtTokenUtil.validateToken(tokenReqRes.getToken()));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<Object> refreshToken(@RequestBody TokenReqRes tokenReqRes) {
        String token = tokenReqRes.getToken();
        String tokenCheckResult = jwtTokenUtil.validateToken(token);

        if (tokenCheckResult.equalsIgnoreCase("valid")) {
            String username = Jwts.parserBuilder()
                    .setSigningKey(jwtTokenUtil.getSecretKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();

            String newToken = jwtTokenUtil.generateToken(username);
            String newRefreshToken = jwtTokenUtil.generateRefreshToken(username);
            return ResponseEntity.ok(new TokenReqRes(username, null, newToken, newRefreshToken));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized due to: " + tokenCheckResult);
        }
    }

    @GetMapping("/get-fruits")
    public ResponseEntity<Object> getAllFruits(@RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is required to proceed");
        } else {
            String realToken = token.substring(7);
            String tokenCheckResult = jwtTokenUtil.validateToken(realToken);
            if (tokenCheckResult.equalsIgnoreCase("valid")) {
                List<String> fruits = List.of("Mango", "Banana", "Orange", "Watermelon", "Grapes", "Apple", "Berries");
                return new ResponseEntity<>(fruits, HttpStatus.OK);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized due to: " + tokenCheckResult);
            }
        }
    }

    @GetMapping("/get-all-users")
    public ResponseEntity<Object> getAllUsers(@RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is required to proceed");
        } else {
            String realToken = token.substring(7);
            String tokenCheckResult = jwtTokenUtil.validateToken(realToken);
            if (tokenCheckResult.equalsIgnoreCase("valid")) {
                List<UserDetails> userDetailsList = userDetailsRepository.findAll();
                return ResponseEntity.ok(userDetailsList);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized due to: " + tokenCheckResult);
            }
        }
    }

    @GetMapping("/get-user-details/{id}")
    public ResponseEntity<Object> getUserDetails(@PathVariable Long id, @RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is required to proceed");
        } else {
            String realToken = token.substring(7);
            String tokenCheckResult = jwtTokenUtil.validateToken(realToken);
            if (tokenCheckResult.equalsIgnoreCase("valid")) {
                UserDetails userDetails = userDetailsService.getUserDetailsByUserId(id);
                if (userDetails == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
                }

                UserDetailResponse userDetailResponse = new UserDetailResponse(
                        userDetails.getUser().getUsername(),
                        userDetails.getUser().getEmail(),
                        userDetails.getUser().getDob(),
                        userDetails.getAddress(),
                        userDetails.getContact(),
                        userDetails.getCity(),
                        userDetails.getArea()
                );
                return ResponseEntity.ok(userDetailResponse);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized due to: " + tokenCheckResult);
            }
        }
    }

    // UserDetailResponse class integrated
    private static class UserDetailResponse {
        private String username;
        private String email;
        private Date dob;
        private String address;
        private String contact;
        private String city;
        private String area;

        public UserDetailResponse(String username, String email, Date dob, String address, String contact, String city, String area) {
            this.username = username;
            this.email = email;
            this.dob = dob;
            this.address = address;
            this.contact = contact;
            this.city = city;
            this.area = area;
        }

        public String getUsername() {
            return username;
        }

        public String getEmail() {
            return email;
        }

        public Date getDob() {
            return dob;
        }

        public String getAddress() {
            return address;
        }

        public String getContact() {
            return contact;
        }

        public String getCity() {
            return city;
        }

        public String getArea() {
            return area;
        }
    }
}
