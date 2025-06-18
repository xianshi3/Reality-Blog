export interface Article {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  content?: string;
  tags?: string[];
  link: string;
}

export default Article;