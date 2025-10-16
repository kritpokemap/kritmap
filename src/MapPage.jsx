import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Button } from 'react';
import { Input } from 'react';
import { Label } from 'react';
import { 
  MapPin, LogOut, Plus, Send, Filter, X, User, Shield, MessageCircle 
} from 'lucide-react';
import { sightingsAPI, chatAPI } from './api.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Kanchanaburi center coordinates
const KANCHANABURI_CENTER = [14.0227, 99.5328];

function LocationMarker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Selected location for new sighting</Popup>
    </Marker>
  );
}

export default function MapPage({ user, onLogout }) {
  const [sightings, setSightings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [reportForm, setReportForm] = useState({
    pokemon_name: '',
    pokemon_type: '',
  });
  const [chatMessage, setChatMessage] = useState('');
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchSightings();
    fetchMessages();
    
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchSightings();
      fetchMessages();
    }, 30000);

    return () => clearInterval(interval);
  }, [filterType]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchSightings = async () => {
    try {
      const params = { hours: 24 };
      if (filterType) params.type = filterType;
      
      const response = await sightingsAPI.getSightings(params);
      setSightings(response.data.sightings);
    } catch (error) {
      console.error('Error fetching sightings:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await chatAPI.getMessages({ limit: 50, hours: 24 });
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLocation) {
      alert('Please select a location on the map');
      return;
    }

    setLoading(true);
    try {
      await sightingsAPI.createSighting({
        ...reportForm,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
      });

      setShowReportModal(false);
      setReportForm({ pokemon_name: '', pokemon_type: '' });
      setSelectedLocation(null);
      fetchSightings();
      alert('Sighting reported successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to report sighting');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    try {
      await chatAPI.sendMessage({ message_text: chatMessage });
      setChatMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b shadow-sm z-10">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" 
                 style={{ backgroundColor: 'var(--pokemon-yellow)' }}>
              <MapPin className="w-6 h-6" style={{ color: 'var(--pokemon-black)' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--pokemon-black)' }}>
                KritPokeMap
              </h1>
              <p className="text-xs text-gray-600">Kanchanaburi Province</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowReportModal(true)}
              style={{ backgroundColor: 'var(--pokemon-yellow)', color: 'var(--pokemon-black)' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Report Sighting
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowChatPanel(!showChatPanel)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>

            {user.role === 'admin' && (
              <Link to="/admin">
                <Button variant="outline">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}

            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">{user.username}</span>
            </div>

            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={KANCHANABURI_CENTER}
            zoom={11}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {showReportModal && (
              <LocationMarker onLocationSelect={setSelectedLocation} />
            )}

            {sightings.map((sighting) => (
              <Marker
                key={sighting.id}
                position={[sighting.latitude, sighting.longitude]}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg">{sighting.pokemon_name}</h3>
                    {sighting.pokemon_type && (
                      <p className="text-sm text-gray-600">Type: {sighting.pokemon_type}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Reported by: {sighting.reporter_username}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(sighting.time_reported).toLocaleString()}
                    </p>
                    {sighting.is_verified && (
                      <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Filter Panel */}
          <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4" />
              <span className="font-semibold">Filter</span>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">All Types</option>
              <option value="Water">Water</option>
              <option value="Fire">Fire</option>
              <option value="Grass">Grass</option>
              <option value="Electric">Electric</option>
              <option value="Psychic">Psychic</option>
              <option value="Normal">Normal</option>
            </select>
            <p className="text-xs text-gray-600 mt-2">
              Showing {sightings.length} sightings (last 24h)
            </p>
          </div>
        </div>

        {/* Chat Panel */}
        {showChatPanel && (
          <div className="w-80 bg-white border-l flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold">Live Chat</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChatPanel(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{msg.username}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{msg.message_text}</p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message..."
                />
                <Button
                  type="submit"
                  style={{ backgroundColor: 'var(--pokemon-blue)' }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Report Pokémon Sighting</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowReportModal(false);
                  setSelectedLocation(null);
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Click on the map to select the location where you found the Pokémon.
            </p>

            {selectedLocation && (
              <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded text-sm">
                ✓ Location selected: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
              </div>
            )}

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <Label htmlFor="pokemon_name">Pokémon Name *</Label>
                <Input
                  id="pokemon_name"
                  value={reportForm.pokemon_name}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, pokemon_name: e.target.value })
                  }
                  required
                  placeholder="e.g., Pikachu"
                />
              </div>

              <div>
                <Label htmlFor="pokemon_type">Type (Optional)</Label>
                <select
                  id="pokemon_type"
                  value={reportForm.pokemon_type}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, pokemon_type: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select type...</option>
                  <option value="Water">Water</option>
                  <option value="Fire">Fire</option>
                  <option value="Grass">Grass</option>
                  <option value="Electric">Electric</option>
                  <option value="Psychic">Psychic</option>
                  <option value="Normal">Normal</option>
                  <option value="Flying">Flying</option>
                  <option value="Bug">Bug</option>
                  <option value="Rock">Rock</option>
                  <option value="Ground">Ground</option>
                </select>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !selectedLocation}
                style={{
                  backgroundColor: 'var(--pokemon-yellow)',
                  color: 'var(--pokemon-black)',
                }}
              >
                {loading ? 'Reporting...' : 'Report Sighting'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

