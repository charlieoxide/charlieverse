import React from 'react';
import { Target, Users, Zap, Award } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Mission-Driven',
      description: 'We focus on delivering solutions that drive real business value and growth.',
    },
    {
      icon: Users,
      title: 'Client-Centric',
      description: 'Your success is our priority. We build lasting partnerships through exceptional service.',
    },
    {
      icon: Zap,
      title: 'Innovation First',
      description: 'We leverage cutting-edge technologies to create future-ready solutions.',
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Every project undergoes rigorous testing and quality assurance processes.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Charlieverse</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Empowering businesses with reliable, secure, and innovative tech solutions that drive growth and success.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white">
                Building the Future, One Project at a Time
              </h3>
              <p className="text-lg text-gray-400 leading-relaxed">
                At Charlieverse, we believe technology should be a catalyst for growth, not a barrier. 
                Our team of experienced developers, AI specialists, and cybersecurity experts work 
                together to deliver comprehensive solutions that transform businesses.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                From startups to enterprises, academic institutions to individual entrepreneurs, 
                we've helped hundreds of clients achieve their digital transformation goals with 
                cutting-edge technology and unwavering support.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">5+</div>
                <div className="text-gray-400">Years Experience</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">15+</div>
                <div className="text-gray-400">Team Members</div>
              </div>
            </div>
          </div>

          {/* Right Content - Values */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-8">Our Core Values</h3>
            {values.map((value, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl hover:border-cyan-400/50 transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="p-3 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg">
                    <value.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">{value.title}</h4>
                  <p className="text-gray-400">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border border-cyan-400/20 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">Our Mission</h3>
            <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              "To democratize access to cutting-edge technology by providing reliable, secure, and innovative 
              solutions that empower our clients to achieve their goals and drive meaningful growth in the digital age."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;