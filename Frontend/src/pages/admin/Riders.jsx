import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import riderService from '../../services/riderService';

// Import refactored components
import RiderList from './RiderComponents/RiderList';
import RiderDetail from './RiderComponents/RiderDetail';
import AddRiderModal from './RiderComponents/AddRiderModal';
import EditRiderModal from './RiderComponents/EditRiderModal';
import AbsensiRiderModal from './RiderComponents/AbsensiRiderModal';
import StatusRiderModal from './RiderComponents/StatusRiderModal';

const getFotoUrl = (fotoPath) => {
  if (!fotoPath) return null;
  if (fotoPath.startsWith('http')) return fotoPath;
  const storageBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace('/api', '/storage');
  return `${storageBaseUrl}/${fotoPath}`;
};

export default function Riders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [riders, setRiders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Detail View State
  const [selectedRider, setSelectedRider] = useState(null);
  const [statusAkunRider, setStatusAkunRider] = useState(true);
  const [activityMonth, setActivityMonth] = useState('Juni');
  const [activityYear, setActivityYear] = useState('2026');

  // Activities state
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [activityPage, setActivityPage] = useState(1);
  const activitiesPerPage = 5;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAbsensiModalOpen, setIsAbsensiModalOpen] = useState(false);
  const [isConfirmStatusModalOpen, setIsConfirmStatusModalOpen] = useState(false);
  const [pendingStatusValue, setPendingStatusValue] = useState(true);

  const fetchRiders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await riderService.getAllRiders();
      if (response.success && response.data) {
        setRiders(response.data);
      } else {
        setError('Gagal mengambil data rider dari database.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Gagal mengambil data rider dari database.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (rider) => {
    try {
      setLoading(true);
      const response = await riderService.getRiderById(rider.id_rider);
      if (response.success && response.data) {
        const detailedRider = {
          ...rider,
          ...response.data,
          area: response.data.area || rider.area || 'Belum Ditentukan'
        };
        setSelectedRider(detailedRider);
        setStatusAkunRider(detailedRider.status_akun === 'Aktif');
      } else {
        setSelectedRider(rider);
        setStatusAkunRider(rider.status_akun === 'Aktif');
      }
    } catch (err) {
      console.error('Error fetching detail, fallback to list item:', err);
      setSelectedRider(rider);
      setStatusAkunRider(rider.status_akun === 'Aktif');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    if (!selectedRider) return;
    try {
      setLoadingActivities(true);
      const response = await riderService.getRiderActivity(selectedRider.id_rider, activityMonth, activityYear);
      if (response.success && response.data) {
        setActivities(response.data);
        setActivityPage(1);
      }
    } catch (err) {
      console.error('Gagal mengambil data aktivitas:', err);
    } finally {
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [selectedRider?.id_rider, activityMonth, activityYear]);

  useEffect(() => {
    fetchRiders();

    let urlChanged = false;
    const url = new URL(window.location);

    if (searchParams.get('openAbsensi') === 'true') {
      setIsAbsensiModalOpen(true);
      url.searchParams.delete('openAbsensi');
      urlChanged = true;
    }

    if (searchParams.get('openAddRider') === 'true') {
      setIsAddModalOpen(true);
      url.searchParams.delete('openAddRider');
      urlChanged = true;
    }

    if (urlChanged) {
      window.history.replaceState(null, '', url.pathname + url.search);
    }
  }, [searchParams]);

  const handleToggleStatusSwitch = () => {
    setPendingStatusValue(!statusAkunRider);
    setIsConfirmStatusModalOpen(true);
  };

  // Enrich database riders with visual states (status kehadiran, code, location)
  const enrichedRiders = riders.map((rider) => {
    let formattedPhone = rider.no_hp;
    if (formattedPhone && !formattedPhone.startsWith('+')) {
      formattedPhone = `+62 ${formattedPhone.replace(/^0/, '')}`;
    }

    return {
      ...rider,
      id_rider: rider.id_rider,
      nama_rider: rider.nama_rider,
      no_hp: formattedPhone,
      area: rider.area || 'Belum Ditentukan',
      status_akun: rider.status_akun || 'Aktif',
      status_kehadiran: rider.status_kehadiran || 'TIDAK ADA AKTIVITAS',
      code: `SOTR-${String(rider.id_rider).padStart(2, '0')}`
    };
  });

  const filteredRiders = enrichedRiders.filter((rider) =>
    rider.nama_rider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusDetails = (status) => {
    switch (status) {
      case 'HADIR': return { color: 'text-[#22C55E]', dot: 'bg-[#22C55E]' };
      case 'SAKIT': return { color: 'text-[#DC2626]', dot: 'bg-[#DC2626]' };
      case 'IZIN': return { color: 'text-[#FACC15]', dot: 'bg-[#FACC15]' };
      default: return { color: 'text-gray-400', dot: 'bg-gray-400' };
    }
  };

  // Activity pagination calculations
  const totalActivityPages = Math.ceil(activities.length / activitiesPerPage) || 1;
  const currentActivities = activities.slice((activityPage - 1) * activitiesPerPage, activityPage * activitiesPerPage);
  const startRow = activities.length > 0 ? (activityPage - 1) * activitiesPerPage + 1 : 0;
  const endRow = Math.min(activityPage * activitiesPerPage, activities.length);

  return (
    <div className="w-full space-y-8 pb-10">
      {selectedRider ? (
        <RiderDetail
          selectedRider={selectedRider}
          setSelectedRider={setSelectedRider}
          statusAkunRider={statusAkunRider}
          handleOpenEditModal={() => setIsEditModalOpen(true)}
          handleToggleStatusSwitch={handleToggleStatusSwitch}
          getFotoUrl={getFotoUrl}
          activityMonth={activityMonth}
          setActivityMonth={setActivityMonth}
          activityYear={activityYear}
          setActivityYear={setActivityYear}
          activities={activities}
          loadingActivities={loadingActivities}
          activityPage={activityPage}
          setActivityPage={setActivityPage}
          startRow={startRow}
          endRow={endRow}
          totalActivityPages={totalActivityPages}
          currentActivities={currentActivities}
        />
      ) : (
        <RiderList
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          loading={loading}
          filteredRiders={filteredRiders}
          getStatusDetails={getStatusDetails}
          getFotoUrl={getFotoUrl}
          handleViewDetail={handleViewDetail}
          handleOpenAbsensiModal={() => setIsAbsensiModalOpen(true)}
          setIsAddModalOpen={setIsAddModalOpen}
        />
      )}

      <AddRiderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchRiders}
      />

      <EditRiderModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        selectedRider={selectedRider}
        getFotoUrl={getFotoUrl}
        onSuccess={() => {
          setIsEditModalOpen(false);
          handleViewDetail(selectedRider); // Refresh detail view
          fetchRiders(); // Refresh list
        }}
      />

      <AbsensiRiderModal
        isOpen={isAbsensiModalOpen}
        onClose={() => setIsAbsensiModalOpen(false)}
        enrichedRiders={enrichedRiders}
      />

      <StatusRiderModal
        isOpen={isConfirmStatusModalOpen}
        onClose={() => setIsConfirmStatusModalOpen(false)}
        selectedRider={selectedRider}
        pendingStatusValue={pendingStatusValue}
        onSuccess={(newStatus, updatedData) => {
          setStatusAkunRider(newStatus);
          const updatedRider = updatedData ? {
            ...selectedRider,
            ...updatedData,
            status_akun: newStatus ? 'Aktif' : 'Nonaktif',
          } : {
            ...selectedRider,
            status_akun: newStatus ? 'Aktif' : 'Nonaktif',
            status_live_location: 'Nonaktif',
            current_location: null,
            latitude: null,
            longitude: null,
          };
          setSelectedRider(updatedRider);
          setRiders(prevRiders => prevRiders.map(r => r.id_rider === selectedRider.id_rider ? updatedRider : r));
          setIsConfirmStatusModalOpen(false);
        }}
      />
    </div>
  );
}
