import React from 'react';

const brandsRow1 = [
  { name: 'BMW', domain: 'bmw.com' },
  { name: 'Mercedes-Benz', domain: 'mercedes-benz.com' },
  { name: 'Audi', domain: 'audi.com' },
  { name: 'Porsche', domain: 'porsche.com' },
  { name: 'Ferrari', domain: 'ferrari.com' },
  { name: 'Lamborghini', domain: 'lamborghini.com' },
  { name: 'Tesla', domain: 'tesla.com' },
  { name: 'Jaguar', domain: 'jaguar.com' },
];

const brandsRow2 = [
  { name: 'Toyota', domain: 'toyota.com' },
  { name: 'Volkswagen', domain: 'vw.com' },
  { name: 'Volvo', domain: 'volvocars.com' },
  { name: 'Lexus', domain: 'lexus.com' },
  { name: 'Land Rover', domain: 'landrover.com' },
  { name: 'Bentley', domain: 'bentleymotors.com' },
  { name: 'Rolls Royce', domain: 'rolls-roycemotorcars.com' },
  { name: 'Aston Martin', domain: 'astonmartin.com' },
];

const BrandCarousel = () => {
  return (
    <section className="py-20 bg-[#0a0a0a] overflow-hidden relative border-t border-white/5">
      {/* Edge gradients for smooth fade in/out */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

      <div className="flex flex-col gap-16">
        {/* Row 1: Left to Right */}
        <div className="flex whitespace-nowrap group">
          <div className="animate-marquee-left flex items-center space-x-20 group-hover:[animation-play-state:paused] pr-20">
            {[...brandsRow1, ...brandsRow1, ...brandsRow1].map((brand, idx) => (
              <div
                key={idx}
                className="opacity-40 hover:opacity-100 transition-opacity duration-300 cursor-pointer flex items-center justify-center grayscale hover:grayscale-0"
              >
                <img
                  src={`https://logo.clearbit.com/${brand.domain}`}
                  alt={brand.name}
                  className="h-16 w-auto object-contain"
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent && !parent.querySelector('span')) {
                      const span = document.createElement('span');
                      span.className = 'text-3xl font-black tracking-widest text-white';
                      span.innerText = brand.name;
                      parent.appendChild(span);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Right to Left */}
        <div className="flex whitespace-nowrap group justify-end">
          <div className="animate-marquee-right flex items-center space-x-20 group-hover:[animation-play-state:paused] pr-20">
            {[...brandsRow2, ...brandsRow2, ...brandsRow2].map((brand, idx) => (
              <div
                key={idx}
                className="opacity-40 hover:opacity-100 transition-opacity duration-300 cursor-pointer flex items-center justify-center grayscale hover:grayscale-0"
              >
                <img
                  src={`https://logo.clearbit.com/${brand.domain}`}
                  alt={brand.name}
                  className="h-16 w-auto object-contain"
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent && !parent.querySelector('span')) {
                      const span = document.createElement('span');
                      span.className = 'text-3xl font-black tracking-widest text-white';
                      span.innerText = brand.name;
                      parent.appendChild(span);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandCarousel;
