import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Edit2, Trash2, Plus, Lock, LogOut, Calendar, Users, Award, ExternalLink, X, ChevronLeft, ChevronRight, Mail, Phone, MapPin, Send, Instagram, Linkedin, MessageSquare } from 'lucide-react';

const IEEECSWebsite = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  
  const STORAGE_KEY = 'ieee_cs_data';
  const CONTACTS_KEY = 'ieee_cs_contacts';
  
  const [data, setData] = useState({
    ambassadors: [
      { id: 1, name: 'Bushra SE', image: '', linkedin: '' },
      { id: 2, name: 'Umair CE(N)', image: '', linkedin: '' },
      { id: 3, name: 'Umair CS', image: '', linkedin: '' },
      { id: 4, name: 'Waniya Naveed', image: '', linkedin: '' },
      { id: 5, name: 'Zain Ul Abdin', image: '', linkedin: '' }
    ],
    executive: [
      { id: 1, name: 'MamFadia', role: 'Faculty Head', image: '', linkedin: '' },
      { id: 2, name: 'Chairperson', role: 'Chairperson', image: '', linkedin: '' },
      { id: 3, name: 'Emmar', role: 'Vice Chairperson', image: '', linkedin: '' },
      { id: 4, name: 'Majid Husain', role: 'Secretary', image: '', linkedin: '' }
    ],
    events: {
      completed: [
        { id: 1, title: 'Tech Workshop 2024', date: '2024-12-15', description: 'AI & ML Workshop', thumbnail: '', gallery: [] }
      ],
      upcoming: [
        { id: 1, title: 'Hackathon 2025', date: '2025-02-20', description: 'Annual Coding Competition', thumbnail: '', gallery: [] }
      ]
    }
  });

  const [contacts, setContacts] = useState([]);

  // Framer Motion variants for staggered lists
  const listVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading data:', e);
      }
    }

    const savedContacts = localStorage.getItem(CONTACTS_KEY);
    if (savedContacts) {
      try {
        setContacts(JSON.parse(savedContacts));
      } catch (e) {
        console.error('Error loading contacts:', e);
      }
    }
  }, []);

  const saveData = (newData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  const saveContacts = (newContacts) => {
    setContacts(newContacts);
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(newContacts));
  };

  const handleLogin = () => {
    const validUsers = {
      'admin': 'ieee2025',
      'chairperson': 'chair2025',
      'mamfadia': 'faculty2025'
    };
    
    if (validUsers[credentials.username] === credentials.password) {
      setIsAdmin(true);
      setShowLogin(false);
      alert('Login successful!');
    } else {
      alert('Invalid credentials. Default: admin / ieee2025');
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const newContact = {
      id: Date.now(),
      ...contactForm,
      date: new Date().toISOString()
    };
    saveContacts([...contacts, newContact]);
    setContactSubmitted(true);
    setContactForm({ name: '', email: '', message: '' });
    setTimeout(() => setContactSubmitted(false), 3000);
  };

  const deleteContact = (id) => {
    if (window.confirm('Delete this message?')) {
      saveContacts(contacts.filter(c => c.id !== id));
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const addMember = async (type, member, file) => {
    const newData = { ...data };
    let image = member.image;
    
    if (file) {
      image = await fileToBase64(file);
    }
    
    if (member.id) {
      const index = newData[type].findIndex(m => m.id === member.id);
      newData[type][index] = { ...member, image };
    } else {
      const newId = Math.max(...newData[type].map(m => m.id), 0) + 1;
      newData[type].push({ ...member, id: newId, image });
    }
    
    saveData(newData);
  };

  const deleteMember = (type, id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      const newData = { ...data };
      newData[type] = newData[type].filter(m => m.id !== id);
      saveData(newData);
    }
  };

  const addEvent = async (eventType, event, thumbnailFile, galleryFiles) => {
    const newData = { ...data };
    let thumbnail = event.thumbnail;
    let gallery = event.gallery || [];
    
    if (thumbnailFile) {
      thumbnail = await fileToBase64(thumbnailFile);
    }
    
    if (galleryFiles && galleryFiles.length > 0) {
      const galleryPromises = Array.from(galleryFiles).map(file => fileToBase64(file));
      const newGalleryImages = await Promise.all(galleryPromises);
      gallery = [...gallery, ...newGalleryImages];
    }
    
    if (event.id) {
      const index = newData.events[eventType].findIndex(e => e.id === event.id);
      newData.events[eventType][index] = { ...event, thumbnail, gallery };
    } else {
      const newId = Math.max(...newData.events[eventType].map(e => e.id), 0) + 1;
      newData.events[eventType].push({ ...event, id: newId, thumbnail, gallery });
    }
    
    saveData(newData);
  };

  const deleteEvent = (eventType, id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const newData = { ...data };
      newData.events[eventType] = newData.events[eventType].filter(e => e.id !== id);
      saveData(newData);
    }
  };

  const MemberCard = ({ member, type, showEdit }) => {
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState(member);
    const [file, setFile] = useState(null);

    const handleSave = async () => {
      await addMember(type, editData, file);
      setEditing(false);
      setFile(null);
    };

    if (editing) {
      return (
        <div className="bg-gray-800 p-4 rounded-lg border-2 border-cyan-500">
          <input
            type="text"
            placeholder="Name"
            className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
            value={editData.name}
            onChange={(e) => setEditData({...editData, name: e.target.value})}
          />
          {type === 'executive' && (
            <input
              type="text"
              placeholder="Role"
              className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
              value={editData.role}
              onChange={(e) => setEditData({...editData, role: e.target.value})}
            />
          )}
          <input
            type="text"
            placeholder="LinkedIn URL"
            className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
            value={editData.linkedin}
            onChange={(e) => setEditData({...editData, linkedin: e.target.value})}
          />
          <input
            type="file"
            accept="image/*"
            className="w-full mb-2 text-white"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex-1 bg-green-600 text-white py-2 rounded">Save</button>
            <button onClick={() => setEditing(false)} className="flex-1 bg-gray-600 text-white py-2 rounded">Cancel</button>
          </div>
        </div>
      );
    }

    return (
      <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} transition={{ duration: 0.35 }} className="bg-gray-800 p-4 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
        <div className="w-32 h-32 mx-auto mb-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
          {member.image ? (
            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
          ) : (
            <Camera className="w-12 h-12 text-white" />
          )}
        </div>
        <h3 className="text-white font-bold text-center">{member.name}</h3>
        {member.role && <p className="text-cyan-400 text-sm text-center">{member.role}</p>}
        {member.linkedin && (
          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" 
             className="flex items-center justify-center gap-1 text-blue-400 text-sm mt-2 hover:text-blue-300">
            <ExternalLink className="w-3 h-3" /> LinkedIn
          </a>
        )}
        {showEdit && (
          <div className="flex gap-2 mt-3">
            <button onClick={() => setEditing(true)} className="flex-1 bg-blue-600 text-white py-1 rounded text-sm">
              <Edit2 className="w-3 h-3 inline mr-1" />Edit
            </button>
            <button onClick={() => deleteMember(type, member.id)} className="flex-1 bg-red-600 text-white py-1 rounded text-sm">
              <Trash2 className="w-3 h-3 inline mr-1" />Delete
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  const EventCard = ({ event, eventType, showEdit }) => {
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState(event);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState(null);

    const handleSave = async () => {
      await addEvent(eventType, editData, thumbnailFile, galleryFiles);
      setEditing(false);
      setThumbnailFile(null);
      setGalleryFiles(null);
    };

    if (editing) {
      return (
        <div className="bg-gray-800 p-4 rounded-lg border-2 border-cyan-500">
          <input
            type="text"
            placeholder="Event Title"
            className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
            value={editData.title}
            onChange={(e) => setEditData({...editData, title: e.target.value})}
          />
          <input
            type="date"
            className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
            value={editData.date}
            onChange={(e) => setEditData({...editData, date: e.target.value})}
          />
          <textarea
            placeholder="Description"
            className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
            value={editData.description}
            onChange={(e) => setEditData({...editData, description: e.target.value})}
          />
          <label className="text-cyan-400 text-sm block mb-1">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            className="w-full mb-3 text-white text-sm"
            onChange={(e) => setThumbnailFile(e.target.files[0])}
          />
          <label className="text-cyan-400 text-sm block mb-1">Gallery Images (Multiple)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="w-full mb-3 text-white text-sm"
            onChange={(e) => setGalleryFiles(e.target.files)}
          />
          {editData.gallery && editData.gallery.length > 0 && (
            <div className="mb-3">
              <p className="text-gray-400 text-xs mb-2">Current Gallery: {editData.gallery.length} images</p>
              <div className="grid grid-cols-3 gap-2">
                {editData.gallery.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-20 object-cover rounded" />
                    <button
                      onClick={() => {
                        const newGallery = editData.gallery.filter((_, i) => i !== idx);
                        setEditData({...editData, gallery: newGallery});
                      }}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex-1 bg-green-600 text-white py-2 rounded">Save</button>
            <button onClick={() => setEditing(false)} className="flex-1 bg-gray-600 text-white py-2 rounded">Cancel</button>
          </div>
        </div>
      );
    }

    return (
      <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} transition={{ duration: 0.35 }} className="bg-gray-800 p-4 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
        <div 
          className="w-full h-40 mb-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded overflow-hidden cursor-pointer"
          onClick={() => setSelectedEvent(event)}
        >
          {event.thumbnail ? (
            <img src={event.thumbnail} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-white" />
            </div>
          )}
        </div>
        <h3 className="text-white font-bold">{event.title}</h3>
        <p className="text-cyan-400 text-sm">{new Date(event.date).toLocaleDateString()}</p>
        <p className="text-gray-300 text-sm mt-2">{event.description}</p>
        {event.gallery && event.gallery.length > 0 && (
          <p className="text-cyan-400 text-xs mt-2">📷 {event.gallery.length} photos - Click to view</p>
        )}
        {showEdit && (
          <div className="flex gap-2 mt-3">
            <button onClick={() => setEditing(true)} className="flex-1 bg-blue-600 text-white py-1 rounded text-sm">
              <Edit2 className="w-3 h-3 inline mr-1" />Edit
            </button>
            <button onClick={() => deleteEvent(eventType, event.id)} className="flex-1 bg-red-600 text-white py-1 rounded text-sm">
              <Trash2 className="w-3 h-3 inline mr-1" />Delete
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  const EventGalleryModal = () => {
    if (!selectedEvent) return null;

    const images = selectedEvent.gallery || [];
    const hasImages = images.length > 0;

    const nextImage = () => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }} transition={{ duration: 0.3 }} className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
          <div className="sticky top-0 bg-gray-900 p-4 flex items-center justify-between border-b border-cyan-500/30">
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedEvent.title}</h2>
              <p className="text-cyan-400 text-sm">{new Date(selectedEvent.date).toLocaleDateString()}</p>
            </div>
            <button
              onClick={() => {
                setSelectedEvent(null);
                setCurrentImageIndex(0);
              }}
              className="text-white hover:text-red-400"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <p className="text-gray-300 mb-6">{selectedEvent.description}</p>

            {hasImages ? (
              <>
                <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                  <img
                    src={images[currentImageIndex]}
                    alt={`${selectedEvent.title} - ${currentImageIndex + 1}`}
                    className="w-full max-h-96 object-contain"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`cursor-pointer rounded overflow-hidden border-2 ${
                        idx === currentImageIndex ? 'border-cyan-400' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-20 object-cover" />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No gallery images available</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const AddNewButton = ({ onClick, text }) => (
    <button 
      onClick={onClick}
      className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:shadow-lg transition-all"
    >
      <Plus className="w-5 h-5" /> {text}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-black/50 backdrop-blur-lg border-b border-cyan-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-white p-1">
                <img src="/IEEE_CS_logo.jpg" alt="IEEE CS Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">IEEE Computer Society</h1>
                <p className="text-cyan-400 text-sm">HITEC University</p>
              </div>
            </div>
            
            <nav className="flex items-center gap-6">
              <button onClick={() => setCurrentPage('home')} className={`text-white hover:text-cyan-400 transition-colors ${currentPage === 'home' ? 'text-cyan-400' : ''}`}>Home</button>
              <button onClick={() => setCurrentPage('about')} className={`text-white hover:text-cyan-400 transition-colors ${currentPage === 'about' ? 'text-cyan-400' : ''}`}>About</button>
              <button onClick={() => setCurrentPage('team')} className={`text-white hover:text-cyan-400 transition-colors ${currentPage === 'team' ? 'text-cyan-400' : ''}`}>Team</button>
              <button onClick={() => setCurrentPage('events')} className={`text-white hover:text-cyan-400 transition-colors ${currentPage === 'events' ? 'text-cyan-400' : ''}`}>Events</button>
              <button onClick={() => setCurrentPage('contact')} className={`text-white hover:text-cyan-400 transition-colors ${currentPage === 'contact' ? 'text-cyan-400' : ''}`}>Contact</button>
              
              {isAdmin ? (
                <button onClick={() => { setIsAdmin(false); alert('Logged out successfully'); }} 
                        className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              ) : (
                <button onClick={() => setShowLogin(true)} 
                        className="bg-cyan-600 text-white px-4 py-2 rounded flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Admin
                </button>
              )}
            </nav>
          </div>
        </div>
      </motion.header>

      {showLogin && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg w-96 border-2 border-cyan-500">
            <h2 className="text-2xl font-bold text-white mb-6">Admin Login</h2>
            <input
              type="text"
              placeholder="Username"
              className="w-full mb-4 p-3 bg-gray-700 text-white rounded"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-6 p-3 bg-gray-700 text-white rounded"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <div className="flex gap-3">
              <button onClick={handleLogin} className="flex-1 bg-cyan-600 text-white py-3 rounded hover:bg-cyan-700">Login</button>
              <button onClick={() => setShowLogin(false)} className="flex-1 bg-gray-600 text-white py-3 rounded hover:bg-gray-700">Cancel</button>
            </div>
            <p className="text-gray-400 text-sm mt-4 text-center">Default: admin / ieee2025</p>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedEvent && <EventGalleryModal key={selectedEvent.id} />}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {currentPage === 'home' && (
          <div>
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-white mb-4">Welcome to IEEE CS HITEC</h2>
              <p className="text-xl text-cyan-400">Empowering Innovation Through Technology</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-lg border border-cyan-500/30 hover:border-cyan-500 transition-all cursor-pointer"
                   onClick={() => setCurrentPage('team')}>
                <Users className="w-12 h-12 text-cyan-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Our Team</h3>
                <p className="text-gray-300">Meet our dedicated executives and ambassadors driving innovation</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-lg border border-cyan-500/30 hover:border-cyan-500 transition-all cursor-pointer"
                   onClick={() => setCurrentPage('events')}>
                <Calendar className="w-12 h-12 text-cyan-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Events</h3>
                <p className="text-gray-300">Workshops, hackathons, and tech talks throughout the year</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-lg border border-cyan-500/30 hover:border-cyan-500 transition-all">
                <Award className="w-12 h-12 text-cyan-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Excellence</h3>
                <p className="text-gray-300">Committed to technical excellence and professional development</p>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'about' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-8">About IEEE CS HITEC</h2>
            
            <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-lg border border-cyan-500/30 mb-8">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">Our Mission</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                The IEEE Computer Society HITEC Student Chapter is dedicated to advancing innovation, 
                creativity, and excellence in the field of computing. We strive to provide our members 
                with opportunities to develop technical skills, network with industry professionals, 
                and contribute to cutting-edge research and projects.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-lg border border-cyan-500/30 mb-8">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">What We Do</h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                  <p className="text-lg">Organize technical workshops and seminars on emerging technologies</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                  <p className="text-lg">Host hackathons and coding competitions</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                  <p className="text-lg">Facilitate networking events with industry experts</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                  <p className="text-lg">Support student research and innovation projects</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                  <p className="text-lg">Build a strong community of tech enthusiasts</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-lg border border-cyan-500/30">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">Join Us</h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                Whether you're a beginner or an experienced programmer, IEEE CS HITEC welcomes all 
                students passionate about technology. Join us to enhance your skills, expand your network, 
                and be part of a vibrant community of innovators.
              </p>
              <button 
                onClick={() => setCurrentPage('contact')}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all"
              >
                Get in Touch
              </button>
            </div>
          </div>
        )}

        {currentPage === 'contact' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-8">Contact Us</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-lg border border-cyan-500/30">
                <h3 className="text-2xl font-bold text-cyan-400 mb-6">Get in Touch</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-cyan-400 mt-1" />
                    <div>
                      <p className="text-white font-semibold">Email</p>
                      <a href="mailto:ieee.cs@hitecuni.edu.pk" className="text-gray-300 hover:text-cyan-400">
                        ieee.cs@hitecuni.edu.pk
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-cyan-400 mt-1" />
                    <div>
                      <p className="text-white font-semibold">Location</p>
                      <p className="text-gray-300">HITEC University, Taxila Cantt, Pakistan</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-white font-semibold mb-3">Follow Us</p>
                    <div className="flex gap-4">
                      <a 
                        href="https://www.instagram.com/ieeecshitec/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg hover:shadow-lg transition-all"
                      >
                        <Instagram className="w-6 h-6 text-white" />
                      </a>
                      <a 
                        href="https://www.linkedin.com/company/ieee-computer-society-hitec-student-chapter/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-blue-600 p-3 rounded-lg hover:shadow-lg transition-all"
                      >
                        <Linkedin className="w-6 h-6 text-white" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-lg border border-cyan-500/30">
                <h3 className="text-2xl font-bold text-cyan-400 mb-6">Send a Message</h3>
                
                {contactSubmitted ? (
                  <div className="bg-green-600/20 border border-green-500 rounded-lg p-4 mb-4">
                    <p className="text-green-400 font-semibold">✓ Message sent successfully!</p>
                    <p className="text-gray-300 text-sm">We'll get back to you soon.</p>
                  </div>
                ) : null}

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      required
                      className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <input
                      type="email"
                      placeholder="Your Email"
                      required
                      className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <textarea
                      placeholder="Your Message"
                      required
                      rows="4"
                      className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none resize-none"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                  >
                    <Send className="w-5 h-5" /> Send Message
                  </button>
                </form>
              </div>
            </div>

            {isAdmin && contacts.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-lg border border-cyan-500/30">
                <h3 className="text-2xl font-bold text-cyan-400 mb-6">
                  <MessageSquare className="w-6 h-6 inline mr-2" />
                  Received Messages ({contacts.length})
                </h3>
                <div className="space-y-4">
                  {contacts.map(contact => (
                    <div key={contact.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-white font-semibold">{contact.name}</p>
                          <p className="text-cyan-400 text-sm">{contact.email}</p>
                          <p className="text-gray-400 text-xs">{new Date(contact.date).toLocaleString()}</p>
                        </div>
                        <button
                          onClick={() => deleteContact(contact.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-gray-300">{contact.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentPage === 'team' && (
          <div>
            <h2 className="text-4xl font-bold text-white mb-8">Our Team</h2>
            
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold text-cyan-400">Executive Body</h3>
                {isAdmin && <AddNewButton onClick={() => addMember('executive', { name: '', role: '', linkedin: '' }, null)} text="Add Executive" />}
              </div>
              <motion.div variants={listVariants} initial="hidden" animate="show" className="grid md:grid-cols-4 gap-6">
                {data.executive.map(member => (
                  <MemberCard key={member.id} member={member} type="executive" showEdit={isAdmin} />
                ))}
              </motion.div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold text-cyan-400">Ambassadors</h3>
                {isAdmin && <AddNewButton onClick={() => addMember('ambassadors', { name: '', linkedin: '' }, null)} text="Add Ambassador" />}
              </div>
              <motion.div variants={listVariants} initial="hidden" animate="show" className="grid md:grid-cols-5 gap-6">
                {data.ambassadors.map(member => (
                  <MemberCard key={member.id} member={member} type="ambassadors" showEdit={isAdmin} />
                ))}
              </motion.div>
            </div>
          </div>
        )}

        {currentPage === 'events' && (
          <div>
            <h2 className="text-4xl font-bold text-white mb-8">Events</h2>
            
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold text-cyan-400">Upcoming Events</h3>
                {isAdmin && <AddNewButton onClick={() => addEvent('upcoming', { title: '', date: '', description: '', gallery: [] }, null, null)} text="Add Event" />}
              </div>
              <motion.div variants={listVariants} initial="hidden" animate="show" className="grid md:grid-cols-3 gap-6">
                {data.events.upcoming.map(event => (
                  <EventCard key={event.id} event={event} eventType="upcoming" showEdit={isAdmin} />
                ))}
              </motion.div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold text-cyan-400">Completed Events</h3>
                {isAdmin && <AddNewButton onClick={() => addEvent('completed', { title: '', date: '', description: '', gallery: [] }, null, null)} text="Add Event" />}
              </div>
              <motion.div variants={listVariants} initial="hidden" animate="show" className="grid md:grid-cols-3 gap-6">
                {data.events.completed.map(event => (
                  <EventCard key={event.id} event={event} eventType="completed" showEdit={isAdmin} />
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-black/50 backdrop-blur-lg border-t border-cyan-500/30 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400">© 2025 IEEE Computer Society - HITEC University</p>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.instagram.com/ieeecshitec/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/company/ieee-computer-society-hitec-student-chapter/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="mailto:ieee.cs@hitecuni.edu.pk"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IEEECSWebsite;