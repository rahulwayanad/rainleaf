export default function ServiceBlock({ number, title, description, image, badge, reverse }) {
  return (
    <div className={`service-block${reverse ? ' service-block-reverse' : ''}`}>
      <div className="service-block-img">
        <img src={image} alt={title} />
      </div>
      <div className="service-block-content">
        <span className="service-block-number">{number}</span>
        <h3>{title}</h3>
        <p>{description}</p>
        <span className={badge === 'included' ? 'service-badge' : 'service-badge service-badge-paid'}>
          {badge === 'included' ? 'Included' : 'Payable'}
        </span>
      </div>
    </div>
  );
}
