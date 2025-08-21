import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, List, FileText, MapPin, ArrowLeft, ArrowRight, ExternalLink, Sun, X, Info } from "lucide-react";

/**
 * SEOUL TRIP APP – updated3
 * - Remove "(details)" suffix; clickable items are underlined only.
 * - Reset button default styles (p-0 m-0 bg-transparent border-0 appearance-none text-left) to prevent indentation.
 * - Currency converter shows computed result alongside symbol.
 * - Keep prior fixes and itinerary/doc updates.
 */

// -------------------- DATA --------------------
const ITINERARY = [
  { date: `2025-08-21`, city: ``, accommodation: ``, checkin_details: ``, items: [`Fly to Seoul.`] },
  {
    date: `2025-08-22`, city: `Hongdae`,
    accommodation: `Donggyo-ro 29-gil, Yeonnam-dong, Mapo-gu, Seoul 121-240, South Korea`,
    checkin_details: `If you get out of Exit 3 of Hongik University Station-----------------------
It works. There is a park in the center and roads on both sides. Go straight to the right of both roads (about 7 minutes) and turn right when you see the Ted cafe.
And if you walk past CU convenience store and turn left at the second apartment, my apartment called "Deulgookwa Sherville" is called Deulgookwa Sherville

Or I have to search for this address on Google Maps so I can find my apartment more easily.

The address is
It is 254-10, Yeonnam-dong, Mapo-gu, Seoul.
(Road name address: 15, Seongmisan-ro 28-gil, Mapo-gu, Seoul)
(Korean: Seoul Metropolitan Government, Mapo-gu, Yeonnam-dong 254-10, Deulgukhwa Sherville No. 202)

My apartment is on the second floor and my room number is 202.
We also have a door lock to enter the accommodation, so we will give you the password before we arrive in Korea.

> Check out: 11 a.m.
> Check-in: 3 p.m. (15:00)`,
    items: [
      `✈️ 17:30 – Land Incheon → 🚖 taxi to Hongdae Airbnb (~$75-$100 split, ~1 hr).`,
      `🥩 19:30 – K-BBQ Dinner at Saemaeul Sikdang.`,
      `🍻 21:00 – Bar hop: see note`,
      `🎤 23:00–02:00 – Karaoke (coin noraebang) OR Club NB2 (hip hop, always packed).`,
    ]
  },
  { date: `2025-08-23`, city: `Hongdae`, accommodation: ``, checkin_details: ``, items: [
    `🍳 12:00 – Recovery brunch: Eggslut (greasy fix) or Thanks, Oat (lighter).`,
    `🚲 15:00 – Han River Chill Sesh @ Yeouido Hangang Park: rent bikes, lay mats, order fried chicken; optional Hangang River Cruise (~$22, 1 hr, sunset).`,
    `🌶️ 18:30 – Dinner: Chicken JangIn Dakgalbi (spicy stir-fried chicken w/ cheese).`,
    `🍻 20:30–02:00 – Hongdae Pub Crawl (Mike’s Cabin, pre-book). Includes 3 bars + 1 club + 4 drinks.`,
    `🎶 02:00+ – Karaoke or Club Vera.`
  ]},
  { date: `2025-08-24`, city: `Hongdae`, accommodation: ``, checkin_details: ``, items: [
    `🥟 12:00 – Gwangjang Market – must-try: bindaetteok, mayak gimbap, yukhoe.`,
    `💆 15:30–18:00 – Skincare @ Forena Clinic (2–2.5 hrs).`,
    `🍺 18:30 – Craft beer crawl: Magpie Brewing Co. → The Booth.`,
    `🍢 20:00 – Dinner: Pojangmacha tents – street food + soju.`
  ]},
  { date: `2025-08-25`, city: `Hongdae`, accommodation: ``, checkin_details: ``, items: [
    `🍡 11:00 – Myeongdong Street Food Alley (skewers, hotteok pancakes).`,
    `🥟 13:00 – Optional market stop (Namdaemun or Gwangjang).`,
    `☕ 15:00 – Yeonnam-dong café crawl (hipster neighbourhood) – see note.`,
    `🍸 17:30 – Rooftop pre-dinner drinks: The Griffin Bar (JW Marriott).`,
    `🥓 19:30 – Dinner: Hanam Pig House (legendary pork belly BBQ).`,
    `🍹 21:30–00:00 – Cocktails @ Alice Cheongdam (hidden speakeasy).`
  ]},
  { date: `2025-08-26`, city: `Hongdae`, accommodation: ``, checkin_details: ``, items: [
    `🏰 11:00–16:00 – Gyeongbokgung Palace → Bukchon Hanok Village → Insadong tea house.`,
    `🍜 12:30 – Lunch: Tosokchon Samgyetang / Gogung (Insadong) / Tongin Market / Yetchatjip (Bukchon).`,
    `🥩 18:30 – Dinner: Yeontabal BBQ (premium beef). See note.`,
    `🍻 20:30–01:00 – Hongdae blowout: Thursday Party → karaoke → Club Vera.`
  ]},
  { date: `2025-08-27`, city: `Itaewon`, accommodation: `11 Usadan-ro 12-gil 302, Seoul, 04405`, checkin_details: `Check‑in: 15:00\nCheck‑out: 10:00`, items: [
    `🚖 11:00 – Taxi to Itaewon Airbnb (~25 min).`,
    `🥗 13:00 – Lunch: Plant Itaewon (healthy).`,
    `☕ Afternoon – Chill cafes, explore Itaewon.`,
    `🍖 19:00 – Dinner: Linus BBQ (American smoked meats).`,
    `🍸 21:00–02:00 – Itaewon bar hop: The Fountain → B One Lounge Club → karaoke.`
  ]},
  { date: `2025-08-28`, city: `Itaewon`, accommodation: ``, checkin_details: ``, items: [
    `🚖 11:00 – Taxi to Gangnam (~25 min).`,
    `🍽️ 12:00 – Michelin Lunch @ Soul (1★, booked).`,
    `🛍️ 14:30 – COEX Mall + Starfield Library (photos).`,
    `🍸 17:00 – Rooftop crawl: Privilege Bar (Mondrian) → Le Chamber – see note.`,
    `🌮 20:00 – Dinner: Vatos Urban Tacos.`,
    `🎧 22:30–03:00 – Club Octagon (Gangnam): $33.37 entry incl. 1 drink; VIP from $612 (6 ppl, 2 bottles); dress smart.`,
    `🚖 Taxi back to Itaewon (~$20).`
  ]},
  { date: `2025-08-29`, city: `Itaewon`, accommodation: ``, checkin_details: ``, items: [
    `🍝 11:00 – Brunch: Pasta Market Itaewon.`,
    `🛍️ Day – rest, shop, chill.`,
    `🍗 19:00 – Dinner: Chicken in the Kitchen (elite fried chicken).`,
    `🍻 21:00–02:00 – Itaewon Pub Crawl (pre-book).`,
    `🎶 02:00+ – Club Made (EDM/hip hop) or Cake Shop (underground techno).`
  ]},
  { date: `2025-08-30`, city: `Itaewon`, accommodation: ``, checkin_details: ``, items: [
    `🛍️ Day – last shopping & coffee crawl.`,
    `🌇 17:00 – Farewell rooftop: Kloud @ InterContinental OR revisit Griffin.`,
    `🥩 19:30 – Dinner: Hanokjib BBQ.`,
    `🍸 21:00–01:00 – Casual bar hop, final karaoke.`
  ]},
  { date: `2025-08-31`, city: ``, accommodation: ``, checkin_details: ``, items: [`Fly home.`] },
  { date: `2025-09-01`, city: ``, accommodation: ``, checkin_details: ``, items: [] },
];

const DETAIL_BLOCKS = {
  "2025-08-22-hongdae-hop": {
    title: `HONGDAE BAR HOP (Fri 22 Aug)`,
    lines: [
      `Thursday Party Hongdae – Beer pong, cheap drinks, expat/student vibe.`,
      `Fritz Coffee × Bar – Coffee cocktails & creative drinks.`,
      `Mike’s Cabin Hongdae – Legendary dive bar, cheap shots, live DJs.`,
      `FF Club (Free Funk) – Rock bar/club, indie bands early & DJs late.`,
      `Zen Bar – Tropical, frozen margaritas; easy warm‑up.`,
      `Bunker Bar – Underground hip‑hop DJs, cheap cocktails.`,
      `Gopchang Jeongol (shot bar) – flaming cocktails & group shots; pre‑game energy.`,
      `Thursday’s “Yellow” – neon dive, banana cocktails.`
    ]
  },
  "2025-08-25-cafes": {
    title: `CAFE CRAWL (Mon 25 Aug)`,
    lines: [
      `Thanks, Oat – Granola bowls, yogurt, smoothies.`,
      `Zapangi – Milk teas, cakes in cans; Insta door.`,
      `C.Through Café – Cream‑art lattes (fun stop).`,
      `Anthracite – Serious coffee; industrial‑chic.`,
      `Café Layered – Scones, British tearoom vibe.`,
      `Ver’s Garden – Plant‑filled, calm, photogenic.`,
      `Thanks Nature Café – Coffee + waffles + sheep.`,
      `Order: Thanks, Oat → Zapangi → C.Through → Anthracite → Layered → Ver’s Garden or Thanks Nature.`
    ]
  },
  "2025-08-27-itaewon-hop": {
    title: `ITAEWON BAR HOP (Wed 27 Aug)`,
    lines: [
      `The Fountain – Big club‑bar, DJs, dancefloor.`,
      `B One Lounge Club – Dark, hip‑hop heavy.`,
      `The Wolfhound – Irish pub, pints; expat crowd.`,
      `Gold Bar – Hidden speakeasy, slick cocktails.`,
      `Casa Corona Rooftop – Summery rooftop; sunset.`,
      `Route 66 – Sports bar, cheap pitchers & food.`,
      `Volstead – Prohibition‑style speakeasy.`,
      `Made (lounge) – Pre‑party lounge mid‑week.`,
      `Finish with Karaoke Noraebang.`,
      `Order: Wolfhound/Route 66 → Casa Corona → Gold Bar/Volstead → The Fountain → B One → Karaoke.`
    ]
  },
  "2025-08-26-lunch": {
    title: `LUNCH SUGGESTIONS (Tue 26 Aug)`,
    lines: [
      `Tosokchon Samgyetang – near Gyeongbokgung; ginseng chicken soup.`,
      `Gogung (Insadong) – Jeonju bibimbap (dolsot).`,
      `Tongin Market – Buy brass coins & build a lunchbox from stalls.`,
      `Yetchatjip (Bukchon) – Bulgogi hotpot; cozy hanok.`
    ]
  },
  "2025-08-28-rooftops": {
    title: `EXTRA ROOFTOPS (Thu 28 Aug)`,
    lines: [
      `The Griffin Bar – JW Marriott Dongdaemun; refined start.`,
      `Kloud Rooftop – InterContinental COEX; panoramic beer garden.`,
      `Southside Parlor – Texan‑run cocktails; Itaewon rooftop.`,
      `Gaja Changgo Rooftop – Low‑key, group‑friendly.`,
      `Rooftop Floating Bar – L7 Hongdae; pool + cocktails.`,
      `Flow: Griffin → Mondrian Privilege → Southside → Kloud → finish at Le Chamber.`
    ]
  }
};

const TRAVELLERS = [
  { name: `Mapa`, origin: `London`, avatar: `https://iili.io/Fy3Cgbj.png`, flights: [
    { dir: `Outbound`, flight: `Asiana OZ522`, from: `LHR T2`, to: `ICN T1`, dep: `Thu 21 Aug 20:40`, arr: `Fri 22 Aug 17:30` },
    { dir: `Return`, flight: `Asiana OZ521`, from: `ICN T1`, to: `LHR T2`, dep: `Sun 31 Aug 12:20`, arr: `Sun 31 Aug 18:50` },
  ]},
  { name: `Nuwie G`, origin: `Brisbane (early)`, avatar: `https://iili.io/Fy3BFCN.png`, flights: [
    { dir: `Outbound`, flight: `Jetstar JQ53`, from: `BNE`, to: `ICN T1`, dep: `Sat 23 Aug 11:10`, arr: `Sat 23 Aug 19:50` },
    { dir: `Return`, flight: `Jetstar JQ48`, from: `ICN T1`, to: `SYD`, dep: `Mon 1 Sep 21:50`, arr: `Tue 2 Sep 09:05` },
  ]},
  { name: `Hari`, origin: `Sydney`, avatar: `https://iili.io/Fy3fyzl.png`, flights: [
    { dir: `Outbound`, flight: `Korean Air KE402`, from: `SYD T1`, to: `ICN T2`, dep: `Fri 22 Aug 07:55`, arr: `Fri 22 Aug 17:35` },
    { dir: `Return`, flight: `Korean Air KE401`, from: `ICN T2`, to: `SYD T1`, dep: `Sun 31 Aug 19:10`, arr: `Mon 1 Sep 06:20` },
  ]},
  { name: `Ray`, origin: `Sydney`, avatar: `https://iili.io/Fy3ojFS.png`, flights: [
    { dir: `Outbound`, flight: `Korean Air KE402`, from: `SYD T1`, to: `ICN T2`, dep: `Fri 22 Aug 07:55`, arr: `Fri 22 Aug 17:35` },
    { dir: `Return`, flight: `Korean Air KE401`, from: `ICN T2`, to: `SYD T1`, dep: `Sun 31 Aug 19:10`, arr: `Mon 1 Sep 06:20` },
  ]},
  { name: `Naz`, origin: `Sydney`, avatar: `https://iili.io/Fy3xOfp.png`, flights: [
    { dir: `Outbound`, flight: `Jetstar JQ47`, from: `SYD T1`, to: `ICN T1`, dep: `Thu 21 Aug 10:45`, arr: `Thu 21 Aug 20:15` },
    { dir: `Return`, flight: `Jetstar JQ48`, from: `ICN T1`, to: `SYD T1`, dep: `Sun 31 Aug 21:50`, arr: `Mon 1 Sep 09:05` },
  ]},
];

const DOCS = [
  { key: 'mapa', group: `Flights`, title: `Mapa – Asiana Itinerary/Receipt`, url: `https://drive.google.com/file/d/18qqTWYr6nEfkAj5ZfrysDQMk0y61QQWU/view?usp=drive_link` },
  { key: 'rayhari', group: `Flights`, title: `Ray & Hari – Korean Air e‑ticket`, url: `https://drive.google.com/file/d/1o3QTqgJdirclEIvODKhRV-GO8y5sSCAT/view?usp=drive_link` },
  { key: 'naz', group: `Flights`, title: `Naz – Jetstar booking`, url: `https://drive.google.com/file/d/1fhrCN_ni4wuquIs3tY9CvBNs0mMWBf7m/view?usp=drive_link` },
  { key: 'nuwie_out', group: `Flights`, title: `Nuwie G – Brisbane → Seoul`, url: `https://drive.google.com/file/d/1Z3LfGfHXp2MWTXr5WaJwG1l8v39zt4eh/view?usp=drive_link` },
  { key: 'nuwie_ret', group: `Flights`, title: `Nuwie G – Seoul → Sydney`, url: `https://drive.google.com/file/d/1JbAGXShkHao2K9jvRfsrG4bq8QYt2VWN/view?usp=drive_link` },
  { group: `Accommodation`, title: `Airbnb – Hongdae (22–27 Aug)`, url: `https://www.airbnb.co.uk/trips/v1/reservation-details/ro/RESERVATION2_CHECKIN/HMHE83NSPJ`, meta: {address: `Donggyo-ro 29-gil, Yeonnam-dong, Mapo-gu, Seoul 121-240`, checkin: `15:00 Fri 22 Aug`, checkout: `11:00 Wed 27 Aug`, host: `Natalie`, conf: `HMHE83NSPJ`} },
  { group: `Accommodation`, title: `Airbnb – Itaewon (27–31 Aug)`, url: `https://www.airbnb.co.uk/trips/v1/reservation-details/ro/RESERVATION2_CHECKIN/HMR9RHKKHF`, meta: {address: `3‑min walk to Itaewon Stn (stay KANU)`, checkin: `15:00 Wed 27 Aug`, checkout: `10:00 Sun 31 Aug`, host: `Sue`, conf: `HMR9RHKKHF`} },
];

const FLIGHT_DOC_URL = {
  Mapa: { Outbound: DOCS.find(d=>d.key==='mapa')?.url, Return: DOCS.find(d=>d.key==='mapa')?.url },
  Hari: { Outbound: DOCS.find(d=>d.key==='rayhari')?.url, Return: DOCS.find(d=>d.key==='rayhari')?.url },
  Ray:  { Outbound: DOCS.find(d=>d.key==='rayhari')?.url, Return: DOCS.find(d=>d.key==='rayhari')?.url },
  Naz:  { Outbound: DOCS.find(d=>d.key==='naz')?.url,     Return: DOCS.find(d=>d.key==='naz')?.url },
  'Nuwie G': { Outbound: DOCS.find(d=>d.key==='nuwie_out')?.url, Return: DOCS.find(d=>d.key==='nuwie_ret')?.url },
};

const BAGGAGE = {
  ASIANA: "23kg checked + 10kg carry‑on (55×20×40cm) + personal item (40×30×20cm)",
  "KOREAN AIR": "20kg checked + 10kg carry‑on (55×20×40cm) + personal item (40×30×15cm)",
  JETSTAR: "30kg checked + 14kg carry‑on",
};

// -------------------- HELPERS --------------------
const SEOUL = { name: `Seoul`, lat: 37.5665, lon: 126.9780, tz: `Asia/Seoul` };
const SEOUL_HERO = 'https://iili.io/FyZBDga.png';

function useSeoulWeather(selectedISO) {
  const [state, setState] = useState({loading:true});
  useEffect(() => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${SEOUL.lat}&longitude=${SEOUL.lon}&current=temperature_2m,apparent_temperature,precipitation,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days=16&timezone=${encodeURIComponent(SEOUL.tz)}`;
    fetch(url)
      .then(r => r.json())
      .then(data => setState({loading:false, current:data.current, daily:data.daily}))
      .catch(err => setState({loading:false, error: String(err)}));
  }, [selectedISO]);
  return state;
}

function getForecastForDate(daily, iso){
  if(!daily || !daily.time) return null;
  const idx = daily.time.findIndex(t => t === iso);
  if(idx === -1) return null;
  return {
    tmin: Math.round((daily.temperature_2m_min && daily.temperature_2m_min[idx]) || 0),
    tmax: Math.round((daily.temperature_2m_max && daily.temperature_2m_max[idx]) || 0),
    prcp: Math.round(((daily.precipitation_sum && daily.precipitation_sum[idx]) || 0) * 10) / 10,
  };
}

function fmtDate(iso) {
  const d = new Date(iso + `T00:00:00`);
  return d.toLocaleDateString(undefined, { weekday: `short`, day: `numeric`, month: `short` });
}

function openMaps(query) {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  window.open(url, `_blank`);
}

function guessPlaceFromStep(step) {
  const after = step.split(` – `)[1] || step.split(` - `)[1] || step.split(`: `)[1] || step;
  return after.replace(/^[^\w\(]+/u,'').trim();
}

function shouldShowMaps(step){
  const s = step.trim().toLowerCase();
  const generic = [
    'fly', 'check in', 'freshen up', 'pack up', 'pack', 'explore', 'chill cafes', 'rest, shop, chill',
    'bar hop', 'pub crawl', 'bar crawl', 'karaoke', 'club', 'casual bar hop', 'farewell rooftop',
    'today –', 'day –', 'afternoon', 'morning', 'taxi to', 'taxi back', 'blowout'
  ];
  if (generic.some(g => s.includes(g))) return false;
  const keywords = ['dinner', 'lunch', 'brunch', 'rooftop', 'market', 'library', 'palace', 'village', 'insadong', 'coex', 'park', 'plant itaewon', 'vatos', 'hanokjib', 'hanam pig', 'alice cheongdam', 'soul', 'octagon', 'linus bbq', 'yeontabal', 'thanks, oat', 'eggslut', 'gwangjang', 'forena', 'magpie', 'the booth', 'myeongdong', 'namdaemun'];
  if (keywords.some(k => s.includes(k))) return true;
  if (s.includes('@')) return true;
  return false;
}

function parseFlightDate(str){
  const m = str.match(/\b(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i);
  if(!m) return null;
  const day = m[1].padStart(2,'0');
  const months = {Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12'};
  const month = months[m[2].slice(0,3)];
  return `2025-${month}-${day}`;
}

function detailKeyForStep(date, step){
  const s = step.toLowerCase();
  if(date==='2025-08-22' && s.includes('bar hop')) return '2025-08-22-hongdae-hop';
  if(date==='2025-08-25' && (s.includes('café crawl') || s.includes('cafe crawl'))) return '2025-08-25-cafes';
  if(date==='2025-08-26' && (s.includes('lunch') || s.startsWith('🍜'))) return '2025-08-26-lunch';
  if(date==='2025-08-27' && s.includes('itaewon bar hop')) return '2025-08-27-itaewon-hop';
  if(date==='2025-08-28' && s.includes('rooftop')) return '2025-08-28-rooftops';
  return null;
}

// -------------------- UI PRIMITIVES --------------------
const TabBtn = ({active, onClick, icon:Icon, label}) => (
  <button onClick={onClick} className={`flex-1 flex flex-col items-center justify-center py-2 ${active?`text-emerald-700 dark:text-emerald-400`:`text-zinc-400`}`}>
    <Icon size={22} />
    <span className="text-xs mt-1">{label}</span>
  </button>
);

const Card = ({children, className="", tint='emerald'}) => (
  <div className={
    `rounded-2xl shadow-sm border p-4 ` +
    (tint==='emerald'? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/60' : '') + ' ' +
    (tint==='rose'? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200/60 dark:border-rose-900/60' : '') + ' ' +
    (tint==='amber'? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/60' : '') + ' ' +
    (tint==='indigo'? 'bg-indigo-50/60 dark:bg-indigo-950/20 border-indigo-200/60 dark:border-indigo-900/60' : '') + ' ' +
    className
  }>{children}</div>
);

const Modal = ({open,onClose,children,title}) => {
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-zinc-900 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold">{title}</div>
          <button onClick={onClose} className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800"><X size={16}/></button>
        </div>
        {children}
      </div>
    </div>
  );
};

const InfoModal = ({open, onClose, title, lines}) => (
  <Modal open={open} onClose={onClose} title={title}>
    <div className="space-y-2">
      {lines.map((l, idx) => {
        const name = l.split(' – ')[0];
        const showMap = !/^\s*(Order|Finish)/i.test(l || '');
        return (
          <div key={idx} className="flex items-center justify-between border rounded-xl p-2 bg-white dark:bg-zinc-900">
            <div className="text-sm font-medium mr-2">{l}</div>
            {showMap && <button onClick={()=>openMaps(name)} className="text-xs px-2 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Map</button>}
          </div>
        );
      })}
    </div>
  </Modal>
);

// Drag‑to‑scroll Date Strip
const DateStrip = ({days, index, setIndex}) => {
  const ref = useRef(null);
  const state = useRef({down:false, startX:0, scrollLeft:0});
  const onDown = (e) => {
    const el = ref.current; if(!el) return;
    state.current.down = true;
    state.current.startX = (e.touches? e.touches[0].pageX : e.pageX) - el.offsetLeft;
    state.current.scrollLeft = el.scrollLeft;
  };
  const onMove = (e) => {
    const el = ref.current; if(!el || !state.current.down) return;
    e.preventDefault();
    const x = (e.touches? e.touches[0].pageX : e.pageX) - el.offsetLeft;
    const walk = (x - state.current.startX) * -1;
    el.scrollLeft = state.current.scrollLeft + walk;
  };
  const onUp = () => { state.current.down = false; };
  return (
    <div className="-mx-2 px-2 select-none">
      <div
        ref={ref}
        className="overflow-x-auto"
        style={{scrollbarWidth:'none', msOverflowStyle:'none'}}
        onMouseDown={onDown} onMouseMove={onMove} onMouseLeave={onUp} onMouseUp={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
      >
        <div className="flex items-center gap-2 w-max py-2">
          {days.map((d,i)=> (
            <button
              key={d.date}
              onClick={()=>setIndex(i)}
              className={`px-3 py-1.5 rounded-full text-xs border whitespace-nowrap ${i===index? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}
              aria-label={fmtDate(d.date)}
            >{fmtDate(d.date)}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

const TripProgressBar = ({days, index}) => {
  const pct = Math.round((index/(days.length-1))*100);
  const daysLeft = (days.length-1) - index;
  return (
    <div className="px-1">
      <div className="h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-emerald-500 to-amber-400" style={{width: pct + '%'}} />
      </div>
      <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 text-right">{pct}% • Day {index+1} of {days.length} • {daysLeft} day{daysLeft!==1?'s':''} left</div>
    </div>
  );
};

function baggageForFlight(flightStr=''){
  const u = flightStr.toUpperCase();
  if(u.includes('OZ')) return BAGGAGE.ASIANA;
  if(u.includes('KE')) return BAGGAGE["KOREAN AIR"];
  if(u.includes('JQ')) return BAGGAGE.JETSTAR;
  return null;
}

// -------------------- SCREENS --------------------
const TodayView = ({index,setIndex,days})=>{
  const day = days[index];
  const weather = useSeoulWeather(day?.date || ``);
  const forecast = weather.daily ? getForecastForDate(weather.daily, day.date) : null;
  const [detailKey, setDetailKey] = useState(null);

  const prev = () => setIndex(Math.max(0, index-1));
  const next = () => setIndex(Math.min(days.length-1, index+1));

  const flights = TRAVELLERS
    .flatMap(t => (t.flights||[]).map(f => ({t, f, depISO: parseFlightDate(f.dep), arrISO: parseFlightDate(f.arr||'')})) )
    .filter(x => x.depISO===day.date || x.arrISO===day.date);

  return (
    <div className="space-y-3">
      <DateStrip days={days} index={index} setIndex={setIndex} />
      <TripProgressBar days={days} index={index} />

      <div className="rounded-2xl overflow-hidden">
        <img src={SEOUL_HERO} alt="Seoul" className="w-full h-40 object-cover" />
      </div>

      <div className="rounded-2xl p-4 bg-gradient-to-r from-emerald-500 to-amber-400 text-white">
        <div className="flex items-center justify-between">
          <button onClick={prev} className="p-2 rounded-xl bg-white/20 hover:bg-white/30"><ArrowLeft size={18}/></button>
          <div className="text-center">
            <div className="text-xs uppercase tracking-wide opacity-90">{day.city || `Seoul`}</div>
            <div className="text-lg font-semibold">{fmtDate(day.date)}</div>
            <div className="text-[11px] opacity-90 mt-1">Day {index+1} of {days.length}</div>
          </div>
          <button onClick={next} className="p-2 rounded-xl bg-white/20 hover:bg-white/30"><ArrowRight size={18}/></button>
        </div>
      </div>

      <Card tint="emerald">
        <div className="flex items-center gap-3">
          <Sun />
          <div>
            <div className="font-medium">Seoul weather</div>
            {weather.loading && <div className="text-sm text-zinc-600">Loading…</div>}
            {weather.error && <div className="text-sm text-red-500">{weather.error}</div>}
            {!weather.loading && !weather.error && (
              <div className="text-sm text-zinc-800 dark:text-zinc-200">
                {forecast ? (
                  <div>Forecast for {fmtDate(day.date)}: H {forecast.tmax}° / L {forecast.tmin}° · Rain {forecast.prcp} mm</div>
                ) : (
                  <div>
                    Current: {Math.round((weather.current && weather.current.temperature_2m) || 0)}°C · Feels {Math.round((weather.current && weather.current.apparent_temperature) || 0)}°C
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {flights.length>0 && (
        <Card tint="indigo">
          <div className="font-semibold mb-2">Flights today</div>
          <div className="space-y-2">
            {flights.map(({t,f},i)=>{
              const url = (FLIGHT_DOC_URL[t.name] && FLIGHT_DOC_URL[t.name][f.dir]) || undefined;
              const bagText = baggageForFlight(f.flight);
              return (
                <div key={i} className="flex items-start gap-2">
                  <Info size={16} className="text-zinc-500 mt-0.5"/>
                  <div className="text-sm">
                    <div className="font-medium">{t.name} · {f.dir}: {f.flight}</div>
                    <div className="text-zinc-600">{f.from} → {f.to}</div>
                    <div className="text-zinc-600">{f.dep} → {f.arr}</div>
                    {bagText && <div className="text-zinc-700 dark:text-zinc-300 mt-1">Baggage: {bagText}</div>}
                  </div>
                  {url && <a href={url} target="_blank" rel="noreferrer" className="ml-auto text-xs px-2 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-1">Open <ExternalLink size={14}/></a>}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Card tint="indigo">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold">Plan for the day</div>
          <div className="text-xs text-zinc-600">{day.items.length} items</div>
        </div>
        <div className="space-y-2">
          {day.items.length === 0 && (
            <div className="text-sm text-zinc-500">No planned items. Free day or travel day.</div>
          )}
          {day.items.map((step, i) => {
            const k = detailKeyForStep(day.date, step);
            const showMap = shouldShowMaps(step);
            const place = guessPlaceFromStep(step);
            return (
              <motion.div key={i} initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} transition={{delay: i*0.02}} className="flex items-start gap-3">
                <div className="mt-1 text-zinc-400">•</div>
                <div className="flex-1">
                  <div className="text-sm leading-snug">
                    {k ? (
                      <button
                        onClick={()=>setDetailKey(k)}
                        className="underline decoration-dotted underline-offset-4 p-0 m-0 bg-transparent border-0 appearance-none text-left inline"
                      >
                        {step}
                      </button>
                    ) : step}
                  </div>
                  {showMap && (
                    <div className="mt-1 flex gap-2">
                      <button onClick={()=>openMaps(place)} className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700"> <MapPin size={14}/> Google Maps</button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {day.accommodation && (
        <Card tint="rose">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Accommodation</div>
              <div className="text-sm text-zinc-700 dark:text-zinc-300 mt-1">{day.accommodation}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>openMaps(day.accommodation)} className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 border"> <MapPin size={14}/> Map</button>
              {day.checkin_details && <button onClick={()=>setDetailKey(day.date+"-checkin")} className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500 text-white hover:bg-amber-600">Check‑in</button>}
            </div>
          </div>
        </Card>
      )}

      {Object.entries(DETAIL_BLOCKS).filter(([k])=>k.startsWith(day.date)).map(([k,blk]) => (
        <InfoModal key={k} open={detailKey===k} onClose={()=>setDetailKey(null)} title={blk.title} lines={blk.lines} />
      ))}
      <Modal open={detailKey===day.date+"-checkin"} onClose={()=>setDetailKey(null)} title="Check‑in Instructions">
        <div className="text-sm whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">{day.checkin_details}</div>
        {day.accommodation && (
          <div className="mt-3">
            <button onClick={()=>openMaps(day.accommodation)} className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 border"> <MapPin size={14}/> Map address</button>
          </div>
        )}
      </Modal>

      <CurrencyConverter />
    </div>
  );
};

const FullItineraryView = ({days, goTo}) => {
  const [detailKey, setDetailKey] = useState(null);
  return (
    <div className="space-y-3">
      {days.map((d, i) => (
        <Card key={d.date} tint="indigo">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide text-zinc-600">{d.city || `Seoul`}</div>
              <div className="font-semibold">{fmtDate(d.date)}</div>
            </div>
            <button onClick={()=>goTo(i)} className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"> <CalendarDays size={14}/> Go to day</button>
          </div>
          <div className="mt-2 space-y-1">
            {d.items.map((s, j)=> {
              const k = detailKeyForStep(d.date, s);
              return (
                <div key={j} className="text-sm flex items-start gap-2">
                  <span className="text-zinc-400">•</span>
                  <span>
                    {k ? (
                      <button
                        onClick={()=>setDetailKey(k)}
                        className="underline decoration-dotted underline-offset-4 p-0 m-0 bg-transparent border-0 appearance-none text-left inline"
                      >
                        {s}
                      </button>
                    ) : s}
                  </span>
                </div>
              );
            })}
            {d.items.length===0 && <div className="text-sm text-zinc-500">(No items)</div>}
          </div>
        </Card>
      ))}
      {Object.entries(DETAIL_BLOCKS).map(([k, blk]) => (
        <InfoModal key={k} open={detailKey===k} onClose={()=>setDetailKey(null)} title={blk.title} lines={blk.lines} />
      ))}
    </div>
  );
};

const DocsView = () => {
  const accommodationDocs = DOCS.filter(d=>d.group==='Accommodation');
  const flightDocsByTraveller = FLIGHT_DOC_URL;
  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Travellers & flights</div>
        <div className="space-y-3">
          {TRAVELLERS.map(t => (
            <Card key={t.name} tint="indigo">
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={`${t.name} avatar`} className="w-10 h-10 rounded-full"/>
                <div className="font-medium">{t.name} <span className="text-zinc-500">· {t.origin}</span></div>
              </div>
              <div className="mt-2 space-y-2 text-sm">
                {t.flights.map((f, i)=> {
                  const url = (flightDocsByTraveller[t.name] && flightDocsByTraveller[t.name][f.dir]) || undefined;
                  const bagText = baggageForFlight(f.flight);
                  return (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-zinc-400">•</span>
                      <div className="flex-1">
                        <div className="font-medium">{f.dir}: {f.flight}</div>
                        <div className="text-zinc-600">{f.from} → {f.to}</div>
                        <div className="text-zinc-600">{f.dep} → {f.arr}</div>
                        {bagText && <div className="text-zinc-700 dark:text-zinc-300 mt-1">Baggage: {bagText}</div>}
                      </div>
                      {url && <a href={url} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-1">Open <ExternalLink size={14}/></a>}
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Accommodation</div>
        <div className="grid grid-cols-1 gap-3">
          {accommodationDocs.map(doc => (
            <Card key={doc.title} tint="rose">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{doc.title}</div>
                  {doc.meta && (
                    <div className="text-xs text-zinc-600 mt-1">
                      {doc.meta.address && <>📍 {doc.meta.address}<br/></>}
                      {doc.meta.checkin && <>🕒 Check‑in: {doc.meta.checkin}<br/></>}
                      {doc.meta.checkout && <>🧳 Check‑out: {doc.meta.checkout}<br/></>}
                      {doc.meta.conf && <>🔖 Code: {doc.meta.conf}<br/></>}
                      {doc.meta.host && <>👤 Host: {doc.meta.host}<br/></>}
                    </div>
                  )}
                </div>
                <a href={doc.url} target="_blank" rel="noreferrer" className="shrink-0 inline-flex items-center gap-1 text-sm px-2 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Open <ExternalLink size={14} /></a>
              </div>
              {doc.meta && doc.meta.address && (
                <div className="mt-2">
                  <button onClick={()=>openMaps(doc.meta.address)} className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 border"> <MapPin size={14}/> Map address</button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// --------- Currency Converter with symbols and output ---------
const CurrencyConverter = () => {
  const [rates, setRates] = useState(null);
  const [pair, setPair] = useState('GBP-KRW');
  const [amount, setAmount] = useState(10);

  useEffect(()=>{
    const fetchRate = async (base) => {
      const tryHost = async () => {
        const r = await fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=KRW`);
        const j = await r.json();
        return j?.rates?.KRW || null;
      };
      const tryFrankfurter = async () => {
        const r = await fetch(`https://api.frankfurter.app/latest?from=${base}&to=KRW`);
        const j = await r.json();
        return j?.rates?.KRW || null;
      };
      const tryERAPI = async () => {
        const r = await fetch(`https://open.er-api.com/v6/latest/${base}`);
        const j = await r.json();
        return j?.rates?.KRW || null;
      };
      let rate = null;
      try { rate = await tryHost(); } catch {}
      if(!rate || rate<=0){ try { rate = await tryFrankfurter(); } catch {} }
      if(!rate || rate<=0){ try { rate = await tryERAPI(); } catch {} }
      return (rate && rate>0) ? rate : null;
    };

    (async()=>{
      try{
        const [gbp, aud] = await Promise.all([fetchRate('GBP'), fetchRate('AUD')]);
        if(!gbp && !aud){ setRates({error:'Live FX rate unavailable. Please try again later.'}); return; }
        setRates({ GBP_KRW: gbp || null, AUD_KRW: aud || null, ts: new Date().toLocaleString() });
      }catch(e){ setRates({error: String(e)}); }
    })();
  },[]);

  if(!rates) return <Card tint="emerald"><div className="text-sm">Loading rates…</div></Card>;
  if(rates.error) return <Card tint="rose"><div className="text-sm text-red-600">{rates.error}</div></Card>;

  const isGBP = pair==='GBP-KRW' || pair==='KRW-GBP';
  const r = isGBP ? rates.GBP_KRW : rates.AUD_KRW;
  const toKRW = pair.endsWith('KRW');

  let output = '—';
  if(r && r>0){
    const amt = isFinite(Number(amount)) ? Number(amount) : 0;
    output = toKRW ? Math.round(amt * r).toLocaleString() : (amt / r).toFixed(2);
  } else {
    output = 'unavailable';
  }

  const symbol = toKRW ? '₩' : (isGBP ? '£' : 'A$');
  const result = `${symbol} ${output}`;

  return (
    <Card tint="emerald">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">Currency converter</div>
        <div className="text-xs text-zinc-500">Updated {rates.ts}</div>
      </div>
      <div className="flex gap-2 mb-2">
        <button onClick={()=>setPair('GBP-KRW')} className={`text-xs px-2 py-1 rounded-lg border ${pair==='GBP-KRW'?'bg-emerald-600 text-white border-emerald-600':'bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}>£ → ₩</button>
        <button onClick={()=>setPair('KRW-GBP')} className={`text-xs px-2 py-1 rounded-lg border ${pair==='KRW-GBP'?'bg-emerald-600 text-white border-emerald-600':'bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}>₩ → £</button>
        <button onClick={()=>setPair('AUD-KRW')} className={`text-xs px-2 py-1 rounded-lg border ${pair==='AUD-KRW'?'bg-emerald-600 text-white border-emerald-600':'bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}>A$ → ₩</button>
        <button onClick={()=>setPair('KRW-AUD')} className={`text-xs px-2 py-1 rounded-lg border ${pair==='KRW-AUD'?'bg-emerald-600 text-white border-emerald-600':'bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}>₩ → A$</button>
      </div>
      <div className="flex items-center gap-2">
        <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} className="flex-1 px-3 py-2 rounded-xl border bg-white dark:bg-zinc-900"/>
        <div className="text-sm w-36 text-right tabular-nums">{result}</div>
      </div>
      {!r && <div className="mt-1 text-xs text-zinc-500">Live rate not available right now.</div>}
    </Card>
  );
};

// -------------------- APP --------------------
export default function App() {
  const [tab, setTab] = useState(`today`);

  // Auto-select today's date within itinerary
  const idxByDate = useMemo(() => new Map(ITINERARY.map((d, i)=>[d.date, i])), []);
  const todayISO = new Date().toISOString().slice(0,10);
  const firstISO = ITINERARY[0].date;
  const lastISO = ITINERARY[ITINERARY.length-1].date;
  let initialIndex = idxByDate.has(todayISO) ? idxByDate.get(todayISO) : 0;
  if (todayISO < firstISO) initialIndex = 0;
  else if (todayISO > lastISO) initialIndex = ITINERARY.length-1;
  else {
    const idx = ITINERARY.findIndex(d => d.date >= todayISO);
    initialIndex = idx >= 0 ? idx : ITINERARY.length-1;
  }
  const [index, setIndex] = useState(initialIndex);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-rose-50 to-amber-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-md mx-auto px-4 pb-24 pt-6">
        <div className="text-2xl font-bold mb-4">Seoul Trip</div>
        {tab === `today` && <TodayView index={index} setIndex={setIndex} days={ITINERARY} />}
        {tab === `all` && <FullItineraryView days={ITINERARY} goTo={(i)=>{ setIndex(i); setTab(`today`); }} />}
        {tab === `docs` && <DocsView />}
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-md mx-auto flex">
          <TabBtn active={tab===`today`} onClick={()=>setTab(`today`)} icon={CalendarDays} label="Today" />
          <TabBtn active={tab===`all`} onClick={()=>setTab(`all`)} icon={List} label="Full Itinerary" />
          <TabBtn active={tab===`docs`} onClick={()=>setTab(`docs`)} icon={FileText} label="Docs" />
        </div>
      </div>
    </div>
  );
}
