package hrms.hrms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {

        CorsConfiguration config = new CorsConfiguration();

        // ALLOWED ORIGINS (VERY IMPORTANT)
        config.setAllowedOrigins(Arrays.asList(
                "https://hmrs-six.vercel.app",        // NEW deployment
                "https://hmrs-fullstack3.vercel.app", // your live frontend
                "https://hmrs-fullstack2.vercel.app", // previous deployment
                "http://localhost:5173",              // local frontend
                "http://localhost:5174"               // local frontend alternate
        ));

        // Allowed methods
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Allowed headers
        config.setAllowedHeaders(Arrays.asList("*"));

        // Important for login/auth cookies or tokens
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
