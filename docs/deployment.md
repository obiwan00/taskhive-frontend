# TaskHive Frontend - Production Deployment Guide

## Overview

TaskHive Frontend is deployed to **Azure Static Web Apps** using a fully automated CI/CD pipeline powered by GitHub Actions.

## Prerequisites

Before deploying, ensure you have:

1. **GitHub Repository** with proper access permissions
2. **Azure Static Web Apps API Token** stored in GitHub Secrets

## Automated Deployment Pipeline

### Workflow Configuration

The deployment is managed by the GitHub Actions workflow located at:
```
.github/workflows/azure-static-web-apps-white-mud-0bd195c03.yml
```

### Trigger Events

The workflow automatically triggers on:

1. **Push to main branch**: Automatically builds and deploys to production
2. **Pull Request Events**: 
   - Opened
   - Synchronized
   - Reopened
   - Closed (triggers cleanup)

### Pull Request Previews

The workflow creates preview deployments for pull requests:

- Each PR gets a unique preview URL
- Preview is updated on every commit to the PR
- Preview is automatically deleted when PR is closed

### Deployment Process

When code is pushed to the `main` branch:

1. **Checkout**: Repository code is checked out with submodules
2. **OIDC Authentication**: GitHub OIDC token is generated for secure Azure authentication
3. **Build**: Application is built using production configuration
4. **Deploy**: Built artifacts are deployed to Azure Static Web Apps

## Production Environment Configuration

Located at: `src/environments/environment.prod.ts`. Contains the production API base URL (`apiBaseUrl`).

## Static Web App Configuration

Configuration is managed in `src/staticwebapp.config.json`. This file controls:
- Routing rules
- HTTP headers
- Authentication settings
- Custom error pages

## Rollback Procedure

If a deployment causes issues:

### Option 1: Revert via Git

```bash
# Identify the last working commit
git log

# Revert to previous commit
git revert <bad-commit-hash>
git push origin main
```

### Option 2: Azure Portal

1. Go to Static Web App in Azure Portal
2. Navigate to **Deployment History**
3. Find the last working deployment
4. Click **Redeploy** (if available)

### Option 3: Deploy Previous Version

```bash
# Checkout previous working commit
git checkout <working-commit-hash>

# Create a new branch and push
git checkout -b hotfix/rollback
git push origin hotfix/rollback

# Merge to main
```

## Additional Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Angular Deployment Guide](https://angular.io/guide/deployment)

