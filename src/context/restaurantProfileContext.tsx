import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DeleteAccountData, RestaurantProfile } from '../interfaces/profileInterface';
import { 
  getRestaurantProfile, 
  updateRestaurantProfile,
  updateRestaurantImage,
  deleteRestaurantAccount 
} from '../services/profileService';

interface RestaurantProfileContextType {
  profile: RestaurantProfile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: RestaurantProfile) => Promise<void>;
  updateImage: (file: File) => Promise<string>;
  deleteAccount: (data: DeleteAccountData) => Promise<void>;
}

const RestaurantProfileContext = createContext<RestaurantProfileContextType | undefined>(undefined);

export function RestaurantProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<RestaurantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const profileData = await getRestaurantProfile();
      setProfile(profileData);
      localStorage.setItem('restaurantProfile', JSON.stringify(profileData));
    } catch (err) {
      setError('Failed to fetch restaurant profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (data: RestaurantProfile) => {
    try {
      await updateRestaurantProfile(data);
      await fetchProfile();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleUpdateImage = async (file: File) => {
    try {
      const imageUrl = await updateRestaurantImage(file);
      await fetchProfile();
      return imageUrl;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleDeleteAccount = async (data: DeleteAccountData) => {
    try {
      await deleteRestaurantAccount(data);
      setProfile(null);
      localStorage.removeItem('restaurantProfile');
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    const savedProfile = localStorage.getItem('restaurantProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setLoading(false);
    }
    
    fetchProfile();
  }, []);

  return (
    <RestaurantProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        refreshProfile: fetchProfile,
        updateProfile: handleUpdateProfile,
        updateImage: handleUpdateImage,
        deleteAccount: handleDeleteAccount,
      }}
    >
      {children}
    </RestaurantProfileContext.Provider>
  );
}

export function useRestaurantProfile() {
  const context = useContext(RestaurantProfileContext);
  if (context === undefined) {
    throw new Error('useRestaurantProfile must be used within a RestaurantProfileProvider');
  }
  return context;
}