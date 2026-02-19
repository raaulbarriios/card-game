import { CardType } from '../types/CardType.js';

// SI Units helper
const K=1e3, M=1e6, B=1e9, T=1e12, P=1e15, E=1e18, Z=1e21, Y=1e24;

export const CardTypes = [
    // Tier 1-6
    new CardType('jeffrey', 'Jeffrey The Epstein', 10, 1, 'src/img/Jeffrey.png'),
    new CardType('adept', 'Adept', 150, 12, 'https://placehold.co/100x140/green/white?text=Adept'),
    new CardType('scholar', 'Scholar', 2*K, 180, 'https://placehold.co/100x140/blue/white?text=Scholar'),
    new CardType('expert', 'Expert', 35*K, 2.5*K, 'https://placehold.co/100x140/purple/white?text=Expert'),
    new CardType('master', 'Master', 600*K, 45*K, 'https://placehold.co/100x140/orange/white?text=Master'),
    new CardType('grandmaster', 'Grandmaster', 15*M, 900*K, 'https://placehold.co/100x140/red/white?text=Grandmaster'),
    
    // Tier 7-10
    new CardType('legend', 'Legend', 450*M, 25*M, 'https://placehold.co/100x140/gold/black?text=Legend'),
    new CardType('mythic', 'Mythic', 15*B, 800*M, 'https://placehold.co/100x140/cyan/black?text=Mythic'),
    new CardType('celestial', 'Celestial', 600*B, 25*B, 'https://placehold.co/100x140/white/black?text=Celestial'),
    new CardType('ancient', 'Ancient', 25*T, 1*T, 'https://placehold.co/100x140/brown/white?text=Ancient'),
    
    // Tier 11-15
    new CardType('eternal', 'Eternal', 1*P, 50*T, 'https://placehold.co/100x140/silver/black?text=Eternal'),
    new CardType('void', 'Void', 80*P, 4*P, 'https://placehold.co/100x140/black/white?text=Void'),
    new CardType('cosmic', 'Cosmic', 5*E, 300*P, 'https://placehold.co/100x140/indigo/white?text=Cosmic'),
    new CardType('galactic', 'Galactic', 250*E, 15*E, 'https://placehold.co/100x140/violet/white?text=Galactic'),
    new CardType('universal', 'Universal', 10*K*E, 600*E, 'https://placehold.co/100x140/teal/white?text=Universal'),
    
    // Tier 16-20 (Post-Endgame)
    new CardType('multiversal', 'Multiversal', 1*Y, 80*Z, 'https://placehold.co/100x140/pink/white?text=Multiversal'),
    new CardType('dimension', 'Dimension', 100*Y, 9*Y, 'https://placehold.co/100x140/maroon/white?text=Dimension'),
    new CardType('temporal', 'Temporal', 15*K*Y, 1.2*K*Y, 'https://placehold.co/100x140/lime/black?text=Temporal'),
    new CardType('infinity', 'Infinity', 1*M*Y, 90*K*Y, 'https://placehold.co/100x140/yellow/black?text=Infinity'),
    new CardType('source', 'The Source', 1*B*Y, 10*M*Y, 'https://placehold.co/100x140/rainbow/black?text=Source'),
];

const ArrowUpgrades = [
    { id: 'arrow', level: 1, name: "Bola Rebotadora", cost: 1000, speed: 200, description: "Desbloquea una bola que rebota y hace clic por ti." },
    { id: 'arrow', level: 2, name: "Bola Veloz I", cost: 5000, speed: 300, description: "Aumenta la velocidad de la bola." },
    { id: 'arrow', level: 3, name: "Bola Veloz II", cost: 25000, speed: 450, description: "¡Más rápido!" },
    { id: 'arrow', level: 4, name: "Bola Sónica", cost: 100_000, speed: 700, description: "La bola se mueve a velocidades increíbles." },
    { id: 'arrow', level: 5, name: "Bola Hiper", cost: 1_000_000, speed: 1200, description: "¡Casi no se puede ver!" },
    { id: 'arrow', level: 6, name: "Bola Cuántica", cost: 50_000_000, speed: 2500, description: "Está en todas partes a la vez." },
    { id: 'arrow', level: 7, name: "Bola Divina", cost: 10*B, speed: 5000, description: "Velocidad divina." }
];

const ClickUpgrades = [
    { id: 'click', level: 1, name: "Guantes de Poder", cost: 50_000, power: 2, description: "Tus clics valen x2." },
    { id: 'click', level: 2, name: "Martillo Digital", cost: 250_000, power: 5, description: "Tus clics valen x5." },
    { id: 'click', level: 3, name: "Click Sónico", cost: 1_000_000, power: 10, description: "Tus clics valen x10." },
    { id: 'click', level: 4, name: "Dedo de Midas", cost: 5_000_000, power: 25, description: "Tus clics valen x25." },
    { id: 'click', level: 5, name: "Click Divino", cost: 100_000_000, power: 100, description: "Tus clics valen x100." }
];

const BallSizeUpgrades = [
    { id: 'ballSize', level: 1, name: "Bola Grande", cost: 15_000, size: 60, description: "Aumenta el tamaño de la bola." },
    { id: 'ballSize', level: 2, name: "Bola Gigante", cost: 100_000, size: 80, description: "¡Más grande es mejor!" },
    { id: 'ballSize', level: 3, name: "Bola Colosal", cost: 500_000, size: 120, description: "Golpea más cartas a la vez." },
    { id: 'ballSize', level: 4, name: "Sol en Miniatura", cost: 5*M, size: 200, description: "Ocupa gran parte de la pantalla." }
];

export const Upgrades = {
    arrow: ArrowUpgrades,
    click: ClickUpgrades,
    ballSize: BallSizeUpgrades
};
// Export ArrowUpgrades separately ONLY if legacy code needs it, otherwise remove or keeping for safety during refactor
export { ArrowUpgrades };
