export default function ContactForm() {
  return (
    <div className="contact-form-block">
      <h3 className="form-heading">GET IN TOUCH</h3>
      <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-row">
          <div className="form-group">
            <input type="text" placeholder="Your Name" required />
          </div>
          <div className="form-group">
            <input type="email" placeholder="Your Email" required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <input type="tel" placeholder="Phone Number" />
          </div>
          <div className="form-group">
            <input type="text" placeholder="Subject" />
          </div>
        </div>
        <div className="form-group">
          <textarea rows="5" placeholder="Your Message" required></textarea>
        </div>
        <button type="submit" className="btn btn-primary btn-full">SEND MESSAGE</button>
      </form>
    </div>
  );
}
