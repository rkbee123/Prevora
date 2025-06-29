import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, Shield, Users, MessageSquare, Briefcase } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'contact@prevora.ai',
      description: 'Get in touch for any inquiries'
    },
    {
      icon: MapPin,
      title: 'Our Location',
      details: 'Innovation Hub, Tech District',
      description: 'Visit our research facility'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      description: 'Available Mon-Fri, 9AM-6PM'
    }
  ];

  const subjectOptions = [
    { value: 'partnership', label: 'Partnership Opportunities', icon: Briefcase },
    { value: 'press', label: 'Press & Media', icon: MessageSquare },
    { value: 'technical', label: 'Technical Support', icon: Shield },
    { value: 'general', label: 'General Inquiry', icon: Users }
  ];

  const socialLinks = [
    { name: 'Twitter', url: '#', color: 'hover:text-blue-400' },
    { name: 'LinkedIn', url: '#', color: 'hover:text-blue-600' },
    { name: 'GitHub', url: '#', color: 'hover:text-gray-800' }
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              We'd love to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">hear from you</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Whether you're interested in partnering with us, contributing data, or just want to learn more about our mission, 
              we're here to help. Reach out and join the prevention revolution.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      {subjectOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Send className="h-5 w-5" />
                    <span>Send Message</span>
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Get in touch</h2>
                  <p className="text-lg text-gray-600 leading-relaxed mb-8">
                    Ready to be part of the future of preventive healthcare? We're always looking for partners, 
                    contributors, and advocates who share our vision of a world prepared for health challenges.
                  </p>
                </div>

                {/* Contact Cards */}
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                        <info.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{info.title}</h3>
                        <p className="text-blue-600 font-medium mb-1">{info.details}</p>
                        <p className="text-gray-600 text-sm">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subject Options */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">What can we help you with?</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {subjectOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2 p-3 bg-white rounded-lg">
                        <option.icon className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">{option.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Follow us on social media</p>
                  <div className="flex justify-center space-x-4">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        className={`w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 ${social.color} transition-colors`}
                      >
                        <span className="sr-only">{social.name}</span>
                        <div className="w-5 h-5 bg-current rounded"></div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Visit Our Innovation Hub</h2>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              {/* Map Placeholder */}
              <div className="h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation Hub</h3>
                  <p className="text-gray-600">Tech District, Research Campus</p>
                  <p className="text-sm text-gray-500 mt-2">Interactive map loading...</p>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600 mb-4">
                  Located in the heart of the tech district, our facility is home to researchers, engineers, 
                  and healthcare professionals working together to build the future of preventive medicine.
                </p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to make a difference?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join our mission to create a world where outbreaks are detected before they spread. 
            Every partnership, every contribution, every voice matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
              Partner With Us
            </button>
            <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;