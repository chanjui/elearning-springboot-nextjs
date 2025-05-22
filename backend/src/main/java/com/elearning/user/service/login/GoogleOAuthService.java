package com.elearning.user.service.login;

import com.elearning.common.config.JwtProvider;
import com.elearning.user.dto.SocialLogin.GoogleUserInfoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import javax.net.ssl.*;
import java.security.cert.X509Certificate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class GoogleOAuthService {

  @Value("${oauth.google.client-id}")
  private String googleClientId;

  @Value("${oauth.google.client-secret}")
  private String googleClientSecret;

  @Value("${oauth.google.redirect-uri}")
  private String googleRedirectUri;

  private final RestTemplate restTemplate;
  private final JwtProvider jwtProvider;

  // SSL 검증을 무시하는 RestTemplate 생성
  private RestTemplate createIgnoreSSLRestTemplate() {
    try {
      TrustManager[] trustAllCerts = new TrustManager[]{
              new X509TrustManager() {
                public void checkClientTrusted(X509Certificate[] certs, String authType) {}
                public void checkServerTrusted(X509Certificate[] certs, String authType) {}
                public X509Certificate[] getAcceptedIssuers() { return new X509Certificate[0]; }
              }
      };

      SSLContext sslContext = SSLContext.getInstance("TLS");
      sslContext.init(null, trustAllCerts, new java.security.SecureRandom());
      HttpsURLConnection.setDefaultSSLSocketFactory(sslContext.getSocketFactory());
      HttpsURLConnection.setDefaultHostnameVerifier((hostname, session) -> true);

      return new RestTemplate();
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  public String getAccessToken(String code) {
    String tokenUrl = "https://oauth2.googleapis.com/token";

    MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
    params.add("code", code);
    params.add("client_id", googleClientId);
    params.add("client_secret", googleClientSecret);
    params.add("redirect_uri", googleRedirectUri);
    params.add("grant_type", "authorization_code");

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

    HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

    try {
      RestTemplate ignoreSSLTemplate = createIgnoreSSLRestTemplate();

      ResponseEntity<Map> response = ignoreSSLTemplate.exchange(
              tokenUrl,
              HttpMethod.POST,
              request,
              Map.class
      );

      System.out.println("Google 토큰 응답: " + response.getBody());

      return (String) response.getBody().get("access_token");

    } catch (Exception e) {
      System.err.println("❌ Google getAccessToken 오류:");
      e.printStackTrace();
      throw new RuntimeException("Google AccessToken 발급 실패");
    }
  }

  public GoogleUserInfoDTO getUserInfo(String accessToken) {
    String userInfoUrl = "https://www.googleapis.com/oauth2/v2/userinfo";

    HttpHeaders headers = new HttpHeaders();
    headers.setBearerAuth(accessToken);
    HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(headers);

    try {
      RestTemplate ignoreSSLTemplate = createIgnoreSSLRestTemplate();
      
      ResponseEntity<GoogleUserInfoDTO> response = ignoreSSLTemplate.exchange(
              userInfoUrl,
              HttpMethod.GET,
              request,
              GoogleUserInfoDTO.class
      );

      System.out.println("Google 유저 정보 응답: " + response.getBody());

      return response.getBody();
    } catch (Exception e) {
      System.err.println("❌ Google getUserInfo 오류:");
      e.printStackTrace();
      throw new RuntimeException("Google UserInfo 요청 실패");
    }
  }
}