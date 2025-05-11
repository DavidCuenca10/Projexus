export interface Project {
    id: number;
    owner_id: number
    owner: {
      name: string;
    };
    name: string;
    description: string;
    category: string;
    max_members: number;
    current_members: number;
    deadline: string;
    tags: string;
    image_url: string;
    estado: string;
}
  