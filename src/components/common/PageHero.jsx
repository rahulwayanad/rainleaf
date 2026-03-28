import { Link } from 'react-router-dom';

export default function PageHero({ title, breadcrumbLabel }) {
  return (
    <section className="page-hero">
      <div className="page-hero-overlay"></div>
      <div className="container page-hero-content">
        <h1>{title}</h1>
        <p className="page-breadcrumb">
          <Link to="/">Home</Link> <span>/</span> {breadcrumbLabel || title}
        </p>
      </div>
    </section>
  );
}
