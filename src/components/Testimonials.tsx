import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CEO, TechStart Inc.',
      content: 'Charlieverse transformed our startup idea into a fully functional platform in just 8 weeks. Their expertise in both frontend and backend development is exceptional.',
      rating: 5,
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    },
    {
      name: 'Dr. Michael Rodriguez',
      role: 'Research Director, University Labs',
      content: 'The AI solution they developed for our research project exceeded all expectations. The machine learning models are incredibly accurate and well-documented.',
      rating: 5,
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    },
    {
      name: 'James Thompson',
      role: 'CTO, SecureFinance',
      content: 'Their cybersecurity audit revealed critical vulnerabilities we never knew existed. The team provided comprehensive solutions and ongoing support.',
      rating: 5,
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    },
    {
      name: 'Emily Watson',
      role: 'Founder, EcoCommerce',
      content: 'From concept to launch, Charlieverse delivered a beautiful, fast, and secure e-commerce platform. Our sales increased by 300% in the first quarter.',
      rating: 5,
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    },
    {
      name: 'Alex Kumar',
      role: 'Product Manager, DataFlow',
      content: 'The team\'s attention to detail and commitment to quality is unmatched. They delivered our complex data visualization platform ahead of schedule.',
      rating: 5,
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    },
    {
      name: 'Lisa Park',
      role: 'Director, HealthTech Solutions',
      content: 'Charlieverse helped us navigate complex healthcare compliance requirements while building a user-friendly patient management system.',
      rating: 5,
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-gray-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Client <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Success Stories</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our clients say about working with Charlieverse.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Quote Icon */}
              <div className="mb-6">
                <Quote className="h-8 w-8 text-cyan-400 opacity-50" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border border-cyan-400/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Join Our Success Stories?</h3>
            <p className="text-gray-400 mb-6">Let's discuss how we can help transform your business with innovative technology solutions.</p>
            <button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
              Start Your Project
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;