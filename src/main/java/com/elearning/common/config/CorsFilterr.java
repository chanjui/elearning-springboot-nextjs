package com.elearning.common.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CorsFilterr implements Filter {

    public CorsFilterr() {
        System.out.println("✅ CorsFilter 로딩됨!");
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        // 요청의 Origin 가져오기
        String origin = request.getHeader("Origin");
        
        // 허용할 도메인 목록
        if (origin != null && (
            origin.equals("http://localhost:3000") || 
            origin.equals("https://elearning-frontend-smoky.vercel.app"))) {
            
            // CORS 헤더 설정
            response.setHeader("Access-Control-Allow-Origin", origin);
            response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
            response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader("Access-Control-Expose-Headers", "Set-Cookie");
            response.setHeader("Access-Control-Max-Age", "3600");
        }

        // OPTIONS 요청은 여기서 바로 끝냄
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        // 나머지 요청은 필터 체인 계속 진행
        chain.doFilter(req, res);
    }
}