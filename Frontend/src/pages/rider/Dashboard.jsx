import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import menuService from '../../services/menuService';
import penjualanService from '../../services/penjualanService';
import riderService from '../../services/riderService';

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function RiderDashboard() {
  const [riderProducts, setRiderProducts] = useState([]);
  const [salesData, setSalesData] = useState(null);
  const [riderData, setRiderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [riderId, setRiderId] = useState(null);
  
  // Location state
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  // Default coordinates from database or use current location
  const defaultCoordinates = location || [-6.2088, 106.8456];

  // Get rider ID from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setRiderId(user.id_rider);
    } else {
      setError('Data pengguna tidak ditemukan');
      setLoading(false);
    }
  }, []);

  // Fetch data when rider ID is available
  useEffect(() => {
    if (!riderId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch rider data
        const riderResponse = await riderService.getRiderById(riderId);
        if (riderResponse.success) {
          setRiderData(riderResponse.data);
          // Initialize isLive from database
          setIsLive(riderResponse.data.status_live_location === 'Aktif');
        }

        // Fetch last location from database
        try {
          const locationResponse = await riderService.getRiderLocation(riderId);
          if (locationResponse.success && locationResponse.data) {
            const locationData = locationResponse.data;
            // Convert to numbers in case they're strings from database
            const lat = parseFloat(locationData.latitude);
            const lng = parseFloat(locationData.longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
              setLocation([lat, lng]);
              if (locationData.waktu_update) {
                setLastUpdated(new Date(locationData.waktu_update));
              }
            }
          }
        } catch (err) {
          console.log('Location tidak ditemukan, menggunakan default');
        }

        // Fetch products/menus
        const menuResponse = await menuService.getAllMenus();
        if (menuResponse.success) {
          setRiderProducts(menuResponse.data);
        }

        // Fetch today's sales data (or latest if today's doesn't exist)
        try {
          try {
            const penjualanResponse = await penjualanService.getTodayByRider(riderId);
            if (penjualanResponse.success) {
              setSalesData(penjualanResponse.data);
            }
          } catch (todayErr) {
            // Try to get latest penjualan if today's doesn't exist
            const latestResponse = await penjualanService.getLatestByRider(riderId);
            if (latestResponse.success) {
              setSalesData(latestResponse.data);
            }
          }
        } catch (latestErr) {
          // No sales data available yet
          console.log('Sales data tidak ditemukan');
          setSalesData(null);
        }
      } catch (err) {
        setError(err.message || 'Gagal mengambil data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [riderId]);

  // Handle toggle live location
  const handleToggleLive = useCallback(async () => {
    try {
      setToggleLoading(true);
      const newIsLive = !isLive;
      
      if (newIsLive) {
        // When turning ON, get current location
        setLocationLoading(true);
        setLocationError(null);

        if (!navigator.geolocation) {
          setLocationError('Geolocation tidak didukung oleh browser Anda');
          setToggleLoading(false);
          setLocationLoading(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Update backend dengan status Aktif dan lat/lng
            try {
              const response = await riderService.updateRiderLocation(riderId, 'Aktif', lat, lng);
              console.log('Toggle ON response:', response);
              
              if (response.success) {
                // Verify the update was actually applied in the backend
                const verifyResponse = await riderService.getRiderById(riderId);
                if (verifyResponse.success && verifyResponse.data.status_live_location === 'Aktif') {
                  setLocation([lat, lng]);
                  setLastUpdated(new Date());
                  setIsLive(true);
                  setToggleLoading(false);
                  setLocationLoading(false);
                } else {
                  setError('Gagal mengaktifkan live location (data tidak tersimpan)');
                  setToggleLoading(false);
                  setLocationLoading(false);
                  setIsLive(false); // Revert to match database state
                }
              } else {
                setError(response.message || 'Gagal mengaktifkan live location');
                setToggleLoading(false);
                setLocationLoading(false);
              }
            } catch (err) {
              console.error('Toggle ON error:', err);
              setError('Gagal mengaktifkan live location: ' + (err.message || 'Unknown error'));
              setToggleLoading(false);
              setLocationLoading(false);
            }
          },
          async (error) => {
            // Geolocation failed, use fallback coordinates
            console.warn('Geolocation failed, using fallback coordinates:', error.message);
            const fallbackLat = -6.2088;
            const fallbackLng = 106.8456;
            
            try {
              const response = await riderService.updateRiderLocation(riderId, 'Aktif', fallbackLat, fallbackLng);
              console.log('Toggle ON with fallback response:', response);
              
              if (response.success) {
                // Verify the update was actually applied in the backend
                const verifyResponse = await riderService.getRiderById(riderId);
                if (verifyResponse.success && verifyResponse.data.status_live_location === 'Aktif') {
                  setLocation([fallbackLat, fallbackLng]);
                  setLastUpdated(new Date());
                  setIsLive(true);
                  setLocationError(`Menggunakan lokasi default. Izinkan akses geolocation untuk lokasi akurat.`);
                  setToggleLoading(false);
                  setLocationLoading(false);
                } else {
                  setError('Gagal mengaktifkan live location (data tidak tersimpan)');
                  setToggleLoading(false);
                  setLocationLoading(false);
                  setIsLive(false); // Revert to match database state
                }
              } else {
                setError(response.message || 'Gagal mengaktifkan live location');
                setToggleLoading(false);
                setLocationLoading(false);
              }
            } catch (err) {
              console.error('Toggle ON with fallback error:', err);
              setError('Gagal mengaktifkan live location: ' + (err.message || 'Unknown error'));
              setToggleLoading(false);
              setLocationLoading(false);
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        // When turning OFF, just update status to Nonaktif (without coordinates)
        try {
          const response = await riderService.updateRiderLocation(riderId, 'Nonaktif');
          console.log('Toggle OFF response:', response);
          
          if (response.success) {
            // Verify the update was actually applied in the backend
            const verifyResponse = await riderService.getRiderById(riderId);
            if (verifyResponse.success && verifyResponse.data.status_live_location === 'Nonaktif') {
              setIsLive(false);
              setToggleLoading(false);
            } else {
              // Backend didn't actually update, keep UI in sync with database
              setError('Gagal menonaktifkan live location (data tidak tersimpan)');
              setToggleLoading(false);
              setIsLive(true); // Revert UI to match actual database state
            }
          } else {
            setError(response.message || 'Gagal menonaktifkan live location');
            setToggleLoading(false);
          }
        } catch (err) {
          console.error('Toggle OFF error:', err);
          setError('Gagal menonaktifkan live location: ' + (err.message || 'Unknown error'));
          setToggleLoading(false);
        }
      }
    } catch (err) {
      console.error('Toggle general error:', err);
      setError('Gagal mengubah status live location');
      setToggleLoading(false);
      setLocationLoading(false);
    }
  }, [riderId, isLive, location]);

  if (loading) {
    return (
      <div className="animate-fade-in w-full pb-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fdd835] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in w-full pb-10">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-[#fdd835] font-display-lg inline-block border-b-4 border-[#fdd835] pb-1 tracking-wide">
          Dashboard
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-100 border-4 border-red-500 rounded-xl p-4 text-red-700 font-bold">
          {error}
        </div>
      )}

      {/* Status Pill */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 bg-[#1d4ed8] border-2 border-gray-900 rounded-lg px-4 py-2 text-white font-bold shadow-[3px_3px_0_0_rgba(17,24,39,1)]">
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>location_on</span>
          Tampilkan Lokasi Penjual
        </div>
      </div>

      {/* Live Location Card */}
      <div className="bg-white border-4 border-gray-900 shadow-[8px_8px_0_0_rgba(17,24,39,1)] rounded-2xl overflow-hidden mb-8">
        {/* Card Header */}
        <div className="bg-[#fdd835] border-b-4 border-gray-900 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest">LIVE LOCATION</h2>
            <div className={`border-2 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm ${
              isLive
                ? 'bg-green-50 border-green-500 text-green-700'
                : 'bg-gray-100 border-gray-400 text-gray-700'
            }`}>
              <div className={`w-2.5 h-2.5 rounded-full border border-white ${
                isLive
                  ? 'bg-green-500 animate-pulse'
                  : 'bg-gray-400'
              }`}></div>
              {isLive ? 'Lokasi ditampilkan' : 'Lokasi tersembunyi'}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-900 text-sm">{isLive ? 'Aktif' : 'Nonaktif'}</span>
            <button 
              onClick={handleToggleLive}
              disabled={toggleLoading || locationLoading}
              className={`w-14 h-8 rounded-full border-4 border-gray-900 flex items-center p-0.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                isLive ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white border-2 border-gray-900 rounded-full transition-transform ${
                isLive ? 'translate-x-6' : 'translate-x-0'
              }`}></div>
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-center">
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-gray-700 font-medium text-lg leading-relaxed mb-8 max-w-lg">
              {isLive 
                ? 'Lokasi Anda sedang ditampilkan kepada pelanggan. Mereka dapat menemukan Anda di area sekitar.'
                : 'Aktifkan toggle untuk menampilkan lokasi Anda kepada pelanggan.'
              }
            </p>
            
            {/* GPS Coordinates Box */}
            {isLive ? (
              <div className="bg-gray-100 border-4 border-gray-900 rounded-xl p-5 flex items-start gap-4 shadow-[4px_4px_0_0_rgba(17,24,39,1)] max-w-md w-full relative">
                <div className="bg-[#0f2c7a] text-white p-2.5 rounded-full mt-1 shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                </div>
                <div className="overflow-hidden flex-1">
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-1.5">GPS COORDINATES</p>
                  {locationLoading ? (
                    <p className="text-lg text-gray-600 font-bold">Mengambil lokasi...</p>
                  ) : location && Array.isArray(location) && location.length === 2 ? (
                    <>
                      <p className="text-xl md:text-2xl font-black text-gray-900 font-mono tracking-tight truncate">
                        {parseFloat(location[0]).toFixed(4)}° N, {parseFloat(location[1]).toFixed(4)}° E
                      </p>
                      <p className="text-sm text-gray-600 mt-2 font-medium truncate">Lokasi terakhir diupdate</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xl md:text-2xl font-black text-gray-900 font-mono tracking-tight truncate">
                        Belum ada data
                      </p>
                      <p className="text-sm text-gray-600 mt-2 font-medium truncate">Lokasi akan ditampilkan setelah Anda aktifkan toggle</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 border-4 border-gray-300 rounded-xl p-5 flex items-start gap-4 shadow-[4px_4px_0_0_rgba(17,24,39,1)] max-w-md w-full opacity-50">
                <div className="bg-gray-400 text-white p-2.5 rounded-full mt-1 shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>location_off</span>
                </div>
                <div className="overflow-hidden flex-1">
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-1.5">GPS COORDINATES</p>
                  <p className="text-xl md:text-2xl font-black text-gray-900 font-mono tracking-tight truncate">
                    Lokasi tersembunyi
                  </p>
                  <p className="text-sm text-gray-600 mt-2 font-medium truncate">Aktifkan toggle untuk menampilkan</p>
                </div>
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-4 font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">history</span>
              {lastUpdated ? (
                <>
                  Last updated: {lastUpdated.toLocaleTimeString('id-ID')}
                </>
              ) : (
                <>Belum ada update</>
              )}
            </p>
          </div>
          
          {/* Map with Leaflet - Only show when isLive is true */}
          {isLive && (
            <div className="lg:w-1/2 w-full rounded-2xl border-4 border-gray-900 overflow-hidden relative min-h-[300px] shadow-[6px_6px_0_0_rgba(17,24,39,1)]">
              {locationError && (
                <div className="absolute top-4 left-4 right-4 bg-red-100 border-2 border-red-500 rounded-lg p-3 z-10">
                  <p className="text-red-700 text-sm font-bold">{locationError}</p>
                </div>
              )}
              
              <MapContainer 
                center={location || defaultCoordinates} 
                zoom={15} 
                style={{ height: '100%', width: '100%' }}
                className="rounded-lg"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* Show marker when location exists */}
                {location && Array.isArray(location) && location.length === 2 && (
                  <Marker position={[parseFloat(location[0]), parseFloat(location[1])]}
                  >
                    <Popup>
                      <div className="text-center">
                        <p className="font-bold text-gray-900">Lokasi Anda</p>
                        <p className="text-xs text-gray-600">{parseFloat(location[0]).toFixed(4)}° N, {parseFloat(location[1]).toFixed(4)}° E</p>
                        {lastUpdated && (
                          <p className="text-xs text-gray-500 mt-1">
                            {lastUpdated.toLocaleTimeString('id-ID')}
                          </p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          )}
        </div>
      </div>

      {/* Rekap Pill */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 bg-[#1d4ed8] border-2 border-gray-900 rounded-lg px-4 py-2 text-white font-bold shadow-[3px_3px_0_0_rgba(17,24,39,1)]">
          <span className="material-symbols-outlined text-lg">bar_chart</span>
          {salesData ? `Rekap ${new Date(salesData.tanggal_penjualan).toLocaleDateString('id-ID')} - ${new Date(salesData.updated_at).toLocaleTimeString('id-ID')}` : 'Belum ada data penjualan'}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { 
            label: 'TOTAL TERJUAL', 
            value: salesData ? salesData.jumlah_produk_terjual : '0', 
            unit: 'pcs' 
          },
          { 
            label: 'TOTAL PENDAPATAN', 
            value: salesData ? `Rp ${(salesData.total_pendapatan || 0).toLocaleString('id-ID')}` : 'Rp 0', 
            unit: '' 
          },
          { 
            label: 'SISA BAGUS', 
            value: salesData ? salesData.sisa_stok : '0', 
            unit: 'pcs' 
          },
          { 
            label: 'TOTAL BASI', 
            value: salesData ? salesData.jumlah_susu_basi : '0', 
            unit: 'pcs' 
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white border-4 border-gray-900 rounded-2xl p-6 shadow-[6px_6px_0_0_rgba(17,24,39,1)] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[8px_8px_0_0_rgba(17,24,39,1)] transition-all">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-3">{stat.label}</h3>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-black text-gray-900 tracking-tight">{stat.value}</span>
              {stat.unit && <span className="text-sm font-bold text-gray-500">{stat.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Products Section */}
      <div className="mb-10">
        <h3 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-widest">Status Produk</h3>
        {riderProducts.length === 0 ? (
          <div className="bg-white border-4 border-gray-900 rounded-2xl p-8 text-center text-gray-600 font-medium">
            Tidak ada data produk tersedia
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {riderProducts.map((product) => (
              <div key={product.id_menu} className="bg-white border-4 border-gray-900 rounded-2xl overflow-hidden shadow-[6px_6px_0_0_rgba(17,24,39,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0_0_rgba(17,24,39,1)] transition-all">
                {/* Product Image */}
                <div className="relative h-40 bg-gray-200 overflow-hidden border-b-4 border-gray-900">
                  {product.gambar_menu ? (
                    <img 
                      src={`/drive-download-20260512T105721Z-3-001/${product.gambar_menu}`}
                      alt={product.nama_menu}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160"%3E%3Crect fill="%23d1d5db" width="200" height="160"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="14" fill="%23666" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <span className="text-gray-500 text-sm">Tidak ada gambar</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h4 className="text-lg font-black text-gray-900 mb-2 truncate">{product.nama_menu}</h4>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.deskripsi || 'Tidak ada deskripsi'}</p>
                  
                  {/* Stock Info */}
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-1">Stok Bawa</p>
                      <p className="text-xl font-black text-gray-900">{product.stokBawa || 0}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-1">Sisa Stok</p>
                      <p className="text-xl font-black text-gray-900">{salesData ? (salesData.sisa_stok || 0) : product.stokBawa}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="bg-[#fdd835] border-2 border-gray-900 rounded-lg p-2 text-center">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Harga</p>
                    <p className="text-lg font-black text-gray-900">Rp {(product.harga || 0).toLocaleString('id-ID')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sync Button */}
      <div className="flex justify-end mb-10">
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 bg-[#fdd835] border-4 border-gray-900 px-8 py-3.5 rounded-xl font-bold text-lg shadow-[6px_6px_0_0_rgba(17,24,39,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0_0_rgba(17,24,39,1)] active:translate-y-0 active:shadow-[2px_2px_0_0_rgba(17,24,39,1)] transition-all"
        >
          <span className="material-symbols-outlined font-bold text-xl">sync</span>
          Sync Data Sekarang
        </button>
      </div>
    </div>
  );
}
