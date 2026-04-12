import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, MapPin, Phone, Building2 } from "lucide-react";
import { RESOURCE_BASE } from "../apiConfig";

const Directory = () => {
  const [resources, setResources] = useState([]);
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (city.trim()) params.append('city', city.trim());
      if (category) params.append('category', category);

      const { data } = await axios.get(`${RESOURCE_BASE}?${params.toString()}`);
      setResources(data.message || []);
    } catch (err) {
      console.error("Error fetching resources:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
   
  }, [category]);
  const handleSearch = (e) => {
    e.preventDefault();
    fetchResources();
  };

  return (
    <div className="page px-4 py-10 sm:py-14" style={{ background: "linear-gradient(160deg,#fdf0f5 0%,#f7f0ff 50%,#fdf0f5 100%)", minHeight: "calc(100vh - 4rem)" }}>
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="tag tag-purple mb-4 mx-auto">Safety Network</div>
          <h1 className="text-3xl sm:text-5xl font-light grad-text mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Verified Safe Spaces
          </h1>
          <p className="text-[var(--c-muted)] text-sm max-w-lg mx-auto">
            Find vetted NGOs, emergency shelters, legal aid, and medical centers in your vicinity. You are not alone.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass p-4 rounded-3xl mb-8" style={{ backdropFilter: "blur(20px)", background: "rgba(255,255,255,0.65)", border: "1px solid rgba(139,92,246,0.14)" }}>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--c-muted)]" />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Search by city (e.g., Delhi)..."
                className="field !pl-12 w-full"
              />
            </div>
            
            <div className="w-full sm:w-48">
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="field w-full appearance-none bg-white font-medium text-[var(--c-ink)]"
              >
                <option value="">All Categories</option>
                <option value="NGO">NGO Support</option>
                <option value="Shelter">Safe Shelter</option>
                <option value="Legal">Legal Aid</option>
                <option value="Medical">Medical Center</option>
              </select>
            </div>
            
            <button type="submit" className="btn-primary w-full sm:w-auto px-6 py-2.5 shadow-md">
              Find
            </button>
          </form>
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="spinner" style={{ width: "2rem", height: "2rem", borderTopColor: "#8b5cf6", borderColor: "rgba(139,92,246,0.25)" }}></div>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-16 text-[var(--c-muted)]">
            <p className="text-4xl mb-4">📍</p>
            <p>No verified resources found in this area.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res) => (
              <div key={res._id} className="glass p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md border border-[rgba(139,92,246,0.1)]">
                
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg text-[var(--c-ink)] leading-tight pr-2">{res.name}</h3>
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-violet-100 text-violet-700 rounded-lg">
                    {res.category}
                  </span>
                </div>
                
                <div className="space-y-3 mb-5">
                  <div className="flex items-start gap-2 text-sm text-[var(--c-muted)]">
                    <Building2 size={16} className="mt-0.5 text-violet-400 shrink-0" />
                    <span>{res.fullAddress}</span>
                  </div>
                  {res.contactNumber && (
                    <div className="flex items-center gap-2 text-sm text-[var(--c-muted)]">
                      <Phone size={16} className="text-pink-400 shrink-0" />
                      <a href={`tel:${res.contactNumber}`} className="hover:text-pink-600 transition-colors font-medium">
                        {res.contactNumber}
                      </a>
                    </div>
                  )}
                </div>

                {res.mapUrl && (
                  <a 
                    href={res.mapUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-violet-50 to-pink-50 hover:from-violet-100 hover:to-pink-100 text-violet-700 font-semibold rounded-xl text-sm transition-colors border border-violet-100/50"
                  >
                    <MapPin size={16} /> Get Directions
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Directory;
