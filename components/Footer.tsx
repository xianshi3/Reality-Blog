type FooterProps = {
  currentYear: number;
};

export default function Footer({ currentYear }: FooterProps) {
  return (
    <footer className="footer mt-8">
      <div>© {currentYear} Reality-Blog. 保留所有权利.</div>
      <div className="footer-links">
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href="mailto:your@email.com">Email</a>
      </div>
    </footer>
  );
}