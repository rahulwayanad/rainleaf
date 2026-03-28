export default function BookingBar() {
  return (
    <section className="booking-bar">
      <div className="container">
        <form className="booking-form" onSubmit={(e) => e.preventDefault()}>
          <div className="booking-field">
            <label>Check In</label>
            <input type="date" defaultValue="2026-03-28" />
          </div>
          <div className="booking-field">
            <label>Check Out</label>
            <input type="date" defaultValue="2026-03-30" />
          </div>
          <div className="booking-field">
            <label>Guests</label>
            <select defaultValue="2 Adults">
              <option>1 Adult</option>
              <option>2 Adults</option>
              <option>3 Adults</option>
              <option>4 Adults</option>
            </select>
          </div>
          <div className="booking-field">
            <label>Rooms</label>
            <select defaultValue="1 Room">
              <option>1 Room</option>
              <option>2 Rooms</option>
              <option>3 Rooms</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-check">Check Availability</button>
        </form>
      </div>
    </section>
  );
}
