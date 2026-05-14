# Interviewer questions and answers (screening bank)

यह फ़ाइल उन सामान्य सवालों और नमूना जवाबों का संग्रह है जो एक interviewer / technical recruiter स्क्रीनिंग या पहले राउंड में पूछ सकता है। जवाब उम्मीदवार की तरफ से दिए गए **नमूने** हैं — हर उम्मीदवार को अपने अनुभव के अनुसार अनुकूलित करना चाहिए।

---

## 1. Introduction and background

**Q1. Tell me about yourself.**  
**A (sample):** I am a [role] with [X] years in [domain]. I’ve worked on [2–3 concrete projects or outcomes]. I enjoy [specific skill: e.g. building APIs, talking to customers] and I’m looking for a role where I can [clear goal].

**Q2. Walk me through your resume / last role.**  
**A:** In my last role at [company], I was responsible for [scope]. I delivered [metric or outcome]. The tech stack included [list]. The hardest part was [challenge] and I handled it by [action].

**Q3. Why are you looking for a change?**  
**A:** I want [growth / new domain / better alignment with skills]. I’ve learned [X] in my current role and I’m ready for [next step]. I’m not running away from problems—I want a clearer path for [learning / impact / leadership].

**Q4. Why this company / role?**  
**A:** I read about [product or mission]. It connects to my experience in [area]. This role’s focus on [from JD] matches what I want to do next.

**Q5. Where do you see yourself in 3–5 years?**  
**A:** I want to deepen expertise in [area] and take on more ownership—either as a senior IC or leading small initiatives. I care more about impact and learning than a fixed title.

---

## 2. Behavioral (STAR-style)

**Q6. Tell me about a time you missed a deadline.**  
**A:** Situation: [project + constraint]. Task: deliver [X]. Action: I flagged risk early, reprioritized with the team, and communicated to stakeholders. Result: we shipped [partial / full] with a new date everyone agreed on. I learned to surface blockers earlier.

**Q7. Describe a conflict with a teammate.**  
**A:** We disagreed on [technical approach / priority]. I listened to their reasoning, shared data/tests, and we tried a small spike. We chose [outcome] based on evidence. Relationship stayed professional.

**Q8. Tell me about a failure.**  
**A:** I [what went wrong]. Impact was [X]. I owned it, fixed [immediate issue], and added [process / test / doc] so it wouldn’t repeat. I’m more careful about [lesson] now.

**Q9. A time you went above and beyond.**  
**A:** Customer / internal user had [pain]. I wasn’t asked but I [action]. Outcome: [metric or feedback]. It aligned with team goals.

**Q10. How do you handle feedback you disagree with?**  
**A:** I try to understand the intent. I ask clarifying questions. If I still disagree, I propose a small experiment or data to compare options. I don’t argue for ego—I argue for better outcomes.

**Q11. Multitasking / many priorities.**  
**A:** I list priorities with the manager, estimate effort, and say no or defer with transparency. I use a single backlog and time-box deep work.

**Q12. Working with a difficult stakeholder.**  
**A:** I scheduled short syncs, documented decisions, and focused on shared goals. I escalated only when options were clear and blocked.

---

## 3. Motivation, culture, and remote work

**Q13. What motivates you?**  
**A:** Solving real user problems, measurable impact, and working with people who care about quality.

**Q14. What kind of manager helps you succeed?**  
**A:** Clear expectations, regular 1:1s, autonomy with support when stuck, and honest feedback.

**Q15. How do you work in a remote / hybrid team?**  
**A:** Over-communicate in writing, respect time zones, use async updates, and keep meetings focused with agendas.

**Q16. What is your ideal team size?**  
**A:** Small cross-functional teams (roughly 5–9) where I know dependencies and can own a slice end-to-end.

**Q17. How do you learn new technology?**  
**A:** Official docs first, a small toy project, then apply on a real task with code review.

---

## 4. Technical screening (general software)

**Q18. Explain REST in one minute.**  
**A:** REST uses HTTP verbs and resource URLs. Stateless requests; common formats JSON; status codes convey result (2xx success, 4xx client, 5xx server).

**Q19. Difference between GET and POST.**  
**A:** GET should be safe/idempotent for reads; parameters often in URL. POST sends body; used for creates or non-idempotent actions.

**Q20. What is idempotency?**  
**A:** Same request repeated produces the same effect as once—important for retries (e.g. PUT vs POST for payment).

**Q21. SQL: difference between INNER and LEFT JOIN.**  
**A:** INNER returns rows matching both tables. LEFT keeps all rows from the left table and nulls for non-matches on the right.

**Q22. What is an index? Trade-off?**  
**A:** Index speeds lookups/sorts; cost is extra storage and slower writes and need to choose columns wisely.

**Q23. ACID properties.**  
**A:** Atomicity, Consistency, Isolation, Durability—guarantees for reliable transactions in databases.

**Q24. What is OAuth2 at a high level?**  
**A:** Delegated authorization: user approves an app to access resources on their behalf via tokens, without sharing password with the client app.

**Q25. JWT basics.**  
**A:** Signed (often) JSON claims; stateless for auth if validated correctly; watch expiry, revocation, and secret/key management.

**Q26. Horizontal vs vertical scaling.**  
**A:** Vertical: bigger machine. Horizontal: more machines—needs load balancing and often stateless services.

**Q27. What is caching? Where do you use it?**  
**A:** Store copies of expensive results (CDN, Redis, HTTP cache). Must handle invalidation and stale data.

**Q28. Microservices vs monolith (trade-offs).**  
**A:** Monolith simpler to deploy/debug early; microservices help scale teams and isolate failures but add network, ops, and consistency complexity.

**Q29. What is CI/CD?**  
**A:** Automated build, test, and deploy pipelines so changes integrate safely and reach production reliably.

**Q30. Explain a bug you debugged recently.**  
**A:** Symptom → hypothesis → logs/metrics → minimal repro → root cause → fix + test. (Fill with real example.)

---

## 5. System design (high level)

**Q31. Design a URL shortener (high level).**  
**A:** API to create short codes; store mapping in DB; redirect service; handle collisions; rate limits; analytics optional.

**Q32. How would you add real-time chat?**  
**A:** WebSockets or SSE; message broker if multi-instance; persist messages; auth per room; presence optional.

**Q33. How do you secure an API?**  
**A:** HTTPS, authn (tokens), authz (roles), input validation, rate limiting, dependency updates, secrets in vault—not in code.

---

## 6. HR / recruiter-specific (this HRMS context)

**Q34. Why HR / recruitment tech interests you?**  
**A:** Hiring affects people’s careers; good tools reduce bias and save time; I want to build fair, transparent processes.

**Q35. How would you treat candidate data?**  
**A:** Minimize collection, encrypt in transit/at rest, access on need-to-know, retention policy, comply with local privacy laws.

**Q36. How do you reduce bias in screening?**  
**A:** Structured rubrics, same core questions for all, avoid illegal questions, document decisions, diverse interview panels where possible.

**Q37. What makes a good job description?**  
**A:** Clear must-have vs nice-to-have, realistic seniority, salary range if local law allows, inclusive language, and real responsibilities not buzzwords only.

**Q38. Candidate ghosted after offer—what do you do?**  
**A:** Follow up politely, check communication channel, offer to clarify doubts; internally track funnel metrics; no harassment.

**Q39. How do you give rejection feedback?**  
**A:** Brief, respectful, optional high-level reason if policy allows; invite to apply again if genuinely suitable later.

---

## 7. Situational for recruiters / hiring managers

**Q40. Two strong finalists, one slot—how do you decide?**  
**A:** Revisit rubric with hiring manager; tie-break with team need (skill gap); document rationale for audit.

**Q41. Hiring manager wants “rockstar only” language—your response?**  
**A:** Suggest inclusive wording that still signals high bar; explain research on how language affects applicant pool.

**Q42. Role open 60 days—what do you check?**  
**A:** Comp vs market, JD accuracy, sourcing channels, interview process length, feedback loop speed.

---

## 8. Closing questions (candidate → interviewer)

**Q43. What does success look like in the first 90 days?**  
**A (candidate asking):** Shows you want to align early—note answer and reflect it in follow-up.

**Q44. What are the biggest challenges for this team right now?**  
**A:** Shows maturity; listen for honesty vs vague positivity.

**Q45. How is performance reviewed?**  
**A:** Clarifies expectations and growth path.

---

## 9. Quick-fire (short answers)

| Question | Sample answer direction |
|----------|-------------------------|
| Greatest strength? | 1 strength + 1 proof (metric or story) |
| Greatest weakness? | Real area + concrete improvement steps |
| Salary expectation? | Range based on research; willingness to discuss total comp |
| Notice period? | Honest timeline + handover plan |
| Willing to relocate? | Yes/No + conditions clearly |
| Preferred stack? | List honestly; willingness to learn adjacent tech |
| Do you have other offers? | Optional to share; stay professional |
| Part-time / contract? | State preference and constraints |

---

## 10. Illegal or sensitive topics (India / general)

Interviewers should **not** ask in a discriminatory way about: religion, caste, marital status, pregnancy plans, age (except legal work age), disability (unless job-related accommodation process).  
**Candidate response (if asked):** “I prefer to keep personal details private. Happy to discuss job-related skills and availability.”

---

## Usage in this project

- इसे **AI screening prompts** में seed context के रूप में उपयोग न करें यदि आप चाहते हैं कि मॉडल सिर्फ लाइव बातचीत से सीखे—तब यह **human recruiter** और **content team** के लिए reference है।  
- आप चाहें तो `MIN_AI_SCREENING_QUESTIONS` के बाद feedback में इन रूब्रिक्स को manually map कर सकते हैं।

---

## 11. Java / Spring Boot (this codebase style)

**Q46. `@RestController` vs `@Controller`.**  
**A:** `@RestController` = `@Controller` + `@ResponseBody` on class—return values go to HTTP body (e.g. JSON). `@Controller` often used with views (Thymeleaf) without `@ResponseBody` on every method.

**Q47. What is dependency injection in Spring?**  
**A:** Spring creates and wires beans; you declare dependencies via constructor or fields; easier testing and loose coupling.

**Q48. `@Transactional` — what does it do?**  
**A:** Wraps method in a DB transaction; commit on success, rollback on unchecked exceptions (default behavior—know your propagation and rollback rules).

**Q49. JPA `Entity` vs DTO—why both?**  
**A:** Entity maps DB; DTO exposes stable API shape, avoids lazy-loading leaks, and hides internal fields.

**Q50. WebSocket vs HTTP for chat.**  
**A:** WebSocket: persistent bidirectional channel, lower overhead for many messages. HTTP polling: simpler but heavier; good for low-frequency updates.

**Q51. What is CORS?**  
**A:** Browser security: server must allow origins/headers/methods for cross-origin XHR/fetch; backend configures `Access-Control-*`.

**Q52. How do you handle API errors consistently?**  
**A:** Global exception handler, stable error schema (code, message), correct HTTP status, no stack traces to clients in prod.

**Q53. `Optional` — when to use?**  
**A:** For return types that may be absent; avoid as fields; don’t use only to null-check without a clear API contract.

**Q54. Streams vs loops in Java.**  
**A:** Streams good for pipeline transforms; loops clearer for complex stateful logic or performance-critical tight loops.

**Q55. What is Hibernate N+1?**  
**A:** Loading parent then one query per child; fix with fetch join, `@EntityGraph`, or batch size.

---

## 12. React / TypeScript (frontend)

**Q56. Controlled vs uncontrolled input.**  
**A:** Controlled: React state owns value. Uncontrolled: DOM owns value; refs to read—use when integrating legacy or file inputs.

**Q57. `useEffect` dependency array—why empty `[]`?**  
**A:** Run once on mount; omitting array runs every render (usually wrong for subscriptions).

**Q58. How do you avoid unnecessary re-renders?**  
**A:** Split state, `useMemo`/`useCallback` when profiling shows need, stable keys, avoid inline object props that change identity every render.

**Q59. Client-side routing—what breaks on refresh?**  
**A:** SPA needs server fallback to `index.html` for deep links; dev server handles it; production needs web server config.

**Q60. Axios interceptor use case.**  
**A:** Attach auth token, centralize error logging, transform responses globally.

---

## 13. Security and privacy (apps like HRMS)

**Q61. Storing passwords.**  
**A:** Never plain text; strong adaptive hash (e.g. bcrypt/Argon2), unique salt per user, rate limit login.

**Q62. PII in logs.**  
**A:** Don’t log national IDs, full DOB, tokens; redact or structured logging with allowlist.

**Q63. Principle of least privilege.**  
**A:** Users/services get minimum access needed; review periodically.

---

## 14. More behavioral (short A patterns)

**Q64. Tell me about a time you disagreed with your manager.**  
**A:** Respectful disagreement + data + outcome; willingness to commit once decision made.

**Q65. Pressure / stress.**  
**A:** Break work, communicate early, exercise/sleep routine, escalate when scope unrealistic.

**Q66. Proudest project.**  
**A:** Problem, your role, tech, measurable outcome, what you’d improve next time.

**Q67. Why should we hire you?**  
**A:** Map 3 strengths to JD + proof; not generic superlatives.

**Q68. Questions for us?**  
**A:** Team structure, on-call, tech debt, success metrics, next interview step.

**Q69. Availability for interviews / start date.**  
**A:** Honest calendar + notice period compliance.

**Q70. Visa / work authorization (if legal in your region).**  
**A:** State facts simply; employer decides eligibility.

---

## 15. Data and SQL (more)

**Q71. Normalization—why?**  
**A:** Reduce redundancy, anomalies; trade-off: more joins—sometimes denormalize for read perf.

**Q72. Primary key vs unique constraint.**  
**A:** PK uniquely identifies row and is NOT NULL; unique allows one NULL often (DB-dependent).

**Q73. `GROUP BY` and `HAVING`.**  
**A:** `GROUP BY` aggregates rows; `HAVING` filters groups (like WHERE for aggregates).

**Q74. Explain `EXPLAIN` / query plan (concept).**  
**A:** DB shows how it executes query—sequential scan vs index—tune based on that.

**Q75. CAP theorem (one line each).**  
**A:** Consistency, Availability, Partition tolerance—under partition, choose between C and A in practice.

---

## 16. Leadership / senior IC (if role is senior)

**Q76. How do you mentor juniors?**  
**A:** Pairing, clear tasks, safe code review tone, growth goals in 1:1s.

**Q77. Tech debt decision.**  
**A:** Cost of delay vs shipping; document debt; pay down in slices tied to features touching that area.

**Q78. Incident response.**  
**A:** Mitigate, communicate status page, postmortem blameless, action items with owners.

---

## 17. One-line “red flag” answers to avoid (candidate side)

- Bad-mouthing previous employer without ownership.  
- “I don’t know” with no follow-up—prefer “I haven’t used X; I’d read docs and prototype.”  
- Lying about skills—will surface in technical round.

---

*File generated as a structured bank. Expand any section with your domain (e.g. Java, React, data science) as needed.*
