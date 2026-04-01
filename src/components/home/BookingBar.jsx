import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

export default function BookingBar() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    check_in: today,
    check_out: tomorrow,
    guests: '2',
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams({
      check_in: form.check_in,
      check_out: form.check_out,
      guests: form.guests,
    });
    navigate(`/availability?${params.toString()}`);
  }

  return (
    <section className="booking-bar">
      <div className="container">
        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="booking-field">
            <label>Check In</label>
            <input type="date" name="check_in" value={form.check_in} onChange={handleChange} min={today} />
          </div>
          <div className="booking-field">
            <label>Check Out</label>
            <input type="date" name="check_out" value={form.check_out} onChange={handleChange} min={form.check_in} />
          </div>
          <div className="booking-field">
            <label>Guests</label>
            <select name="guests" value={form.guests} onChange={handleChange}>
              <option value="1">1 Adult</option>
              <option value="2">2 Adults</option>
              <option value="3">3 Adults</option>
              <option value="4">4 Adults</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-check">Check Availability</button>
        </form>
      </div>
    </section>
  );
}
