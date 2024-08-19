package com.JWTMYSQL.demo.model;

public class TokenReqRes {

    private String username;
    private String password;
    private String token;
    private String refreshToken;

    // Default constructor
    public TokenReqRes() {
    }

    // Constructor with all fields
    public TokenReqRes(String username, String password, String token, String refreshToken) {
        this.username = username;
        this.password = password;
        this.token = token;
        this.refreshToken = refreshToken;
    }

    // Getters and setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public void setExpirationTime(String expirationTime) {
        // Method implementation here (optional, based on your use case)
    }
}
