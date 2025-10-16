import { Link } from 'react-router-dom';
import { Button } from 'react';
import { MapPin, Users, MessageCircle, Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" 
                 style={{ backgroundColor: 'var(--pokemon-yellow)' }}>
              <MapPin className="w-6 h-6" style={{ color: 'var(--pokemon-black)' }} />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--pokemon-black)' }}>
              KritPokeMap
            </h1>
          </div>
          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/register">
              <Button style={{ 
                backgroundColor: 'var(--pokemon-yellow)', 
                color: 'var(--pokemon-black)' 
              }}>
                Subscribe Now
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6" style={{ color: 'var(--pokemon-black)' }}>
          Catch 'Em All in Kanchanaburi!
        </h2>
        <p className="text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
          Join the ultimate Pokémon tracking community in Kanchanaburi. 
          Discover real-time Pokémon locations shared by trainers like you.
        </p>
        <Link to="/register">
          <Button size="lg" className="text-lg px-8 py-6" style={{ 
            backgroundColor: 'var(--pokemon-yellow)', 
            color: 'var(--pokemon-black)' 
          }}>
            Start Your Adventure
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--pokemon-black)' }}>
          Why Choose KritPokeMap?
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" 
                 style={{ backgroundColor: 'var(--pokemon-blue)' }}>
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold mb-2">Real-time Map</h4>
            <p className="text-gray-600">
              Track Pokémon locations in Kanchanaburi with live updates from the community.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" 
                 style={{ backgroundColor: 'var(--pokemon-yellow)' }}>
              <Users className="w-8 h-8" style={{ color: 'var(--pokemon-black)' }} />
            </div>
            <h4 className="text-xl font-bold mb-2">Community Driven</h4>
            <p className="text-gray-600">
              Share your sightings and help fellow trainers catch rare Pokémon.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" 
                 style={{ backgroundColor: 'var(--pokemon-blue)' }}>
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold mb-2">Live Chat</h4>
            <p className="text-gray-600">
              Communicate with other trainers in real-time and coordinate hunts.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" 
                 style={{ backgroundColor: 'var(--pokemon-gray)' }}>
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold mb-2">Admin Verified</h4>
            <p className="text-gray-600">
              Trusted sightings verified by our admin team for accuracy.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8 border-4" 
             style={{ borderColor: 'var(--pokemon-yellow)' }}>
          <h3 className="text-3xl font-bold text-center mb-4">Monthly Access</h3>
          <div className="text-center mb-6">
            <span className="text-5xl font-bold" style={{ color: 'var(--pokemon-blue)' }}>
              ฿99
            </span>
            <span className="text-gray-600">/month</span>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Unlimited map access</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Report Pokémon sightings</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Real-time chat access</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>7-day free trial</span>
            </li>
          </ul>
          <Link to="/register">
            <Button className="w-full text-lg py-6" style={{ 
              backgroundColor: 'var(--pokemon-yellow)', 
              color: 'var(--pokemon-black)' 
            }}>
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 KritPokeMap. All rights reserved.</p>
          <p className="mt-2">Focused on Kanchanaburi Province, Thailand</p>
        </div>
      </footer>
    </div>
  );
}

