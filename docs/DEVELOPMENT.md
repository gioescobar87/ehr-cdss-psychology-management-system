# Development Guide

## 1. Overview

This document describes how to prepare a local development environment for the Clinical Psychology Management System.

The repository contains a Spring Boot backend and a React frontend. The backend exposes REST APIs and connects to PostgreSQL, while the frontend provides the web interface.

The application also integrates with AWS services for clinical document storage and supports a cloud deployment workflow.

These instructions focus on local development. Production deployment and infrastructure provisioning are documented separately in [DEPLOYMENT.md](DEPLOYMENT.md).

## 2. Prerequisites

Install the following tools before starting development.

| Tool | Purpose |
| --- | --- |
| Git | Source control and repository management |
| JDK 21 | Backend compilation and execution |
| Maven Wrapper | Backend build and dependency management |
| Node.js | Frontend development and build tooling |
| npm | Frontend dependency management |
| PostgreSQL | Local relational database |
| Docker | Optional containerized development and image builds |
| AWS CLI | Required for development workflows that access AWS |
| AWS CDK | Required when working with infrastructure definitions |

Use versions compatible with the project's current dependencies and configuration.

The repository includes a Maven Wrapper, so a separate Maven installation is generally unnecessary.

## 3. Clone the Repository

Clone the repository and navigate to its root directory.

```bash
git clone https://github.com/gioescobar87/ehr-cdss-psychology-management-system.git

cd ehr-cdss-psychology-management-system
```

Inspect the repository structure to locate the backend, frontend, and infrastructure directories.

The backend is located at:

```text
backend/clinical-system/
```

The frontend and infrastructure directories should be verified against the current repository layout.

## 4. Database Setup

The backend uses PostgreSQL for relational persistence.

### 4.1 Create a Development Database

Install and start PostgreSQL locally, then create a dedicated database for development.

For example, using `psql` with an administrative account:

```sql
CREATE DATABASE clinical_system;
```

Create or configure a dedicated database user with the permissions needed by the application. Avoid using the PostgreSQL administrative account for normal application execution.

The database name above should match the local configuration. Change either the database or the configuration if your development environment uses a different name.

### 4.2 Database Migrations

The project uses Flyway to manage database schema changes.

Before starting the application, verify:

- The database is running and reachable.
- The configured database credentials are valid.
- The required migration files are present.
- The configured Flyway behavior matches the current application setup.

Allow the application to run its configured migrations, or follow the repository's documented migration procedure.

Do not manually recreate tables that are already managed by Flyway. Avoid modifying previously applied migration scripts; add a new versioned migration when a schema change is required.

## 5. Backend Configuration

### 5.1 Navigate to the Backend

From the repository root:

```bash
cd backend/clinical-system
```

### 5.2 Configure Environment Variables

The backend supports environment-specific configuration and imports environment variables from a local `.env` file where configured.

Review the backend's application configuration and identify the variables required by the active development profile.

Depending on the current configuration, these may include:

- Database URL, username, and password.
- JWT signing configuration and token expiration settings.
- Frontend URL used for CORS configuration.
- AWS region and document-storage bucket configuration.
- AWS credentials or profile selection, when AWS access is required.
- SMTP configuration, if email functionality is being tested.

Use the actual property names defined by the application. Do not assume that illustrative names in external documentation are interchangeable with the project's configuration.

If the repository contains an `.env.example` file, use it as the starting point. Otherwise, create a local configuration file based on the properties defined in the application configuration.

Never commit real credentials, private keys, tokens, or production secrets.

### 5.3 AWS Configuration

Some backend workflows interact with Amazon S3 and other AWS resources.

If the local application requires AWS access, configure the AWS CLI with an authorized development profile and grant only the permissions required for the relevant operations.

For example, if an authorized development profile already exists:

```powershell
$env:AWS_PROFILE = "your-development-profile"
```

Replace the placeholder with your actual profile name.

Do not copy production credentials into local configuration or commit AWS credentials to the repository.

If a feature does not require AWS access, avoid configuring broader AWS permissions than necessary.

### 5.4 Run the Backend

On Windows, use the Maven Wrapper:

```powershell
.\mvnw.cmd spring-boot:run
```

On Linux or macOS:

```bash
./mvnw spring-boot:run
```

Wait for the application to finish initializing.

Review the logs for database connection failures, migration errors, missing configuration properties, security initialization issues, or failed AWS integrations.

The backend's configured port and active Spring profile should be confirmed in the application configuration.

## 6. Frontend Configuration

### 6.1 Navigate to the Frontend

From the repository root, navigate to the directory containing the frontend's `package.json`.

If the application is located in a root-level `frontend/` directory:

```bash
cd frontend
```

If the actual directory differs, use the corresponding path.

### 6.2 Install Dependencies

```bash
npm install
```

Use the committed lockfile and the repository's documented package-manager conventions to keep dependency resolution reproducible.

### 6.3 Configure the API URL

Review the frontend's environment configuration to determine how the backend API URL is supplied.

For a Vite application, environment variables exposed to client-side code commonly use the `VITE_` prefix. The actual variable name must match the frontend implementation.

A local configuration may point to the backend's local HTTP endpoint, using the port configured by Spring Boot.

Do not place secrets in frontend environment variables. Values exposed to a browser application are not private.

### 6.4 Run the Frontend

```bash
npm run dev
```

Open the local URL printed by Vite in the terminal.

Verify that:

- The frontend starts without compilation errors.
- The API URL points to the intended backend.
- The browser can reach the backend.
- CORS settings allow the configured development origin.
- Authentication and session behavior work as expected.

## 7. Running the Application Locally

A typical development workflow is:

1. Start PostgreSQL.
2. Configure the backend environment.
3. Start the Spring Boot application.
4. Confirm that the backend has initialized successfully.
5. Configure and start the React frontend.
6. Open the application in the browser.
7. Authenticate with an authorized development account.
8. Test the intended workflow using synthetic data.

The frontend and backend must use compatible API URLs and environment settings.

If authentication fails, inspect the browser's network requests and backend logs before changing security configuration.

## 8. Testing

Testing should be performed before committing changes and before deploying a new version.

### 8.1 Backend Tests

From `backend/clinical-system/`, run:

```powershell
.\mvnw.cmd test
```

On Linux or macOS:

```bash
./mvnw test
```

Review the test results and resolve failures before proceeding.

### 8.2 Frontend Checks

From the frontend directory, inspect the scripts defined in `package.json`.

Run the available linting, type-checking, and test commands.

For example, if these scripts exist:

```bash
npm run lint
npm run build
```

The production build helps identify compilation and type-checking issues that may not be apparent during development.

Do not assume that a test script exists without checking the project's package configuration.

### 8.3 Manual Verification

For changes affecting clinical workflows or authorization, verify both successful and unauthorized scenarios.

Examples include:

- A psychologist accessing an assigned patient.
- A psychologist attempting to access a patient outside their assignment.
- A coordinator performing an authorized assignment operation.
- An unauthenticated request to a protected endpoint.
- A user attempting an operation outside their assigned permissions.
- A diagnostic rule evaluation with matching and nonmatching criteria.

Use synthetic clinical data for all development and testing activities.

## 9. Database and Data Management

Database changes should be managed through version-controlled Flyway migrations.

When introducing a new entity or modifying an existing one:

1. Define the required schema change.
2. Add a new migration where applicable.
3. Update the persistence model and repository.
4. Update service logic and validation.
5. Update DTOs, mappings, and API endpoints where required.
6. Test persistence, validation, and authorization behavior.

Use development-only seed data where necessary. Never use identifiable patient records from a real clinical environment in a local development database unless an explicitly authorized and appropriately protected process permits it.

## 10. Security Considerations During Development

Development configuration should preserve the application's important security boundaries.

- Never commit `.env` files containing secrets.
- Do not expose JWT signing keys or refresh tokens in logs.
- Do not disable authentication to simplify testing.
- Do not replace server-side authorization with frontend-only checks.
- Do not make clinical documents publicly accessible to resolve storage problems.
- Avoid logging sensitive clinical fields.
- Use synthetic patient records.
- Keep local configuration separate from production configuration.
- Use least-privilege credentials for AWS development access.

Changes to encryption, authentication, authorization, and document access should be tested before deployment.

## 11. Troubleshooting

### Backend Fails to Start

Check:

- The installed JDK version.
- The active Spring profile.
- Missing environment variables.
- Database connectivity and credentials.
- Flyway migration errors.
- Port conflicts.
- AWS configuration when required by the active workflow.

### Database Connection Errors

Confirm that PostgreSQL is running, the database exists, and the configured connection URL and credentials are correct.

Check whether the application is attempting to connect to a local or remote database.

### Frontend Cannot Reach the Backend

Verify the backend URL configured in the frontend, the backend's listening port, and the CORS settings.

Inspect the browser console and network panel for failed requests and HTTP error responses.

### Authentication or Authorization Failures

Check token expiration, session state, endpoint security configuration, user status, and role and permission assignments.

For patient-specific operations, also verify the user's patient assignment.

### AWS or Document Storage Errors

Confirm the AWS region, bucket configuration, active credentials, IAM permissions, and network connectivity.

Use the backend logs to identify the failing operation without exposing secrets or clinical information.

### Migration Failures

Review the Flyway error message and the state of the development database.

Do not delete migration history or modify previously applied migrations merely to bypass a failure. Determine whether the database requires a new migration or a controlled reset of disposable development data.

## 12. Development Workflow

A recommended workflow for implementing a feature is:

1. Review the existing domain model and related application modules.
2. Define the required behavior and authorization rules.
3. Implement the persistence and business logic changes.
4. Add or update database migrations.
5. Implement the API contract and validation.
6. Update the frontend when necessary.
7. Add relevant automated tests.
8. Run backend tests and frontend checks.
9. Verify the workflow manually using synthetic data.
10. Review the changes for security issues and unintended regressions.
11. Commit the changes with a descriptive message.

Keep changes focused and avoid unrelated refactoring when modifying established clinical workflows.

## 13. Related Documentation

- [Project README](../README.md)
- [System Architecture](ARCHITECTURE.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Feature Reference](FEATURES.md)
- [Security Documentation](SECURITY.md)
