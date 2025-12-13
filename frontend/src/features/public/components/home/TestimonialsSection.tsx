import { Star, Quote } from 'lucide-react';
import { testimonials } from '../../pages/homeData';

export function TestimonialsSection() {
    return (
        <section
            className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8"
            style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdfa 50%, #eff6ff 100%)' }}
        >
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-10 sm:mb-14 lg:mb-16">
                    <span
                        className="inline-block text-xs sm:text-sm font-semibold tracking-wider uppercase mb-3 sm:mb-4"
                        style={{ color: '#2563eb' }}
                    >
                        TESTIMONIALS
                    </span>
                    <h2
                        className="text-2xl sm:text-3xl lg:text-5xl font-bold italic mb-3 sm:mb-4 lg:mb-6"
                        style={{ color: '#0f172a' }}
                    >
                        What Our Customers Say
                    </h2>
                    <p
                        className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto"
                        style={{ color: '#475569' }}
                    >
                        Real stories from real customers who trust us for their journeys.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="relative bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-md transition-all duration-300 hover:shadow-xl"
                        >
                            {/* Quote Icon */}
                            <div
                                className="absolute -top-3 right-5 sm:-top-4 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: '#2563eb' }}
                            >
                                <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>

                            {/* Stars */}
                            <div className="flex gap-1 mb-3 sm:mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400"
                                    />
                                ))}
                            </div>

                            {/* Content */}
                            <p
                                className="text-sm sm:text-base mb-5 sm:mb-6 leading-relaxed"
                                style={{ color: '#475569' }}
                            >
                                "{testimonial.content}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                                />
                                <div>
                                    <h4 className="font-semibold text-sm sm:text-base" style={{ color: '#0f172a' }}>
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-xs sm:text-sm" style={{ color: '#2563eb' }}>
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
