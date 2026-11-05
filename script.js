/**
 * DENNIS OS • ULTIMATE EDITION
 * Created exclusively for Dennis.
 */

// Web Audio Synthesizer (UI SFX) & Global Audio Analyzer Setup
class SoundFX {
    constructor() { 
        this.ctx = null; 
        this.analyser = null;
        this.dataArray = null;
        this.source = null;
    }
    init() { 
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }
    setupAudioAnalyser(audioElement) {
        this.init();
        if (!this.analyser && this.ctx) {
            try {
                this.analyser = this.ctx.createAnalyser();
                this.analyser.fftSize = 64;
                this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
                this.source = this.ctx.createMediaElementSource(audioElement);
                this.source.connect(this.analyser);
                this.analyser.connect(this.ctx.destination);
            } catch(e) {
                console.log("Audio node connection managed or already connected.", e);
            }
        }
    }
    getAudioEnergy() {
        if (!this.analyser || !this.dataArray) return 0;
        this.analyser.getByteFrequencyData(this.dataArray);
        let sum = 0;
        for (let i = 0; i < this.dataArray.length; i++) {
            sum += this.dataArray[i];
        }
        return sum / this.dataArray.length;
    }
    playTone(freq, type = 'sine', duration = 0.15) {
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch(e){}
    }
    click() { this.playTone(850, 'sine', 0.08); }
    starUnlock() {
        this.playTone(523.25, 'triangle', 0.12);
        setTimeout(() => this.playTone(659.25, 'triangle', 0.12), 90);
        setTimeout(() => this.playTone(783.99, 'triangle', 0.22), 180);
    }
    win() {
        this.playTone(440, 'sine', 0.1);
        setTimeout(() => this.playTone(554.37, 'sine', 0.1), 90);
        setTimeout(() => this.playTone(659.25, 'sine', 0.3), 180);
    }
}
const sfx = new SoundFX();

// OS State
const state = {
    unlocked: false,
    theme: 'dark', // 'dark' or 'rose'
    anniversaryStartDate: new Date('2026-10-05T00:00:00'),
    audioPlaying: false,
    customConstMode: false,
    poemText: `Princesa Dennis,\n\nHoy cumplimos nuestro primer mes oficial de novios.\nDesde el momento en que entraste en mi vida,\nel universo entero cobró un nuevo sentido.\n\nGracias por cada risa compartida, por cada abrazo reconfortante,\npor tus palabras dulces y por ser la mejor novia del mundo.\nEres mi refugio, mi sueño hecho realidad y mi mayor tesoro.\n\nEste Dennis OS es solo una pequeña muestra del amor infinito que te tengo.\nFeliz 1er Mes, Mi Novia Hermosa.`,
    constellations: [
        { id: 1, name: "Corazón", quote: "Tu amor es la razón principal de mi felicidad, Dennis.", x: 20, y: 30 },
        { id: 2, name: "Promesa", quote: "Prometo cuidar tu corazón hoy y siempre, Princesa.", x: 35, y: 15 },
        { id: 3, name: "Canción", quote: "Nuestra melodía favorita siempre suena cuando pienso en ti.", x: 50, y: 35 },
        { id: 4, name: "Abrazo", quote: "Tus abrazos son mi lugar seguro en el mundo.", x: 70, y: 20 },
        { id: 5, name: "Sonrisa", quote: "Verte sonreír me alegra la vida en un instante.", x: 80, y: 45 },
        { id: 6, name: "Destino", quote: "El destino nos unió para escribir una hermosa historia.", x: 15, y: 65 },
        { id: 7, name: "Infinito", quote: "Un mes de novios es solo el comienzo de nuestra eternidad.", x: 30, y: 80 },
        { id: 8, name: "Mirada", quote: "En tus ojitos hermosos veo mi futuro entero.", x: 50, y: 60 },
        { id: 9, name: "Futuro", quote: "Sueño con vivir mil aventuras más a tu lado, Mi Amor.", x: 75, y: 75 },
        { id: 10, name: "Dulzura", quote: "Tu ternura alegra hasta el día más complicado.", x: 85, y: 85 },
        { id: 11, name: "Cómplice", quote: "Mi mejor amiga, mi novia y mi compañía eterna.", x: 40, y: 45 },
        { id: 12, name: "Refugio", quote: "En tus brazos siempre encuentro mi lugar favorito.", x: 60, y: 85 },
        { id: 13, name: "Magia", quote: "Lo que sentimos desafía cualquier explicación lógica.", x: 10, y: 45 },
        { id: 14, name: "Tesoro", quote: "Eres el regalo más lindo que la vida me regaló.", x: 65, y: 40 },
        { id: 15, name: "Eternidad", quote: "Te amo hoy, mañana y siempre, Mi Princesa Dennis.", x: 90, y: 25 }
    ],
    unlockedConstellations: new Set(),
    memories: [
        { id: 1, title: "Nuestra Primera Cita", date: "25 Septiembre 2026", cat: "citas", desc: "El día oficial en que decidimos caminar juntos como novios." },
        { id: 2, title: "Detalle Especial", date: "02 Octubre 2026", cat: "detalles", desc: "Tu carita de alegría al recibir el detalle me enamoró aún más." },
        { id: 3, title: "Noche de Pláticas", date: "12 Octubre 2026", cat: "citas", desc: "Horas conversando y soñando sobre nuestro futuro juntos." },
        { id: 4, title: "Promesa de Amor", date: "20 Octubre 2026", cat: "promesas", desc: "Siempre tomados de la mano, apoyándonos en todo." },
        { id: 5, title: "Nuestro 1er Mes", date: "25 Octubre 2026", cat: "detalles", desc: "Celebramos nuestro primer hito hermoso. Te amo Dennis." }
    ],
    compliments: [
        "Eres la novia más hermosa e increíble de todo el universo.",
        "Tu sonrisa tiene el poder de iluminar mi vida entera, Dennis.",
        "Amo la dulzura con la que me hablas y la paz que me transmites.",
        "Cada momento a tu lado se convierte en un recuerdo inolvidable.",
        "Eres mi sueño hecho realidad, Princesa.",
        "Tienes el corazón más noble, puro y hermoso que existe.",
        "Gracias por hacer de mi vida un lugar lleno de felicidad."
    ],
    fortunes: [
        "🥠 El destino dice: Tu amor con tu novio durará infinitas galaxias.",
        "🥠 Mensaje de la fortuna: Te espera un futuro lleno de risas y besos junto a tu novio.",
        "🥠 Revelación dulce: Tu novio sonreirá hoy al recordar lo mucho que lo amas."
    ]
};

// CANVAS BACKGROUND MULTI-LAYER ENGINE
const bgCanvas = document.getElementById('bgCanvas');
const bgCtx = bgCanvas.getContext('2d');
const fxCanvas = document.getElementById('fxCanvas');
const fxCtx = fxCanvas.getContext('2d');

let width, height;
let stars = [];
let shootingStars = [];
let cursorParticles = [];

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    bgCanvas.width = width;
    bgCanvas.height = height;
    fxCanvas.width = width;
    fxCanvas.height = height;
    initStars();
}
window.addEventListener('resize', resizeCanvas);

function initStars() {
    stars = [];
    for (let i = 0; i < 160; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            baseSize: Math.random() * 2.2,
            size: Math.random() * 2.2,
            alpha: Math.random(),
            speed: Math.random() * 0.02 + 0.005
        });
    }
}

window.addEventListener('mousemove', (e) => {
    if (!state.unlocked) return;
    for (let i = 0; i < 2; i++) {
        cursorParticles.push({
            x: e.clientX,
            y: e.clientY,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 4 + 2,
            color: state.theme === 'dark' ? '#ff007f' : '#ff758f',
            alpha: 1
        });
    }
});

window.addEventListener('click', (e) => {
    if (!state.unlocked) return;
    for (let i = 0; i < 8; i++) {
        cursorParticles.push({
            x: e.clientX,
            y: e.clientY,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            size: Math.random() * 6 + 3,
            color: '#ffd700',
            alpha: 1
        });
    }
});

function animateCanvas() {
    bgCtx.clearRect(0, 0, width, height);

    const audioEnergy = (state.audioPlaying && sfx.analyser) ? sfx.getAudioEnergy() : 0;
    const energyNorm = audioEnergy / 255;

    const baseNebulaRadius = 450;
    const dynamicRadius = baseNebulaRadius + (energyNorm * 200);
    const nebulaAlpha = state.theme === 'dark' 
        ? 0.18 + (energyNorm * 0.25) 
        : 0.25 + (energyNorm * 0.2);

    const grad1 = bgCtx.createRadialGradient(width * 0.25, height * 0.35, 50, width * 0.25, height * 0.35, dynamicRadius);
    grad1.addColorStop(0, state.theme === 'dark' ? `rgba(157, 78, 221, ${nebulaAlpha})` : `rgba(255, 204, 213, ${nebulaAlpha})`);
    grad1.addColorStop(0.5, state.theme === 'dark' ? `rgba(255, 0, 127, ${nebulaAlpha * 0.5})` : `rgba(255, 117, 143, ${nebulaAlpha * 0.5})`);
    grad1.addColorStop(1, 'transparent');
    bgCtx.fillStyle = grad1;
    bgCtx.fillRect(0, 0, width, height);

    stars.forEach(star => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0) star.speed = -star.speed;
        
        const currentSize = star.baseSize + (energyNorm * star.baseSize * 1.8);
        const currentAlpha = Math.min(1, Math.abs(star.alpha) + (energyNorm * 0.4));

        bgCtx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        bgCtx.beginPath();
        bgCtx.arc(star.x, star.y, currentSize, 0, Math.PI * 2);
        bgCtx.fill();
    });

    const shootingStarThreshold = 0.02 + (energyNorm * 0.05);
    if (Math.random() < shootingStarThreshold) {
        shootingStars.push({
            x: Math.random() * width,
            y: Math.random() * height * 0.5,
            length: Math.random() * 90 + 40 + (energyNorm * 50),
            speed: Math.random() * 11 + 6 + (energyNorm * 8),
            alpha: 1
        });
    }

    bgCtx.lineWidth = 2 + (energyNorm * 2);
    for (let i = shootingStars.length - 1; i >= 0; i--) {
        let st = shootingStars[i];
        st.x += st.speed;
        st.y += st.speed * 0.5;
        st.alpha -= 0.02;

        let grad = bgCtx.createLinearGradient(st.x, st.y, st.x - st.length, st.y - st.length * 0.5);
        grad.addColorStop(0, `rgba(255, 215, 0, ${st.alpha})`);
        grad.addColorStop(1, 'transparent');

        bgCtx.strokeStyle = grad;
        bgCtx.beginPath();
        bgCtx.moveTo(st.x, st.y);
        bgCtx.lineTo(st.x - st.length, st.y - st.length * 0.5);
        bgCtx.stroke();

        if (st.alpha <= 0) shootingStars.splice(i, 1);
    }

    fxCtx.clearRect(0, 0, width, height);
    for (let i = cursorParticles.length - 1; i >= 0; i--) {
        let p = cursorParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.03;
        p.size *= 0.95;

        fxCtx.fillStyle = p.color;
        fxCtx.globalAlpha = Math.max(0, p.alpha);
        fxCtx.beginPath();
        fxCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        fxCtx.fill();

        if (p.alpha <= 0) cursorParticles.splice(i, 1);
    }
    fxCtx.globalAlpha = 1;

    requestAnimationFrame(animateCanvas);
}

// LOCKSCREEN & UNLOCK MECHANISM
const lockscreen = document.getElementById('lockscreen');
const unlockBtn = document.getElementById('unlockBtn');
const desktop = document.getElementById('desktop');
const pinBox = document.getElementById('pinBox');
const togglePinBtn = document.getElementById('togglePinBtn');
const pinInput = document.getElementById('pinInput');
const pinSubmitBtn = document.getElementById('pinSubmitBtn');
const startAudioLockBtn = document.getElementById('startAudioLockBtn');

function triggerUnlock() {
    sfx.init();
    sfx.win();
    state.unlocked = true;
    lockscreen.classList.add('opacity-0');
    setTimeout(() => {
        lockscreen.style.display = 'none';
        desktop.classList.remove('opacity-0', 'pointer-events-none');
        showNotification("¡Bienvenida Princesa!", "Dennis OS cargado con todo el amor.");
    }, 1000);
}

unlockBtn.addEventListener('click', triggerUnlock);

togglePinBtn.addEventListener('click', () => {
    sfx.click();
    pinBox.classList.toggle('hidden');
});

pinSubmitBtn.addEventListener('click', () => {
    if (pinInput.value === '0609') {
        triggerUnlock();
    } else {
        sfx.click();
        showNotification("Pin Incorrecto", "Pista: Día y mes de nuestra primera interacción");
    }
});

startAudioLockBtn.addEventListener('click', () => {
    triggerUnlock();
    jumpToSixtySec();
});

// TIME & VENEZUELAN CLOCK ENGINE
function updateClocks() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-VE', { timeZone: 'America/Caracas' });
    const dateStr = now.toLocaleDateString('es-VE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    document.getElementById('lockClock').textContent = timeStr;
    document.getElementById('lockDate').textContent = dateStr;
    document.getElementById('osClock').textContent = timeStr;

    const diff = now - state.anniversaryStartDate;
    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);

        const formatted = `${String(days).padStart(2,'0')}d ${String(hours).padStart(2,'0')}h ${String(mins).padStart(2,'0')}m ${String(secs).padStart(2,'0')}s`;
        document.getElementById('anniversaryCounter').textContent = formatted;

        document.getElementById('calcDays').textContent = String(days).padStart(2,'0');
        document.getElementById('calcHours').textContent = String(hours).padStart(2,'0');
        document.getElementById('calcMins').textContent = String(mins).padStart(2,'0');
        document.getElementById('calcSecs').textContent = String(secs).padStart(2,'0');
    }
}
setInterval(updateClocks, 1000);
updateClocks();

// DUAL THEME ENGINE
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');

themeToggleBtn.addEventListener('click', () => {
    sfx.click();
    if (state.theme === 'dark') {
        state.theme = 'rose';
        document.documentElement.classList.remove('dark');
        themeIcon.className = 'fa-solid fa-sun text-amber-400 text-xs';
        themeLabel.textContent = 'Rose Quartz';
        applyGlassSkin('rose');
    } else {
        state.theme = 'dark';
        document.documentElement.classList.add('dark');
        themeIcon.className = 'fa-solid fa-moon text-amber-300 text-xs';
        themeLabel.textContent = 'Cosmic Dark';
        applyGlassSkin('dark');
    }
});

function applyGlassSkin(theme) {
    const windows = document.querySelectorAll('.app-window');
    windows.forEach(win => {
        if (theme === 'rose') {
            win.classList.remove('glass-cosmic');
            win.classList.add('glass-rosequartz');
        } else {
            win.classList.remove('glass-rosequartz');
            win.classList.add('glass-cosmic');
        }
    });
}

// WINDOW MANAGEMENT
let activeZ = 100;
const windows = document.querySelectorAll('.app-window');

windows.forEach(win => {
    const header = win.querySelector('.app-header');
    const closeBtn = win.querySelector('.win-btn-close');
    const minBtn = win.querySelector('.win-btn-min');

    win.addEventListener('mousedown', () => {
        activeZ++;
        win.style.zIndex = activeZ;
    });
    win.addEventListener('touchstart', () => {
        activeZ++;
        win.style.zIndex = activeZ;
    }, {passive: true});

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sfx.click();
            win.classList.add('hidden');
        });
    }

    if (minBtn) {
        minBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sfx.click();
            win.classList.add('hidden');
        });
    }

    let isDragging = false;
    let startX, startY, initialX, initialY;

    header.addEventListener('mousedown', (e) => {
        if (window.innerWidth <= 768) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialX = win.offsetLeft;
        initialY = win.offsetTop;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        win.style.left = `${initialX + dx}px`;
        win.style.top = `${initialY + dy}px`;
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
});

// DOCK LAUNCHERS
const dockApps = document.querySelectorAll('.dock-app');
dockApps.forEach(app => {
    app.addEventListener('click', () => {
        sfx.click();
        const targetId = app.getAttribute('data-target');
        const win = document.getElementById(targetId);
        if (win) {
            win.classList.remove('hidden');
            activeZ++;
            win.style.zIndex = activeZ;
        }
    });
});

// APP 1: TYPEWRITER POEM
const poemTypewriter = document.getElementById('poemTypewriter');
const typingSpeedSelect = document.getElementById('typingSpeed');
const restartPoemBtn = document.getElementById('restartPoemBtn');
const copyPoemBtn = document.getElementById('copyPoemBtn');
const voiceoverBtn = document.getElementById('voiceoverBtn');
let poemTimeout = null;

function startTypewriter() {
    if (poemTimeout) clearTimeout(poemTimeout);
    poemTypewriter.textContent = '';
    let idx = 0;
    const speed = parseInt(typingSpeedSelect.value) || 20;

    function typeChar() {
        if (idx < state.poemText.length) {
            poemTypewriter.textContent += state.poemText.charAt(idx);
            idx++;
            poemTimeout = setTimeout(typeChar, speed);
        }
    }
    typeChar();
}

restartPoemBtn.addEventListener('click', () => {
    sfx.click();
    startTypewriter();
});

copyPoemBtn.addEventListener('click', () => {
    sfx.click();
    navigator.clipboard.writeText(state.poemText);
    showNotification("Copiado", "Poema copiado al portapapeles para Princesa.");
});

voiceoverBtn.addEventListener('click', () => {
    sfx.click();
    showNotification("Lectura de Voz", "Simulando lectura romántica del poema para Dennis...");
});

// APP 2: CONSTELACIONES ESTELARES
const svgMap = document.getElementById('constellationSvg');
const constName = document.getElementById('constName');
const constQuote = document.getElementById('constQuote');
const constProgress = document.getElementById('constProgress');
const constUnlockedCount = document.getElementById('constUnlockedCount');
const constPercent = document.getElementById('constPercent');
const customConstModeBtn = document.getElementById('customConstModeBtn');

function renderConstellations() {
    svgMap.innerHTML = '';

    for (let i = 0; i < state.constellations.length - 1; i++) {
        const c1 = state.constellations[i];
        const c2 = state.constellations[i + 1];
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', `${c1.x}%`);
        line.setAttribute('y1', `${c1.y}%`);
        line.setAttribute('x2', `${c2.x}%`);
        line.setAttribute('y2', `${c2.y}%`);
        line.setAttribute('stroke', state.unlockedConstellations.has(c1.id) && state.unlockedConstellations.has(c2.id) ? '#ff007f' : 'rgba(255, 255, 255, 0.15)');
        line.setAttribute('stroke-width', '1.5');
        line.setAttribute('stroke-dasharray', '4');
        svgMap.appendChild(line);
    }

    state.constellations.forEach(c => {
        const isUnlocked = state.unlockedConstellations.has(c.id);
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.classList.add('cursor-pointer');

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', `${c.x}%`);
        circle.setAttribute('cy', `${c.y}%`);
        circle.setAttribute('r', isUnlocked ? '8' : '5');
        circle.setAttribute('fill', isUnlocked ? '#ffd700' : '#c77dff');

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', `${c.x}%`);
        text.setAttribute('y', `${c.y + 4}%`);
        text.setAttribute('fill', '#FFFFFF');
        text.setAttribute('font-size', '10');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-family', 'Inter');
        text.textContent = c.name;

        g.appendChild(circle);
        g.appendChild(text);

        g.addEventListener('click', () => {
            sfx.starUnlock();
            state.unlockedConstellations.add(c.id);
            constName.textContent = `Constelación ${c.name}`;
            constQuote.textContent = `"${c.quote}"`;
            updateConstellationProgress();
            renderConstellations();
        });

        svgMap.appendChild(g);
    });
}

function updateConstellationProgress() {
    const count = state.unlockedConstellations.size;
    const total = state.constellations.length;
    const pct = Math.round((count / total) * 100);

    constProgress.style.width = `${pct}%`;
    constUnlockedCount.textContent = `${count} / ${total}`;
    constPercent.textContent = `${pct}%`;

    if (count === total) {
        showNotification("¡Constelación Completa!", "Has descubierto todo el firmamento de amor de Dennis.");
    }
}

customConstModeBtn.addEventListener('click', () => {
    sfx.click();
    state.customConstMode = !state.customConstMode;
    customConstModeBtn.classList.toggle('bg-emerald-500/30');
    showNotification("Modo Dibujo", state.customConstMode ? "Haz clic en el mapa para añadir estrellas personalizadas" : "Modo desactivado");
});

svgMap.addEventListener('click', (e) => {
    if (!state.customConstMode) return;
    const rect = svgMap.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const newId = state.constellations.length + 1;
    state.constellations.push({
        id: newId,
        name: `Estrella ${newId}`,
        quote: "Una nueva estrella añadida al cielo de Dennis.",
        x: x,
        y: y
    });
    renderConstellations();
});

// APP 3: AUDIO SANCTUARY ENGINE
const audio = document.getElementById('audioSource');
const mainPlayBtn = document.getElementById('mainPlayBtn');
const hudPlayBtn = document.getElementById('hudPlayBtn');
const vinylDisk = document.getElementById('vinylDisk');
const mainSeekbar = document.getElementById('mainSeekbar');
const hudSeekbar = document.getElementById('hudSeekbar');
const jumpSixtySecBtn = document.getElementById('jumpSixtySecBtn');
const hudJumpBtn = document.getElementById('hudJumpBtn');
const visualizerCanvas = document.getElementById('visualizerCanvas');
const visCtx = visualizerCanvas.getContext('2d');

function toggleAudio() {
    sfx.click();
    sfx.setupAudioAnalyser(audio);

    if (audio.paused) {
        audio.play().then(() => {
            state.audioPlaying = true;
            updateAudioUI(true);
            showNotification("Reproduciendo", "Stay With Me • Miki Matsubara");
        }).catch((err) => {
            console.error("Error al reproducir audio:", err);
            showNotification("Aviso de Audio", "Toca el botón de reproducción nuevamente para iniciar la música.");
        });
    } else {
        audio.pause();
        state.audioPlaying = false;
        updateAudioUI(false);
    }
}

function updateAudioUI(isPlaying) {
    const iconClass = isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    mainPlayBtn.innerHTML = `<i class="${iconClass}"></i>`;
    hudPlayBtn.innerHTML = `<i class="${iconClass}"></i>`;

    if (isPlaying) {
        vinylDisk.classList.add('animate-spin-slow');
    } else {
        vinylDisk.classList.remove('animate-spin-slow');
    }
}

mainPlayBtn.addEventListener('click', toggleAudio);
hudPlayBtn.addEventListener('click', toggleAudio);

function jumpToSixtySec() {
    sfx.click();
    audio.currentTime = 60;
    if (audio.paused) {
        toggleAudio();
    } else {
        showNotification("Audio Sanctuary", "Saltando al segundo 60 (1:00)");
    }
}
jumpSixtySecBtn.addEventListener('click', jumpToSixtySec);
hudJumpBtn.addEventListener('click', jumpToSixtySec);

audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    mainSeekbar.value = pct;
    hudSeekbar.value = pct;

    const m = Math.floor(audio.currentTime / 60);
    const s = Math.floor(audio.currentTime % 60);
    const formatted = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    document.getElementById('audioCurrentTime').textContent = formatted;
    document.getElementById('hudTime').textContent = formatted;
});

audio.addEventListener('error', (e) => {
    console.error("Error en archivo de audio:", e);
    showNotification("Error de Audio", "No se pudo cargar el archivo desde GitHub. Verifica la conexión.");
});

mainSeekbar.addEventListener('input', (e) => {
    if (audio.duration) {
        audio.currentTime = (e.target.value / 100) * audio.duration;
    }
});
hudSeekbar.addEventListener('input', (e) => {
    if (audio.duration) {
        audio.currentTime = (e.target.value / 100) * audio.duration;
    }
});

function renderVisualizer() {
    visCtx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
    const bars = 28;
    const barWidth = visualizerCanvas.width / bars;

    if (state.audioPlaying && sfx.analyser && sfx.dataArray) {
        sfx.analyser.getByteFrequencyData(sfx.dataArray);
        for (let i = 0; i < bars; i++) {
            let val = sfx.dataArray[i % sfx.dataArray.length];
            let h = (val / 255) * (visualizerCanvas.height - 8) + 4;
            visCtx.fillStyle = state.theme === 'dark' ? '#ff007f' : '#ff758f';
            visCtx.fillRect(i * barWidth + 2, visualizerCanvas.height - h, barWidth - 3, h);
        }
    } else {
        for (let i = 0; i < bars; i++) {
            let h = 4;
            visCtx.fillStyle = state.theme === 'dark' ? '#ff007f' : '#ff758f';
            visCtx.fillRect(i * barWidth + 2, visualizerCanvas.height - h, barWidth - 3, h);
        }
    }
    requestAnimationFrame(renderVisualizer);
}
renderVisualizer();

// APP 4: JARDÍN DE RECUERDOS
const memoryTimeline = document.getElementById('memoryTimeline');
const memFilters = document.querySelectorAll('.mem-filter');
const addMemoryNoteBtn = document.getElementById('addMemoryNoteBtn');

function renderMemories(filter = 'all') {
    memoryTimeline.innerHTML = '';
    const filtered = filter === 'all' ? state.memories : state.memories.filter(m => m.cat === filter);

    filtered.forEach(m => {
        const div = document.createElement('div');
        div.className = "relative p-3 md:p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-pink-400/40 transition-all space-y-1";
        div.innerHTML = `
            <div class="flex items-center justify-between">
                <span class="text-xs font-serif font-bold text-pink-300">${m.title}</span>
                <span class="text-[10px] font-mono text-amber-300">${m.date}</span>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">${m.desc}</p>
        `;
        memoryTimeline.appendChild(div);
    });
}

memFilters.forEach(btn => {
    btn.addEventListener('click', () => {
        sfx.click();
        memFilters.forEach(b => b.className = "mem-filter font-mono text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-slate-300 shrink-0");
        btn.className = "mem-filter font-mono text-[11px] px-2.5 py-1 rounded-full bg-pink-500 text-white shrink-0";
        renderMemories(btn.getAttribute('data-filter'));
    });
});

addMemoryNoteBtn.addEventListener('click', () => {
    sfx.click();
    const noteText = prompt("Escribe una nota rápida de amor para Dennis:");
    if (noteText) {
        state.memories.unshift({
            id: Date.now(),
            title: "Nota de Amor",
            date: "Hoy",
            cat: "detalles",
            desc: noteText
        });
        renderMemories();
        showNotification("Nota Guardada", "Guardada en el Jardín de Recuerdos.");
    }
});

// APP 5: GAME & LEGO 3D HEART
const cardGrid = document.getElementById('cardGrid');
const gameMoves = document.getElementById('gameMoves');
const gameTimer = document.getElementById('gameTimer');
const restartGameBtn = document.getElementById('restartGameBtn');

const cardIcons = ['fa-heart', 'fa-star', 'fa-crown', 'fa-gem', 'fa-moon', 'fa-sun'];
let cards = [];
let flippedCards = [];
let moves = 0;
let matchedPairs = 0;
let timerInterval = null;
let secondsElapsed = 0;

function initGame() {
    cards = [...cardIcons, ...cardIcons].sort(() => Math.random() - 0.5);
    cardGrid.innerHTML = '';
    moves = 0;
    matchedPairs = 0;
    secondsElapsed = 0;
    gameMoves.textContent = '0';
    gameTimer.textContent = '00:00';

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        secondsElapsed++;
        const m = Math.floor(secondsElapsed / 60);
        const s = secondsElapsed % 60;
        gameTimer.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }, 1000);

    cards.forEach((icon, idx) => {
        const card = document.createElement('div');
        card.className = "w-full aspect-square max-w-[60px] rounded-xl bg-white/10 border border-white/20 flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-95 mx-auto";
        card.dataset.icon = icon;
        card.dataset.index = idx;
        card.innerHTML = `<i class="fa-solid fa-question text-slate-400 text-xs md:text-base"></i>`;

        card.addEventListener('click', () => handleCardClick(card));
        cardGrid.appendChild(card);
    });
}

function handleCardClick(card) {
    if (flippedCards.length >= 2 || card.classList.contains('matched') || flippedCards.includes(card)) return;

    sfx.click();
    card.innerHTML = `<i class="fa-solid ${card.dataset.icon} text-xl md:text-2xl text-pink-400"></i>`;
    card.classList.add('bg-pink-500/20', 'border-pink-400');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        gameMoves.textContent = moves;
        checkMatch();
    }
}

function checkMatch() {
    const [c1, c2] = flippedCards;
    if (c1.dataset.icon === c2.dataset.icon) {
        sfx.starUnlock();
        c1.classList.add('matched');
        c2.classList.add('matched');
        matchedPairs++;
        flippedCards = [];

        if (matchedPairs === cardIcons.length) {
            clearInterval(timerInterval);
            sfx.win();
            showNotification("¡Ganaste!", `Completaste el juego para Dennis en ${moves} movimientos.`);
        }
    } else {
        setTimeout(() => {
            c1.innerHTML = `<i class="fa-solid fa-question text-slate-400 text-xs md:text-base"></i>`;
            c2.innerHTML = `<i class="fa-solid fa-question text-slate-400 text-xs md:text-base"></i>`;
            c1.classList.remove('bg-pink-500/20', 'border-pink-400');
            c2.classList.remove('bg-pink-500/20', 'border-pink-400');
            flippedCards = [];
        }, 800);
    }
}

restartGameBtn.addEventListener('click', () => {
    sfx.click();
    initGame();
});

// ISOMETRIC 3D LEGO HEART SIMULATOR
const legoCanvas = document.getElementById('legoCanvas');
const legoCtx = legoCanvas.getContext('2d');
const explodeLegoBtn = document.getElementById('explodeLegoBtn');

let legoExploded = false;
let legoExplodeProgress = 0;
let legoDebris = [];
let legoHovering = false;

const heartGrid = [
    { gridX: -2, gridY: -3, gridZ: 0, color: '#e6005c' },
    { gridX: -1, gridY: -3, gridZ: 0, color: '#ff007f' },
    { gridX: 1,  gridY: -3, gridZ: 0, color: '#ff007f' },
    { gridX: 2,  gridY: -3, gridZ: 0, color: '#e6005c' },
    { gridX: -3, gridY: -2, gridZ: 0, color: '#c9184a' },
    { gridX: -2, gridY: -2, gridZ: 0, color: '#ff2a85' },
    { gridX: -1, gridY: -2, gridZ: 0, color: '#ff007f' },
    { gridX: 0,  gridY: -2, gridZ: 0, color: '#ff758f' },
    { gridX: 1,  gridY: -2, gridZ: 0, color: '#ff007f' },
    { gridX: 2,  gridY: -2, gridZ: 0, color: '#ff2a85' },
    { gridX: 3,  gridY: -2, gridZ: 0, color: '#c9184a' },
    { gridX: -3, gridY: -1, gridZ: 0, color: '#a71d31' },
    { gridX: -2, gridY: -1, gridZ: 0, color: '#ff007f' },
    { gridX: -1, gridY: -1, gridZ: 0, color: '#ff4d94' },
    { gridX: 0,  gridY: -1, gridZ: 0, color: '#ff758f' },
    { gridX: 1,  gridY: -1, gridZ: 0, color: '#ff4d94' },
    { gridX: 2,  gridY: -1, gridZ: 0, color: '#ff007f' },
    { gridX: 3,  gridY: -1, gridZ: 0, color: '#a71d31' },
    { gridX: -3, gridY: 0, gridZ: 0, color: '#c9184a' },
    { gridX: -2, gridY: 0, gridZ: 0, color: '#ff007f' },
    { gridX: -1, gridY: 0, gridZ: 0, color: '#ff2a85' },
    { gridX: 0,  gridY: 0, gridZ: 0, color: '#ff4d94' },
    { gridX: 1,  gridY: 0, gridZ: 0, color: '#ff2a85' },
    { gridX: 2,  gridY: 0, gridZ: 0, color: '#ff007f' },
    { gridX: 3,  gridY: 0, gridZ: 0, color: '#c9184a' },
    { gridX: -2, gridY: 1, gridZ: 0, color: '#a71d31' },
    { gridX: -1, gridY: 1, gridZ: 0, color: '#ff007f' },
    { gridX: 0,  gridY: 1, gridZ: 0, color: '#ff2a85' },
    { gridX: 1,  gridY: 1, gridZ: 0, color: '#ff007f' },
    { gridX: 2,  gridY: 1, gridZ: 0, color: '#a71d31' },
    { gridX: -1, gridY: 2, gridZ: 0, color: '#c9184a' },
    { gridX: 0,  gridY: 2, gridZ: 0, color: '#ff007f' },
    { gridX: 1,  gridY: 2, gridZ: 0, color: '#c9184a' },
    { gridX: 0,  gridY: 3, gridZ: 0, color: '#800f2f' },
    { gridX: -1, gridY: -2, gridZ: 1, color: '#ff4d94' },
    { gridX: 0,  gridY: -2, gridZ: 1, color: '#ffd700' },
    { gridX: 1,  gridY: -2, gridZ: 1, color: '#ff4d94' },
    { gridX: -2, gridY: -1, gridZ: 1, color: '#e6005c' },
    { gridX: -1, gridY: -1, gridZ: 1, color: '#ff758f' },
    { gridX: 0,  gridY: -1, gridZ: 1, color: '#ffffff' },
    { gridX: 1,  gridY: -1, gridZ: 1, color: '#ff758f' },
    { gridX: 2,  gridY: -1, gridZ: 1, color: '#e6005c' },
    { gridX: -1, gridY: 0,  gridZ: 1, color: '#ff007f' },
    { gridX: 0,  gridY: 0,  gridZ: 1, color: '#ff4d94' },
    { gridX: 1,  gridY: 0,  gridZ: 1, color: '#ff007f' },
    { gridX: 0,  gridY: 1,  gridZ: 1, color: '#c9184a' }
];

const legoBlocks = heartGrid.map((b) => {
    const angle = Math.atan2(b.gridY, b.gridX) + (Math.random() - 0.5) * 0.5;
    const dist = Math.hypot(b.gridX, b.gridY) + 1.5;
    const dirX = Math.cos(angle) * dist * 35 + (Math.random() - 0.5) * 40;
    const dirY = Math.sin(angle) * dist * 35 + (Math.random() - 0.5) * 40;
    const dirZ = (b.gridZ + 1) * 40 + Math.random() * 50;

    return {
        ...b,
        targetX: dirX,
        targetY: dirY,
        targetZ: dirZ,
        rotX: (Math.random() - 0.5) * 2.5,
        rotY: (Math.random() - 0.5) * 2.5
    };
});

for (let i = 0; i < 40; i++) {
    legoDebris.push({
        x: (Math.random() - 0.5) * 220,
        y: (Math.random() - 0.5) * 180,
        z: Math.random() * 80,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        color: Math.random() < 0.5 ? '#ff007f' : (Math.random() < 0.5 ? '#ffd700' : '#c77dff'),
        size: Math.random() * 4 + 2
    });
}

function adjustColor(hex, lum) {
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    lum = lum || 0;
    let rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i*2,2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00"+c).substr(c.length);
    }
    return rgb;
}

function drawIsometricLegoBrick(ctx, x, y, sizeX, sizeY, height, color, rot = 0) {
    ctx.save();
    ctx.translate(x, y);
    if (rot !== 0) ctx.rotate(rot);

    const ISO_ANGLE = 0.523598;
    const cos = Math.cos(ISO_ANGLE);
    const sin = Math.sin(ISO_ANGLE);

    const topColor = adjustColor(color, 0.25);
    const leftColor = adjustColor(color, -0.15);
    const rightColor = adjustColor(color, -0.35);

    const pX0 = 0;
    const pY0 = -sizeY * sin;
    const pX1 = sizeX * cos;
    const pY1 = 0;
    const pX2 = 0;
    const pY2 = sizeY * sin;
    const pX3 = -sizeX * cos;
    const pY3 = 0;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.moveTo(pX0, pY0 + height + 6);
    ctx.lineTo(pX1, pY1 + height + 6);
    ctx.lineTo(pX2, pY2 + height + 6);
    ctx.lineTo(pX3, pY3 + height + 6);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = leftColor;
    ctx.beginPath();
    ctx.moveTo(pX3, pY3);
    ctx.lineTo(pX2, pY2);
    ctx.lineTo(pX2, pY2 + height);
    ctx.lineTo(pX3, pY3 + height);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.fillStyle = rightColor;
    ctx.beginPath();
    ctx.moveTo(pX1, pY1);
    ctx.lineTo(pX2, pY2);
    ctx.lineTo(pX2, pY2 + height);
    ctx.lineTo(pX1, pY1 + height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = topColor;
    ctx.beginPath();
    ctx.moveTo(pX0, pY0);
    ctx.lineTo(pX1, pY1);
    ctx.lineTo(pX2, pY2);
    ctx.lineTo(pX3, pY3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const studRadiusX = sizeX * 0.38;
    const studRadiusY = sizeY * 0.24;
    const studHeight = height * 0.28;
    const studYOffset = -sizeY * 0.1;

    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, studYOffset + 1, studRadiusX, studRadiusY, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = adjustColor(color, 0.05);
    ctx.beginPath();
    ctx.ellipse(0, studYOffset - studHeight / 2, studRadiusX, studRadiusY, 0, 0, Math.PI);
    ctx.lineTo(studRadiusX, studYOffset - studHeight);
    ctx.ellipse(0, studYOffset - studHeight, studRadiusX, studRadiusY, 0, Math.PI, 0, true);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = adjustColor(color, 0.35);
    ctx.beginPath();
    ctx.ellipse(0, studYOffset - studHeight, studRadiusX, studRadiusY, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.stroke();

    ctx.restore();
}

let legoTime = 0;

function animateLegoCanvas() {
    legoCtx.clearRect(0, 0, legoCanvas.width, legoCanvas.height);
    const cx = legoCanvas.width / 2;
    const cy = legoCanvas.height / 2 + 10;

    legoTime += 0.03;

    const targetProg = legoExploded ? 1 : 0;
    legoExplodeProgress += (targetProg - legoExplodeProgress) * 0.12;

    const floatOffset = Math.sin(legoTime * 1.5) * 4;

    if (legoExplodeProgress > 0.05) {
        legoDebris.forEach(p => {
            const px = cx + p.x * legoExplodeProgress;
            const py = cy + p.y * legoExplodeProgress + Math.sin(legoTime + p.z) * 5;

            legoCtx.fillStyle = p.color;
            legoCtx.globalAlpha = legoExplodeProgress * (0.6 + 0.4 * Math.sin(legoTime * 3 + p.z));
            legoCtx.beginPath();
            legoCtx.arc(px, py, p.size, 0, Math.PI * 2);
            legoCtx.fill();
        });
        legoCtx.globalAlpha = 1.0;
    }

    const sortedBlocks = [...legoBlocks].sort((a, b) => {
        const depthA = (a.gridY * 2) + (a.gridX) + (a.gridZ * 5);
        const depthB = (b.gridY * 2) + (b.gridX) + (b.gridZ * 5);
        return depthA - depthB;
    });

    const isoXStep = 17;
    const isoYStep = 10;
    const isoZStep = 14;
    const brickWidth = 12;
    const brickDepth = 12;
    const brickHeight = 10;

    sortedBlocks.forEach(b => {
        let isoX = (b.gridX - b.gridY) * isoXStep;
        let isoY = (b.gridX + b.gridY) * isoYStep - (b.gridZ * isoZStep);

        isoX += b.targetX * legoExplodeProgress;
        isoY += (b.targetY - b.targetZ) * legoExplodeProgress;

        const curX = cx + isoX;
        const curY = cy + isoY + floatOffset;
        const curRot = b.rotX * legoExplodeProgress;

        let renderColor = b.color;
        if (legoHovering && !legoExploded) {
            renderColor = adjustColor(b.color, 0.15);
        }

        drawIsometricLegoBrick(legoCtx, curX, curY, brickWidth, brickDepth, brickHeight, renderColor, curRot);
    });

    requestAnimationFrame(animateLegoCanvas);
}

function toggleLegoExplode() {
    sfx.click();
    legoExploded = !legoExploded;
    if (legoExploded) {
        sfx.win();
        showNotification("Corazón LEGO 3D", "💥 ¡BOOM! Corazón explotado en piezas estelares.");
    } else {
        sfx.starUnlock();
        showNotification("Corazón LEGO 3D", "❤️ Corazón reensamblado pieza a pieza para Dennis.");
    }
}

legoCanvas.addEventListener('click', toggleLegoExplode);
explodeLegoBtn.addEventListener('click', toggleLegoExplode);
legoCanvas.addEventListener('mouseenter', () => legoHovering = true);
legoCanvas.addEventListener('mouseleave', () => legoHovering = false);

// APP 6: COMPLIMENT WHEEL & FORTUNE COOKIE
const wheelCanvas = document.getElementById('wheelCanvas');
const wCtx = wheelCanvas.getContext('2d');
const spinWheelBtn = document.getElementById('spinWheelBtn');
const openFortuneBtn = document.getElementById('openFortuneBtn');
const complimentBox = document.getElementById('complimentBox');
let currentWheelAngle = 0;

function drawWheel() {
    const numSlices = state.compliments.length;
    const sliceAngle = (Math.PI * 2) / numSlices;
    const radius = wheelCanvas.width / 2;

    wCtx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);

    for (let i = 0; i < numSlices; i++) {
        wCtx.beginPath();
        wCtx.moveTo(radius, radius);
        wCtx.arc(radius, radius, radius, i * sliceAngle + currentWheelAngle, (i + 1) * sliceAngle + currentWheelAngle);
        wCtx.fillStyle = i % 2 === 0 ? '#c77dff' : '#ff007f';
        wCtx.fill();
        wCtx.strokeStyle = 'rgba(255,255,255,0.2)';
        wCtx.stroke();
    }
}

spinWheelBtn.addEventListener('click', () => {
    sfx.click();
    let spinAngle = Math.random() * 20 + 20;
    let duration = 3000;
    let start = null;

    function animateSpin(timestamp) {
        if (!start) start = timestamp;
        let progress = timestamp - start;

        currentWheelAngle += (spinAngle * (1 - progress / duration)) * 0.05;
        drawWheel();

        if (progress < duration) {
            requestAnimationFrame(animateSpin);
        } else {
            sfx.win();
            const chosen = state.compliments[Math.floor(Math.random() * state.compliments.length)];
            complimentBox.innerHTML = `<p class="font-serif italic text-xs md:text-sm text-pink-200">"${chosen}"</p>`;
            showNotification("Para Dennis", "Nuevo cumplido revelado.");
        }
    }
    requestAnimationFrame(animateSpin);
});

openFortuneBtn.addEventListener('click', () => {
    sfx.win();
    const chosen = state.fortunes[Math.floor(Math.random() * state.fortunes.length)];
    complimentBox.innerHTML = `<p class="font-serif italic text-xs md:text-sm text-amber-300">${chosen}</p>`;
    showNotification("Galleta Abierta", "Suerte revelada para Princesa Dennis.");
});

// TOAST NOTIFICATION ENGINE
function showNotification(title, msg) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = "glass-cosmic border border-pink-500/40 rounded-2xl p-3 shadow-2xl pointer-events-auto flex items-start space-x-3 w-72 animate-bounce";
    toast.innerHTML = `
        <div class="text-pink-400 text-lg mt-0.5"><i class="fa-solid fa-heart"></i></div>
        <div class="flex-1 space-y-0.5">
            <h5 class="text-xs font-serif font-bold text-pink-300">${title}</h5>
            <p class="text-[11px] text-slate-300">${msg}</p>
        </div>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

// INITIALIZATION
window.addEventListener('load', () => {
    resizeCanvas();
    animateCanvas();
    startTypewriter();
    renderConstellations();
    renderMemories();
    initGame();

    wheelCanvas.width = 180;
    wheelCanvas.height = 180;
    drawWheel();

    legoCanvas.width = 280;
    legoCanvas.height = 240;
    animateLegoCanvas();

    setInterval(() => {
        if (state.unlocked && Math.random() < 0.4) {
            const msgs = [
                "Recordatorio: Eres la novia más hermosa, Dennis.",
                "1 mes juntos y contando infinitos momentos más.",
                "Dennis OS funcionando con 100% de amor puro."
            ];
            const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
            showNotification("Mensaje de Amor", randomMsg);
        }
    }, 30000);
});


