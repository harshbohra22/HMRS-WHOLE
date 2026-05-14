# HMRS (HRMS) — 10 detailed Q&A to showcase the whole project

Use this in demos, viva, portfolio interviews, or stakeholder walkthroughs. Answers describe **this repository** as implemented.

---

### 1. What problem does this system solve, and who are the main users?

**Answer:**  
HMRS is a **Human Resource Management / hiring workflow** web application. It connects **employers (recruiters)** with **job seekers** around job advertisements, applications, and communication.

- **Employers** register, manage job postings tied to cities and job positions, and see all applications (e.g. via the Recruiter Dashboard). They can open a chat with a candidate in the context of a specific application.
- **Job seekers** browse internal listings (and optionally **external jobs** aggregated from Adzuna), apply to ads, track application status, and use **real-time chat** tied to an application.

The differentiator in this codebase is **AI-assisted screening**: after a candidate applies, an automated “AI Recruiter” can conduct a structured chat before a human fully takes over.

---

### 2. What is the end-to-end technical architecture (frontend, backend, data, real-time)?

**Answer:**  
The project is a **full-stack monorepo-style layout**:

- **Frontend:** React 19 + TypeScript + Vite + Tailwind. Routing via React Router (`/`, `/jobs`, registration pages, `/chat/:applicationId`, `/employer`). HTTP calls use Axios to `/api` (proxied in dev to the Spring server). Real-time chat uses **SockJS + STOMP** (`@stomp/stompjs`) to the `/ws` endpoint.
- **Backend:** Spring Boot 3.2, Java 17. Layered style: **REST controllers** → **service interfaces + managers** → **JPA repositories** → **H2 in-memory** database (configurable via `application.properties`). **Spring WebSocket** enables STOMP: clients publish to `/app/chat.send`; server broadcasts to `/topic/chat/{applicationId}`.
- **AI layer:** `AiScreeningManager` calls **Google Gemini** (`generateContent` REST API) with system + transcript context; replies are persisted as `BOT` messages and pushed over the same WebSocket topic.

So one browser session talks REST for CRUD/history and WebSockets for live messages—classic **SPA + API + push** pattern.

---

### 3. How does a job seeker move from “browsing” to “applied” to “in conversation”?

**Answer:**  
1. **Browse:** The **Jobs** page loads active job advertisements from the backend (`JobAdvertisementController` and related services). It can also show **external** listings through `/api/external-jobs`, which proxies to **Adzuna** with query parameters (`what`, `where`, `country`).
2. **Apply:** The seeker submits an **apply** request (`POST /api/applications/apply` with `ApplyJobRequest`: job advertisement id + job seeker id). `JobApplicationManager` validates the ad is active, checks duplicate application on the same ad+seeker pair, creates a `JobApplication` with initial status **`PENDING`**.
3. **Chat:** From “My Applications,” the user opens chat (Floating chat or `/chat/:applicationId`). The UI loads **REST** history (`GET /api/chat/{applicationId}/history`), then opens STOMP, subscribes to `/topic/chat/{applicationId}`, and sends messages to `/app/chat.send`. Each message is stored as a `ChatMessage` row linked to `applicationId`.

That single **application id** is the anchor: it ties the job, the seeker, status, and chat room together.

---

### 4. How does AI screening work, including limits and handoff to a human recruiter?

**Answer:**  
When a message arrives on `/app/chat.send` with sender type **job seeker**, `ChatController` saves it, broadcasts it, then calls `AiScreeningService.processAndReply(applicationId, content)` **asynchronously**.

`AiScreeningManager`:

1. **Runs only while** the application status is **`PENDING`**. If status is already `AWAITING_RECRUITER`, `ACCEPTED`, or `REJECTED`, the AI does nothing—humans or final decisions own the thread.
2. Loads full **chat history**, counts prior **`BOT`** messages, and chooses a **phase-specific system prompt**:
   - **Fewer than 5 bot messages:** the model must ask **exactly one** next professional question; decision/handoff tags are stripped if the model misbehaves.
   - **Five bot messages already sent:** the candidate’s latest message is treated as the answer to the fifth question. The model must **not** ask another screening question; it gives **feedback** (strengths, gaps, fit), thanks the candidate, and the reply is cleaned of the internal **`[HANDOFF: RECRUITER]`** tag before saving.
3. After that wrap-up message is saved, status updates to **`AWAITING_RECRUITER`**, signaling “AI phase complete—recruiter should review and set **ACCEPTED** or **REJECTED**” via `POST /api/applications/update-status`.

So the project showcases **governed LLM use**: bounded turns, explicit lifecycle state, and human-in-the-loop for final hiring outcomes.

---

### 5. How is real-time chat implemented on the wire, and why SockJS?

**Answer:**  
`WebSocketConfig` registers a STOMP endpoint **`/ws`** with **SockJS** fallback and permissive CORS patterns for development. The broker prefix is **`/topic`**; application destinations use **`/app`**.

Flow:

1. Client connects with SockJS to `/ws`, sends a STOMP CONNECT, then SUBSCRIBE to `/topic/chat/{applicationId}`.
2. On send, client publishes a JSON body to **`/app/chat.send`** (mapped in `ChatController`).
3. Server persists via `ChatService`, then **`SimpMessagingTemplate.convertAndSend("/topic/chat/" + id, dto)`** so every subscriber (seeker, employer, other tabs) receives the same payload.

SockJS is used so browsers and proxies that don’t behave well with raw WebSockets still get a **streaming HTTP fallback**—important for demos on restrictive networks.

---

### 6. What are the main domain entities and how do they relate?

**Answer:**  
Core JPA entities include:

- **Employer** — company profile and auth-related fields.
- **JobSeeker** — candidate profile.
- **City**, **JobPosition** — reference data for advertisements.
- **JobAdvertisement** — belongs to employer, position, city; fields like salary range, deadline, active flag.
- **JobApplication** — unique pair `(job_advertisement_id, job_seeker_id)`; **`status`** enum: `PENDING` → (after AI) `AWAITING_RECRUITER` → `ACCEPTED` or `REJECTED`.
- **ChatMessage** — `applicationId`, sender type (`JOBSEEKER`, `EMPLOYER`, `BOT`), ids, names, content, timestamp.

This model supports **one chat thread per application**, which mirrors how real ATS tools scope conversations to a specific requisition + candidate pair.

---

### 7. What REST APIs exist for recruiters and integrators?

**Answer:**  
Illustrative surface (not exhaustive):

- **Applications:** `POST /api/applications/apply`, `POST /api/applications/update-status`, `GET .../by-advertisement/{adId}`, `.../by-jobseeker/{seekerId}`, `.../getAll`.
- **Chat:** `GET /api/chat/{applicationId}/history`; STOMP `/app/chat.send` for live send; optional test route for AI connectivity.
- **Employers, job seekers, cities, job positions, job advertisements** — CRUD-style controllers under `/api/...` for registration and listing management.
- **External jobs:** `GET /api/external-jobs` with query params hitting Adzuna.

**springdoc-openapi** is on the classpath, so Swagger UI is available at the usual Spring Boot path for interactive exploration—useful to showcase API completeness in a portfolio.

---

### 8. How does the frontend stay maintainable and aligned with the backend?

**Answer:**  
The UI is split into **pages** (`Home`, `Jobs`, `RegisterEmployer`, `RegisterJobSeeker`, `ChatPage`, `EmployerDashboard`, `TestApi`), **reusable components** (layout, cards, chat windows), and **hooks** such as `useChat` (STOMP lifecycle + history merge) and `useChatNotification` (background subscriptions and unread counts for job seekers on the Jobs page).

**`vite.config.ts`** proxies `/api` and `/ws` to the backend URL (default `http://localhost:8080`), so the SPA can be served from Vite during development without CORS friction. Shared **TypeScript types** describe DTOs for jobs, applications, and chat—reducing drift between what the API returns and what React renders.

That separation is a good talking point for **clean architecture on the client**.

---

### 9. What about security, configuration, and operational concerns in this codebase?

**Answer:**  
- **Passwords:** The stack includes **Spring Security Crypto** (hashing capability); actual auth flows may be simplified for the academic/demo scope—worth stating honestly in an interview and naming hardening next steps (session/JWT, role guards on endpoints).
- **Secrets:** Gemini keys appear configurable via **`GEMINI_API_KEY`** / `gemini.api.key`; production guidance is **environment variables**, never committed secrets, and key rotation.
- **CORS:** Controllers use `@CrossOrigin(origins = "*")` for ease of local demos—production should narrow origins.
- **Database:** **H2 in-memory** means data resets when the JVM stops—fine for showcase; production would move to PostgreSQL/MySQL and migrations.
- **External API keys:** Adzuna credentials in `externalcontroller` should be externalized the same way as Gemini keys.

Demonstrating that you understand **demo vs production** posture is often as valuable as listing features.

---

### 10. How would you demo this project in 3 minutes to a non-technical stakeholder?

**Answer:**  
Suggested script:

1. **“This is an internal hiring portal.”** Open the home page, show employer vs seeker registration.
2. **“Companies post jobs; candidates apply once per job.”** Show an active listing and apply flow; point to **application status** on the dashboard (`PENDING` during AI chat).
3. **“The AI conducts a short structured interview in chat.”** Send a few seeker replies; show exactly **five** AI questions then a **summary message**; show status flipping to **`AWAITING_RECRUITER`**.
4. **“A human recruiter then decides.”** Open employer view, show same thread, explain they update status to hired or not.
5. **“Everything updates live.”** Open two browsers—show a message appearing without refresh thanks to WebSockets.
6. **Close:** Mention optional **external job board** integration and Swagger for API visibility.

That narrative hits **business value**, **automation boundary**, **human oversight**, and **technical credibility** without drowning the audience in stack names.

---

*Generated for the HMRS-WHOLE codebase. Adjust URLs and enum names if your branch diverges.*
