import galleryImages from '../../data/galleryImages';

export default function GallerySection() {
  return (
    <section id="gallery" className="gallery section section-dark">
      <div className="container">
        <div className="section-header section-header-light">
          <span className="section-tag"><i className="fas fa-camera" aria-hidden="true"></i> Gallery</span>
          <h2 className="section-title">Explore Rainleaf Retreat<br /><small style={{fontSize:'0.5em',fontWeight:400,letterSpacing:'1px'}}>Wayanad, Kerala — Private Pool Villas Gallery</small></h2>
        </div>
        <div className="gallery-grid">
          {galleryImages.map((img) => (
            <div className={`gallery-item${img.wide ? ' gallery-item-wide' : ''}`} key={img.alt}>
              <img src={img.src} alt={img.alt} loading="lazy" width="800" height="600" />
              <div className="gallery-overlay"><i className="fas fa-expand" aria-hidden="true"></i></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
