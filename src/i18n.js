import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "dashboard_title": "Dashboard Overview",
      "device_management_title": "IoT Device Management",
      "add_device": "Add New Device",
      "total_devices": "Total Devices",
      "active_sensors": "Active Sensors",
      "offline_devices": "Offline Devices",
      "status": "Status",
      "battery": "Battery",
      "last_ping": "Last Ping",
      "device_id": "Device ID",
      "type": "Type",
      "online": "Online",
      "offline": "Offline",
      "restart": "Restart",
      "diagnostics": "Diagnostics"
    }
  },
  hi: {
    translation: {
      "dashboard_title": "डैशबोर्ड अवलोकन",
      "device_management_title": "IoT डिवाइस प्रबंधन",
      "add_device": "नया उपकरण जोड़ें",
      "total_devices": "कुल उपकरण",
      "active_sensors": "सक्रिय सेंसर",
      "offline_devices": "ऑफ़लाइन उपकरण",
      "status": "स्थिति",
      "battery": "बैटरी",
      "last_ping": "अंतिम पिंग",
      "device_id": "डिवाइस आईडी",
      "type": "प्रकार",
      "online": "ऑनलाइन",
      "offline": "ऑफ़लाइन",
      "restart": "पुनरारंभ करें",
      "diagnostics": "निदान"
    }
  },
  ta: {
    translation: {
      "dashboard_title": "டாஷ்போர்டு கண்ணோட்டம்",
      "device_management_title": "சாதன மேலாண்மை",
      "add_device": "புதிய சாதனத்தைச் சேர்",
      "total_devices": "மொத்த சாதனங்கள்",
      "active_sensors": "செயலில் உள்ள சென்சார்கள்",
      "offline_devices": "ஆஃப்லைன் சாதனங்கள்",
      "status": "நிலை",
      "battery": "பேட்டரி",
      "last_ping": "கடைசி பிங்",
      "device_id": "சாதன ஐடி",
      "type": "வகை",
      "online": "ஆன்லைன்",
      "offline": "ஆஃப்லைன்",
      "restart": "மீண்டும் தொடங்கு",
      "diagnostics": "கண்டறிதல்"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
