import galleryImages from '../../data/galleryImages';

export default function GallerySection() {
  return (
    <section id="gallery" className="gallery section section-dark">
      <div className="container">
        <div className="section-header section-header-light">
          <span className="section-tag"><i className="fas fa-camera"></i> Gallery</span>
          <h2 className="section-title">Explore<br />Rainleaf Retreat</h2>
        </div>
        <div className="gallery-grid">
          {galleryImages.map((img) => (
            <div className={`gallery-item${img.wide ? ' gallery-item-wide' : ''}`} key={img.alt}>
              <img src={img.src} alt={img.alt} />
              <div className="gallery-overlay"><i className="fas fa-expand"></i></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
