import {
  Gamepad2,
  Dices,
  Wifi,
  Sparkles,
  LayoutTemplate,
  MonitorSmartphone,
} from 'lucide-react'

export const stats = [
  { value: 5, label: 'Years Exp.' },
  { value: 50, label: 'Projects' },
  { value: 67, label: 'Casino Games' },
  { value: 15, label: 'Team Led', accent: true },
]

export const coreSkills = [
  'Unity Engine (C#)',
  'Casino & Slot Mechanics',
  'Stack Engine & RGS',
  'Photon Fusion',
  'WebGL / Cross-Platform',
  'VFX & Animation',
]

export const skillGroups = [
  {
    Icon: Gamepad2,
    title: 'Game Engine',
    tags: ['Unity', 'C#', 'C++', 'OOP', 'SOLID', 'Design Patterns'],
  },
  {
    Icon: Dices,
    title: 'Casino & Gameplay',
    accent: true,
    tags: ['Slot Mechanics', 'RNG Systems', 'RTP Logic', 'Stack Engine', 'RGS', 'Bonus Rounds', 'Gameplay AI'],
  },
  {
    Icon: Wifi,
    title: 'Multiplayer',
    tags: ['Photon Fusion', 'Socket.IO', 'REST APIs', 'Matchmaking', 'State Sync'],
  },
  {
    Icon: Sparkles,
    title: 'Unity Systems',
    tags: ['Addressables', 'Timeline', 'VFX Graph', 'Particle System', 'DoTween', 'Animation'],
  },
  {
    Icon: LayoutTemplate,
    title: 'Architecture',
    tags: ['MVC / MVCS', 'Observer', 'State Pattern', 'Command', 'Singleton', 'Object Pooling'],
  },
  {
    Icon: MonitorSmartphone,
    title: 'Platforms & Tools',
    tags: ['WebGL', 'Android', 'iOS', 'PC / Mac', 'Git', 'Blender', 'Photoshop'],
  },
]

export const experience = [
  {
    date: 'Jul 2024 – Present',
    current: true,
    role: 'Unity Developer',
    org: 'Bilions · Austin, Texas (Remote)',
    desc: 'Building cutting-edge casino slot machine games — architected 30+ games from scratch within a 67+ game Slot Empire platform. Engineered real-time systems using Socket.IO and REST APIs. Built Addressables-based asset delivery, in-app updates, festival-themed UI, and bonus wheel. Currently integrating Stack Engine (backend-driven logic) and RGS for web-playable deployment.',
    tags: ['Unity', 'C#', 'RNG', 'Socket', 'Addressables', 'Stack Engine', 'RGS'],
  },
  {
    date: 'Dec 2023 – Jul 2024',
    role: 'Freelance Unity Developer',
    org: 'Upwork · Remote',
    desc: 'Delivered high-quality freelance Unity projects focused on gameplay programming, performance optimization, and cross-platform deployment.',
    tags: ['Unity', 'C#', 'Freelance'],
  },
  {
    date: 'Aug 2023 – Nov 2023',
    role: 'Mid-Level Unity Developer',
    org: 'Appzia Technologies · Pune, India',
    desc: 'Developed core chess mechanics including piece movement, turn-based logic, and rule enforcement. Built a real-time multiplayer system with global matchmaking and game synchronization.',
    tags: ['Unity', 'Multiplayer', 'C#', '3D UI'],
  },
  {
    date: 'Jul 2022 – Jul 2023',
    role: 'Unity Developer (Level 1)',
    org: 'PhiBonacci Solutions · Ahmedabad, India',
    desc: 'Led a team of 15 developers across 50+ game projects. Developed responsive UIs for Windows, Linux, Mobile, AR, and VR. Specialized in animation systems and asset management with Addressables.',
    tags: ['Unity', 'Team Lead', 'AR/VR', 'Addressables', 'DoTween', 'Animation'],
  },
  {
    date: 'Jan 2021 – Jul 2022',
    role: 'Game Developer',
    org: 'Outscal · Delhi, India (Remote)',
    desc: 'Designed gameplay elements, AI behaviors, and UI systems. Integrated third-party plugins and optimized game performance through advanced profiling.',
    tags: ['Unity', 'C#', 'AI', 'UI/UX', 'Profiling'],
  },
  {
    date: 'Diploma',
    role: 'Diploma in C.S.E.',
    org: 'Government Polytechnic Shahjahanpur · GPA: 7.9',
    sub: 'Best Project Award 2021 · Game Programming Certification',
  },
]

export const projects = [
  { vid: 'BsKxrJxeV6E', title: 'Slot Empire (67+ Games)', badge: 'Bilions', caseId: 'slot-empire', desc: '67+ slot games via Addressables · 30+ built from scratch · Sockets, APIs, in-app updates, festival themes, bonus wheel, Stack Engine & RGS integration.', tags: ['Unity', 'Socket', 'RGS'], extra: '+4' },
  { vid: 'RubElttzOaU', title: 'Zombie Slot Game', badge: 'Bilions', desc: 'Multi-reel slot with dynamic paylines, scatter bonuses, free spins & horror-themed VFX.', tags: ['Unity', 'C#', 'VFX'] },
  { vid: 'I8Fej49mxJc', title: 'Black Jack', badge: 'Bilions', desc: 'Classic casino Black Jack with polished UI, smooth card animations & responsive interactions.', tags: ['Unity', 'Animation', 'UI'] },
  { vid: 'Sq1utN9apPg', title: 'Keno', badge: 'Bilions', desc: 'Number-based casino game with configurable bets, real-time draw animations & clean UI.', tags: ['Unity', 'UI', 'Animation'] },
  { vid: '2dcOnKkfR3c', title: 'Buffalo Gold Rush', badge: 'Slot', desc: '5×4 · 25 paylines · 90% RTP · Free Spin Wheel · 2x Wild Multiplier · High Volatility.', tags: ['Unity', 'RNG', 'VFX'] },
  { vid: 'itwqD6WdViY', title: 'Empress of Fortune', badge: 'Personal', desc: 'Cleopatra-themed slot with Free Bonus Spins, Scatter Multipliers up to 100x, Wild Fury.', tags: ['Unity', 'VFX Graph', 'Timeline'] },
  { vid: 'EpKVVICdjdI', title: 'Fireball Chinatown', badge: 'Slot', desc: '5×4 · 50 paylines · 90% RTP · Fireball Feature · Free Spins + Wild Multipliers.', tags: ['Unity', 'C#', 'VFX'] },
  { vid: 'gm90SaB44Vo', title: 'Jungle Safari', badge: 'Slot', desc: '5×3 · 20 paylines · Free Spins · Expanding Wilds · Scatter Payouts.', tags: ['Unity', 'RNG', 'VFX'] },
  { vid: 'KaJ14D6Ap2c', title: 'Viva La Fiesta', badge: 'Slot', desc: '5×3 · 20 paylines · Free Spins · Wild Multipliers (2x-4x) · Scatter Triggers.', tags: ['Unity', 'C#', 'Animation'] },
  { type: 'github', url: 'https://github.com/kishan831/Advanced-Tetris-Game', title: 'Advanced Tetris', badge: 'Personal', caseId: 'advanced-tetris', desc: 'Guideline-compliant Tetris · SRS rotation · 7-bag randomizer · 4 game modes · T-spin detection · MVC architecture · ScriptableObject-driven.', tags: ['Unity', 'C#', 'MVC'] },
  { type: 'github', url: 'https://github.com/kishan831/Match-Card', title: 'Match Card Game', badge: 'Personal', desc: 'Card matching memory game with clean architecture, smooth flip animations & engaging gameplay.', tags: ['Unity', 'C#', 'UI'] },
  { vid: 'kF5E60FwK8I', thumb: 'F2Ag78wDMuc', title: 'AiLO: Parkour Odyssey', badge: 'Indie', desc: 'Open-world parkour adventure with multiplayer via Photon Fusion & intense combat.', tags: ['Photon Fusion', 'Unity', 'Combat'] },
]

export const socials = {
  email: 'jaiswalkishan628@gmail.com',
  github: 'https://github.com/kishan831',
  linkedin: 'https://www.linkedin.com/in/kishan-jaiswal-2586a4220/',
  youtube: 'https://www.youtube.com/channel/UCrN0559CtMg-NeUi-9bqrTQ',
}

// Deep case studies for flagship projects (opened via a modal)
export const caseStudies = {
  'slot-empire': {
    title: 'Slot Empire — 67+ Game Casino Platform',
    badge: 'Bilions · Unity',
    vid: 'BsKxrJxeV6E',
    overview:
      'A production casino platform hosting 67+ slot games — 30+ of which I architected and built from scratch — unified under one shared infrastructure with real-time services and on-demand content delivery.',
    role: 'Lead Unity Developer — game-systems architecture, real-time backend integration, and live-ops tooling.',
    highlights: [
      'Addressables-based asset delivery so players download only the games they open, keeping the core app tiny.',
      'Real-time socket services (Socket.IO) for live balance, jackpots and session sync, backed by REST APIs.',
      'In-app update system to ship new games and content without a full store re-download.',
      'RTP-backed RNG slot mechanics: paylines, scatters, free spins, bonus wheel and festival-themed UI.',
      'Integrating Stack Engine (server-driven game logic) and an RGS for web-playable deployment.',
    ],
    tech: ['Unity', 'C#', 'Socket.IO', 'REST APIs', 'Addressables', 'RNG / RTP', 'Stack Engine', 'RGS'],
    outcome:
      '67+ games live on one scalable platform with real-time, multiplayer-grade infrastructure and streamlined live content updates.',
    links: [{ label: 'Watch demo', url: 'https://www.youtube.com/watch?v=BsKxrJxeV6E', type: 'video' }],
  },
  'advanced-tetris': {
    title: 'Advanced Tetris — Guideline-Compliant Engine',
    badge: 'Personal · Unity',
    overview:
      'A modern, guideline-compliant Tetris built to official "feel" standards — a showcase of faithful mechanics and clean, data-driven architecture.',
    role: 'Solo developer — gameplay systems, architecture and configuration design.',
    highlights: [
      'SRS (Super Rotation System) with correct wall-kicks for authentic rotation behavior.',
      '7-bag randomizer for fair, guideline-standard piece distribution.',
      'T-spin detection and scoring, plus 4 distinct game modes.',
      'MVC architecture with ScriptableObject-driven configuration for clean, data-driven tuning.',
    ],
    tech: ['Unity', 'C#', 'MVC', 'ScriptableObjects'],
    outcome:
      'A polished, guideline-accurate Tetris that doubles as a demonstration of maintainable, pattern-driven game architecture.',
    links: [{ label: 'View on GitHub', url: 'https://github.com/kishan831/Advanced-Tetris-Game', type: 'github' }],
  },
}

// Contact: form submits via mailto (no backend needed on GitHub Pages).
// To enable silent in-page submission instead, create a free form at formspree.io
// and set FORMSPREE_ACTION to its endpoint (e.g. https://formspree.io/f/abcdwxyz).
export const FORMSPREE_ACTION = ''
