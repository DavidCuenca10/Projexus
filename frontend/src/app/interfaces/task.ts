export interface Task {
    id: number;
    project_id: number;
    assigned_to: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    deadline: string;
    anteriorStatus?: string;
}
