# TaskHive Frontend -- Angular

**TaskHive** is a full-stack task management system inspired by tools like Jira.

This repository contains a **demonstration Angular frontend** whose primary purpose is to showcase and validate the TaskHive backend (.NET).

Backend: https://github.com/obiwan00/taskhive-backend <br>
Live Demo: https://white-mud-0bd195c03.2.azurestaticapps.net/ (desktop only, no mobile support)

## Project Purpose

This frontend exists primarily to:

- Showcase and validate all capabilities of the TaskHive backend.
- Enable interaction with backend features such as authentication, projects, tickets, and project members management.
- Provide a well-structured Angular project with feature-based organization, guards, and routing.

> This is not intended as a production-ready frontend. Its main purpose is to explore and validate backend functionality.

## Tech Stack

- Angular 21
- Angular Material
- ESLint
- TypeScript
- SCSS

## Project Structure

High-level view of ./src/app:

```txt
./src/app
├── core           # Services, guards, tokens, interceptors, user/auth management
├── features       # Feature modules: auth, projects, tickets, my-tickets etc.
├── layouts        # App and auth layouts, header/footer components
├── shared         # Shared UI components, pipes, directives, utils
├── app.routes.ts  # Root routes
└── app.ts         # App entry component
```

## Routing Overview

```txt
/auth                                      # Unauthenticated
├── login                                    → LoginPage
└── register                                 → RegistrationPage

/app                                       # Authenticated
├── my-tickets                               → MyTicketsPage
├── projects/list                            → ProjectsListPage
├── projects/:projectId/board                → ProjectBoardPage
├── projects/:projectId/members              → ProjectMembersPage
└── projects/:projectId/tickets/:ticketId    → TicketDetailsPage

/unsupported-screen                        → UnsupportedScreenPage
```

## Implemented Features

- Auth
  - Login and registration (JWT + refresh tokens)
  - Interceptors for token management, automatic token refresh
  - Guards for authenticated/unauthenticated access

- Projects
  - Projects list (searchable and filterable)
  - Project board with tickets overview (searchable and filterable)
  - Project members management with roles (Roles: `Owner`, `Member`, `Viewer`)
  - Project permissions enforcement via guards and `canProject` pipe

- Tickets
  - Create and edit ticket details (title, description, status, assignees)
  - Visual indicator showing whether ticket changes were successfully saved

- My Tickets
  - View tickets assigned to the current user (searchable and filterable)

- Screen constraints
  - Friendly informational page for unsupported screen resolutions

## Known Limitations

- No state management library (e.g., NgRx, Akita) used for simplicity
- No unit tests implemented
- No tablet or mobile device support
- Angular Material components not encapsulated into separate UI components
- Not all files follow BEM methodology
- Styles are partially inconsistent; duplication may exist across components
- UI elements are basic; no skeleton loaders or advanced loading states

## Documentation

- [Local Development](docs/local-development.md)
- [Deployment](docs/deployment.md)
