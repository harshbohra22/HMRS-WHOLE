package hrms.hrms.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/external-jobs")
@CrossOrigin(origins = "*") // allow frontend to access this API
public class externalcontroller {

    private final String APP_ID = "a2514d40";

;
    private final String APP_KEY = "6733ad01616314d4ae530bf2211b3af6";

    @GetMapping
    public Object getExternalJobs(
            @RequestParam String what,
            @RequestParam String where,
            @RequestParam String country
    ) {
        String url = String.format(
                "https://api.adzuna.com/v1/api/jobs/%s/search/1?app_id=%s&app_key=%s&what=%s&where=%s",
                country, APP_ID, APP_KEY, what, where
        );

        RestTemplate rest = new RestTemplate();
        return rest.getForObject(url, Object.class);
    }
}
