export interface CourseEntity {
    id: string;
    name: string;
    description: string;
    price: number;
    thumbnailImage: string;
    coveringTopics: string[];
    chapters: { name: string; description: string; video: string }[];
    createdBy: string; // Stores the User _id as a string
    courseStatus: 'published' | 'unpublished' | 'pending';
    createdAt: Date;
}

export interface AddCourseDTO {
    name: string;
    description: string;
    price: number;
    thumbnailImage: string;
    coveringTopics: string[];
    chapters: { name: string; description: string; video: string }[];
    createdBy: string; // Expects User _id as a string
    courseStatus: 'published' | 'unpublished' | 'pending';
}

export interface UpdateCourseDTO {
    name?: string;
    description?: string;
    price?: number;
    thumbnailImage?: string;
    coveringTopics?: string[];
    chapters?: { name: string; description: string; video: string }[];
    createdBy?: string; // Expects User _id as a string
    courseStatus?: 'published' | 'unpublished' | 'pending';
}

export class CourseEntity {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public price: number,
        public thumbnailImage: string,
        public coveringTopics: string[],
        public chapters: { name: string; description: string; video: string }[],
        public createdBy: string,
        public courseStatus: 'published' | 'unpublished' | 'pending',
        public createdAt: Date
    ) {}
}