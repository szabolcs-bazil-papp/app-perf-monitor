# AppPerfMonitor

## How to Build

1. Install dependencies using `npm i`
2. Serve local server with `npm run start`. Server will be available on `localhost:4200`

## Permitting Requests to the Actuator Endpoints

Amend your server security config to allow cross origin requests for actuator endpoints:

```java
@Configuration
@EnableWebSecurity
public class EszkSecurityConfig extends WebSecurityConfigurerAdapter {

  private static final CorsConfiguration STRICT_CORS_CONFIG = new CorsConfiguration();
  private static final CorsConfiguration PERMISSIVE_CORS_CONFIG;

  static {
    final CorsConfiguration corsConfig = new CorsConfiguration();
    corsConfig.applyPermitDefaultValues();
    corsConfig.setAllowedMethods(List.of(HttpMethod.GET.name()));
    PERMISSIVE_CORS_CONFIG = corsConfig;
  }

  /* ... */

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
      .csrf().disable()
      .cors()
      .configurationSource(req -> {
        if (req.getRequestURI().startsWith("/actuator")) {
          return PERMISSIVE_CORS_CONFIG;
        } else {
          return STRICT_CORS_CONFIG;
        }
      })
      .and()
      .authorizeRequests()
      /* further configuration omitted for brevity */
  }
```
