import React from 'react';

interface SponsorsProps {
  sponsorLogos: string[];
}

export default function Sponsors({ sponsorLogos }: SponsorsProps) {
  return (
    <div className="sponsors-container">
      <h2>Our Sponsors</h2>
      <div className="sponsors">
        {sponsorLogos.map((logo, index) => (
          <div key={index} className="sponsor">
            <img src={logo} alt={`Sponsor ${index + 1}`} className="sponsor-logo" />
          </div>
        ))}
      </div>
    </div>
  );
}