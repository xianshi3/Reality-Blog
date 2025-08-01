export interface Article {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  content?: string;
  tags?: string[];
  link: string;
  likes?: number;
  image_url?: string;
}

export default Article;