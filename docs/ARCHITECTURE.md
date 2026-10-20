# System Architecture

## 1. Overview

The Clinical Psychology Management System is a full-stack Electronic Health Record (EHR) and Clinical Decision Support System (CDSS) designed to support clinical documentation, patient management, psychological care workflows, and rule-based diagnostic decision support.

The application follows a **modular monolith architecture**. The frontend and backend are separate applications, while the backend organizes business functionality into cohesive modules deployed as a single application.

The architecture prioritizes maintainability, controlled access to sensitive clinical information, reproducible infrastructure provisioning, and a deployment model appropriate for the project's scope.

## 2. Architectural Principles

The system follows these principles:

- **Separation of concerns:** Presentation, business logic, persistence, and infrastructure responsibilities are separated.
- **Modularity:** Clinical and administrative capabilities are organized into distinct functional modules.
- **Server-side security:** Authentication and authorization decisions are enforced by the backend.
- **Data protection:** Sensitive information and clinical documents require appropriate encryption and access controls.
- **Deterministic decision support:** Diagnostic suggestions are generated through explicitly modeled rules rather than machine learning or probabilistic inference.
- **Infrastructure as code:** AWS resources are defined and managed through AWS CDK.
- **Reproducibility:** Database schema changes and application builds are managed through version-controlled tooling.

## 3. High-Level Architecture

```mermaid
flowchart TB
    USER[Authorized Users]
    subgraph FRONTEND["Presentation Layer"]
        WEB[React + TypeScript + Material UI]
    end

    subgraph CLOUD["AWS Application Infrastructure"]
        ALB[Application Load Balancer]
        ECS[Amazon ECS Fargate]
        subgraph BACKEND["Spring Boot Modular Monolith"]
            AUTH[Authentication and Authorization]
            CLIN[Clinical Management]
            ADMIN[User and Coordination Management]
            REPORTS[Reporting]
            CDSS[Diagnostic Decision Support]
        end

        RDS[(Amazon RDS PostgreSQL)]
        S3[(Private Amazon S3 Bucket)]
    end

    USER --> WEB
    WEB -->|HTTPS REST API requests| ALB
    ALB --> ECS
    ECS --> AUTH
    AUTH --> CLIN
    AUTH --> ADMIN
    AUTH --> REPORTS
    CLIN --> CDSS
    CLIN --> RDS
    ADMIN --> RDS
    REPORTS --> RDS
    CDSS --> RDS
    CLIN --> S3
```

The diagram illustrates the logical application architecture and intended AWS deployment model. Actual frontend hosting and delivery resources must be verified against the deployed infrastructure.

## 4. Technology Stack

### Backend

| Technology | Responsibility |
| --- | --- |
| Java 21 | Backend programming language |
| Spring Boot | Application configuration and service runtime |
| Spring MVC | REST API endpoints |
| Spring Security | Authentication and authorization |
| Spring Data JPA | Persistence abstraction |
| Hibernate | Object-relational mapping |
| Flyway | Version-controlled database migrations |
| Maven | Dependency management and build automation |

### Frontend

| Technology | Responsibility |
| --- | --- |
| React | User interface and component composition |
| TypeScript | Static type checking |
| Vite | Frontend development server and build tooling |
| Material UI | Interface components and styling |

### Data and Infrastructure

| Technology | Responsibility |
| --- | --- |
| PostgreSQL | Relational persistence |
| Docker | Application containerization |
| Amazon ECR | Container image registry |
| Amazon ECS Fargate | Managed container execution |
| Amazon RDS | Managed PostgreSQL database |
| Amazon S3 | Clinical document storage |
| Amazon VPC | Network isolation |
| Application Load Balancer | Backend traffic routing |
| AWS Certificate Manager | TLS certificate management |
| AWS CDK | Infrastructure as code |
| GitHub Actions | CI/CD automation |

## 5. Backend Architecture

The backend is organized around a layered architecture within a modular monolith.

### 5.1 Presentation Layer

The presentation layer exposes REST endpoints through Spring MVC controllers.

Responsibilities include:

- Receiving and validating HTTP requests.
- Enforcing endpoint-level security requirements.
- Mapping requests and responses through data-transfer objects (DTOs).
- Delegating business operations to application services.
- Returning appropriate HTTP status codes and response bodies.

Controllers should not contain complex business logic or directly manage persistence operations.

### 5.2 Application and Business Logic Layer

The service layer coordinates application workflows and enforces business rules.

Examples include:

- Patient registration and management.
- Clinical history management.
- Appointment and session workflows.
- User and role administration.
- Patient assignment management.
- Diagnostic rule evaluation.
- Coordination reporting.

Where applicable, service interfaces and implementations separate application contracts from implementation details.

### 5.3 Persistence Layer

Repositories use Spring Data JPA and Hibernate to interact with PostgreSQL.

The persistence layer is responsible for database access, while Flyway manages schema evolution through version-controlled migration scripts.

Business rules and authorization decisions should not depend exclusively on frontend behavior or database visibility.

### 5.4 Data Transfer and Mapping

DTOs define the data exposed by API endpoints. Mapping between DTOs and persistence entities helps separate the public API contract from the internal database model.

This approach also allows request validation and response shaping without exposing every entity field to clients.

## 6. Authentication and Authorization

The application uses JWT-based authentication with database-backed refresh-token management.

The security architecture includes:

- Authentication of application users.
- Access-token validation for protected requests.
- Refresh-token persistence and lifecycle management.
- Role, permission, and module-based access control.
- Server-side authorization for sensitive operations.
- Assignment-aware access restrictions for clinical records.

### Role-Based Access Control

The application models users, roles, permissions, modules, and their relationships to control access to application functionality.

The intended responsibilities include:

| Role | General responsibility |
| --- | --- |
| Administrator | System and user administration according to assigned permissions |
| Coordinator | Clinical coordination, authorized oversight, and patient assignment management |
| Psychologist | Assigned patient management and authorized clinical workflows |

The exact permissions are determined by the configured roles and permission assignments.

### Patient Assignment Authorization

Patient access is not determined solely by whether a user has authenticated successfully.

Psychologists must be authorized to access the relevant patient based on the application's assignment rules. Coordinators with the appropriate permissions can oversee assignments and manage reassignment workflows.

Assignment history is retained to support traceability of patient allocation changes.

## 7. Clinical Data and Document Storage

The architecture separates structured clinical information from stored documents.

### PostgreSQL

PostgreSQL stores structured application data, including patient records, clinical workflows, diagnostic catalogs, user information, and related entities.

Relational constraints and application-level validation help maintain data integrity.

### Amazon S3

Amazon S3 stores clinical documents separately from the relational database.

The intended storage configuration includes private bucket access, encryption, versioning, and restricted access through authorized application workflows.

Document access must be enforced through the backend and appropriate AWS permissions rather than by exposing unrestricted bucket objects.

### Sensitive Data Encryption

Designated sensitive database fields use application-level encryption with AES-GCM and an initialization vector (IV).

The implementation uses a JPA attribute converter to integrate field encryption with persistence operations.

This mechanism is distinct from encryption at rest provided by the underlying database or storage service. Encryption-key management, backup protection, access control, and transport security remain separate security responsibilities.

## 8. Clinical Decision Support System

The Clinical Decision Support System (CDSS) uses a deterministic rule engine to evaluate documented clinical criteria against configured diagnostic rules. It supports the psychologist's diagnostic decision by evaluating a selected diagnosis first when that diagnosis is modeled in the rule catalog, followed by the normal inference workflow when necessary.

The system provides diagnostic suggestions and rule-based evaluation outcomes for professional review. It does not autonomously establish diagnoses or replace the psychologist's clinical judgment.

### 8.1 Rule Model

The diagnostic knowledge model is organized around the following entities and relationships:

```mermaid
flowchart TD
    CATEGORY[Diagnostic Category]
    DIAGNOSIS[Diagnosis]
    CRITERION[Clinical Criterion]
    SESSION_CRITERION[Session Clinical Criterion]
    DIAGNOSIS_CRITERION[Diagnosis-Criterion Association]
    RULE[Diagnostic Rule]
    RULE_TYPE[Rule Type]
    OPERATOR[Comparison Operator]
    EVALUATION[Diagnostic Evaluation]
    RESULT[Inference Outcome]
    SELECTED[Psychologist-Selected Diagnosis]

    CATEGORY --> DIAGNOSIS
    DIAGNOSIS --> DIAGNOSIS_CRITERION
    CRITERION --> DIAGNOSIS_CRITERION
    CRITERION --> SESSION_CRITERION
    SESSION_CRITERION --> EVALUATION
    DIAGNOSIS --> RULE
    RULE --> RULE_TYPE
    RULE --> OPERATOR
    RULE --> EVALUATION
    SELECTED --> EVALUATION
    EVALUATION --> RESULT
```

The model distinguishes the diagnostic catalog, clinical criteria documented during a session, the rules associated with each diagnosis, and the resulting diagnostic evaluation.

Rules are interpreted using their configured types, parameters, comparison operators, and expected values. The principal rule types used in the inference workflow are `BASICA`, which evaluates the presence of clinical criteria, and `EXCLUSION`, which evaluates answers to configured exclusion questions.

### 8.2 Evaluation Workflow

The inference workflow consists of four stages, with an initial selected-diagnosis evaluation when applicable.

**Selected-diagnosis prioritization**

When the psychologist selects a diagnosis and clicks **Guardar**, the system first checks whether the selected diagnosis is represented in the diagnostic rule catalog.

- If the diagnosis is modeled, the system evaluates its basic rules first, followed by its exclusion rules when applicable.
- If the selected diagnosis passes all applicable rules, the system completes the diagnostic evaluation and stops inference without evaluating other diagnoses.
- If the selected diagnosis fails its rules, the system resumes the normal inference process from Stage 1.
- If the selected diagnosis is not modeled, the system starts the normal inference process directly.

**Stage 1 — Candidate filtering**

The system retrieves the clinical criteria recorded for the current session and retains criteria marked as present. It identifies diagnoses associated with at least one present criterion and having at least one configured diagnostic rule.

Duplicate diagnoses and duplicate criterion counts are avoided. If no applicable candidates remain, the system returns an explicit empty result rather than inventing a diagnosis.

**Stage 2 — Basic rule evaluation**

For each candidate diagnosis, the system evaluates its applicable `BASICA` rules. Each rule identifies a criterion group through its configured parameter and reference.

The system counts distinct associated criteria present in the session and compares the count against the rule's expected value using its configured operator.

A diagnosis passes this stage only when all applicable basic rules pass. A failed rule rejects that candidate, allowing evaluation to continue with the next candidate. Unsupported or malformed rules and operators must be handled explicitly rather than treated as successful evaluations.

**Stage 3 — Exclusion questions and answers**

For candidates that pass Stage 2, the system retrieves applicable `EXCLUSION` rules. Each rule's parameter provides the question displayed to the psychologist, preserving the configured Spanish wording.

The frontend presents the required questions with explicit answers, such as **Sí** and **No**. Every required answer must be supplied before the corresponding exclusion rules can be evaluated and the diagnostic evaluation finalized.

Answers are evaluated using the configured operator and expected value. A failed exclusion rule rejects only its associated diagnosis. Candidates without exclusion rules can proceed without additional questions.

When a selected diagnosis fails after its exclusion answers have been evaluated, the system resumes normal inference. Previously supplied answers may be reused when they apply to the same question and rule context.

Missing answers are not interpreted as negative responses or successful rule evaluations.

**Stage 4 — Persistence**

After all required rule evaluations have been completed, the system persists the diagnostic evaluation and the psychologist's selected diagnosis using the existing persistence services and authorization rules.

The evaluation records the session, authenticated user, suggested diagnosis when applicable, selected diagnosis, inference timestamp, and diagnostic concordance.

When the selected diagnosis passes its rules, the system persists that outcome and stops inference. Otherwise, the system preserves the results of the subsequent normal inference process.

If a modeled selected diagnosis fails its rules and normal inference finds no applicable diagnosis, the system can record a configured explanatory outcome. This outcome uses the existing diagnosis record whose name is exactly:

`El diagnóstico seleccionado ya fue modelado, pero no cumple con las reglas definidas`

The explanatory outcome must be retrieved from the database. It is not a new diagnosis, must not be created automatically, and must not be treated as a concordant diagnostic suggestion merely because it is recorded as the system's outcome. If the required catalog record is missing, the system must report the configuration problem.

If normal inference identifies one or more applicable diagnoses, its results take precedence over this fallback outcome.

### 8.3 Deterministic Behavior

The inference engine uses explicit rules, configured comparison operators, and documented clinical criteria. It does not rely on machine learning, natural language processing, fuzzy logic, probabilistic prediction, or statistical scoring.

Given the same applicable rules, equivalent session criteria, the same selected diagnosis, and equivalent exclusion answers, the engine is intended to produce reproducible results.

The reliability of its output depends on the completeness and correctness of the modeled rules, the integrity of the clinical data, and the validity of the implementation. Missing answers or invalid rule configurations must not be silently interpreted as successful evaluations.

### 8.4 Diagnostic Concordance

Diagnostic concordance measures whether the system's diagnostic suggestion agrees with the diagnosis selected by the psychologist.

Concordance is recorded as `1` only when exactly one diagnosis is suggested and it matches the psychologist's selected diagnosis. Otherwise, it is recorded as `0`, following the defined evaluation rules.

When multiple diagnoses pass the inference rules, the system must preserve all applicable candidates rather than arbitrarily selecting the first one. When no diagnosis passes, the system must not fabricate a diagnostic suggestion. An explanatory fallback outcome is a system-generated evaluation result, not a clinical diagnosis confirmed by the psychologist.

Concordance is an evaluation measure and should not be interpreted as proof of clinical accuracy, diagnostic validity, or improved patient outcomes.

## 9. Cloud Deployment Architecture

The backend deployment uses AWS managed services.

The infrastructure design includes:

- A VPC distributed across multiple Availability Zones.
- Public subnets for externally accessible infrastructure where required.
- Private subnets for application workloads.
- Isolated subnets for the relational database.
- An Application Load Balancer for HTTPS traffic.
- An ECS Fargate service for the backend container.
- Amazon ECR for backend images.
- Amazon RDS for PostgreSQL.
- Amazon S3 for clinical document storage.
- AWS Secrets Manager for application and database secrets.
- Amazon CloudWatch for application logs and operational monitoring.

The deployed environment must be checked independently to confirm which components are active and correctly configured.

### Network Boundaries

The intended traffic flow is:

1. External clients connect through the public HTTPS endpoint.
2. The load balancer forwards requests to the backend service.
3. The backend accesses the database through private networking.
4. The backend accesses clinical document storage through authorized AWS permissions.
5. The database is not exposed directly to the public internet.

Security groups and IAM policies should restrict communication to the minimum required ports, resources, and operations.

## 10. CI/CD and Infrastructure as Code

AWS CDK defines infrastructure resources in code, allowing changes to be reviewed and deployed through a repeatable process.

The intended CI/CD workflow uses GitHub Actions and short-lived AWS credentials through OpenID Connect (OIDC), avoiding the need for long-lived AWS access keys in GitHub repository secrets.

The backend delivery workflow is designed to cover:

1. Triggering on relevant repository changes or manual execution.
2. Building and testing the backend.
3. Building a Docker image.
4. Publishing the image to Amazon ECR.
5. Updating the ECS service.
6. Verifying deployment health and handling failed deployments.

The frontend delivery workflow is intended to build the React application, publish static assets, and invalidate the CloudFront cache when the relevant resources are configured.

Refer to the deployment documentation for the current workflow definitions and verified operational status.

## 11. Design Trade-offs

### Modular Monolith Instead of Microservices

A modular monolith provides clear functional boundaries while reducing deployment complexity, inter-service communication, distributed tracing requirements, and operational overhead.

It is appropriate for a system whose functional modules are related and whose deployment scale does not currently justify independent microservices.

### Managed Cloud Services

ECS Fargate, RDS, and S3 reduce the need to manage container hosts, database operating systems, and document-storage infrastructure directly.

The trade-off includes ongoing cloud costs, service-specific operational constraints, and the need to configure IAM, networking, monitoring, and recovery correctly.

### Deterministic Rules Instead of Machine Learning

Explicit rules make the diagnostic evaluation process inspectable and reproducible.

However, rule-based evaluation does not eliminate the need for clinical review, careful modeling, testing, and validation against appropriate clinical references.

## 12. Further Reading

- [Project README](../README.md)
- [Development Guide](DEVELOPMENT.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Feature Reference](FEATURES.md)
- [Security Documentation](SECURITY.md)
