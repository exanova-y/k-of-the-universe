# Kardashev Scale of the Universe Explorer - Development Plan

## 1. Project Overview
A web-based interactive explorer inspired by "The Scale of the Universe", but focused on **Energy Consumption/Output** (Power). Users can explore systems ranging from single bacteria to entire galaxies using a logarithmic slider.

## 2. Data Model
We will use a normalized JSON structure. The primary unit for calculation will be **Watts (Joules/second)**, but we will display **Joules/minute** as requested in the UI.

### Entities Roster (Normalized)
Recalculated using Sagan's Formula: $K = \frac{\log_{10}(W) - 6}{10}$

| Entity | Spatial Scale | Raw Input | Power (Watts) | Kardashev Scale |
| :--- | :--- | :--- | :--- | :--- |
| **E. coli Bacterium** | 2 µm | 4×10⁻¹¹ J/min | ~6.67×10⁻¹³ W | Type -1.82 |
| **Single Neuron** | 100 µm | 3×10⁻⁸ J/min | ~5.0×10⁻¹⁰ W | Type -1.53 |
| **Slime Mold (Starved)** | 3 cm | 2×10⁻² J/min | ~3.33×10⁻⁴ W | Type -0.95 |
| **Slime Mold (Healthy)** | 3 cm | 6×10⁻² J/min | ~1.0×10⁻³ W | Type -0.90 |
| **Dolphin (Individual)** | 3 m | 2.6×10⁴ J/min | ~433 W | Type -0.34 |
| **Dolphin Group (3)** | ~10 m | 7.8×10⁴ J/min | ~1,300 W | Type -0.29 |
| **Dolphin Group (10)** | ~20 m | 2.6×10⁵ J/min | ~4,333 W | Type -0.24 |
| **Dolphin Group (30)** | ~50 m | 7.8×10⁵ J/min | ~13,000 W | Type -0.19 |
| **Song Dynasty Coal (Furnace)** | 2-3 m | 6.7×10³ J/s | 6,700 W | Type -0.22 |
| **ITER (Magnet Storage)** | 10 m | 4×10⁹ J/min | ~6.67×10⁷ W | Type 0.18 |
| **ITER (Tokamak Plasma)** | 15-20 m | 500 MW (Fusion Power) | 5×10⁸ W | Type 0.27 |
| **Fengman Hydropower** | ~1 km | 1 GW | 1×10⁹ W | Type 0.30 |
| **Daqing Oilfield** | >6000 km² | 1.3×10¹⁸ J/yr | ~4.1×10¹⁰ W | Type 0.46 |
| **Planet Earth** | 12,742 km | Insolation | ~1.741*10^13 W | Type 0.73 |
| **Solar System (Sun)** | 1.4M km | Luminosity | ~3.8×10²⁶ W | Type 2.06 |
| **Milky Way Galaxy** | 100k ly | Luminosity | ~1×10³⁷ W | Type 3.10 |

## 3. System Architecture

### State Management
A simple React Context or State to hold:
- `currentPowerLog`: Float (Log10 of current Watts).
- `selectedEntity`: Object | null.

### Data Transformer (`src/utils/transformer.ts`)
Responsible for conversions:
1. **Watts to Joules/min**: $W \times 60$
2. **Watts to Kardashev (K)**: $K = \frac{\log_{10}(W) - 6}{10}$ (Sagan's formula).
3. **Watts to Bitcoins Mined**:
   - Estimate: Mining 1 BTC $\approx 2 \times 10^{12}$ Joules (varies, but useful for scale).
   - Output: "Generates X Bitcoins per day" or "Takes Y years to mine 1 Bitcoin".

### UI Components
1.  **`UniverseExplorer`**: Main container.
2.  **`ScaleSlider`**: Range input controlling `currentPowerLog`.
    - Range: -13 (Bacteria) to 38 (Galaxy).
3.  **`EntityCanvas`**:
    - Renders entities based on `currentPowerLog`.
    - **Visual Scaling**: If `entity.power` is close to `10^currentPowerLog`, it is shown at normal size.
    - If user zooms out (slider increases), smaller energy objects shrink/fade.
4.  **`InfoPanel`**:
    - Displays when an entity is clicked.
    - Shows: Name, Spatial Scale, Power (J/min & W), Description, Bitcoin equivalent.

## 4. Development Roadmap
1.  **Setup**: Clean up `App.tsx` and install dependencies (if any needed, likely just standard React).
2.  **Data Implementation**: Create `data/entities.ts` with the JSON roster.
3.  **Logic Implementation**: Create `transformer.ts` for math.
4.  **UI Implementation**:
    - Build the background/canvas.
    - Build the slider.
    - Build the entity markers (using circles or placeholder images/emojis for now).
    - Connect interactions.
5.  **Refining**: Add the descriptions and styling.

## 5. Math & Physics Notes
- **Kardashev Scale**: Based on power $P$ (Watts).
    - Type I: $10^{16}$ W
    - Type II: $10^{26}$ W
    - Type III: $10^{36}$ W
- **Bitcoin**:
    - Using approximation: 1 BTC $\approx 1,400,000$ MJ (mega-joules) = $1.4 \times 10^{12}$ J.
