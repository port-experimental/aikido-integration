

export interface Issue {
    id: number;
    group_id: number;
    attack_surface: string;
    status: string;
    severity: number;
    severity_score: string;
    type: string;
    rule: string;
    rule_id: string;
    affected_package: string;
    affected_file: string;
    first_detected_at: number;
    code_repo_name: string;
    code_repo_id: number;
    container_repo_id: number;
    container_repo_name: string;
    sla_days: number;
    sla_remediate_by: number;
    ignored_at: number | null;
    ignored_by: string | null;
    closed_at: number | null;
};

export interface Repository {
    id: number;
    name: string;
    provider: string;
    external_repo_id: string;
    active: boolean;
    url: string;
};