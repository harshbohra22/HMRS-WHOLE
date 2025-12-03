package hrms.hrms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // Allow all origins (you can restrict this to specific domains in production)
        // Note: Cannot use setAllowCredentials(true) with addAllowedOriginPattern("*")
        // So we'll allow credentials only for specific origins or remove credentials
        config.addAllowedOriginPattern("*");

        // Allow all headers
        config.addAllowedHeader("*");

        // Allow all HTTP methods
        config.addAllowedMethod("*");

        // Allow credentials (cookies, authorization headers)
        // If you need credentials, specify exact origins instead of "*"
        config.setAllowCredentials(true);
        // config.addAllowedOrigin("http://localhost:5173");
        // config.addAllowedOrigin("https://yourdomain.com");

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
