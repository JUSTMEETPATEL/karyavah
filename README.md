# 📌 Karyavah

A web-based platform that connects people who need work done (e.g., house painting, plumbing) with skilled workers offering those services. This includes a searchable, tag-based system, profile management, reviews, a ranking system for workers, and gamified leveling up as workers complete tasks and get rated.

---

## 🚧 Phases of Development

### Phase 1 – MVP (Core)

* User Authentication (Login/Register)  ✅
* Roles: Client & Worker
* Profile with bio, location, tags
* Post Jobs and Service Offers
* Search & Tag Filters
* Inquiry Messaging
* Admin Moderation Panel

### Phase 2 – Engagement & Trust

* Star Ratings and Text Reviews
* Worker Leveling System

  * Newbie → Skilled → Pro → Elite
* Expanding Service Reach by Level
* Notification System
* Profile Verification
* Reporting/Blocking Users

### Phase 3 – Smart Features

* Dynamic Tag Demand Analysis
* Rate Suggestion Engine
* Reputation-Based Worker Sorting
* Worker & Client Dashboards
* Location Heatmaps
* Real-Time Chat (optional)

### Phase 4 – Premium & Growth

* Paid Subscription Plans for Workers
* Badge System (Verified, Top Performer)
* Language Localization
* Mobile App (React Native)

---

## 🛢️ Database Schema Overview

Tables:

* users (id, name, email, password, role, location, bio, level, verified)
* tags (id, name)
* user\_tags (user\_id, tag\_id)
* jobs (id, user\_id, title, description, budget, location, status)
* services (id, user\_id, title, description, rate, location)
* job\_tags / service\_tags (linking tags to jobs/services)
* messages (id, sender\_id, receiver\_id, message, timestamp)
* reviews (id, reviewer\_id, reviewed\_id, job\_id, rating, comment, created\_at)
* worker\_levels (user\_id, level\_name, completed\_jobs, avg\_rating, reach\_km)
* notifications (id, user\_id, type, content, is\_read, created\_at)
* reports (id, reported\_by\_id, reported\_user\_id, reason, status)

---

## 🧩 REST API Route Structure

### Auth

* POST /auth/register
* POST /auth/login
* GET /auth/me

### Users

* GET /users/\:id
* PUT /users/\:id
* GET /users/\:id/reviews

### Jobs

* POST /jobs
* GET /jobs
* GET /jobs/\:id
* PUT /jobs/\:id
* DELETE /jobs/\:id

### Services

* POST /services
* GET /services
* GET /services/\:id
* PUT /services/\:id
* DELETE /services/\:id

### Tags & Search

* GET /tags
* GET /search?tags=\&location=

### Reviews

* POST /reviews
* GET /reviews/\:userId

### Messaging

* POST /messages
* GET /messages/\:conversationId

### Notifications

* GET /notifications
* PUT /notifications/\:id/read

### Reports

* POST /reports

---

## 🖼️ UI Wireframes Overview

1. Home Screen

   * Tabs: "Find Work" / "Find Talent"
   * Search bar, filters

2. Post Job / Service Form

   * Title, Description, Tags, Location, Rate/Budget

3. Search Results Page

   * Filter by tags, location, rating
   * Cards for jobs/services

4. Profile Page

   * Bio, Skills, Ratings, Reviews, Level Badge

5. Review & Rating Modal

   * Star input, optional text comment

6. Messaging

   * Chat thread between client and worker

7. Admin Panel

   * List of flagged users, reported posts, statistics

---

