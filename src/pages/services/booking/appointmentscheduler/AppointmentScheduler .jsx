import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './appointmentScheduler.css';

const API_BASE_URL = 'https://e-nutritionist-08e05a1c6652.herokuapp.com/'; 

const AppointmentScheduler = () => {

  const url = API_BASE_URL;

  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [priceOfProgram, setPriceOfProgram] = useState(null);
  const [typeOfConsultation, setTypeOfConsultation] = useState('');

  const navigate = useNavigate();

  const services = [
    'First Consultation',
    '1st MONTH - INITIAL PACK',
    'Fortnightly Pack',
    'Weekly Tune-Up Consultation',
    '6 - MONTH PACKAGE',
    'Personalized Workout and Nutrition Plan',
    "1 euro test"
  ];

  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
      const hour = i < 10 ? `0${i}` : i;
      slots.push(`${hour}:00`, `${hour}:30`);
    }
    return slots;
  };

  const allTimeSlots = generateTimeSlots();

  const handleServiceChange = (event) => {
    const selected = event.target.value;
    setSelectedService(selected);
    handlePriceOfProgram(selected);
  };

  const handleDateChange = (event) => {
    const selected = event.target.value;
    setSelectedDate(selected);
    filterTimeSlots(selected);
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'name') {
      setUserName(value);
    } else if (name === 'email') {
      setUserEmail(value);
    }
  };

  const handleMessageChange = (event) => {
    setUserMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const bookingDetails = {
      name: userName,
      email: userEmail,
      date: selectedDate,
      time: selectedTime,
      type_of_consultation: typeOfConsultation,
      price_of_consultation: priceOfProgram,
      user_message: userMessage,
    };
  
    try {
      const response = await fetch(`${url}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingDetails),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Network response was not ok: ${response.statusText} - ${errorData}`);
      }
  
      const data = await response.json();
      console.log(data);
      setConfirmation(`Appointment confirmed for ${userName} on ${selectedDate} at ${selectedTime} for ${typeOfConsultation}. Confirmation email sent to ${userEmail}.`);
  
      navigate('/payment', { state: { bookingId: data.booking.id, amount: priceOfProgram * 100 } }); // Pass the booking ID and amount (in cents)
  
    } catch (error) {
      console.error('Error:', error.message);
    }
  };  
  
  const handlePriceOfProgram = (option) => {
    switch (option) {
      case "First Consultation": setPriceOfProgram(50); setTypeOfConsultation("First Consultation"); break;
      case "1st MONTH - INITIAL PACK": setPriceOfProgram(150); setTypeOfConsultation("1st MONTH - INITIAL PACK"); break;
      case "Fortnightly Pack": setPriceOfProgram(70); setTypeOfConsultation("Fortnightly Pack"); break;
      case "Weekly Tune-Up Consultation": setPriceOfProgram(40); setTypeOfConsultation("Weekly Tune-Up Consultation"); break;
      case "6 - MONTH PACKAGE": setPriceOfProgram(450); setTypeOfConsultation("6 - MONTH PACKAGE"); break;
      case "Personalized Workout and Nutrition Plan": setPriceOfProgram(75); setTypeOfConsultation("Personalized Workout and Nutrition Plan"); break;
      case "1 euro test": setPriceOfProgram(1); setTypeOfConsultation("1 euro test"); break;
      default: setPriceOfProgram(null); setTypeOfConsultation(''); 
    }
  };

  const filterTimeSlots = (date) => {
    const now = new Date();
    const selectedDate = new Date(date);
    if (selectedDate.toDateString() === now.toDateString()) {
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();
      const availableSlots = allTimeSlots.filter((slot) => {
        const [hour, minutes] = slot.split(':');
        return (parseInt(hour) > currentHour) || (parseInt(hour) === currentHour && parseInt(minutes) > currentMinutes);
      });
      setTimeSlots(availableSlots);
    } else {
      setTimeSlots(allTimeSlots);
    }
  };

  useEffect(() => {
    filterTimeSlots(selectedDate);
  }, [selectedDate]);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="appointment-scheduler-background"> {/* Background wrapper for fixed image */}
      <div className="appointment-scheduler">
        <h2>Schedule an Appointment</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Select Service:
              <select value={selectedService} onChange={handleServiceChange} required>
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {priceOfProgram !== null && (
            <div>
              <p>Service Fee: {priceOfProgram}€</p>
            </div>
          )}
          <div>
            <label>
              Select Date:
              <input type="date" value={selectedDate} onChange={handleDateChange} min={getTodayDate()} required />
            </label>
          </div>
          <div>
            <label>
              Select Time:
              <select value={selectedTime} onChange={handleTimeChange} required>
                <option value="">Select a time</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label>
              Message (optional):
              <textarea value={userMessage} onChange={handleMessageChange} />
            </label>
          </div>
          <div>
            <label>
              Name:
              <input type="text" name="name" value={userName} onChange={handleInputChange} required />
            </label>
          </div>
          <div>
            <label>
              Email:
              <input type="email" name="email" value={userEmail} onChange={handleInputChange} required />
            </label>
          </div>
          <button type="submit">Confirm Appointment</button>
        </form>
        {confirmation && <p>{confirmation}</p>}
      </div>
    </div>
  );
};

export default AppointmentScheduler;
