import { useState, useEffect, useCallback } from "react";
import { getSettings } from "../api/settingsApi";

export function useSettings() {
  const [settings, setSettings] = useState({
    default_room_price: 0,
    default_electric_price: 0,
    default_water_price: 0,
    default_service_fee: 0,
    bank_name: "",
    bank_account: "",
    bank_owner: "",
    qr_image_url: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await getSettings();
      if (!data) return;

      setSettings((prev) => ({
        ...prev,
        default_room_price: data.default_room_price ?? prev.default_room_price,
        default_electric_price: data.default_electric_price ?? prev.default_electric_price,
        default_water_price: data.default_water_price ?? prev.default_water_price,
        default_service_fee: data.default_service_fee ?? prev.default_service_fee,
        bank_name: data.bank_name ?? prev.bank_name,
        bank_account: data.bank_account ?? prev.bank_account,
        bank_owner: data.bank_owner ?? prev.bank_owner,
        qr_image_url: data.qr_image_url ?? prev.qr_image_url,
      }));
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, loading, refreshSettings: fetchSettings };
}
