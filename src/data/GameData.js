import { CardType } from '../types/CardType.js';

// SI Units helper
const K=1e3, M=1e6, B=1e9, T=1e12, P=1e15, E=1e18, Z=1e21, Y=1e24;

export const PrestigeLevels = [
    { name: "Novato", multiplier: 1, targetMoney: 50_000_000, nextTierName: "Maestro" },
    { name: "Maestro", multiplier: 10, targetMoney: 5 * T, nextTierName: "Épico" },
    { name: "Épico", multiplier: 100, targetMoney: 10 * P, nextTierName: "Divino" },
    { name: "Divino", multiplier: 5000, targetMoney: 500 * E, nextTierName: "Astral" },
    { name: "Astral", multiplier: 1_000_000, targetMoney: 100 * Y, nextTierName: "Origen" },
    { name: "Origen", multiplier: 1e12, targetMoney: Infinity, nextTierName: "MAX" }
];

export const CardTypes = [
    // Tier 1-6
    new CardType('jeffrey', 'Jeffrey The Epstein', 25, 1, 'src/img/Jeffrey.png'),
    new CardType('adept', 'Adept', 400, 12, 'https://placehold.co/100x140/green/white?text=Adept'),
    new CardType('scholar', 'Scholar', 5*K, 180, 'https://placehold.co/100x140/blue/white?text=Scholar'),
    new CardType('expert', 'Expert', 100*K, 2.5*K, 'https://placehold.co/100x140/purple/white?text=Expert'),
    new CardType('master', 'Master', 2.5*M, 45*K, 'https://placehold.co/100x140/orange/white?text=Master'),
    new CardType('grandmaster', 'Grandmaster', 50*M, 900*K, 'https://placehold.co/100x140/red/white?text=Grandmaster'),
    
    // Tier 7-10
    new CardType('legend', 'Legend', 2*B, 25*M, 'https://placehold.co/100x140/gold/black?text=Legend'),
    new CardType('mythic', 'Mythic', 100*B, 800*M, 'https://placehold.co/100x140/cyan/black?text=Mythic'),
    new CardType('celestial', 'Celestial', 5*T, 25*B, 'https://placehold.co/100x140/white/black?text=Celestial'),
    new CardType('ancient', 'Ancient', 200*T, 1*T, 'https://placehold.co/100x140/brown/white?text=Ancient'),
];
