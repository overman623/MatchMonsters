# Match Monsters

**A browser-based 3-Sort puzzle defense game where sorting pieces builds your defenses against waves of monsters.**

Match Monsters combines a sorting puzzle with real-time defense gameplay.  
Instead of separating puzzle solving and combat, every successful sort directly contributes to the battle.

> AI-assisted solo development project focused on rapid prototyping, gameplay iteration, and system-driven game design.

---

## Demo

<!--
Add gameplay GIF here later.

Recommended:
docs/match_monsters_gameplay.gif

Example:
![Match Monsters Gameplay](docs/match_monsters_gameplay.gif)
-->

---

## Overview

Match Monsters is a single-player browser game that combines **3-Sort puzzle mechanics with real-time monster defense**.

The player organizes pieces across a limited set of slots. Matching three identical pieces creates combat units that automatically attack incoming monsters.

This creates a gameplay loop where every sorting decision affects both:

- the state of the puzzle
- the state of the battlefield

As waves become more difficult, the player must balance board management, unit composition, targeting behavior, upgrades, and survival.

---

## Core Gameplay

The basic gameplay loop is:

1. Move pieces between sorting slots.
2. Match three identical pieces.
3. Create or upgrade combat units.
4. Defend against incoming monsters.
5. Build combos and trigger special attacks.
6. Survive increasingly difficult waves.
7. Choose upgrades and improve the current build.
8. Defeat boss encounters and continue pushing the run.

The goal is not simply to clear the puzzle board.

Sorting efficiently determines how quickly the player's defenses are created and how effectively they can respond to the battlefield.

---

## Combat Roles

Different pieces create units with different combat behaviors.

### Basic

A general-purpose attacker that prioritizes nearby enemies.

### Scatter

Fires multiple projectiles in a spread pattern for close-range pressure.

### Sniper

Prioritizes distant targets and uses piercing projectiles.

### Breaker

Targets high-health enemies and is designed to deal with durable monsters and bosses.

### Blast

Targets groups of enemies and deals area damage.

### Support

Attacks enemies while providing recovery effects to damaged defensive slots.

Each role uses different targeting and projectile behavior, making piece composition part of the strategy.

---

## Targeting & Projectile Systems

Combat units use different targeting priorities depending on their role.

Examples include:

- `near` — prioritize nearby enemies
- `far` — prioritize distant enemies
- `strong` — prioritize high-health targets
- `cluster` — prioritize groups of enemies

Projectile behavior also varies between units:

- standard projectiles
- piercing projectiles
- spread shots
- anti-tank attacks
- explosive area attacks
- recovery-related projectiles

This allows units to behave differently without requiring direct combat control from the player.

---

## Combo System

Successful sorting builds a combo chain.

Maintaining the combo rewards fast and accurate puzzle decisions with additional combat power.

At specific combo milestones, special projectiles can be triggered to deal damage across multiple enemies.

The combo system connects puzzle performance directly to combat efficiency.

---

## Waves & Boss Battles

Combat progresses through increasingly difficult waves.

During a run, the player encounters different enemy compositions and eventually boss encounters.

The wave system includes:

- timed combat waves
- persistent battlefield state
- upgrade selections between waves
- increasingly difficult enemies
- boss encounters
- continued progression after major encounters

The system is designed around short sessions that gradually increase battlefield pressure.

---

## Progression

Match Monsters includes persistent and run-based progression systems.

Players can:

- unlock characters
- upgrade combat units
- earn and spend gold
- experiment with different team compositions
- improve their performance across runs

Game progress and player records are stored locally in the browser.

---

## Data-Driven Game Design

Gameplay configuration is separated from much of the runtime logic through structured game data.

```text
assets/
├── audio/
├── data/
│   └── game-data.js
├── fonts/
└── images/

docs/
├── BATTLE_QA_MATRIX.md
├── DATA_TABLE_COLUMN_AUDIT.md
├── DATA_TABLE_COLUMN_GUIDE.md
├── DATA_TABLE_MIGRATION.md
├── EXHIBITION_TELEMETRY_SETUP.md
├── MATCH_MONSTERS_CONCEPT_KO.md
└── MODULARIZATION_RESIDUE_AUDIT.md

index.html
```

Combat values, unit properties, targeting behavior, stages, and other gameplay parameters are organized around data tables rather than being entirely embedded into individual gameplay implementations.

This makes balancing and iteration easier while reducing duplicated configuration.

---

## Development & QA

The project was developed through repeated gameplay iteration rather than only implementing an initial prototype.

A dedicated battle QA matrix is included in the repository to verify systems such as:

- core sorting flow
- combat unit behavior
- targeting priorities
- projectile behavior
- combo attacks
- wave progression
- boss encounters
- slot and unit lifecycle
- balance data
- regression cases

Additional documentation tracks data-table migration and legacy implementation cleanup.

These documents reflect the process of turning an experimental prototype into a more structured and testable game implementation.

---

## AI-Assisted Development

Match Monsters was developed as an **AI-assisted solo project**.

AI tools were used throughout the implementation workflow to accelerate tasks such as coding, refactoring, documentation, debugging, and iteration.

The overall game concept, gameplay direction, system design, balancing decisions, integration, testing, and final product decisions were directed by the developer.

The project also served as an experiment in building a practical workflow where AI can increase implementation speed while the developer remains responsible for design and product decisions.

---

## Tech Stack

- HTML5
- JavaScript
- CSS
- Canvas-based rendering
- Browser Local Storage
- GitHub Pages
- AI-assisted development workflow

---

## Project Goals

Match Monsters explores three main ideas:

**1. Connect puzzle actions directly to combat**

Sorting is not a separate mini-game. Successful puzzle decisions create immediate battlefield consequences.

**2. Create strategic variety without complex controls**

Different unit roles, targeting priorities, projectiles, and upgrades create tactical choices while combat itself remains largely automatic.

**3. Explore AI-assisted solo game development**

The project was also used to test how far a single developer can take a playable game by combining hands-on product decisions with AI-assisted implementation.

---

## Project Status

Playable prototype / exhibition-oriented build.

The current version includes the core sorting and combat loop, multiple combat roles, progression systems, wave-based encounters, boss gameplay, balancing data, and structured QA documentation.

Further development may include additional content, balance improvements, presentation polish, and gameplay iteration.

---

## Author

**Beomjin Kim**

Android / Mobile Developer  
Independent developer working on apps, games, and development tools with AI-assisted workflows.

HappyHouse
