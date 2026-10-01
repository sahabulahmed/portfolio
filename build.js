const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'portfolio-data.json');
const targetFile = path.join(__dirname, 'index.html');

if (!fs.existsSync(dataFile)) {
  console.error('Error: portfolio-data.json not found!');
  process.exit(1);
}

const portfolio = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

// SVG definitions
const icons = {
  html5: '<svg width="22" height="22" viewBox="0 0 24 24" fill="#E34F26"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/></svg>',
  css3: '<svg width="22" height="22" viewBox="0 0 24 24" fill="#1572B6"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm17.09 4.413L5.41 4.41l.23 2.622 10.06.003-.232 2.718H8.53l.33 4.17 2.956.81 2.91-.803.326-3.426H6.11l-.698 8.01 6.565 1.823 6.565-1.823.744-8.157z"/></svg>',
  javascript: '<svg width="22" height="22" viewBox="0 0 24 24" fill="#F7DF1E"><path d="M0 0h24v24H0V0zm21.734 17.41c-.26-.64-.9-1.07-1.74-1.07-.94 0-1.56.51-1.56 1.54 0 1.4.88 1.69 2.15 2.2.16.06.33.12.5.19 1.76.67 2.45 1.5 2.45 3.03 0 2.1-1.57 3.33-4.13 3.33-2.2 0-3.52-1.05-4.04-2.4l1.5-1c.36.85.99 1.52 2.45 1.52 1.07 0 1.72-.47 1.72-1.4 0-1.08-.53-1.4-1.85-1.92l-.6-.24c-1.58-.64-2.45-1.39-2.45-3.14 0-2 1.52-3.1 3.73-3.1 1.8 0 3.14.86 3.72 2.2l-1.5.96zM11.234 16h1.77v6.64c0 2.23-1.12 3.36-3.4 3.36-1.54 0-2.73-.72-3.23-1.93l1.5-.96c.33.69.83 1.05 1.67 1.05.97 0 1.46-.44 1.46-1.52V16z"/></svg>',
  php: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#8892BF"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-5.74 15.688H4.62l1.62-7.376h2.82c1.78 0 2.76.88 2.5 2.24-.26 1.4-1.58 2.22-3.32 2.22H6.96l-.7 2.916zm2.34-4.596h.9c.96 0 1.54-.42 1.7-1.18.16-.76-.32-1.18-1.28-1.18h-.9l-.42 2.36zm6.86 4.596h-1.64l1.62-7.376h2.82c1.78 0 2.76.88 2.5 2.24-.26 1.4-1.58 2.22-3.32 2.22h-1.28l-.7 2.916zm2.34-4.596h.9c.96 0 1.54-.42 1.7-1.18.16-.76-.32-1.18-1.28-1.18h-.9l-.42 2.36z"/></svg>',
  tailwind: '<svg width="22" height="22" viewBox="0 0 24 24" fill="#06B6D4"><path d="M12 6.5c-2.3 0-3.6 1.1-4 3.4.9-1.2 2-1.6 3.4-1.2.8.3 1.4.9 2 1.5 1.1 1.1 2.3 2.3 4.8 2.3 2.3 0 3.6-1.1 4-3.4-.9 1.2-2 1.6-3.4 1.2-.8-.3-1.4-.9-2-1.5-1.1-1.1-2.3-2.3-4.8-2.3zM6 12.5c-2.3 0-3.6 1.1-4 3.4.9-1.2 2-1.6 3.4-1.2.8.3 1.4.9 2 1.5 1.1 1.1 2.3 2.3 4.8 2.3 2.3 0 3.6-1.1 4-3.4-.9 1.2-2 1.6-3.4 1.2-.8-.3-1.4-.9-2-1.5-1.1-1.1-2.3-2.3-4.8-2.3z"/></svg>',
  figma: '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="#0ACF83" d="M12 24a4 4 0 0 0 4-4v-4h-4a4 4 0 0 0 0 8z"/><path fill="#A259FF" d="M4 16a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4z"/><path fill="#F24E1E" d="M4 8a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4z"/><path fill="#FF7262" d="M12 0h4a4 4 0 0 1 4 4 4 4 0 0 1-4 4h-4V0z"/><circle fill="#1ABCFE" cx="16" cy="12" r="4"/></svg>',
  googleads: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3.2 16.5l7.5-13c.6-1 1.8-1.4 2.8-.8l1.7 1c1 .6 1.4 1.8.8 2.8l-7.5 13c-.6 1-1.8 1.4-2.8.8l-1.7-1c-1-.6-1.4-1.8-.8-2.8z" fill="#FABB05"/><path d="M21.5 17.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" fill="#4285F4"/><path d="M4.2 18.2a2.3 2.3 0 1 1-4.2-2.1 2.3 2.3 0 0 1 4.2 2.1z" fill="#34A853"/></svg>',
  facebookads: '<svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
  code: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline><line x1="14" y1="4" x2="10" y2="20"></line></svg>',
  github: '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path></svg>',
  linkedin: '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>',
  facebook: '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
  download: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3"></path><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="m7 10 5 5 5-5"></path></svg>',
  location: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
  email: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
  education: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>',
  user: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
  award: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path><circle cx="12" cy="8" r="6"></circle></svg>',
  sparkles: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>',
  phone: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
  send: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>',
  external: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>'
};

// Orbit nodes customized to Sahabul's CV skills
const orbitNodes = [
  { name: 'HTML5', svg: icons.html5 },
  { name: 'CSS3', svg: icons.css3 },
  { name: 'JavaScript', svg: icons.javascript },
  { name: 'PHP', svg: icons.php },
  { name: 'Tailwind CSS', svg: icons.tailwind },
  { name: 'Figma UI/UX', svg: icons.figma },
  { name: 'Google Ads', svg: icons.googleads },
  { name: 'Facebook Ads', svg: icons.facebookads },
  { name: 'Full Stack', svg: icons.code }
];

let html = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Sahabul Ahmed Asraf | Full Stack Web Developer</title>
  <meta name="description" content="Sahabul Ahmed Asraf - Full Stack Web Developer & UI/UX Designer building clean, user-focused web applications with HTML, CSS, JavaScript, PHP, and Tailwind CSS.">
  <link rel="icon" href="/logo.png" type="image/png">
  
  <meta property="og:title" content="Sahabul Ahmed Asraf | Full Stack Web Developer">
  <meta property="og:description" content="Sahabul Ahmed Asraf - Full Stack Web Developer & UI/UX Designer building clean, user-focused web applications with HTML, CSS, JavaScript, PHP, and Tailwind CSS.">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="Sahabul Ahmed Asraf | Full Stack Web Developer">
  <meta name="twitter:description" content="Sahabul Ahmed Asraf - Full Stack Web Developer & UI/UX Designer building clean, user-focused web applications with HTML, CSS, JavaScript, PHP, and Tailwind CSS.">
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet">
  
  <link rel="stylesheet" href="/styles.css">
  
  <style>
    .bg-dark { background-color: #030b18; }
    .bg-dark2 { background-color: #071020; }
    .bg-dark3 { background-color: #0a1628; }
    .bg-card { background-color: #0d1f35; }
    .bg-card2 { background-color: #111f38; }
    .text-cyan { color: #00d4ff; }
    .text-cyan2 { color: #00ffcc; }
    .text-pink { color: #ff2d78; }
    .text-muted { color: #7a9bb5; }
    .text-text { color: #e2eaf5; }
    .border-border { border-color: #1a3050; }
    
    .carousel-container { perspective: 1200px; }
    .carousel-card { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
    
    .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
    .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

    @keyframes floatUp {
      0% { transform: translateY(0) rotate(0deg); opacity: 0.15; }
      50% { transform: translateY(-250px) rotate(180deg); opacity: 0.25; }
      100% { transform: translateY(-500px) rotate(360deg); opacity: 0; }
    }
    .drift-icon {
      position: absolute;
      animation: floatUp 12s linear infinite;
    }
  </style>
</head>
<body class="bg-dark text-text antialiased relative selection:bg-cyan selection:text-black">

  <canvas id="particles" class="fixed top-0 left-0 pointer-events-none z-0 opacity-40"></canvas>

  <nav id="navbar" class="fixed top-0 left-0 right-0 z-[999] px-[5%] py-[0.6rem] flex items-center justify-between backdrop-blur-xl border-b border-[rgba(0,212,255,0.08)] transition-all duration-300 bg-[rgba(3,11,24,0.85)]">
    <a href="#home" class="flex items-center gap-3 no-underline py-1 group">
      <img src="/logo.png" alt="SA Logo" width="48" height="48" class="w-[42px] sm:w-[50px] h-auto object-contain transition-transform duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_12px_rgba(255,215,0,0.5)]">
      <div class="flex flex-col">
        <span class="font-syne font-extrabold text-lg sm:text-2xl text-white tracking-wide transition-all group-hover:scale-[1.02]">
          <span class="text-cyan">Sahabul</span> Asraf
        </span>
        <span class="text-[0.65rem] sm:text-[0.7rem] text-cyan2/80 tracking-widest uppercase font-mono -mt-1">Full Stack Dev</span>
      </div>
    </a>
    
    <ul class="hidden md:flex items-center gap-6 lg:gap-8 list-none m-0 p-0">
      <li><a href="#home" class="nav-link text-muted no-underline text-[0.9rem] font-medium tracking-[0.5px] transition-colors duration-300 relative capitalize hover:text-cyan group">home<span class="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-cyan transition-all duration-300 group-hover:w-full"></span></a></li>
      <li><a href="#about" class="nav-link text-muted no-underline text-[0.9rem] font-medium tracking-[0.5px] transition-colors duration-300 relative capitalize hover:text-cyan group">about<span class="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-cyan transition-all duration-300 group-hover:w-full"></span></a></li>
      <li><a href="#skills" class="nav-link text-muted no-underline text-[0.9rem] font-medium tracking-[0.5px] transition-colors duration-300 relative capitalize hover:text-cyan group">skills<span class="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-cyan transition-all duration-300 group-hover:w-full"></span></a></li>
      <li><a href="#technologies" class="nav-link text-muted no-underline text-[0.9rem] font-medium tracking-[0.5px] transition-colors duration-300 relative capitalize hover:text-cyan group">technologies<span class="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-cyan transition-all duration-300 group-hover:w-full"></span></a></li>
      <li><a href="#education" class="nav-link text-muted no-underline text-[0.9rem] font-medium tracking-[0.5px] transition-colors duration-300 relative capitalize hover:text-cyan group">education<span class="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-cyan transition-all duration-300 group-hover:w-full"></span></a></li>
      <li><a href="#projects" class="nav-link text-muted no-underline text-[0.9rem] font-medium tracking-[0.5px] transition-colors duration-300 relative capitalize hover:text-cyan group">projects<span class="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-cyan transition-all duration-300 group-hover:w-full"></span></a></li>
      <li><a href="#contact" class="nav-link text-muted no-underline text-[0.9rem] font-medium tracking-[0.5px] transition-colors duration-300 relative capitalize hover:text-cyan group">contact<span class="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-cyan transition-all duration-300 group-hover:w-full"></span></a></li>
    </ul>

    <button onclick="document.querySelector('#contact').scrollIntoView({behavior:'smooth'})" class="hidden md:flex items-center justify-center gap-2 bg-gradient-to-br from-cyan to-cyan2 text-black border-none px-[1.4rem] py-[0.55rem] rounded-full font-bold text-[0.85rem] cursor-pointer transition-all duration-200 tracking-[0.5px] hover:scale-105 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)]">
      Hire Me
    </button>

    <div id="burger-btn" class="flex md:hidden flex-col gap-[5px] cursor-pointer p-1 relative z-50">
      <span class="burger-bar block w-6 h-[2px] bg-cyan rounded-[2px] transition-all duration-300"></span>
      <span class="burger-bar block w-6 h-[2px] bg-cyan rounded-[2px] transition-all duration-300"></span>
      <span class="burger-bar block w-6 h-[2px] bg-cyan rounded-[2px] transition-all duration-300"></span>
    </div>
  </nav>

  <div id="mobile-menu" class="md:hidden fixed top-[70px] left-0 right-0 bg-[rgba(7,16,32,0.98)] backdrop-blur-xl border-b border-border px-[5%] py-6 flex-col gap-4 z-[998] transition-all duration-300 hidden opacity-0 -translate-y-2">
    <a href="#home" class="mobile-nav-link text-muted no-underline text-base font-medium py-2 border-b border-border capitalize hover:text-cyan transition-colors">home</a>
    <a href="#about" class="mobile-nav-link text-muted no-underline text-base font-medium py-2 border-b border-border capitalize hover:text-cyan transition-colors">about</a>
    <a href="#skills" class="mobile-nav-link text-muted no-underline text-base font-medium py-2 border-b border-border capitalize hover:text-cyan transition-colors">skills</a>
    <a href="#technologies" class="mobile-nav-link text-muted no-underline text-base font-medium py-2 border-b border-border capitalize hover:text-cyan transition-colors">technologies</a>
    <a href="#education" class="mobile-nav-link text-muted no-underline text-base font-medium py-2 border-b border-border capitalize hover:text-cyan transition-colors">education</a>
    <a href="#projects" class="mobile-nav-link text-muted no-underline text-base font-medium py-2 border-b border-border capitalize hover:text-cyan transition-colors">projects</a>
    <a href="#contact" class="mobile-nav-link text-muted no-underline text-base font-medium py-2 border-b border-border capitalize hover:text-cyan transition-colors">contact</a>
    <button onclick="document.querySelector('#contact').scrollIntoView({behavior:'smooth'}); toggleMobileMenu(false);" class="mt-2 w-full py-3 bg-gradient-to-br from-cyan to-cyan2 text-black font-bold rounded-xl text-center">Hire Me</button>
  </div>

  <main class="relative z-10">
    
    <section id="home" class="min-h-screen flex flex-col justify-between relative overflow-hidden pt-20 md:pt-[100px]">
      <div class="hero-grid-bg absolute inset-0 pointer-events-none"></div>
      <div class="absolute top-[15%] right-[5%] md:right-[10%] w-[400px] h-[400px] bg-[radial-gradient(ellipse,rgba(0,212,255,0.12)_0%,transparent_70%)] pointer-events-none animate-pulse-glow hidden md:block"></div>
      
      <div class="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div class="drift-icon opacity-15 filter blur-[0.5px]" style="left:10%; bottom:-50px; font-size:30px; animation-duration:12s; animation-delay:0s;">
          <svg stroke="currentColor" fill="currentColor" viewBox="0 0 24 24" class="text-[#E34F26]" height="1em" width="1em"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"></path></svg>
        </div>
        <div class="drift-icon opacity-15 filter blur-[0.5px]" style="left:40%; bottom:-50px; font-size:24px; animation-duration:14s; animation-delay:3s;">
          <svg stroke="currentColor" fill="currentColor" viewBox="0 0 24 24" class="text-[#1572B6]" height="1em" width="1em"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm17.09 4.413L5.41 4.41l.23 2.622 10.06.003-.232 2.718H8.53l.33 4.17 2.956.81 2.91-.803.326-3.426H6.11l-.698 8.01 6.565 1.823 6.565-1.823.744-8.157z"></path></svg>
        </div>
        <div class="drift-icon opacity-15 filter blur-[0.5px]" style="left:75%; bottom:-50px; font-size:36px; animation-duration:11s; animation-delay:1s;">
          <svg stroke="currentColor" fill="currentColor" viewBox="0 0 24 24" class="text-[#06B6D4]" height="1em" width="1em"><path d="M12 6.5c-2.3 0-3.6 1.1-4 3.4.9-1.2 2-1.6 3.4-1.2.8.3 1.4.9 2 1.5 1.1 1.1 2.3 2.3 4.8 2.3 2.3 0 3.6-1.1 4-3.4-.9 1.2-2 1.6-3.4 1.2-.8-.3-1.4-.9-2-1.5-1.1-1.1-2.3-2.3-4.8-2.3z"></path></svg>
        </div>
        <div class="drift-icon opacity-15 filter blur-[0.5px]" style="left:25%; bottom:-50px; font-size:28px; animation-duration:15s; animation-delay:5s;">
          <svg stroke="currentColor" fill="currentColor" viewBox="0 0 24 24" class="text-[#8892BF]" height="1em" width="1em"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-5.74 15.688H4.62l1.62-7.376h2.82c1.78 0 2.76.88 2.5 2.24-.26 1.4-1.58 2.22-3.32 2.22H6.96l-.7 2.916zm2.34-4.596h.9c.96 0 1.54-.42 1.7-1.18.16-.76-.32-1.18-1.28-1.18h-.9l-.42 2.36z"></path></svg>
        </div>
        <div class="drift-icon opacity-15 filter blur-[0.5px]" style="left:60%; bottom:-50px; font-size:32px; animation-duration:13s; animation-delay:2s;">
          <svg stroke="currentColor" fill="currentColor" viewBox="0 0 24 24" class="text-[#F7DF1E]" height="1em" width="1em"><path d="M0 0h24v24H0V0zm21.734 17.41c-.26-.64-.9-1.07-1.74-1.07-.94 0-1.56.51-1.56 1.54 0 1.4.88 1.69 2.15 2.2.16.06.33.12.5.19 1.76.67 2.45 1.5 2.45 3.03 0 2.1-1.57 3.33-4.13 3.33-2.2 0-3.52-1.05-4.04-2.4l1.5-1c.36.85.99 1.52 2.45 1.52 1.07 0 1.72-.47 1.72-1.4 0-1.08-.53-1.4-1.85-1.92l-.6-.24c-1.58-.64-2.45-1.39-2.45-3.14 0-2 1.52-3.1 3.73-3.1 1.8 0 3.14.86 3.72 2.2l-1.5.96z"></path></svg>
        </div>
        <div class="drift-icon opacity-15 filter blur-[0.5px]" style="left:90%; bottom:-50px; font-size:35px; animation-duration:10s; animation-delay:6s;">
          <svg stroke="currentColor" fill="currentColor" viewBox="0 0 24 24" class="text-[#00d4ff]" height="1em" width="1em"><path d="M12 0L1.5 6v12L12 24l10.5-6V6L12 0zm0 2.3l8.25 4.7v9.5L12 21.2l-8.25-4.7v-9.5L12 2.3z"></path></svg>
        </div>
      </div>

      <div class="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-8 lg:gap-16 items-center px-4 md:px-[5%] flex-grow content-center py-8">
        
        <div class="flex justify-center md:justify-start relative order-2 md:order-1 animate-slideInLeft">
          <div class="relative w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] md:w-[400px] md:h-[400px] lg:w-[420px] lg:h-[420px]">
            
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] md:w-[310px] md:h-[310px]">
              <div class="w-full h-full rounded-full border border-dashed border-[rgba(0,212,255,0.15)] animate-spin-slow"></div>
            </div>
            
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] md:w-[380px] md:h-[380px]">
              <div class="w-full h-full rounded-full border border-dashed border-[rgba(0,212,255,0.15)] animate-spin-slower"></div>
            </div>

            ${orbitNodes.map((n, idx) => `
              <div id="orbit-node-${idx}" class="orbit-node absolute top-1/2 left-1/2 flex flex-col items-center gap-1 group cursor-pointer">
                <div class="w-[46px] h-[46px] sm:w-[52px] sm:h-[52px] rounded-[14px] bg-card2 border border-border flex items-center justify-center transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.3)] group-hover:border-cyan group-hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] group-hover:scale-110">
                  ${n.svg}
                </div>
                <span class="text-[0.55rem] sm:text-[0.6rem] text-muted whitespace-nowrap font-medium">${n.name}</span>
              </div>
            `).join('')}

            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[230px] sm:h-[230px] md:w-[240px] md:h-[240px] z-10 flex items-center justify-center">
              <div class="w-full h-full rounded-full overflow-hidden border-[3px] border-[rgba(0,212,255,0.4)] shadow-[0_0_60px_rgba(0,212,255,0.25),inset_0_0_60px_rgba(0,212,255,0.05)] animate-photo-float relative bg-[#0b1329]">
                <img src="/photo.webp" alt="Sahabul Ahmed Asraf" class="w-full h-full object-cover object-top scale-105">
              </div>
            </div>

            <div class="absolute bg-gradient-to-r from-[#0a1428] via-[#112244] to-[#0a1428] border border-cyan-400/40 rounded-2xl px-6 py-3 text-[0.82rem] font-medium text-white whitespace-nowrap backdrop-blur-xl shadow-[0_10px_30px_rgba(0,212,255,0.2)] bottom-[16%] sm:bottom-[18%] left-1/3 -translate-x-1/2 animate-tag-float2 z-20">
              <span class="font-bold text-[#00f0ff]">Full Stack</span> Web Developer
            </div>

          </div>
        </div>

        <div class="flex-1 text-center md:text-left order-1 md:order-2 z-[2] pt-8 md:pt-0 animate-slideInRight relative min-h-[400px]">
          <div class="inline-flex items-center gap-2 bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.2)] px-4 py-1.5 rounded-full text-[0.8rem] text-cyan mb-6 mx-auto md:mx-0">
            <span class="w-2 h-2 bg-[#00ff88] rounded-full animate-blink"></span>
            ${portfolio.hero.availability}
          </div>

          <h1 class="font-syne text-[clamp(2.3rem,4.8vw,4.2rem)] font-extrabold leading-[1.08] mb-4">
            <span class="text-white">Hi, I'm<br></span>
            <span class="bg-gradient-to-br from-cyan via-cyan2 to-pink text-transparent bg-clip-text">${portfolio.hero.name}</span>
          </h1>

          <p class="text-[1.2rem] sm:text-[1.25rem] font-semibold mb-8 tracking-[0.5px] h-[38px] flex items-center justify-center md:justify-start">
            <span class="mr-2">✦</span>
            <span id="typed-text" class="text-green-400">Full Stack Web Developer</span>
            <span class="animate-blink text-cyan ml-0.5">|</span>
          </p>

          <p class="text-muted leading-[1.75] max-w-[480px] mb-8 mx-auto md:mx-0 text-[0.95rem] sm:text-base">
            ${portfolio.hero.tagline}
          </p>

          <div class="flex gap-4 flex-wrap mb-8 justify-center md:justify-start items-center min-h-[50px]">
            <a href="#projects" id="hero-work-btn" class="bg-gradient-to-br from-cyan to-cyan2 text-black px-7 py-[0.75rem] rounded-full font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,212,255,0.35)] flex items-center justify-center gap-2">
              <span>View My Work</span>
            </a>
            
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" class="bg-transparent text-text px-7 py-[0.75rem] rounded-full font-semibold border-[1.5px] border-[rgba(0,212,255,0.3)] transition-all duration-300 hover:border-cyan hover:text-cyan hover:-translate-y-0.5 flex items-center gap-2">
              ${icons.download}
              <span>View Resume (CV)</span>
            </a>
          </div>

          <div class="flex gap-3 justify-center md:justify-start">
            <a href="${portfolio.hero.github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub" class="w-[42px] h-[42px] border border-border rounded-full flex items-center justify-center text-muted hover:border-cyan hover:text-cyan hover:-translate-y-[3px] hover:bg-[rgba(0,212,255,0.08)] transition-all">
              ${icons.github}
            </a>
            <a href="${portfolio.hero.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="w-[42px] h-[42px] border border-border rounded-full flex items-center justify-center text-muted hover:border-cyan hover:text-cyan hover:-translate-y-[3px] hover:bg-[rgba(0,212,255,0.08)] transition-all">
              ${icons.linkedin}
            </a>
            <a href="${portfolio.hero.facebook}" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="w-[42px] h-[42px] border border-border rounded-full flex items-center justify-center text-muted hover:border-cyan hover:text-cyan hover:-translate-y-[3px] hover:bg-[rgba(0,212,255,0.08)] transition-all">
              ${icons.facebook}
            </a>
          </div>
        </div>

      </div>

      <div class="w-full border-t border-b border-cyan-900/50 bg-black/60 backdrop-blur-md py-4 select-none pointer-events-none mt-auto overflow-hidden">
        <div class="overflow-hidden flex">
          <div class="flex animate-marquee-continuous whitespace-nowrap gap-8 md:gap-12 text-sm md:text-base font-medium text-cyan-300 will-change-transform">
            ${[
              "HTML5", "CSS3", "JavaScript", "PHP", "Tailwind CSS", "Figma UI/UX", "Facebook Ads", "Google Ads", "Email Marketing", "MySQL", "Git & GitHub", "Responsive Design",
              "HTML5", "CSS3", "JavaScript", "PHP", "Tailwind CSS", "Figma UI/UX", "Facebook Ads", "Google Ads", "Email Marketing", "MySQL", "Git & GitHub", "Responsive Design"
            ].map(x => `<span class="inline-flex items-center gap-1.5">• ${x}</span>`).join('')}
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 px-4 md:px-[5%] max-w-7xl mx-auto w-full relative">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        ${portfolio.stats.map(s => `
          <div ${s.targetId ? `onclick="document.querySelector('#${s.targetId}')?.scrollIntoView({behavior:'smooth'})"` : ''} class="flex flex-col items-center justify-center p-5 md:p-6 bg-[rgba(13,31,53,0.3)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] rounded-2xl hover:border-[#00d4ff]/50 transition-all duration-300 group ${s.targetId ? 'cursor-pointer active:scale-95' : ''}">
            <h3 class="stat-number text-2xl sm:text-3xl md:text-4xl font-extrabold text-white group-hover:text-[#00d4ff] transition-colors" data-value="${s.value}" data-suffix="${s.suffix}">0${s.suffix}</h3>
            <p class="text-[#94a3b8] text-[0.75rem] sm:text-xs md:text-sm font-medium mt-2 uppercase tracking-wider text-center">${s.label}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <section id="about" class="py-20 md:py-28 px-[5%] bg-dark2 overflow-hidden relative">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col items-center mb-12 md:mb-20 text-center">
          <h2 class="font-syne text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold text-white">About <span class="text-cyan">Me</span></h2>
          <span class="text-xs sm:text-sm uppercase tracking-[0.2em] text-cyan/70 font-semibold mt-2 block">Who I Am</span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-center">
          <div class="lg:col-span-5 flex justify-center">
            <div class="relative w-[280px] sm:w-[320px] md:w-[350px] aspect-[4/5] rounded-3xl overflow-hidden border border-cyan/30 shadow-[0_0_50px_rgba(0,212,255,0.15)] group bg-[#0b1329]">
              <img src="/photo.webp" alt="Sahabul Ahmed Asraf" class="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105">
              <div class="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60"></div>
            </div>
          </div>

          <div class="lg:col-span-7 flex flex-col gap-6">
            <div class="text-base sm:text-lg leading-relaxed text-muted/90">
              <p class="mb-4 text-white font-medium">
                I am <span class="text-cyan font-bold">${portfolio.about.name}</span>, ${portfolio.about.intro}
              </p>
              <p class="mb-4 text-muted">
                ${portfolio.about.paragraph1}
              </p>
              <p class="text-muted">
                ${portfolio.about.paragraph2}
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div class="p-4 rounded-2xl bg-card/60 border border-border flex items-center gap-4 transition-all duration-300 hover:border-cyan/40 hover:bg-white/5">
                <div class="w-12 h-12 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan flex-shrink-0">
                  ${icons.user}
                </div>
                <div>
                  <span class="text-xs text-gray-500 uppercase tracking-widest font-bold block mb-1">Name</span>
                  <span class="text-[0.95rem] text-white font-medium block">${portfolio.about.name}</span>
                </div>
              </div>

              <div id="location-card" onclick="openMapModal()" class="p-4 rounded-2xl bg-card/60 border border-border flex items-center gap-4 transition-all duration-300 hover:border-cyan/40 hover:bg-white/5 cursor-pointer active:scale-[0.98] group">
                <div class="w-12 h-12 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan group-hover:bg-cyan group-hover:text-black transition-all duration-300 flex-shrink-0">
                  ${icons.location}
                </div>
                <div>
                  <span class="text-xs text-gray-500 uppercase tracking-widest font-bold block mb-1">Location</span>
                  <span class="text-[0.95rem] text-white font-medium block group-hover:text-cyan transition-colors">${portfolio.about.location}</span>
                </div>
              </div>

              <div class="p-4 rounded-2xl bg-card/60 border border-border flex items-center gap-4 transition-all duration-300 hover:border-cyan/40 hover:bg-white/5">
                <div class="w-12 h-12 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan flex-shrink-0">
                  ${icons.email}
                </div>
                <div>
                  <span class="text-xs text-gray-500 uppercase tracking-widest font-bold block mb-1">Email</span>
                  <a href="mailto:${portfolio.about.email}" class="text-[0.95rem] text-white font-medium block hover:text-cyan truncate">${portfolio.about.email}</a>
                </div>
              </div>

              <div class="p-4 rounded-2xl bg-card/60 border border-border flex items-center gap-4 transition-all duration-300 hover:border-cyan/40 hover:bg-white/5">
                <div class="w-12 h-12 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan flex-shrink-0">
                  ${icons.education}
                </div>
                <div>
                  <span class="text-xs text-gray-500 uppercase tracking-widest font-bold block mb-1">Education</span>
                  <span class="text-[0.95rem] text-white font-medium block">${portfolio.about.education}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>

    <section id="skills" class="py-24 px-[5%] bg-dark">
      <div id="technologies" class="max-w-7xl mx-auto">
        
        <div class="text-center mb-16">
          <h2 class="font-syne text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold text-white">Skills <span class="text-cyan">&</span> Technologies</h2>
          <span class="text-xs sm:text-sm uppercase tracking-[0.2em] text-cyan/70 font-semibold mt-2 block">My Technical Stack & Tools</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          
          <div class="bg-card/40 border border-border rounded-2xl p-6 sm:p-8 backdrop-blur-sm hover:border-cyan/40 transition-all">
            <h3 class="font-syne text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan"></span>
              Frontend Development
            </h3>
            <div class="flex flex-col gap-5">
              ${portfolio.skills.Frontend.map(s => `
                <div>
                  <div class="flex justify-between text-sm font-semibold mb-2">
                    <span class="text-white">${s.name}</span>
                    <span class="text-cyan">${s.level}%</span>
                  </div>
                  <div class="h-2 w-full bg-dark2 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-cyan to-cyan2 rounded-full" style="width: ${s.level}%;"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="bg-card/40 border border-border rounded-2xl p-6 sm:p-8 backdrop-blur-sm hover:border-cyan/40 transition-all">
            <h3 class="font-syne text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan2"></span>
              Backend & Database
            </h3>
            <div class="flex flex-col gap-5">
              ${portfolio.skills.Backend.map(s => `
                <div>
                  <div class="flex justify-between text-sm font-semibold mb-2">
                    <span class="text-white">${s.name}</span>
                    <span class="text-cyan2">${s.level}%</span>
                  </div>
                  <div class="h-2 w-full bg-dark2 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-cyan2 to-cyan rounded-full" style="width: ${s.level}%;"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="bg-card/40 border border-border rounded-2xl p-6 sm:p-8 backdrop-blur-sm hover:border-cyan/40 transition-all">
            <h3 class="font-syne text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-pink"></span>
              Tools & Digital Marketing
            </h3>
            <div class="flex flex-col gap-5">
              ${portfolio.skills.Tools.map(s => `
                <div>
                  <div class="flex justify-between text-sm font-semibold mb-2">
                    <span class="text-white">${s.name}</span>
                    <span class="text-pink">${s.level}%</span>
                  </div>
                  <div class="h-2 w-full bg-dark2 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-pink to-cyan rounded-full" style="width: ${s.level}%;"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

        <div class="text-center mb-8">
          <h3 class="font-syne text-2xl sm:text-3xl font-bold text-white">Tech <span class="text-cyan">nologies</span></h3>
          <p class="mt-2 text-xs sm:text-sm uppercase tracking-[0.18em] text-gray-500">Core Tools & Platforms</p>
        </div>

        <div class="overflow-hidden py-4 select-none">
          <div class="flex animate-marquee-continuous whitespace-nowrap gap-6 md:gap-8 items-center">
            ${[
              { name: "HTML5", icon: icons.html5 },
              { name: "CSS3", icon: icons.css3 },
              { name: "JavaScript", icon: icons.javascript },
              { name: "PHP", icon: icons.php },
              { name: "Tailwind CSS", icon: icons.tailwind },
              { name: "Figma UI/UX", icon: icons.figma },
              { name: "Google Ads", icon: icons.googleads },
              { name: "Facebook Ads", icon: icons.facebookads },
              { name: "Git & GitHub", icon: icons.github },
              { name: "HTML5", icon: icons.html5 },
              { name: "CSS3", icon: icons.css3 },
              { name: "JavaScript", icon: icons.javascript },
              { name: "PHP", icon: icons.php },
              { name: "Tailwind CSS", icon: icons.tailwind },
              { name: "Figma UI/UX", icon: icons.figma },
              { name: "Google Ads", icon: icons.googleads },
              { name: "Facebook Ads", icon: icons.facebookads },
              { name: "Git & GitHub", icon: icons.github }
            ].map(t => `
              <div class="flex items-center gap-3 px-5 py-3 rounded-2xl bg-card border border-border shadow-md shrink-0">
                <span class="w-6 h-6 flex items-center justify-center">${t.icon}</span>
                <span class="text-sm font-bold text-white">${t.name}</span>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    </section>

    <section id="education" class="overflow-x-hidden bg-dark2 px-[5%] py-24">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="font-syne text-[clamp(2rem,4vw,3rem)] font-extrabold text-white">Education <span class="text-cyan">&</span> Training</h2>
          <p class="text-muted mt-1 text-[0.95rem] font-medium uppercase tracking-[2px]">My Academic & Professional <span class="text-cyan2">Journey</span></p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          <div>
            <h3 class="font-syne text-xl font-bold text-white mb-8 flex items-center gap-3">
              <span class="p-2 rounded-xl bg-cyan/10 text-cyan border border-cyan/20">🎓</span>
              Academic Education
            </h3>
            
            <div class="relative pl-6 border-l-2 border-border flex flex-col gap-10">
              ${portfolio.education.filter(e => e.type === 'education').map(item => `
                <div class="relative group">
                  <div class="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-cyan bg-dark2 transition-all duration-300 group-hover:bg-cyan group-hover:shadow-[0_0_10px_#00d4ff]"></div>
                  
                  <div class="relative overflow-hidden rounded-[16px] border border-border bg-card p-6 transition-all duration-300 hover:border-cyan/40">
                    <div class="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-cyan via-cyan2 to-pink"></div>
                    <div class="mb-2 flex items-center justify-between">
                      <span class="text-[0.85rem] font-semibold text-cyan">${item.period}</span>
                      <span class="text-xs uppercase px-2 py-0.5 rounded-full bg-cyan/10 text-cyan border border-cyan/20">Education</span>
                    </div>
                    <h4 class="font-syne mb-1 text-[1.15rem] font-bold text-white">${item.title}</h4>
                    <p class="mb-3 text-[0.9rem] font-bold text-cyan2">${item.institution}</p>
                    <p class="text-[0.88rem] leading-relaxed text-muted whitespace-pre-line">${item.description.replace(/\\n/g, '<br>')}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div>
            <h3 class="font-syne text-xl font-bold text-white mb-8 flex items-center gap-3">
              <span class="p-2 rounded-xl bg-cyan2/10 text-cyan2 border border-cyan2/20">⚡</span>
              Training & Bootcamps
            </h3>
            
            <div class="relative pl-6 border-l-2 border-border flex flex-col gap-10">
              ${portfolio.education.filter(e => e.type !== 'education').map(item => `
                <div class="relative group">
                  <div class="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-cyan2 bg-dark2 transition-all duration-300 group-hover:bg-cyan2 group-hover:shadow-[0_0_10px_#0fc]"></div>
                  
                  <div class="relative overflow-hidden rounded-[16px] border border-border bg-card p-6 transition-all duration-300 hover:border-cyan2/40">
                    <div class="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-cyan2 via-cyan to-pink"></div>
                    <div class="mb-2 flex items-center justify-between">
                      <span class="text-[0.85rem] font-semibold text-cyan2">${item.period}</span>
                      <span class="text-xs uppercase px-2 py-0.5 rounded-full bg-cyan2/10 text-cyan2 border border-cyan2/20">Training</span>
                    </div>
                    <h4 class="font-syne mb-1 text-[1.15rem] font-bold text-white">${item.title}</h4>
                    <p class="mb-3 text-[0.9rem] font-bold text-cyan">${item.institution}</p>
                    <p class="text-[0.88rem] leading-relaxed text-muted whitespace-pre-line">${item.description.replace(/\\n/g, '<br>')}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>
      </div>
    </section>

    <section id="certificates" class="py-16 sm:py-24 px-4 sm:px-[5%] bg-dark border-t border-border select-none relative overflow-hidden">
      <div class="max-w-[1200px] mx-auto">
        <div class="text-center mb-10 sm:mb-16">
          <span class="inline-flex items-center gap-2 text-[#5b00ff] font-bold text-[0.7rem] sm:text-[0.85rem] uppercase tracking-[2px] sm:tracking-[3px] bg-[rgba(91,0,255,0.08)] px-3 sm:px-4 py-1.5 rounded-full border border-[rgba(91,0,255,0.2)]">
            ${icons.award}
            My Achievements
          </span>
          <h2 class="font-syne text-[1.8rem] sm:text-[clamp(2rem,5vw,3rem)] font-extrabold mt-3 text-white leading-tight">
            Certificates <span class="text-cyan">& Training</span>
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          ${portfolio.certificates.map((c, i) => `
            <div class="rounded-2xl bg-card border border-border overflow-hidden hover:border-cyan/40 transition-all duration-300 flex flex-col group/img">
              <div class="relative w-full h-[200px] sm:h-[220px] bg-neutral-900 overflow-hidden">
                <img src="${c.imageUrl}" alt="${c.title}" class="w-full h-full object-cover object-top transition-transform duration-700 group-hover/img:scale-105">
                <button type="button" onclick="openCertModal(${i})" aria-label="View ${c.title}" class="absolute inset-0 bg-black/65 backdrop-blur-[3px] opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 text-cyan font-bold text-sm cursor-pointer z-20">
                  <div class="p-3 rounded-full bg-cyan/10 border border-cyan/30 shadow-[0_0_15px_rgba(0,212,255,0.25)] transform scale-75 group-hover/img:scale-100 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </div>
                  <span>View Certificate</span>
                </button>
              </div>

              <div class="p-5 flex flex-col flex-grow">
                <span class="text-xs text-cyan font-semibold mb-1">${c.date}</span>
                <h3 class="font-syne text-lg font-bold text-white mb-1">${c.title}</h3>
                <p class="text-sm text-muted mb-4">${c.organization}</p>
                <div class="mt-auto pt-2 flex items-center justify-between border-t border-border/50">
                  <button type="button" onclick="openCertModal(${i})" class="text-xs font-semibold text-cyan hover:underline flex items-center gap-1 cursor-pointer">
                    Preview
                  </button>
                  <a href="${c.documentUrl || c.imageUrl}" target="_blank" rel="noopener noreferrer" class="text-xs text-muted hover:text-white flex items-center gap-1">
                    <span>Full View</span>
                    ${icons.external}
                  </a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <section id="projects" class="py-12 md:py-24 px-4 sm:px-[5%] bg-dark select-none overflow-hidden">
      <div class="max-w-[1200px] mx-auto">
        <div class="text-center mb-10 md:mb-14">
          <h2 class="font-syne text-[clamp(1.8rem,4vw,3rem)] font-extrabold text-white">Featured <span class="text-cyan">Projects</span></h2>
          <p class="text-center text-muted font-medium tracking-[1px] text-[0.85rem] md:text-[0.95rem] uppercase mt-1">
            Built from scratch — <span class="text-cyan2">Hands-on Experience</span>
          </p>
        </div>

        <div id="carousel-stage" class="relative max-w-[1200px] mx-auto min-h-[480px] md:min-h-[580px] flex items-center justify-center carousel-container">
          
          <button id="carousel-prev" class="absolute left-2 sm:left-4 md:left-8 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#5b00ff] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(91,0,255,0.4)] hover:shadow-[0_4px_25px_rgba(91,0,255,0.7)] hover:bg-[#4b00d1] active:scale-90 transition-all duration-300 group cursor-pointer" aria-label="Previous Project">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:-translate-x-0.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.75-7.75"></path></svg>
          </button>

          <div id="carousel-cards-wrapper" class="relative w-[280px] sm:w-[340px] md:w-[380px] h-[450px] md:h-[520px] flex items-center justify-center">
            ${portfolio.projects.map((p, idx) => `
              <div id="proj-card-${idx}" data-idx="${idx}" class="carousel-card absolute w-full h-full pointer-events-auto cursor-pointer">
                <div class="border border-border rounded-[20px] overflow-hidden relative group hover:border-[rgba(0,212,255,0.25)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col h-full bg-[#0b1329]">
                  
                  <div class="h-[160px] sm:h-[200px] md:h-[220px] relative overflow-hidden bg-neutral-950 w-full flex items-center justify-center">
                    <img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                    <div class="absolute top-3 left-3 bg-[rgba(0,212,255,0.12)] border border-[rgba(0,212,255,0.25)] text-cyan w-8 h-8 rounded-lg flex items-center justify-center text-[0.75rem] font-bold backdrop-blur-sm z-10">
                      ${idx + 1 < 10 ? '0' + (idx + 1) : (idx + 1)}
                    </div>
                  </div>

                  <div class="p-4 md:p-[1.4rem] flex flex-col flex-grow">
                    <h3 class="font-syne text-[1rem] md:text-[1.15rem] font-bold mb-1 md:mb-2 text-white text-center line-clamp-1">${p.title}</h3>
                    <p class="text-[0.75rem] md:text-[0.83rem] text-muted leading-[1.5] md:leading-[1.65] mb-3 md:mb-4 line-clamp-3 text-center">${p.desc}</p>
                    
                    <div class="flex flex-wrap justify-center gap-1 mb-4 mt-auto">
                      ${p.tech.slice(0, 4).map(t => `<span class="bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.15)] text-cyan px-2 py-0.5 rounded-full text-[0.62rem] md:text-[0.68rem] font-medium">${t}</span>`).join('')}
                    </div>

                    <div class="flex gap-1.5 md:gap-2">
                      <a href="${p.live}" target="_blank" rel="noopener noreferrer" class="flex-1 px-1 py-2 rounded-lg text-center text-[0.68rem] md:text-[0.78rem] font-semibold bg-gradient-to-br from-cyan to-cyan2 text-black hover:opacity-85 transition-all flex items-center justify-center gap-0.5 sm:gap-1">Live</a>
                      <button type="button" onclick="openProjectModal(${idx})" class="flex-1 px-1 py-2 rounded-lg text-center text-[0.68rem] md:text-[0.78rem] font-semibold bg-[rgba(255,255,255,0.05)] text-text border border-border hover:text-cyan hover:border-[rgba(0,212,255,0.3)] transition-all cursor-pointer">👁 Details</button>
                      <a href="${p.code}" target="_blank" rel="noopener noreferrer" class="flex-1 px-1 py-2 rounded-lg text-center text-[0.68rem] md:text-[0.78rem] font-semibold bg-[rgba(255,255,255,0.05)] text-text border border-border hover:text-pink hover:border-[rgba(255,45,120,0.3)] transition-all flex items-center justify-center gap-0.5 sm:gap-1">&lt;/&gt; Code</a>
                    </div>
                  </div>

                </div>
              </div>
            `).join('')}
          </div>

          <button id="carousel-next" class="absolute right-2 sm:right-4 md:right-8 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#5b00ff] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(91,0,255,0.4)] hover:shadow-[0_4px_25px_rgba(91,0,255,0.7)] hover:bg-[#4b00d1] active:scale-90 transition-all duration-300 group cursor-pointer" aria-label="Next Project">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-0.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"></path></svg>
          </button>
        </div>

        <div id="carousel-dots" class="flex items-center gap-1.5 md:gap-2 justify-center mt-6 md:mt-10">
          ${portfolio.projects.map((_, idx) => `
            <button onclick="setCarouselIndex(${idx})" aria-label="Go to project ${idx + 1}" class="carousel-dot h-2 rounded-full transition-all duration-300 ${idx === 0 ? 'w-5 md:w-7 bg-cyan shadow-[0_0_10px_rgba(0,212,255,0.5)]' : 'w-2 bg-gray-500 hover:bg-gray-400'} cursor-pointer"></button>
          `).join('')}
        </div>

      </div>
    </section>

    <section id="upcoming" class="py-16 sm:py-24 px-[4%] sm:px-[5%] bg-dark border-t border-border select-none relative">
      <div class="max-w-[1200px] mx-auto">
        <div class="text-center mb-12 sm:mb-16">
          <span class="inline-flex items-center gap-2 text-[#5b00ff] font-bold text-[0.75rem] sm:text-[0.85rem] uppercase tracking-[2px] sm:tracking-[3px] bg-[rgba(91,0,255,0.08)] px-3.5 sm:px-4 py-1.5 rounded-full border border-[rgba(91,0,255,0.2)]">
            ${icons.sparkles}
            Next Big Thing
          </span>
          <h2 class="font-syne text-[clamp(1.75rem,5vw,3rem)] font-extrabold mt-3 sm:mt-4 text-white leading-tight">
            Upcoming <span class="text-cyan">Project</span>
          </h2>
        </div>

        <div class="max-w-[850px] mx-auto">
          <div class="bg-card border border-border rounded-[20px] sm:rounded-[24px] overflow-hidden hover:border-cyan/40 transition-all duration-500 shadow-2xl group">
            <div class="w-full h-[220px] sm:h-[350px] md:h-[400px] relative overflow-hidden bg-black/40">
              <img src="/ghurobangla.png" alt="FarmersBD" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
              <div class="absolute inset-0 bg-gradient-to-t from-[#0d1f35] via-transparent to-transparent"></div>
            </div>

            <div class="p-6 sm:p-8 md:p-10">
              <span class="text-xs uppercase font-bold text-cyan tracking-[0.2em] block mb-2">${portfolio.upcoming.tagline}</span>
              <h3 class="font-syne text-2xl sm:text-3xl font-extrabold text-white mb-4">${portfolio.upcoming.title}</h3>
              <p class="text-muted text-sm sm:text-base leading-relaxed mb-6">${portfolio.upcoming.desc}</p>
              
              <div class="mb-6">
                <span class="text-xs uppercase font-bold text-gray-400 tracking-wider block mb-3">Key Features:</span>
                <div class="flex flex-wrap gap-2">
                  ${portfolio.upcoming.features.map(f => `
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan/10 border border-cyan/20 text-cyan">
                      ${icons.sparkles}
                      ${f.name}
                    </span>
                  `).join('')}
                </div>
              </div>

              <div>
                <span class="text-xs uppercase font-bold text-gray-400 tracking-wider block mb-3">Technologies:</span>
                <div class="flex flex-wrap gap-2">
                  ${portfolio.upcoming.tech.map(t => `
                    <span class="px-3 py-1 rounded-lg text-xs font-semibold bg-white/5 border border-border text-white">
                      ${t}
                    </span>
                  `).join('')}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="comments" class="w-full py-20 sm:py-24 bg-dark2 overflow-hidden border-t border-border">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div class="text-center mb-12">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </div>
          <p class="text-blue-400 text-sm font-semibold uppercase tracking-wider">Community</p>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-2 font-syne">Leave a Comment</h2>
          <p class="text-zinc-400 mt-4 text-sm sm:text-base">Have something to say? Drop a comment below. I may personally reply to you.</p>
        </div>

        <form id="comment-form" class="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 sm:p-7 lg:p-8 shadow-2xl mb-12">
          <div class="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label for="comm-name" class="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Your Name *</label>
              <input id="comm-name" required maxlength="60" placeholder="e.g. John Doe" class="w-full bg-zinc-800/80 border border-zinc-700/80 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan">
            </div>
            <div>
              <label for="comm-rel" class="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Relation / Connection *</label>
              <input id="comm-rel" required maxlength="60" placeholder="e.g. Colleague, Friend, Visitor" class="w-full bg-zinc-800/80 border border-zinc-700/80 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan">
            </div>
          </div>
          <div class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <label for="comm-msg" class="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">Your Message *</label>
              <span id="comm-char-count" class="text-xs text-zinc-500">0/1000</span>
            </div>
            <textarea id="comm-msg" required maxlength="1000" rows="4" placeholder="Write your thoughts, feedback or greetings..." class="w-full bg-zinc-800/80 border border-zinc-700/80 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-cyan"></textarea>
          </div>
          <div class="flex items-center justify-between">
            <button type="submit" id="comm-submit-btn" class="bg-gradient-to-r from-blue-500 to-cyan text-black font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all cursor-pointer">
              Post Comment
            </button>
            <span id="comm-status" class="text-sm font-medium"></span>
          </div>
        </form>

        <div class="flex flex-col gap-4" id="comments-list">
          ${portfolio.comments.map(c => `
            <div class="bg-card border border-border rounded-2xl p-5 sm:p-6 transition-all hover:border-cyan/30">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-cyan to-cyan2 text-black font-bold flex items-center justify-center text-sm">
                    ${c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 class="font-bold text-white text-sm sm:text-base">${c.name}</h4>
                    <span class="text-xs px-2 py-0.5 rounded-full bg-cyan/10 text-cyan border border-cyan/20">${c.relation}</span>
                  </div>
                </div>
                <span class="text-xs text-muted">${new Date(c.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              <p class="text-sm sm:text-base text-zinc-300 pl-13 mb-3 leading-relaxed">${c.message}</p>
              
              ${c.reply ? `
                <div class="ml-10 mt-3 p-4 rounded-xl bg-dark border border-border/60">
                  <div class="flex items-center gap-2 text-xs font-bold text-cyan mb-1">
                    <span>${portfolio.hero.name} (Author)</span>
                    <span class="px-1.5 py-0.2 bg-cyan/10 rounded">Reply</span>
                  </div>
                  <p class="text-xs sm:text-sm text-zinc-300">${c.reply}</p>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>

      </div>
    </section>

    <section id="contact" class="py-24 px-[5%] bg-dark relative">
      <div class="max-w-6xl mx-auto">
        
        <div class="text-center mb-16">
          <h2 class="font-syne text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold text-white">Get in <span class="text-cyan">Touch</span></h2>
          <span class="text-xs sm:text-sm uppercase tracking-[0.2em] text-cyan/70 font-semibold mt-2 block">Connect With Me</span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div class="lg:col-span-5 flex flex-col gap-5">
            <h3 class="font-syne text-xl font-bold text-white mb-2">Let's build something remarkable!</h3>
            <p class="text-muted leading-relaxed text-sm sm:text-base mb-4">
              Feel free to get in touch with me. I am currently open to full stack development roles, internships, freelance projects, and collaboration opportunities.
            </p>

            <div class="p-5 rounded-2xl bg-card border border-border flex items-center gap-4 hover:border-cyan/40 transition-all group">
              <div class="w-12 h-12 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan group-hover:bg-cyan group-hover:text-black transition-all">
                ${icons.email}
              </div>
              <div class="overflow-hidden">
                <span class="text-xs text-gray-500 uppercase font-bold tracking-wider block mb-1">Email Me</span>
                <a href="mailto:${portfolio.hero.email}" class="text-sm sm:text-base text-white font-medium hover:text-cyan truncate block transition-colors">${portfolio.hero.email}</a>
              </div>
            </div>

            <div class="p-5 rounded-2xl bg-card border border-border flex items-center gap-4 hover:border-cyan/40 transition-all group">
              <div class="w-12 h-12 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan group-hover:bg-cyan group-hover:text-black transition-all">
                ${icons.phone}
              </div>
              <div>
                <span class="text-xs text-gray-500 uppercase font-bold tracking-wider block mb-1">Call Me</span>
                <a href="tel:${portfolio.hero.phone.replace(/[^+\\d]/g, '')}" class="text-sm sm:text-base text-white font-medium hover:text-cyan block transition-colors">${portfolio.hero.phone}</a>
              </div>
            </div>

            <div onclick="openMapModal()" class="p-5 rounded-2xl bg-card border border-border flex items-center gap-4 hover:border-cyan/40 transition-all group cursor-pointer active:scale-95">
              <div class="w-12 h-12 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan group-hover:bg-cyan group-hover:text-black transition-all">
                ${icons.location}
              </div>
              <div>
                <span class="text-xs text-gray-500 uppercase font-bold tracking-wider block mb-1">Location</span>
                <span class="text-sm sm:text-base text-white font-medium group-hover:text-cyan block transition-colors">${portfolio.hero.location}</span>
              </div>
            </div>

          </div>

          <div class="lg:col-span-7">
            <form id="contact-form" class="bg-card/70 border border-border rounded-3xl p-6 sm:p-8 backdrop-blur-md flex flex-col gap-5">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="contact-name" class="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Your Name *</label>
                  <input id="contact-name" required placeholder="Your Name" class="w-full bg-dark2 border border-border rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-cyan">
                </div>
                <div>
                  <label for="contact-email" class="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Email Address *</label>
                  <input id="contact-email" type="email" required placeholder="name@example.com" class="w-full bg-dark2 border border-border rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-cyan">
                </div>
              </div>

              <div>
                <label for="contact-subject" class="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Subject *</label>
                <input id="contact-subject" required placeholder="Job Opportunity / Project Inquiry" class="w-full bg-dark2 border border-border rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-cyan">
              </div>

              <div>
                <label for="contact-msg" class="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Your Message *</label>
                <textarea id="contact-msg" required rows="5" placeholder="Hi Sahabul, I'd like to talk about..." class="w-full bg-dark2 border border-border rounded-xl p-4 text-white text-sm focus:outline-none focus:border-cyan resize-y"></textarea>
              </div>

              <div class="flex items-center justify-between mt-2">
                <button type="submit" id="contact-send-btn" class="bg-gradient-to-br from-cyan to-cyan2 text-black font-bold px-8 py-3.5 rounded-full flex items-center gap-2 hover:opacity-90 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all cursor-pointer">
                  ${icons.send}
                  <span>Send Message</span>
                </button>
                <span id="contact-status" class="text-sm font-semibold"></span>
              </div>
            </form>
          </div>

        </div>

      </div>
    </section>

  </main>

  <footer class="relative bg-dark3 border-t border-border pt-12 pb-8 px-[5%] overflow-hidden">
    <video autoplay loop muted playsinline class="absolute top-0 left-0 w-full h-full object-cover z-0 pointer-events-none">
      <source src="/footer.mp4" type="video/mp4">
    </video>
    <div class="absolute top-0 left-0 w-full h-full bg-black/60 z-10 pointer-events-none"></div>

    <div class="relative z-20 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] gap-10 md:gap-8 mb-10 text-center sm:text-left">
      <div class="flex flex-col items-center sm:items-start col-span-1 sm:col-span-2 lg:col-span-1">
        <a href="#home" class="font-syne font-extrabold text-[1.5rem] text-cyan tracking-[-1px] no-underline block mb-3">
          &lt;<span class="text-white">Sahabul</span> Asraf/&gt;
        </a>
        <p class="text-[0.85rem] md:text-[0.82rem] text-muted leading-[1.65] max-w-[280px] sm:max-w-[340px] lg:max-w-[240px]">
          Full Stack Web Developer passionate about building user-focused web applications and functional digital designs.
        </p>
        <div class="flex gap-4 mt-5 sm:mt-4">
          <a href="${portfolio.hero.github}" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted hover:text-cyan hover:border-cyan transition-all">
            ${icons.github}
          </a>
          <a href="${portfolio.hero.linkedin}" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted hover:text-cyan hover:border-cyan transition-all">
            ${icons.linkedin}
          </a>
          <a href="${portfolio.hero.facebook}" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted hover:text-cyan hover:border-cyan transition-all">
            ${icons.facebook}
          </a>
        </div>
      </div>

      <div>
        <h4 class="font-syne font-bold text-white text-base mb-4 uppercase tracking-wider">Quick Links</h4>
        <div class="flex flex-col gap-2">
          <a href="#about" class="text-sm text-muted hover:text-cyan transition-colors">About Me</a>
          <a href="#skills" class="text-sm text-muted hover:text-cyan transition-colors">Skills</a>
          <a href="#projects" class="text-sm text-muted hover:text-cyan transition-colors">Projects</a>
          <a href="#certificates" class="text-sm text-muted hover:text-cyan transition-colors">Training & Certs</a>
          <a href="#contact" class="text-sm text-muted hover:text-cyan transition-colors">Contact</a>
        </div>
      </div>

      <div>
        <h4 class="font-syne font-bold text-white text-base mb-4 uppercase tracking-wider">Get in Touch</h4>
        <div class="flex flex-col gap-2 text-sm text-muted">
          <a href="mailto:${portfolio.hero.email}" class="hover:text-cyan transition-colors">${portfolio.hero.email}</a>
          <a href="tel:${portfolio.hero.phone.replace(/[^+\\d]/g, '')}" class="hover:text-cyan transition-colors">${portfolio.hero.phone}</a>
          <span>${portfolio.hero.location}</span>
        </div>
      </div>
    </div>

    <div class="relative z-20 border-t border-border/40 pt-6 text-center text-xs text-muted">
      <p>© 2026 Sahabul Ahmed Asraf. All rights reserved.</p>
    </div>
  </footer>

  <div id="map-modal" class="fixed inset-0 bg-black/70 z-[99999] flex flex-col items-center justify-center pointer-events-auto backdrop-blur-md hidden transition-opacity duration-300">
    <div class="relative p-6 flex flex-col items-center">
      <button onclick="closeMapModal()" class="absolute -top-12 right-0 text-white hover:text-cyan text-2xl font-bold bg-white/10 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer">✕</button>
      
      <div class="map-btn-wrapper cursor-pointer" onclick="window.open('https://www.google.com/maps/search/?api=1&query=Mirpur%2010%2C%20Dhaka%2C%20Bangladesh', '_blank')">
        <svg height="0" width="0">
          <filter id="land">
            <feTurbulence result="turb" numOctaves="7" baseFrequency="0.006" type="fractalNoise"></feTurbulence>
            <feDisplacementMap yChannelSelector="G" xChannelSelector="R" scale="700" in="SourceGraphic" in2="turb"></feDisplacementMap>
          </filter>
        </svg>
        <div class="map-btn animated-state">Mirpur 10, Dhaka</div>
        <div class="pinpoint animated-state"></div>
        <div class="map-container animated-state">
          <div class="map fold-1"></div>
          <div class="map fold-2"></div>
          <div class="map fold-3"></div>
          <div class="map fold-4"></div>
        </div>
      </div>
      <p class="text-xs text-cyan mt-4 font-mono">Mirpur 10, Dhaka, Bangladesh • Click to open in Google Maps</p>
    </div>
  </div>

  <div id="project-modal" class="fixed inset-0 bg-[rgba(3,11,24,0.88)] z-[9990] flex items-center justify-center p-3 sm:p-4 md:p-8 backdrop-blur-md hidden">
    <div class="bg-[#0b1329] border border-border rounded-[20px] md:rounded-[24px] w-full max-w-[720px] max-h-[92vh] overflow-y-auto relative shadow-2xl">
      <button onclick="closeProjectModal()" class="absolute top-3 right-3 md:top-4 md:right-4 bg-[rgba(255,255,255,0.1)] backdrop-blur-sm border border-border text-text w-9 h-9 rounded-full text-base flex items-center justify-center transition-all z-[10] hover:border-pink hover:text-pink cursor-pointer">✕</button>
      
      <div class="w-full h-[180px] sm:h-[260px] md:h-[340px] relative bg-neutral-950 flex items-center justify-center p-4">
        <img id="proj-modal-img" src="" alt="Project Preview" class="w-full h-full object-cover">
      </div>

      <div class="p-6 md:p-8">
        <h2 id="proj-modal-title" class="font-syne text-[1.3rem] md:text-[1.6rem] font-extrabold mb-3 text-white"></h2>
        
        <div id="proj-modal-tech" class="flex flex-wrap gap-1.5 mb-5"></div>

        <p id="proj-modal-desc" class="text-muted leading-relaxed mb-6 text-sm md:text-base"></p>

        <div id="proj-modal-challenges-box" class="mb-5">
          <h4 class="text-xs font-bold text-cyan uppercase tracking-wider mb-1.5">⚡ Key Challenges</h4>
          <p id="proj-modal-challenges" class="text-muted text-sm leading-relaxed"></p>
        </div>

        <div id="proj-modal-improvements-box" class="mb-6">
          <h4 class="text-xs font-bold text-cyan uppercase tracking-wider mb-1.5">🚀 Planned Future Enhancements</h4>
          <p id="proj-modal-improvements" class="text-muted text-sm leading-relaxed"></p>
        </div>

        <div class="flex gap-3 flex-wrap pt-4 border-t border-border">
          <a id="proj-modal-live" href="#" target="_blank" rel="noopener noreferrer" class="px-6 py-2.5 rounded-xl font-bold bg-gradient-to-br from-cyan to-cyan2 text-black hover:opacity-90 flex items-center gap-2">
            <span>Live Demo</span>
            ${icons.external}
          </a>
          <a id="proj-modal-code" href="#" target="_blank" rel="noopener noreferrer" class="px-6 py-2.5 rounded-xl font-bold bg-white/5 border border-border text-white hover:text-pink hover:border-pink flex items-center gap-2">
            <span>&lt;/&gt; Source Code</span>
          </a>
        </div>
      </div>
    </div>
  </div>

  <div id="cert-modal" class="fixed inset-0 bg-black/85 z-[9999] flex items-center justify-center p-4 backdrop-blur-md hidden">
    <div class="relative max-w-3xl w-full bg-[#0b1329] border border-border rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6">
      <button onclick="closeCertModal()" class="absolute top-4 right-4 text-white hover:text-cyan text-xl font-bold bg-white/10 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer z-10">✕</button>
      <div class="w-full max-h-[70vh] flex items-center justify-center overflow-hidden rounded-xl bg-black/40 mb-4">
        <img id="cert-modal-img" src="" alt="Certificate" class="max-h-[70vh] w-auto object-contain">
      </div>
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 id="cert-modal-title" class="font-syne text-lg font-bold text-white"></h3>
          <p id="cert-modal-org" class="text-sm text-cyan"></p>
        </div>
        <a id="cert-modal-doc" href="#" target="_blank" rel="noopener noreferrer" class="px-5 py-2 rounded-xl text-xs font-bold bg-cyan text-black hover:opacity-90 flex items-center gap-1.5">
          <span>Open Full Document</span>
          ${icons.external}
        </a>
      </div>
    </div>
  </div>

  <script>
    const PORTFOLIO_DATA = ${JSON.stringify(portfolio)};

    (function initParticles() {
      const canvas = document.getElementById('particles');
      const ctx = canvas.getContext('2d');
      let w = canvas.width = window.innerWidth;
      let h = canvas.height = window.innerHeight;

      window.addEventListener('resize', () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
      });

      const particles = Array.from({ length: 60 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1.5 * Math.random() + 0.5
      }));

      function render() {
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
          ctx.fillStyle = 'rgba(0, 212, 255, 0.6)';
          ctx.fill();

          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = 'rgba(0, 212, 255, ' + (0.15 * (1 - dist / 120)) + ')';
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
        requestAnimationFrame(render);
      }
      render();
    })();

    window.addEventListener('scroll', () => {
      const nav = document.getElementById('navbar');
      if (window.scrollY > 50) {
        nav.classList.add('bg-[rgba(3,11,24,0.98)]', 'shadow-lg');
        nav.classList.remove('bg-[rgba(3,11,24,0.85)]');
      } else {
        nav.classList.add('bg-[rgba(3,11,24,0.85)]');
        nav.classList.remove('bg-[rgba(3,11,24,0.98)]', 'shadow-lg');
      }
    });

    const burgerBtn = document.getElementById('burger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    let menuOpen = false;

    function toggleMobileMenu(open) {
      menuOpen = typeof open === 'boolean' ? open : !menuOpen;
      const bars = burgerBtn.querySelectorAll('.burger-bar');
      if (menuOpen) {
        mobileMenu.classList.remove('hidden');
        setTimeout(() => {
          mobileMenu.classList.add('opacity-100', 'translate-y-0');
          mobileMenu.classList.remove('opacity-0', '-translate-y-2');
        }, 10);
        bars[0].classList.add('rotate-45', 'translate-y-[7px]');
        bars[1].classList.add('opacity-0');
        bars[2].classList.add('-rotate-45', '-translate-y-[7px]');
      } else {
        mobileMenu.classList.add('opacity-0', '-translate-y-2');
        mobileMenu.classList.remove('opacity-100', 'translate-y-0');
        setTimeout(() => mobileMenu.classList.add('hidden'), 300);
        bars[0].classList.remove('rotate-45', 'translate-y-[7px]');
        bars[1].classList.remove('opacity-0');
        bars[2].classList.remove('-rotate-45', '-translate-y-[7px]');
      }
    }
    burgerBtn.addEventListener('click', () => toggleMobileMenu());
    document.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', () => toggleMobileMenu(false)));

    (function initTyping() {
      const roles = PORTFOLIO_DATA.hero.roles;
      let rIdx = 0, charIdx = 0, isDeleting = false;
      const el = document.getElementById('typed-text');

      function tick() {
        const curRole = roles[rIdx];
        el.className = curRole.color;
        if (isDeleting) {
          charIdx--;
          el.textContent = curRole.text.substring(0, charIdx);
        } else {
          charIdx++;
          el.textContent = curRole.text.substring(0, charIdx);
        }

        let speed = isDeleting ? 40 : 80;
        if (!isDeleting && charIdx === curRole.text.length) {
          isDeleting = true;
          speed = 1800;
        } else if (isDeleting && charIdx === 0) {
          isDeleting = false;
          rIdx = (rIdx + 1) % roles.length;
          speed = 300;
        }
        setTimeout(tick, speed);
      }
      tick();
    })();

    (function initOrbit() {
      const orbits = [
        { ring: 1, angle: 0 },
        { ring: 1, angle: Math.PI / 2 },
        { ring: 1, angle: Math.PI },
        { ring: 1, angle: 3 * Math.PI / 2 },
        { ring: 2, angle: 0 },
        { ring: 2, angle: 2 * Math.PI / 5 },
        { ring: 2, angle: 4 * Math.PI / 5 },
        { ring: 2, angle: 6 * Math.PI / 5 },
        { ring: 2, angle: 8 * Math.PI / 5 }
      ];
      const radii = { 1: 155, 2: 190 };
      const nodes = Array.from({ length: 9 }, (_, i) => document.getElementById('orbit-node-' + i));

      function animate() {
        const now = Date.now() / 1000;
        orbits.forEach((orb, i) => {
          const node = nodes[i];
          if (!node) return;
          const speed = orb.ring === 1 ? 0.6 : 0.4;
          const dir = orb.ring === 2 ? -1 : 1;
          const theta = orb.angle + now * speed * dir;
          const r = radii[orb.ring];
          const x = r * Math.cos(theta) - 26;
          const y = r * Math.sin(theta) - 26;
          node.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
        });
        requestAnimationFrame(animate);
      }
      animate();
    })();

    document.getElementById('hero-work-btn').addEventListener('click', function(e) {
      e.preventDefault();
      this.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span> <span>Loading Projects...</span>';
      setTimeout(() => {
        this.innerHTML = '<span>View My Work</span>';
        document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
      }, 700);
    });

    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        statObserver.unobserve(entry.target);
        const el = entry.target;
        const target = parseInt(el.dataset.value) || 0;
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current + suffix;
        }, 25);
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.stat-number').forEach(s => statObserver.observe(s));

    let currentProjIdx = 0;
    const totalProjects = PORTFOLIO_DATA.projects.length;
    let isCarouselHovered = false;

    function updateCarousel() {
      const isMobile = window.innerWidth < 768;
      const cards = document.querySelectorAll('.carousel-card');
      const dots = document.querySelectorAll('.carousel-dot');

      cards.forEach((card, idx) => {
        let diff = idx - currentProjIdx;
        if (diff < -totalProjects / 2) diff += totalProjects;
        if (diff > totalProjects / 2) diff -= totalProjects;

        const isCurrent = diff === 0;
        const dist = Math.abs(diff);

        if (dist > 2) {
          card.style.opacity = '0';
          card.style.pointerEvents = 'none';
          card.style.transform = 'translateX(0) scale(0.5)';
          card.style.zIndex = '0';
          return;
        }

        const translateX = diff * (isMobile ? 55 : 120);
        const rotateY = diff * (isMobile ? -8 : -14);
        const scale = isCurrent ? 1 : (isMobile ? 0.75 : 0.85) - 0.05 * dist;
        const opacity = isCurrent ? 1 : (isMobile ? 0.45 : 0.65) / dist;
        const filter = isCurrent ? 'none' : ('grayscale(40%) blur(' + (0.5 * dist) + 'px)');

        card.style.opacity = opacity;
        card.style.pointerEvents = isCurrent ? 'auto' : 'none';
        card.style.transform = 'translateX(' + translateX + 'px) scale(' + scale + ') rotateY(' + rotateY + 'deg)';
        card.style.zIndex = 50 - dist;
        card.style.filter = filter;
      });

      dots.forEach((dot, idx) => {
        if (idx === currentProjIdx) {
          dot.className = 'carousel-dot h-2 rounded-full transition-all duration-300 w-5 md:w-7 bg-cyan shadow-[0_0_10px_rgba(0,212,255,0.5)] cursor-pointer';
        } else {
          dot.className = 'carousel-dot h-2 rounded-full transition-all duration-300 w-2 bg-gray-500 hover:bg-gray-400 cursor-pointer';
        }
      });
    }

    function nextProject() {
      currentProjIdx = (currentProjIdx + 1) % totalProjects;
      updateCarousel();
    }
    function prevProject() {
      currentProjIdx = (currentProjIdx - 1 + totalProjects) % totalProjects;
      updateCarousel();
    }
    function setCarouselIndex(idx) {
      currentProjIdx = idx;
      updateCarousel();
    }

    document.getElementById('carousel-next').addEventListener('click', nextProject);
    document.getElementById('carousel-prev').addEventListener('click', prevProject);

    const stage = document.getElementById('carousel-stage');
    stage.addEventListener('mouseenter', () => { isCarouselHovered = true; });
    stage.addEventListener('mouseleave', () => { isCarouselHovered = false; });

    setInterval(() => {
      if (!isCarouselHovered && !document.getElementById('project-modal').classList.contains('flex')) {
        nextProject();
      }
    }, 3500);

    window.addEventListener('resize', updateCarousel);
    updateCarousel();

    function openProjectModal(idx) {
      const p = PORTFOLIO_DATA.projects[idx];
      if (!p) return;
      document.getElementById('proj-modal-img').src = p.image;
      document.getElementById('proj-modal-title').textContent = p.title;
      document.getElementById('proj-modal-desc').textContent = p.desc;
      
      const techBox = document.getElementById('proj-modal-tech');
      techBox.innerHTML = p.tech.map(t => '<span class="bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.15)] text-cyan px-2.5 py-0.5 rounded-full text-xs font-medium">' + t + '</span>').join('');

      document.getElementById('proj-modal-challenges').textContent = p.challenges || 'Ensuring responsive performance and state reliability.';
      document.getElementById('proj-modal-improvements').textContent = p.improvements || 'Planned feature enhancements and automated testing.';

      document.getElementById('proj-modal-live').href = p.live;
      document.getElementById('proj-modal-code').href = p.code;

      const modal = document.getElementById('project-modal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    }
    function closeProjectModal() {
      const modal = document.getElementById('project-modal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }
    document.getElementById('project-modal').addEventListener('click', function(e) {
      if (e.target === this) closeProjectModal();
    });

    function openCertModal(idx) {
      const c = PORTFOLIO_DATA.certificates[idx];
      if (!c) return;
      document.getElementById('cert-modal-img').src = c.imageUrl;
      document.getElementById('cert-modal-title').textContent = c.title;
      document.getElementById('cert-modal-org').textContent = c.organization + ' (' + c.date + ')';
      
      const docLink = document.getElementById('cert-modal-doc');
      docLink.href = c.documentUrl || c.imageUrl;
      docLink.classList.remove('hidden');

      const modal = document.getElementById('cert-modal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    }
    function closeCertModal() {
      const modal = document.getElementById('cert-modal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }
    document.getElementById('cert-modal').addEventListener('click', function(e) {
      if (e.target === this) closeCertModal();
    });

    function openMapModal() {
      const modal = document.getElementById('map-modal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    }
    function closeMapModal() {
      const modal = document.getElementById('map-modal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }
    document.getElementById('map-modal').addEventListener('click', function(e) {
      if (e.target === this) closeMapModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeProjectModal();
        closeCertModal();
        closeMapModal();
      }
    });

    const commMsg = document.getElementById('comm-msg');
    const commCharCount = document.getElementById('comm-char-count');
    commMsg.addEventListener('input', () => {
      commCharCount.textContent = commMsg.value.length + '/1000';
    });

    document.getElementById('comment-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('comm-name').value.trim();
      const relation = document.getElementById('comm-rel').value.trim();
      const message = commMsg.value.trim();
      const status = document.getElementById('comm-status');

      if (!name || !relation || !message) return;

      const list = document.getElementById('comments-list');
      const item = document.createElement('div');
      item.className = 'bg-card border border-cyan/40 rounded-2xl p-5 sm:p-6 transition-all shadow-[0_0_20px_rgba(0,212,255,0.15)] animate-slideInRight';
      item.innerHTML = '<div class="flex items-center justify-between mb-3"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-gradient-to-br from-cyan to-cyan2 text-black font-bold flex items-center justify-center text-sm">' + name.charAt(0).toUpperCase() + '</div><div><h4 class="font-bold text-white text-sm sm:text-base">' + name + '</h4><span class="text-xs px-2 py-0.5 rounded-full bg-cyan/10 text-cyan border border-cyan/20">' + relation + '</span></div></div><span class="text-xs text-cyan font-semibold">Just now</span></div><p class="text-sm sm:text-base text-zinc-300 pl-13 mb-3 leading-relaxed">' + message + '</p>';
      list.prepend(item);

      status.className = 'text-sm font-semibold text-green-400';
      status.textContent = 'Your comment has been posted successfully!';
      this.reset();
      commCharCount.textContent = '0/1000';

      setTimeout(() => { status.textContent = ''; }, 4000);
    });

    document.getElementById('contact-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = document.getElementById('contact-send-btn');
      const status = document.getElementById('contact-status');
      
      btn.disabled = true;
      btn.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span> <span>Sending...</span>';
      
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = '${icons.send} <span>Send Message</span>';
        status.className = 'text-sm font-semibold text-green-400';
        status.textContent = 'Thank you! Your message has been sent.';
        this.reset();
        setTimeout(() => { status.textContent = ''; }, 5000);
      }, 1000);
    });
  </script>

</body>
</html>
`;

fs.writeFileSync(targetFile, html, 'utf8');
console.log('✓ Successfully compiled index.html from portfolio-data.json!');
