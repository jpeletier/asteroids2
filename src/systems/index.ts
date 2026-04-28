// Update phase systems (import order = execution order)
import './ShipControl';
import './Thrust';
import './AlienAI';
import './Movement';
import './FrictionSystem';
import './Wrap';
import './Shooting';
import './LaserSystem';
import './ShieldSystem';
import './DecaySystem';
import './HealthSystem';
import './Collision';
import './Spawn';
import './Wave';
import './Cleanup';

// Render phase systems
import './Render';
import './UI';

// Draw statement systems (render phase, enter/exit only)
import './draw/ShieldDraw';
import './draw/HealthDraw';
import './draw/LaserBeamDraw';
