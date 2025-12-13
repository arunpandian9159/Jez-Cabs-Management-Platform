import { stats } from '../../pages/homeData';

export function StatsSection() {
  return (
    <section
      className="py-8 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: '#2563eb' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm lg:text-base text-blue-100">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
