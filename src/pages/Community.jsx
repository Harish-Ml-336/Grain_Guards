import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Phone, MessageCircle, Send, Users, MapPin, Sprout, PhoneOff, PhoneCall, Mic, MicOff, Volume2 } from 'lucide-react';
import './Community.css';

const farmers = [
  { id: 99, name: 'Grain Guard AI', location: 'Digital Cloud', specialty: 'ML Crop Storage Specialist', phone: 'Direct Chat', avatar: 'AI' },
  { id: 1, name: 'Ravi Kumar', location: 'Thanjavur, TN', specialty: 'Rice & Wheat', phone: '+91 98765 43210', avatar: 'RK', greeting: 'Vanakkam! This is Ravi Kumar from Thanjavur. I specialize in rice and wheat cultivation. How can I help you today?' },
  { id: 2, name: 'Anitha Sundaram', location: 'Madurai, TN', specialty: 'Millets & Pulses', phone: '+91 87654 32109', avatar: 'AS', greeting: 'Hello! Anitha here from Madurai. I grow millets and pulses. What would you like to discuss?' },
  { id: 3, name: 'Balaji Naidu', location: 'Tirunelveli, TN', specialty: 'Organic Farming', phone: '+91 76543 21098', avatar: 'BN', greeting: 'Namaste! Balaji Naidu speaking. I practice organic farming methods. Feel free to ask me anything!' },
  { id: 4, name: 'Lakshmi Devi', location: 'Coimbatore, TN', specialty: 'Seed Supplier', phone: '+91 65432 10987', avatar: 'LD', greeting: 'Hello! This is Lakshmi Devi, your trusted seed supplier from Coimbatore. Looking for quality seeds?' },
  { id: 5, name: 'Murugan P', location: 'Salem, TN', specialty: 'Grain Storage Expert', phone: '+91 54321 09876', avatar: 'MP', greeting: 'Vanakkam! Murugan here from Salem. I am a grain storage expert. How may I assist you with storage solutions?' },
  { id: 6, name: 'Kavitha R', location: 'Trichy, TN', specialty: 'Fertilizer Dealer', phone: '+91 43210 98765', avatar: 'KR', greeting: 'Hello! Kavitha from Trichy. I deal in all types of fertilizers. What do you need for your crops?' }
];

const AI_NAME = 'Grain Guard AI';

const getAIResponse = (query) => {
  const q = query.toLowerCase().trim();
  
  // Greetings
  if (/^(hi|hello|hey|yo|greetings|good morning|good evening|good afternoon|namaste|vanakkam)$/i.test(q)) {
    return `🤖 Welcome! I'm ${AI_NAME}, your smart agricultural assistant.\n\nHere's what I can help with:\n• 🏗️ Bin health reports (try: "Bin 2 status")\n• 🪲 Pest control & treatment\n• 💧 Moisture & humidity management\n• 🌡️ Temperature monitoring\n• 🌾 Crop storage best practices\n• 💰 Market prices & trading\n• 📜 Government schemes & subsidies\n• 🌱 Fertilizer recommendations\n• ⚡ IoT sensor & automation info\n• 🧑‍🌾 Farming tips & techniques\n\nJust type your question!`;
  }

  // Thank you
  if (q.includes('thank') || q.includes('thanks') || q.includes('thx')) {
    return `😊 You're welcome! Feel free to ask me anything else about your crops, bins, or farming needs.`;
  }

  // Who are you / what can you do
  if (q.includes('who are you') || q.includes('what can you do') || q.includes('what do you do') || q.includes('your name')) {
    return `🤖 I am ${AI_NAME}, an ML-powered agricultural advisor built into the Grain Guards platform. I can answer questions about:\n• Storage bin health & sensor readings\n• Pest detection & treatment protocols\n• Moisture, humidity & temperature thresholds\n• Crop pricing & marketplace guidance\n• Government subsidies & schemes\n• Fertilizer & seed recommendations\n• IoT automation & device management\n• General farming best practices`;
  }

  // ── Bin-specific queries ──
  if (q.includes('bin 1') || (q.includes('rice') && (q.includes('bin') || q.includes('status') || q.includes('health')))) {
    return `🌾 Bin 1 (Rice, Block A) — NORMAL ✅\n• Health Score: 92%\n• Temperature: 28°C (Safe)\n• Humidity: 58% (Safe)\n• Moisture: 12% (Safe limit for rice)\n• Pests: None detected\n• Fan: OFF | UV Light: OFF\n\nNo action required. Conditions are optimal.`;
  }
  if (q.includes('bin 2') || (q.includes('wheat') && (q.includes('bin') || q.includes('status') || q.includes('health')))) {
    return `⚠️ Bin 2 (Wheat, Block A) — CRITICAL ❌\n• Health Score: 43%\n• Temperature: 36°C (HIGH — exceeds 30°C safe limit)\n• Humidity: 72% (CRITICAL — exceeds 65% threshold)\n• Moisture: 15.2% (DANGER — wheat limit is 13%)\n• Pests: DETECTED 🪲\n• Qty: 3,500 kg\n\n🚨 Immediate actions:\n1. Go to Bin Monitoring → Bin 2 → Details\n2. Turn ON the Ventilation Fan toggle\n3. Activate UV Light for pest fumigation\n4. Schedule physical inspection within 24 hours`;
  }
  if (q.includes('bin 3') || (q.includes('ragi') && (q.includes('bin') || q.includes('status') || q.includes('health')))) {
    return `🟡 Bin 3 (Ragi, Block B) — WARNING ⚠️\n• Health Score: 78%\n• Temperature: 30°C (Borderline)\n• Humidity: 64% (Rising)\n• Moisture: 13% (Approaching limit)\n\n⚡ Recommendation: Turn on ventilation fan to reduce moisture before it crosses the 14% danger zone.`;
  }
  if (q.includes('bin 4') || (q.includes('maize') && (q.includes('bin') || q.includes('status') || q.includes('health')))) {
    return `🌾 Bin 4 (Maize, Block B) — NORMAL ✅\n• Health Score: 85%\n• Temperature: 31°C\n• Humidity: 61%\n• Moisture: 13.5% (Within safe range)\n\nAll systems optimal. No action needed.`;
  }
  if (q.includes('bin 5') || (q.includes('millet') && (q.includes('bin') || q.includes('status') || q.includes('health')))) {
    return `🟡 Bin 5 (Millets, Block C) — WARNING ⚠️\n• Health Score: 65%\n• Temperature: 33°C (Warm spot detected)\n• Humidity: 68% (Above safe limit)\n• Moisture: 14.8%\n\n🔧 Action: Activate cooling fan via toggle switches in Bin Details. Monitor hourly until temperature drops below 30°C.`;
  }
  if (q.includes('bin 6') || (q.includes('pulse') && (q.includes('bin') || q.includes('status') || q.includes('health')))) {
    return `🌾 Bin 6 (Pulses, Block C) — NORMAL ✅\n• Health Score: 95%\n• Temperature: 29°C\n• Humidity: 55%\n• Moisture: 11%\n\nExcellent storage conditions. All systems safe.`;
  }
  if (q.includes('all bin') || q.includes('overall') || q.includes('summary') || q.includes('dashboard')) {
    return `📊 Overall Bin Summary:\n• Bin 1 (Rice): ✅ Normal — 92%\n• Bin 2 (Wheat): ❌ Critical — 43% ⚠️\n• Bin 3 (Ragi): 🟡 Warning — 78%\n• Bin 4 (Maize): ✅ Normal — 85%\n• Bin 5 (Millets): 🟡 Warning — 65%\n• Bin 6 (Pulses): ✅ Normal — 95%\n\n🚨 Priority: Bin 2 needs immediate attention (pest + high humidity). Check the Dashboard for live graphs.`;
  }

  // ── Pest & Insects ──
  if (q.includes('pest') || q.includes('insect') || q.includes('bug') || q.includes('weevil') || q.includes('rat') || q.includes('rodent') || q.includes('termite') || q.includes('fumigat')) {
    return `🪲 Pest Management Protocol:\n\n1. Detection: IoT sensors detect movement patterns indicating pest activity\n2. Immediate Response:\n   • Seal the affected bin\n   • Activate UV Light toggle in Bin Details\n   • Lower temperature below 30°C (pests breed faster in heat)\n3. Chemical Treatment:\n   • Aluminium Phosphide fumigation for severe infestations\n   • Neem-based organic pesticides for mild cases\n4. Prevention:\n   • Keep moisture below 12%\n   • Clean bins before each storage cycle\n   • Use hermetic (airtight) storage bags\n\n⚠️ Currently Bin 2 has active pest detection. Check Bin Monitoring.`;
  }

  // ── Moisture & Humidity ──
  if (q.includes('moisture') || q.includes('humidity') || q.includes('mold') || q.includes('wet') || q.includes('fungus') || q.includes('damp') || q.includes('dry')) {
    return `💧 Moisture & Humidity Guidelines:\n\nSafe moisture levels by crop:\n• Rice: < 12%\n• Wheat: < 13%\n• Ragi: < 12%\n• Maize: < 13.5%\n• Millets: < 12.5%\n• Pulses: < 10%\n\nSafe humidity: Below 65% relative humidity\n\n🔧 If levels are high:\n1. Turn ON ventilation fans (Bin Details → Toggle)\n2. Use silica gel desiccants for small quantities\n3. Sun-dry grains before re-storing\n4. Ensure proper aeration channels in the bin\n\n⚠️ Bins 3 and 5 currently have rising moisture levels.`;
  }

  // ── Temperature ──
  if (q.includes('temp') || q.includes('heat') || q.includes('hot') || q.includes('warm') || q.includes('cool') || q.includes('cold') || q.includes('fire')) {
    return `🌡️ Temperature Management:\n\n• Safe range: 20°C – 30°C\n• Warning zone: 30°C – 35°C (start cooling)\n• Critical zone: Above 35°C (auto-fan activates)\n\nCurrent readings:\n• Bin 1: 28°C ✅ | Bin 2: 36°C ❌\n• Bin 3: 30°C 🟡 | Bin 4: 31°C ✅\n• Bin 5: 33°C 🟡 | Bin 6: 29°C ✅\n\n🔧 Action: For high-temp bins, activate ventilation fans via the toggle controls. The ESP32 automation will auto-trigger fans above 35°C.`;
  }

  // ── Government Schemes ──
  if (q.includes('subsidy') || q.includes('scheme') || q.includes('govt') || q.includes('government') || q.includes('pm-kisan') || q.includes('kisan') || q.includes('loan') || q.includes('insurance') || q.includes('pmfby')) {
    return `📜 Active Government Schemes:\n\n1. PM-KISAN: ₹6,000/year direct benefit (3 installments of ₹2,000)\n2. PMFBY (Crop Insurance): Premium as low as 2% for Kharif, 1.5% for Rabi\n3. Warehousing Subsidy: Up to 50% discount on storage rental\n4. Fertilizer DBT: Urea at fixed MRP ₹242/45kg bag\n5. KCC (Kisan Credit Card): Crop loans at 4% interest\n6. Soil Health Card: Free soil testing from nearest agriculture office\n\n📍 Check the 'Govt. Schemes' page in the sidebar for detailed eligibility and application links.`;
  }

  // ── Fertilizer ──
  if (q.includes('fertilizer') || q.includes('npk') || q.includes('urea') || q.includes('dap') || q.includes('potash') || q.includes('manure') || q.includes('compost')) {
    return `🌱 Fertilizer Guide:\n\n📋 By crop stage:\n• Basal (before sowing): DAP (18:46:0) — 50kg/acre\n• Vegetative growth: Urea (46% N) — 25kg/acre in splits\n• Flowering/Fruiting: MOP/Potash (0:0:60) — 25kg/acre\n\n💰 Subsidized prices:\n• Urea: ₹242/45kg bag (govt. subsidized)\n• DAP: ₹1,350/50kg bag\n• NPK (20:20:20): ₹1,200/50kg bag\n\n🌿 Organic alternatives:\n• Vermicompost: 2-3 tonnes/acre\n• Neem cake: Pest repellent + nitrogen source\n\nBuy from the 'Fertilizers & Subsidies' marketplace tab.`;
  }

  // ── Market Prices ──
  if (q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('market') || q.includes('sell') || q.includes('buy') || q.includes('buyer') || q.includes('trade') || q.includes('mandi') || q.includes('msp')) {
    return `📈 Current Market Prices (Mandi rates):\n\n• Basmati Rice: ₹42–₹48/kg\n• Sona Masoori Rice: ₹35–₹40/kg\n• Sharbati Wheat: ₹28–₹35/kg\n• Maize: ₹18–₹22/kg\n• Ragi: ₹30–₹38/kg\n• Toor Dal: ₹90–₹110/kg\n• Moong Dal: ₹85–₹100/kg\n\n📌 MSP (Minimum Support Price) 2026-27:\n• Paddy: ₹2,300/quintal\n• Wheat: ₹2,275/quintal\n\nList your produce on the 'Grain Marketplace' to connect with buyers directly.`;
  }

  // ── Seeds ──
  if (q.includes('seed') || q.includes('sowing') || q.includes('planting') || q.includes('germination') || q.includes('variety')) {
    return `🌱 Seed Selection Guide:\n\n• Rice: IR-64 (high yield), Pusa Basmati 1121 (premium)\n• Wheat: HD-2967, Sharbati (MP region)\n• Millets: CO-4 Cumbu, GPU-28 Ragi\n• Maize: DHM-117 (hybrid), HQPM-1 (quality protein)\n\n📋 Before sowing:\n1. Check germination rate (>85% recommended)\n2. Treat seeds with Thiram/Carbendazim fungicide\n3. Use certified seeds from authorized dealers\n\nBrowse the 'Seed Marketplace' for verified suppliers with ratings.`;
  }

  // ── IoT / Sensors / Automation ──
  if (q.includes('iot') || q.includes('sensor') || q.includes('automation') || q.includes('esp32') || q.includes('device') || q.includes('monitor')) {
    return `⚡ IoT & Automation System:\n\n🔌 Hardware: ESP32 microcontroller per bin\n📡 Sensors:\n• DHT22 — Temperature & Humidity\n• Capacitive Soil Sensor — Grain Moisture\n• PIR Motion Sensor — Pest Detection\n\n🤖 Auto-actions:\n• Fan ON when temp > 35°C\n• UV Light ON when pest motion detected\n• Alert pushed when humidity > 65%\n\n🎛️ Manual Controls:\n• Toggle fan, UV light, and heater from 'Bin Details' page\n• View live graphs in 'Statistics'\n• Manage all devices in 'Device Management'`;
  }

  // ── Yield / Farming Tips ──
  if (q.includes('yield') || q.includes('organic') || q.includes('soil') || q.includes('vermicompost') || q.includes('crop rotation') || q.includes('harvest') || q.includes('farming tip')) {
    return `🧑‍🌾 Farming Best Practices:\n\n1. Soil Health: Test pH (ideal 6.0-7.0), add lime if acidic\n2. Crop Rotation: Alternate cereals with legumes to restore nitrogen\n3. Organic Boost: Apply 2-3 tonnes/acre vermicompost\n4. Water Management: Drip irrigation saves 40-60% water\n5. Harvest Timing: Harvest at correct moisture (rice at 20-22%, then sun-dry to 12%)\n6. Post-Harvest: Clean and fumigate bins before storing new harvest\n\n🌾 Use the Grain Guards dashboard to track storage health after harvest.`;
  }

  // ── Weather ──
  if (q.includes('weather') || q.includes('rain') || q.includes('monsoon') || q.includes('forecast') || q.includes('climate') || q.includes('season')) {
    return `🌦️ Weather & Seasonal Advisory:\n\n• Kharif Season (Jun-Oct): Rice, maize, millets — watch for excess rain moisture\n• Rabi Season (Nov-Mar): Wheat, pulses — watch for frost damage\n• Summer (Apr-Jun): Ideal for sun-drying and bin maintenance\n\n📌 Tips:\n• Cover bins during monsoon to prevent water seepage\n• Increase ventilation frequency during humid months\n• Check sensor readings more often during season changes`;
  }

  // ── Storage / Warehouse ──
  if (q.includes('storage') || q.includes('warehouse') || q.includes('store') || q.includes('preserve') || q.includes('shelf life') || q.includes('spoil') || q.includes('loss')) {
    return `🏭 Grain Storage Best Practices:\n\n• Clean & fumigate bins before loading new stock\n• Maintain moisture below safe limits per crop type\n• Use hermetic bags for small quantities (airtight = no pests)\n• Stack bags on pallets, 15cm away from walls\n• Inspect every 2 weeks for signs of heating or insects\n\n📊 Shelf life (properly stored):\n• Rice: 2-3 years | Wheat: 1-2 years\n• Pulses: 1-2 years | Millets: 2+ years\n\nCheck the 'Warehouse' page for capacity tracking.`;
  }

  // ── Water / Irrigation ──
  if (q.includes('water') || q.includes('irrigat') || q.includes('drip') || q.includes('sprinkler') || q.includes('borewell')) {
    return `💧 Irrigation Advisory:\n\n• Rice (paddy): Flood irrigation during transplanting, then alternate wetting-drying\n• Wheat: 4-5 irrigations at critical stages (crown root, tillering, flowering)\n• Millets: Minimal water — rain-fed or 2-3 light irrigations\n\n💡 Water-saving methods:\n• Drip irrigation: 40-60% water savings\n• Sprinkler: Good for wheat, pulses\n• Mulching: Reduces evaporation by 25%`;
  }

  // ── Disease ──
  if (q.includes('disease') || q.includes('blight') || q.includes('rust') || q.includes('wilt') || q.includes('rot') || q.includes('yellow')) {
    return `🦠 Common Crop Diseases:\n\n• Rice Blast: Brown spots on leaves → Spray Tricyclazole\n• Wheat Rust: Orange pustules → Use resistant varieties + Propiconazole spray\n• Ragi Blast: Similar to rice blast → Carbendazim treatment\n• Pulse Wilt: Wilting plants → Treat seeds with Trichoderma before sowing\n\n🔬 Prevention:\n1. Use disease-resistant certified seeds\n2. Avoid waterlogging\n3. Rotate crops every season\n4. Apply bio-fungicides preventively`;
  }

  // ── Help / General ──
  if (q.includes('help') || q.includes('what can') || q.includes('how to use') || q.includes('guide')) {
    return `🤖 ${AI_NAME} — Quick Guide:\n\nTry asking me:\n• "What is the status of Bin 2?"\n• "How to control pests in my storage?"\n• "What is the safe moisture for wheat?"\n• "Current rice market price?"\n• "Tell me about PM-KISAN scheme"\n• "How to improve crop yield?"\n• "What fertilizer for rice?"\n• "Show all bin summary"\n• "How does the IoT sensor work?"\n• "Best storage practices"\n\nI understand natural language — just type freely!`;
  }

  // ── Smart fallback: extract keywords and give best-effort answer ──
  const words = q.split(/\s+/);
  const cropWords = ['rice', 'wheat', 'ragi', 'maize', 'millet', 'pulse', 'dal', 'paddy', 'corn', 'bajra', 'jowar', 'barley'];
  const foundCrop = words.find(w => cropWords.includes(w));
  
  if (foundCrop) {
    return `🌾 About ${foundCrop.charAt(0).toUpperCase() + foundCrop.slice(1)}:\n\n• Check current storage status: Go to Bin Monitoring\n• Market price: Visit Grain Marketplace\n• Seeds: Browse Seed Marketplace for certified ${foundCrop} varieties\n• Fertilizer: NPK + Urea recommended for cereals; DAP for pulses\n\nFor specific queries, try: "${foundCrop} bin status", "${foundCrop} market price", or "${foundCrop} moisture limit"`;
  }

  // Final intelligent fallback
  return `🤖 I understand you're asking about: "${query}"\n\nHere are some suggestions to get detailed answers:\n• For bin health: "Bin 1 status" or "all bin summary"\n• For crop care: "pest control" or "moisture limit"\n• For buying/selling: "market price" or "seed marketplace"\n• For govt help: "subsidy" or "PM-KISAN"\n• For tech: "IoT sensor" or "automation"\n\nTry rephrasing your question with specific keywords and I'll give you precise guidance!`;
};

const seedMessages = [
  { id: 1, sender: 'Ravi Kumar', avatar: 'RK', text: 'Has anyone tried the new organic fertilizer from GreenGold? How is the yield?', time: '10:15 AM' },
  { id: 2, sender: 'Anitha Sundaram', avatar: 'AS', text: 'Yes! I used it last season on my millets. 15% better yield compared to chemical fertilizers.', time: '10:22 AM' },
  { id: 3, sender: 'Balaji Naidu', avatar: 'BN', text: 'The government subsidy on DAP has been extended till March 2027. Make sure to buy through authorized dealers.', time: '10:35 AM' },
  { id: 4, sender: 'Lakshmi Devi', avatar: 'LD', text: 'I have premium quality CO-4 seeds available. Contact me for bulk orders.', time: '11:00 AM' },
];

const avatarColors = [
  '#00E5FF', '#FF2A55', '#FFB300', '#10B981',
  '#8B5CF6', '#F97316',
];

function getAvatarColor(id) {
  return avatarColors[(id - 1) % avatarColors.length];
}

export default function Community() {
  const [messages, setMessages] = useState(seedMessages);
  const [chatMode, setChatMode] = useState('group'); // 'group' or 'ai'
  const [aiMessages, setAiMessages] = useState([
    { id: 1, sender: 'Grain Guard AI', avatar: 'AI', text: '🤖 Hello! I am Grain Guard AI, your private agricultural advisor. Ask me anything about storage health, moisture limits, pest control, marketplace prices, or government subsidies.', time: '10:00 AM', isAI: true }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  const chatSectionRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, aiMessages, chatMode]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const lower = text.toLowerCase();

    if (chatMode === 'ai') {
      // 1. Private AI Mode - Always Respond
      setAiMessages(prev => [
        ...prev,
        { id: Date.now(), sender: 'You', avatar: 'YO', text, time }
      ]);
      setInput('');

      setTimeout(() => {
        const botResponse = getAIResponse(lower);
        const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setAiMessages(prev => [
          ...prev,
          { 
            id: Date.now() + 1, 
            sender: 'Grain Guard AI', 
            avatar: 'AI', 
            text: botResponse, 
            time: botTime,
            isAI: true
          }
        ]);
      }, 800);
    } else {
      // 2. Group Chat Mode
      setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: 'You', avatar: 'YO', text, time },
      ]);
      setInput('');

      // ML Bot Auto-response Trigger
      const requiresAI = lower.includes('?') || 
                         lower.includes('hi') ||
                         lower.includes('hello') ||
                         lower.includes('hey') ||
                         lower.includes('pest') || 
                         lower.includes('moisture') || 
                         lower.includes('fertilizer') || 
                         lower.includes('scheme') ||
                         lower.includes('price') ||
                         lower.includes('ai');

      if (requiresAI) {
        setTimeout(() => {
          const botResponse = getAIResponse(lower);
          const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setMessages(prev => [
            ...prev,
            { 
              id: Date.now() + 1, 
              sender: 'Grain Guard AI', 
              avatar: 'AI', 
              text: botResponse, 
              time: botTime,
              isAI: true
            }
          ]);
        }, 1000);
      }
    }
  };

  const handleChatWithAI = () => {
    setChatMode('ai');
    setInput('How can I protect my stored grains from high moisture and pests?');
    scrollToChat();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const [callingFarmer, setCallingFarmer] = useState(null);
  const [callPhase, setCallPhase] = useState('idle'); // idle | ringing | connected | ended
  const [callTimer, setCallTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const callTimerRef = useRef(null);
  const ringAudioRef = useRef(null);

  // Generate ringtone using Web Audio API
  const playRingtone = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      ringAudioRef.current = ctx;
      const playBeep = (time, freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.value = 0.15;
        osc.start(time);
        osc.stop(time + 0.3);
      };
      for (let i = 0; i < 6; i++) {
        playBeep(i * 1.2, 440);
        playBeep(i * 1.2 + 0.35, 520);
      }
    } catch (e) { /* audio not supported */ }
  }, []);

  const stopRingtone = useCallback(() => {
    if (ringAudioRef.current) {
      try { ringAudioRef.current.close(); } catch(e) {}
      ringAudioRef.current = null;
    }
  }, []);

  const speakGreeting = useCallback((farmer) => {
    if ('speechSynthesis' in window && farmer.greeting) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(farmer.greeting);
      utterance.rate = 0.95;
      utterance.pitch = farmer.id % 2 === 0 ? 1.1 : 0.9;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleCall = useCallback((farmer) => {
    setCallingFarmer(farmer);
    setCallPhase('ringing');
    setCallTimer(0);
    playRingtone();

    // After 3 seconds, connect the call
    setTimeout(() => {
      stopRingtone();
      setCallPhase('connected');
      speakGreeting(farmer);
      // Start call timer
      callTimerRef.current = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    }, 3000);
  }, [playRingtone, stopRingtone, speakGreeting]);

  const handleEndCall = useCallback(() => {
    stopRingtone();
    window.speechSynthesis?.cancel();
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    setCallPhase('ended');
    setTimeout(() => {
      setCallingFarmer(null);
      setCallPhase('idle');
      setCallTimer(0);
    }, 1500);
  }, [stopRingtone]);

  const formatCallTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleChatWithFarmer = (farmer) => {
    setChatMode('group');
    setInput(`@${farmer.name} `);
    scrollToChat();
  };

  const scrollToChat = () => {
    chatSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="community-page">
      {/* Page Header */}
      <div className="community-header">
        <div className="community-header-left">
          <Users size={28} />
          <div>
            <h1>Community Hub</h1>
            <p>Connect with fellow farmers, share knowledge &amp; trade</p>
          </div>
        </div>
        <div className="community-header-stats">
          <div className="comm-stat">
            <span className="comm-stat-value">{farmers.length}</span>
            <span className="comm-stat-label">Farmers</span>
          </div>
          <div className="comm-stat">
            <span className="comm-stat-value">{messages.length}</span>
            <span className="comm-stat-label">Messages</span>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="community-grid">
        {/* LEFT: Farmer Directory */}
        <div className="community-directory">
          <div className="section-title-bar">
            <Users size={18} />
            <span>Farmer Directory</span>
          </div>
          <div className="farmer-list">
            {farmers.map((farmer) => (
              <div className="farmer-card" key={farmer.id}>
                <div
                  className="farmer-avatar"
                  style={{ background: getAvatarColor(farmer.id) }}
                >
                  {farmer.avatar}
                </div>
                <div className="farmer-info">
                  <h3 className="farmer-name">{farmer.name}</h3>
                  <p className="farmer-location">
                    <MapPin size={13} />
                    {farmer.location}
                  </p>
                  <p className="farmer-specialty">
                    <Sprout size={13} />
                    {farmer.specialty}
                  </p>
                  <p className="farmer-phone">
                    <Phone size={13} />
                    <a href={`tel:${farmer.phone.replace(/\s/g, '')}`}>{farmer.phone}</a>
                  </p>
                </div>
                <div className="farmer-actions">
                  {farmer.id !== 99 ? (
                    <button
                      className="farmer-btn farmer-btn-call"
                      onClick={() => handleCall(farmer)}
                      title={`Call ${farmer.name}`}
                    >
                      <Phone size={16} />
                      Call
                    </button>
                  ) : (
                    <div style={{ width: '74px' }} />
                  )}
                  <button
                    className="farmer-btn farmer-btn-chat"
                    onClick={farmer.id === 99 ? handleChatWithAI : () => handleChatWithFarmer(farmer)}
                    title="Chat"
                  >
                    <MessageCircle size={16} />
                    Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Chat Feed Panel */}
        <div className="community-chat" ref={chatSectionRef}>
          {/* Private/Group Mode Selector */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '14px' }}>
            <button
              onClick={() => setChatMode('group')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: chatMode === 'group' ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255,255,255,0.02)',
                color: chatMode === 'group' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              👥 Group Chat
            </button>
            <button
              onClick={() => setChatMode('ai')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: chatMode === 'ai' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                color: chatMode === 'ai' ? '#A78BFA' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              🤖 Ask AI Advisor (Private)
            </button>
          </div>

          <div className="chat-messages">
            {(chatMode === 'group' ? messages : aiMessages).map((msg) => {
              const isYou = msg.sender === 'You';
              const isAI = msg.isAI || msg.avatar === 'AI';
              const farmerId = farmers.find(f => f.avatar === msg.avatar)?.id || 0;
              return (
                <div
                  className={`chat-bubble ${isYou ? 'chat-bubble-self' : ''} ${isAI ? 'chat-bubble-ai' : ''}`}
                  key={msg.id}
                >
                  {!isYou && (
                    <div
                      className="chat-avatar"
                      style={{ background: isAI ? 'var(--primary)' : getAvatarColor(farmerId) }}
                    >
                      {msg.avatar}
                    </div>
                  )}
                  <div className="chat-body">
                    <div className="chat-meta">
                      <span className="chat-sender">{msg.sender}</span>
                      <span className="chat-time">{msg.time}</span>
                    </div>
                    <p className="chat-text">{msg.text}</p>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
          <div className="chat-input-bar">
            <input
              type="text"
              className="chat-input"
              placeholder="Type a message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="chat-send-btn"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
      {/* ── Voice Call Modal ── */}
      {callingFarmer && (
        <div className="call-overlay">
          <div className="call-modal">
            {/* Ripple rings behind avatar */}
            {callPhase === 'ringing' && (
              <>
                <div className="call-ripple call-ripple-1" />
                <div className="call-ripple call-ripple-2" />
                <div className="call-ripple call-ripple-3" />
              </>
            )}
            {callPhase === 'connected' && (
              <div className="call-sound-wave">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="sound-bar" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            )}

            <div
              className={`call-avatar ${callPhase === 'ringing' ? 'call-avatar-ringing' : ''} ${callPhase === 'connected' ? 'call-avatar-connected' : ''}`}
              style={{ background: getAvatarColor(callingFarmer.id) }}
            >
              {callingFarmer.avatar}
            </div>

            <h2 className="call-name">{callingFarmer.name}</h2>
            <p className="call-specialty">{callingFarmer.specialty}</p>

            {callPhase === 'ringing' && (
              <p className="call-status call-status-ringing">📞 Calling...</p>
            )}
            {callPhase === 'connected' && (
              <div className="call-connected-info">
                <p className="call-status call-status-connected">
                  <Volume2 size={16} /> Connected
                </p>
                <span className="call-timer">{formatCallTime(callTimer)}</span>
              </div>
            )}
            {callPhase === 'ended' && (
              <p className="call-status call-status-ended">Call Ended</p>
            )}

            <div className="call-controls">
              {callPhase === 'connected' && (
                <button
                  className={`call-ctrl-btn ${isMuted ? 'call-ctrl-active' : ''}`}
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                  <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                </button>
              )}
              <button className="call-end-btn" onClick={handleEndCall}>
                <PhoneOff size={22} />
                <span>End Call</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
