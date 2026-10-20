# Security Documentation

## 1. Overview

The Clinical Psychology Management System is an Electronic Health Record (EHR) and Clinical Decision Support System (CDSS) designed to manage sensitive clinical information.

Security is an important consideration throughout the application architecture, including authentication, authorization, data persistence, document storage, and cloud infrastructure.

The application incorporates security controls intended to restrict unauthorized access, protect sensitive information, and reduce exposure of the underlying infrastructure.

This document describes the security mechanisms implemented or intended by the system, the responsibilities associated with operating the application, and the procedures for reporting potential vulnerabilities.

The presence of an individual security control does not establish that the entire system is production-ready or compliant with a particular legal or regulatory framework.

## 2. Security Principles

The system follows these security principles:

- **Least privilege:** Users and services should receive only the permissions required for their responsibilities.
- **Defense in depth:** Application security, database permissions, network controls, and cloud IAM policies provide complementary protection.
- **Server-side authorization:** Protected operations are authorized by the backend rather than relying exclusively on frontend restrictions.
- **Data minimization:** Sensitive information should not be unnecessarily exposed through API responses, logs, or external resources.
- **Secure configuration:** Credentials and secrets must remain separate from source code.
- **Encryption:** Sensitive information should be protected during transmission and storage using appropriate encryption mechanisms.
- **Traceability:** Relevant administrative and clinical operations should support appropriate accountability.
- **Controlled deployment:** Infrastructure and application changes should be reviewed, tested, and deployed through authorized workflows.

## 3. Authentication

The application uses JSON Web Tokens (JWT) to authenticate requests to protected API endpoints.

The authentication mechanism includes access tokens and database-backed refresh-token management.

Security considerations include:

- Validating access tokens before allowing protected operations.
- Enforcing token expiration.
- Validating user status and applicable authentication requirements.
- Managing refresh-token lifecycle and revocation.
- Preventing unauthorized access to protected endpoints.
- Avoiding the disclosure of tokens in logs, error messages, or source code.

JWT authentication establishes the identity associated with a request but does not independently determine whether the user may access a particular patient record or perform a specific operation.

Authorization checks must be applied separately.

## 4. Authorization and Access Control

The backend uses Spring Security and role-based access control to protect application functionality.

The authorization model includes users, roles, permissions, modules, and their configured relationships.

### 4.1 Role-Based Permissions

The system distinguishes between administrative, coordination, and clinical responsibilities.

Access to application modules and protected operations depends on the user's configured permissions.

Frontend navigation may reflect those permissions, but hiding a menu item is not a substitute for enforcing authorization on the corresponding backend endpoint.

### 4.2 Patient Assignment Restrictions

Patient assignment is an important authorization boundary.

Psychologists must be authorized to access the patients assigned to them under the application's business rules. Coordinators may perform broader oversight and assignment operations when their permissions allow it.

The backend must validate access to the requested patient for every applicable protected operation.

A valid JWT or knowledge of a patient identifier must not, by itself, grant access to the corresponding clinical information.

### 4.3 Administrative Operations

User management, permission changes, patient reassignment, and other administrative operations require explicit authorization.

Assignment changes should retain the required history and justification to support accountability.

## 5. Sensitive Clinical Data

Clinical records may contain personally identifiable information, medical history, psychological evaluations, and other sensitive information.

The application should limit access to such data according to the user's responsibilities and the applicable clinical workflow.

Security practices include:

- Returning only the information required by each API response.
- Validating incoming data and enforcing business rules.
- Restricting access to clinical records and documents.
- Avoiding unnecessary exposure of sensitive fields.
- Using synthetic data during development and demonstrations.
- Preventing sensitive clinical information from appearing in application logs.
- Applying appropriate backup, retention, and recovery controls.

Production data must not be copied into development or testing environments without an authorized process and appropriate safeguards.

## 6. Encryption

The system uses or is designed to use encryption at multiple layers.

### 6.1 Sensitive Database Fields

Designated sensitive database fields use application-level encryption with AES-GCM and an initialization vector (IV).

A JPA attribute converter integrates the encryption and decryption process with persistence operations.

AES-GCM provides authenticated encryption when correctly implemented and configured. Key generation, storage, access, rotation, and recovery must also be handled securely.

The encryption of selected entity fields does not imply that every database column is encrypted at the application layer.

### 6.2 Data in Transit

HTTPS protects communication between external clients and the public API endpoint when the TLS configuration is valid and correctly enforced.

Internal communication and connections to external services must also use appropriate transport security.

### 6.3 Storage Encryption

Amazon RDS and Amazon S3 support encryption at rest. The actual configuration must be verified against the deployed resources.

Application-level encryption, storage encryption, and transport encryption address different threats and should not be treated as interchangeable controls.

## 7. Clinical Document Storage

Clinical documents are stored in a private Amazon S3 bucket.

The intended storage controls include:

- Blocking unrestricted public access.
- Enforcing secure transport.
- Applying appropriate encryption.
- Enabling object versioning.
- Restricting access through AWS IAM permissions.
- Allowing application operations only through authorized workflows.

The backend should mediate access to clinical documents and validate the requesting user's permissions.

Public bucket policies and unrestricted object URLs must not be used as shortcuts to resolve document-access problems.

Document retention and deletion policies should be consistent with the applicable institutional and legal requirements.

## 8. Cloud Infrastructure Security

The AWS deployment uses network isolation and managed services to reduce direct exposure of application components.

### 8.1 Network Isolation

The intended infrastructure design includes:

- A VPC with public, private, and isolated subnets.
- An internet-facing Application Load Balancer.
- Backend tasks running without public IP addresses.
- A database hosted in private isolated subnets.
- Security groups restricting communication between components.

The database should accept connections only from authorized application resources or explicitly approved administrative paths.

The actual subnet associations, routes, and security group rules must be verified in AWS.

### 8.2 IAM Permissions

AWS IAM roles grant services the permissions needed to perform their responsibilities.

Examples include:

- ECS task execution permissions for image retrieval and supported secret injection.
- Application task permissions for required AWS SDK operations.
- Deployment permissions for the CI/CD identity.

The task execution role and application task role serve different purposes and should not be granted unnecessarily broad permissions.

Avoid using wildcard resource permissions when narrower resource-level permissions are supported.

### 8.3 Secrets Management

AWS Secrets Manager stores sensitive application and database configuration values.

Secrets must not be embedded in Docker images, committed to source control, or printed in logs.

Access should be limited to the identities that require the corresponding secret.

Secret rotation should account for application behavior, database connection management, and JWT signing-key implications.

### 8.4 Container Security

Backend container images are stored in Amazon ECR.

Security practices should include:

- Building images from reviewed source code.
- Scanning images for known vulnerabilities.
- Using supported base images and updating dependencies.
- Avoiding credentials and development artifacts in images.
- Applying appropriate container runtime permissions.
- Using identifiable image digests or immutable tags for deployments.
- Reviewing vulnerabilities before releasing a new image.

Image scanning is one input into the release process and does not establish that an image is free of vulnerabilities.

## 9. CI/CD Security

The deployment workflow uses GitHub Actions to automate application delivery.

The intended AWS authentication mechanism uses OpenID Connect (OIDC) to obtain short-lived credentials rather than relying on long-lived AWS access keys stored in GitHub.

Security requirements include:

- Restricting the IAM trust policy to the intended repository and deployment branch or environment.
- Granting workflows only the permissions they need.
- Reviewing workflow changes before deployment.
- Avoiding the exposure of secrets in logs.
- Validating application builds and tests before release.
- Keeping production deployment permissions separate from ordinary development permissions where practical.
- Using reviewed and appropriately pinned third-party workflow actions.
- Monitoring deployment results and investigating unexpected failures.

The effectiveness of these controls depends on the actual IAM trust policy, workflow permissions, branch protection, and deployment configuration.

## 10. Logging and Monitoring

Amazon CloudWatch collects application logs and provides operational monitoring for the backend.

Logging and monitoring should help detect and investigate:

- Application startup and runtime failures.
- Failed deployments.
- Container restarts and task failures.
- Database connectivity problems.
- Unexpected infrastructure behavior.
- Authentication and authorization failures, where appropriately logged.
- Unusual resource utilization.

Logs must not contain passwords, signing keys, access tokens, refresh tokens, or unnecessary patient information.

Access to logs should be restricted, and retention periods should be configured according to operational and data-protection requirements.

Additional audit logging and alerting should be implemented and verified according to the application's clinical and operational needs.

## 11. Data Retention, Backups, and Recovery

The database and document-storage infrastructure must support appropriate backup and recovery procedures.

The intended infrastructure includes automated RDS backups and versioning for the clinical document bucket.

These mechanisms do not independently guarantee recoverability.

Operational procedures should define:

- Backup retention requirements.
- Authorized access to backups and snapshots.
- Recovery-point and recovery-time objectives.
- Database restoration procedures.
- Document recovery and version-recovery procedures.
- Validation of restored data.
- Protection of backups containing sensitive information.
- Procedures for handling data corruption or accidental deletion.

Restoration procedures should be tested in a controlled environment.

Production database or document deletion must not be performed without understanding the retention requirements, dependencies, and recovery implications.

## 12. Security Testing

Security testing should cover both individual controls and end-to-end workflows.

Recommended verification includes:

| Area | Verification |
| --- | --- |
| Authentication | Invalid, expired, and missing tokens are rejected where required. |
| Authorization | Users cannot perform operations outside their permissions. |
| Patient access | Psychologists cannot access unauthorized patient records. |
| Input validation | Invalid or incomplete requests are handled safely. |
| Sensitive data | API responses and logs do not expose unnecessary sensitive information. |
| Encryption | Sensitive-field encryption and decryption behave as expected. |
| Database access | The database is not directly exposed to the public internet. |
| Document storage | Unauthorized users cannot retrieve protected clinical documents. |
| Secrets | Credentials are absent from source control and container images. |
| HTTPS | Public API traffic uses the intended TLS configuration. |
| Dependencies | Backend and frontend dependencies are checked for known vulnerabilities. |
| Recovery | Backup restoration procedures are tested. |
| CI/CD | Deployment identities and workflows have appropriately restricted permissions. |

Testing should be performed using synthetic data and authorized environments.

## 13. Known Limitations and Security Hardening

Security is an ongoing process rather than a one-time implementation task.

Before using the system with real patient data, the deployed environment should undergo a security review covering application code, infrastructure configuration, access control, encryption, monitoring, backup recovery, and operational procedures.

Areas requiring verification may include:

- Complete authorization coverage across clinical endpoints.
- Key management and rotation procedures for application-level encryption.
- Auditability of sensitive clinical operations.
- Monitoring and alerting for security-relevant events.
- Database backup restoration and disaster recovery.
- Dependency vulnerability management.
- Production CORS configuration.
- IAM policies and security group rules.
- Secret rotation and incident response procedures.
- Applicable legal, institutional, and regulatory obligations.

The application should not be represented as compliant with a specific healthcare or data-protection framework unless a corresponding assessment supports that claim.

## 14. Vulnerability Reporting

If you discover a potential security vulnerability, do not publish details that could expose patient information, credentials, or exploitable production resources.

Report the issue privately to the repository maintainer using a verified contact method or an available private vulnerability-reporting mechanism.

A useful report should include:

- A concise description of the issue.
- The affected component or endpoint.
- The potential impact.
- Reproduction steps that do not expose real patient information.
- Relevant logs or screenshots with sensitive values removed.
- Any suggested mitigation, if known.

Allow the maintainer an appropriate opportunity to investigate and address the issue before publicly disclosing technical details.

Do not attempt unauthorized access to production systems or real clinical data while investigating a suspected vulnerability.

## 15. Responsible Use

This system is designed to support clinical information management and deterministic diagnostic decision support.

The application must not be assumed to provide clinically validated diagnoses or to replace professional judgment.

Access to clinical information must be authorized, and testing or demonstration activities should use synthetic data.

Any use involving real clinical information requires appropriate authorization, operational safeguards, and assessment of the applicable legal and institutional requirements.

## 16. Related Documentation

- [Project README](../README.md)
- [System Architecture](ARCHITECTURE.md)
- [Development Guide](DEVELOPMENT.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Feature Reference](FEATURES.md)
