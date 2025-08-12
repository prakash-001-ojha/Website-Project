import React from 'react';
import '../style/Services.css';

const Services = () => {
  const services = [
    {
      id: 1,
      title: "Luxury Accommodation",
      description: "Experience ultimate comfort in our well-appointed rooms and suites with premium amenities.",
      icon: "🏨",
      features: ["Premium bedding", "Room service", "Daily housekeeping", "Mini bar"]
    },
    {
      id: 2,
      title: "Fine Dining",
      description: "Savor exquisite cuisine at our multiple restaurants serving local and international dishes.",
      icon: "🍽️",
      features: ["International cuisine", "Local specialties", "Room service", "Private dining"]
    },
    {
      id: 3,
      title: "Spa & Wellness",
      description: "Rejuvenate your body and mind with our world-class spa treatments and wellness programs.",
      icon: "🧘",
      features: ["Massage therapy", "Facial treatments", "Yoga classes", "Fitness center"]
    },
    {
      id: 4,
      title: "Recreational Activities",
      description: "Stay active and entertained with our wide range of recreational facilities and activities.",
      icon: "🏊",
      features: ["Swimming pools", "Tennis courts", "Water sports", "Kids club"]
    },
    {
      id: 5,
      title: "Event Planning",
      description: "Perfect venue for weddings, corporate events, and special celebrations.",
      icon: "🎉",
      features: ["Wedding planning", "Corporate events", "Catering services", "Event coordination"]
    },
    {
      id: 6,
      title: "Concierge Services",
      description: "Our dedicated concierge team is here to assist with all your needs and requests.",
      icon: "👨‍💼",
      features: ["Tour arrangements", "Transportation", "Reservations", "Personal assistance"]
    }
  ];

  return (
    <div className="services-page">
      <div className="services-hero">
        <div className="services-hero-content">
          <h1>Our Services</h1>
          <p>Discover the exceptional services that make Paradise Resort your perfect destination</p>
        </div>
      </div>

      <div className="services-content">
        <div className="container">
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="additional-services">
            <h2>Additional Services</h2>
            <div className="additional-services-grid">
              <div className="additional-service">
                <h4>Airport Transfer</h4>
                <p>Complimentary airport pickup and drop-off service</p>
              </div>
              <div className="additional-service">
                <h4>Laundry Service</h4>
                <p>Professional laundry and dry cleaning services</p>
              </div>
              <div className="additional-service">
                <h4>Business Center</h4>
                <p>Fully equipped business center with meeting rooms</p>
              </div>
              <div className="additional-service">
                <h4>Pet Friendly</h4>
                <p>We welcome your furry friends with special amenities</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services; 