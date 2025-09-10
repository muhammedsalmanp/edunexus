export interface Course {
  id: string;
  name: string;
  description: string;
  price: number;
  thumbnailImage: string;
  coveringTopics: string[];
  chapters: {
    name: string;
    description: string;
    video: string;
  }[];
  createdBy: string;
  courseStatus: 'published' | 'unpublished' | 'pending';
  createdAt: string;
}

export interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    thumbnail: string; 
    status: 'published' | 'unpublished' | 'pending'; 
    duration: string; 
  };
}