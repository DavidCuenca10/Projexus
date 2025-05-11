export interface Members {
    id: number;
    name: string;
    email: string;
    biography: string;
    preferences: string;
    pivot: {
      project_id: number;
      user_id: number;
      role: string;
      status: string;
    };
    originalRole?: string;
  }
  