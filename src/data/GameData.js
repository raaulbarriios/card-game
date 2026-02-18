import { CardType } from '../types/CardType.js';

// SI Units helper
const K=1e3, M=1e6, B=1e9, T=1e12, P=1e15, E=1e18, Z=1e21, Y=1e24;

export const PrestigeLevels = [
    { name: "Jeffrey", multiplier: 1, targetMoney: 50_000_000, nextTierName: "Maestro" },
    { name: "Maestro", multiplier: 10, targetMoney: 5 * T, nextTierName: "Épico" },
    { name: "Épico", multiplier: 100, targetMoney: 10 * P, nextTierName: "Divino" },
    { name: "Divino", multiplier: 5000, targetMoney: 500 * E, nextTierName: "Astral" },
    { name: "Astral", multiplier: 1_000_000, targetMoney: 100 * Y, nextTierName: "Origen" },
    { name: "Origen", multiplier: 1e12, targetMoney: Infinity, nextTierName: "MAX" }
];

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
