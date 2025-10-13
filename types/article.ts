export interface Article {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  content?: string;
  tags?: string[] | string;
  link: string;
  likes?: number;
  image_url?: string;
}

export default Article;