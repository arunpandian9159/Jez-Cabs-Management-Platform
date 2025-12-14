import { Users2, ArrowRight } from 'lucide-react';
import { fleetOptions } from '../../pages/homeData';
import { useAuthModal } from '@/features/auth';
import { SlideInButton } from '@/components/ui';

export function FleetSection() {
  const { openRegister } = useAuthModal();

  return (
    <section
      id="fleet"
      className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-16">
          <span
            className="inline-block text-xs sm:text-sm font-semibold tracking-wider uppercase mb-3 sm:mb-4"
            style={{ color: '#2563eb' }}
          >
            OUR FLEET
          </span>
          <h2
            className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6"
            style={{ color: '#0f172a' }}
          >
            Choose Your Perfect Ride
          </h2>
          <p
            className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto"
            style={{ color: '#475569' }}
          >
            From{' '}
            <span className="text-blue-600 font-medium">
              budget-friendly options
            </span>{' '}
            to{' '}
            <span className="text-amber-600 font-medium">luxury vehicles</span>,
            we have the perfect cab for every journey.
          </p>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
          {fleetOptions.map((option) => (
            <div
              key={option.id}
              className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-32 sm:h-40 lg:h-48 overflow-hidden">
                <img
                  src={option.image}
                  alt={option.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay with name */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 sm:p-4">
                  <h3 className="text-white font-bold text-base sm:text-lg">
                    {option.name}
                  </h3>
                </div>
              </div>
              {/* Content */}
              <div className="p-3 sm:p-4 lg:p-5">
                <p
                  className="text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2"
                  style={{ color: '#475569' }}
                >
                  {option.description}
                </p>
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-1 text-xs sm:text-sm"
                    style={{ color: '#64748b' }}
                  >
                    <Users2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="sm:hidden">
                      {option.capacity.split(' ')[0]}
                    </span>
                    <span className="hidden sm:inline">{option.capacity}</span>
                  </div>
                  <span
                    className="text-xs sm:text-sm font-bold"
                    style={{ color: '#2563eb' }}
                  >
                    {option.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <SlideInButton
            text="View All Vehicles"
            onClick={openRegister}
            defaultBgColor="#ffffff"
            hoverBgColor="#2563eb"
            defaultTextColor="#0f172a"
            hoverTextColor="#ffffff"
            className="border-2 border-gray-200 hover:border-transparent transition-all"
            icon={<ArrowRight className="w-4 h-4" />}
          />
        </div>
      </div>
    </section>
  );
}
