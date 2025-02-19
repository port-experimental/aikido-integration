# Aikido Integration

## Overview

Want to see all of your Aikido issues, and map them to your repositories and services?

## Setup

1. Clone repo
1. Setup the code and workflow configuration in a central repository. I'd recommend creating one `.port` repository for all of your GitHub actions for custom integrations and self-service actions
1. For your repository that will run the github actions, configure repository secrets for the following environmental variables:

        - PORT_CLIENT_ID
        - PORT_CLIENT_SECRET
        - AIKIDO_CLIENT_ID
        - AIKIDO_CLIENT_SECRET
1. Create blueprints in port for the two blueprints below `aikido_issue` and `aikido_repository`
1. Have fun!


## Sample blueprints


#### Aikido Issue
```json

{
  "identifier": "aikido_issue",
  "description": "This blueprint represents an Issue from Aikido",
  "title": "Aikido Issue",
  "schema": {
    "properties": {
      "group_id": {
        "type": "number",
        "title": "Group ID"
      },
      "attack_surface": {
        "type": "string",
        "title": "Attack Surface",
        "enum": [
          "frontend",
          "backend",
          "docker_container",
          "cloud"
        ],
        "enumColors": {
          "frontend": "red",
          "backend": "yellow",
          "docker_container": "blue",
          "cloud": "turquoise"
        }
      },
      "status": {
        "type": "string",
        "title": "Status",
        "enum": [
          "open",
          "ignored",
          "snoozed",
          "closed"
        ],
        "enumColors": {
          "open": "red",
          "snoozed": "orange",
          "ignored": "yellow",
          "closed": "green"
        }
      },
      "severity": {
        "icon": "DefaultProperty",
        "title": "Severity",
        "type": "string",
        "enum": [
          "critical",
          "high",
          "medium",
          "low"
        ],
        "enumColors": {
          "critical": "red",
          "high": "orange",
          "medium": "yellow",
          "low": "lightGray"
        }
      },
      "severity_score": {
        "type": "number",
        "title": "Severity Score"
      },
      "rule": {
        "type": "string",
        "title": "Rule"
      },
      "rule_id": {
        "type": "string",
        "title": "Rule ID"
      },
      "affected_package": {
        "type": "string",
        "title": "Affected Package"
      },
      "cve_id": {
        "type": "string",
        "title": "CVE ID"
      },
      "affected_file": {
        "type": "string",
        "title": "Affected File"
      },
      "first_detected_at": {
        "type": "number",
        "title": "First Detected At"
      },
      "code_repo_name": {
        "type": "string",
        "title": "Code Repo Name"
      },
      "container_repo_id": {
        "type": "number",
        "title": "Container Repo ID"
      },
      "container_repo_name": {
        "type": "string",
        "title": "Container Repo Name"
      },
      "cloud_id": {
        "type": "number",
        "title": "Cloud ID"
      },
      "cloud_name": {
        "type": "string",
        "title": "Cloud Name"
      },
      "ignored_at": {
        "type": "number",
        "title": "Ignored At"
      },
      "closed_at": {
        "type": "number",
        "title": "Closed At"
      },
      "ignored_by": {
        "type": "string",
        "title": "Ignored By"
      },
      "sla_days": {
        "type": "number",
        "title": "SLA Days"
      },
      "sla_remediate_by": {
        "type": "string",
        "title": "SLA Remediate By"
      },
      "type": {
        "type": "string",
        "title": "Type",
        "enum": [
          "open_source",
          "leaked_secret",
          "cloud",
          "iac",
          "sast",
          "surface_monitoring",
          "malware",
          "eol"
        ],
        "enumColors": {
          "open_source": "red",
          "leaked_secret": "yellow",
          "cloud": "blue",
          "iac": "turquoise",
          "sast": "purple",
          "surface_monitoring": "pink",
          "malware": "green",
          "eol": "bronze"
        }
      }
    },
    "required": []
  },
  "mirrorProperties": {},
  "calculationProperties": {},
  "aggregationProperties": {},
  "relations": {
    "aikido_repository": {
      "title": "Aikido Code Repo ID",
      "target": "aikido_repository",
      "required": false,
      "many": false
    }
  }
}

```

#### Aikido Repository

```json
{
  "identifier": "aikido_repository",
  "title": "Aikido Repository",
  "description": "This blueprint represents an Repository from Aikido",
  "schema": {
    "properties": {
      "external_repo_id": {
        "type": "string",
        "title": "External Repo ID"
      },
      "provider": {
        "type": "string",
        "title": "Provider"
      },
      "active": {
        "type": "boolean",
        "title": "Active"
      },
      "url": {
        "type": "string",
        "title": "URL"
      }
    },
    "required": []
  },
  "mirrorProperties": {},
  "calculationProperties": {},
  "aggregationProperties": {},
  "relations": {}
}

```

