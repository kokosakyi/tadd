# Master Engineering Specification & React Implementation Blueprint
## Canadian CSA Weather Loading Criteria Generator for PLS-CADD
### Compliance Standard: CAN/CSA-C22.3 No. 60826-10 & CSA C22.3 No. 1-15

This master specification document establishes the complete, production-grade mathematical, architectural, and logical guidelines for developing a client-side React single-page web application. This application is designed to ingest Canadian geoclimatic data, scale it to target reliability levels, calculate ultimate wind and ice limit states, cross-verify against legislated deterministic minima, determine everyday aeolian vibration tension limits, and dynamically generate a fully compliant PLS-CADD Criteria (`.cri`) ASCII file.

---

## SECTION 1: GLOBAL APPLICATION ARCHITECTURE & TYPINGS

To enable a highly reactive, client-side calculation pipeline where updates to inputs instantly cascade through all physical equations, the application must manage a structured global state. Below are the core TypeScript type definitions that govern the app's state machine.

```typescript
export interface CityData {
  location: string;
  elevation: number;
  latitude: number;
  longitude: number;
  min_temp: number;      // 1% lowest January hourly temperature (C)
  wind_50yr: number;     // 10-minute average, 50-year return wind speed (km/h)
  ice_50yr: number;      // Equivalent radial glaze ice thickness, 50-year return (mm)
  wet_snow_50yr?: number;// Wet snow thickness, 50-year return (mm), if applicable
  loading_district: 'Severe' | 'Heavy' | 'Medium A' | 'Medium B';
}

export type ReliabilityLevel = 'Level 1' | 'Level 2' | 'Level 3' | 'Temporary';

export interface ConductorProperties {
  name: string;
  diameter: number;      // Outer bare wire diameter (mm)
  unitWeight: number;    // Bare wire unit weight (N/m)
  rts: number;           // Rated Tensile Strength / Ultimate breaking strength (N)
  rulingSpan: number;    // Design ruling span (meters)
}

export interface AppState {
  selectedProvince: string;
  selectedCity: string;
  cityData: CityData | null;
  voltageKv: number;
  isTransmission: boolean; // Computed dynamically: true if voltage >= 70 kV
  reliabilityLevel: ReliabilityLevel;
  conductor: ConductorProperties;
  customWindOverride?: number; // Optional user override (km/h)
  customIceOverride?: number;  // Optional user override (mm)
}

export interface PhysicsResults {
  W_T: number;             // Scaled wind velocity (km/h)
  t_T: number;             // Scaled radial ice thickness (mm)
  t_design: number;        // Height/spatial-adjusted design ice thickness (mm)
  q0_extreme: number;      // Dynamic wind pressure, wind-only (Pa)
  g_R: number;             // Equivalent design radial ice weight (N/m)
  ice_C1: number;          // Coincident ice thickness for Case C1 (mm)
  wind_C1: number;         // Coincident wind velocity for Case C1 (km/h)
  q0_C1: number;           // Dynamic wind pressure under Case C1 (Pa)
  weight_C1: number;       // Linear ice weight under Case C1 (N/m)
  ice_dia_C1: number;      // Ice-covered conductor outer diameter for C1 (mm)
  ice_C2: number;          // Coincident ice thickness for Case C2 (mm)
  wind_C2: number;         // Coincident wind velocity for Case C2 (km/h)
  q0_C2: number;           // Dynamic wind pressure under Case C2 (Pa)
  weight_C2: number;       // Linear ice weight under Case C2 (N/m)
  ice_dia_C2: number;      // Ice-covered conductor outer diameter for C2 (mm)
}

export interface EverydayTensionLimits {
  catenaryLimit: number;   // Max permissible Everyday Initial catenary constant (m)
  tensionLimitN: number;   // Max permissible Everyday Initial tension force (N)
  percentRtsLimit: number; // Everyday Initial tension expressed as a % of RTS
}
```

---

## SECTION 2: MODULE SPECIFICATIONS, PHYSICS, AND CODE ENGINES

---

### MODULE 1: Location-Specific Climatological Database (`ModuleGeoDB`)

#### A. Junior Engineer Guide & Physics Principles
Module 1 acts as your **"Georeferenced Launchpad."** To design a reliable power line, we must first establish local geoclimatic baseline conditions. Module 1 contains a database of climatological variables compiled across Canada, acting as the starting point of our calculation cascades.
1.  **Elevation (m):** Altitude of the weather station. High altitudes experience colder, thinner air, altering aerodynamic pressure constants and icing rates.
2.  **Minimum January Temperature ($T_{\min}$, C):** Represents the **1% lowest hourly temperature** during January. It represents a statistically realistic cold snap (where only 1% of January hours are historically colder) rather than a wild, once-in-a-century temperature. In PLS-CADD, this maps directly to the everyday stringing or peak cold tension check temperature to model maximum wire contraction.
3.  **Reference Wind Speed ($W_{50}$, km/h):** The 10-minute average wind velocity with a 50-year return period, measured at a standard height of 10 meters. We use a 10-minute average instead of instantaneous gusts because the massive span of a conductor self-damps highly localized, momentary gusts.
4.  **Reference Ice Thickness ($t_{50}$, mm):** Glaze ice radial thickness with a 50-year return period. It represents a uniform, solid cylinder of ice surrounding the wire. Environment Canada models this by simulating freezing rain events on a 25 mm conductor at 10 meters height.
5.  **Ground Snow Pack Check (CSA Table D.1):** When a line is built in deep snow regions ($>500$ mm or $>0.5$ m), the vertical clearance between the sagged wire and a person standing on top of the snowpack is compromised. If Module 1 detects a snow depth above this threshold, it raises a warning flag in the React UI prompting the engineer to increase ground clearance parameters.

#### B. Data Schema & JSON Structures
Embed the geoclimatic dataset as a client-side static JSON file. This dataset captures major stations across Canada:

```json
{
  "provinces": {
    "Ontario": [
      {
        "location": "Ottawa (City Hall)",
        "elevation": 70,
        "latitude": 45.42,
        "longitude": -75.69,
        "min_temp": -27,
        "wind_50yr": 90,
        "ice_50yr": 30,
        "loading_district": "Heavy",
        "ground_snow_depth": 0.7
      }
    ],
    "Alberta": [
      {
        "location": "Calgary",
        "elevation": 1045,
        "latitude": 51.05,
        "longitude": -114.08,
        "min_temp": -32,
        "wind_50yr": 99,
        "ice_50yr": 10,
        "wet_snow_50yr": 60,
        "loading_district": "Medium B",
        "ground_snow_depth": 0.4
      }
    ]
  }
}
```

#### C. React Form & UI Integration
In your React UI, create a province selector dropdown. When the province is chosen, populate a second city dropdown. Selecting the city queries the static JSON object and sets `cityData` in the application state, immediately unlocking the next module computations.

---

### MODULE 2: Return Period (T) Scaling Engine (`ModuleReturnPeriod`)

#### A. Junior Engineer Guide & Physics Principles
Module 2 is our **"Weather Amplifier."** Baseline weather data represents a standard 50-year return period (a 2% annual probability of exceedance). Under Reliability-Based Design (RBD), we scale our design weather criteria up or down depending on the grid's strategic importance:
*   A localized 12 kV distribution line doesn't need to withstand the same extreme storms as a critical 230 kV or 500 kV transmission line supplying a major metropolitan center.
*   To adjust the structural reliability, we map the line to an appropriate statistical return period ($T$) using Gumbel extreme value scaling factors.

#### B. Tables and Clauses
Refer to **CAN/CSA-C22.3 No. 60826-10 Table CA.2 (Reliability Levels & Return Periods)**:
*   **Temporary / Lighter Lines ($T = 25$ years):** Scaled down because of lower service continuity risk.
*   **Level 1 Reliability ($T = 50$ years):** Standard baseline for normal distribution systems.
*   **Level 2 Reliability ($T = 150$ years):** Standard design baseline for key regional transmission systems.
*   **Level 3 Reliability ($T = 500$ years):** High-reliability baseline for critical bulk-transmission lines.

#### C. Code Implementation (TypeScript Scaling Function)
```typescript
const SCALING_FACTORS: Record<ReliabilityLevel, { Tw: number; Ti: number }> = {
  'Temporary': { Tw: 0.95, Ti: 0.87 }, // T = 25 years
  'Level 1':   { Tw: 1.00, Ti: 1.00 }, // T = 50 years
  'Level 2':   { Tw: 1.10, Ti: 1.20 }, // T = 150 years
  'Level 3':   { Tw: 1.20, Ti: 1.42 }  // T = 500 years
};

export function calculateScaledWeather(cityData: CityData, level: ReliabilityLevel): { W_T: number; t_T: number } {
  const factors = SCALING_FACTORS[level];
  return {
    W_T: cityData.wind_50yr * factors.Tw,
    t_T: cityData.ice_50yr * factors.Ti
  };
}
```

---

### MODULE 3: Reliability-Based Physics Engine (`ModulePhysics`)

#### A. Junior Engineer Guide & Physics Principles
Module 3 is our **"Physics Translator."** Wind speeds in km/h and radial ice thicknesses in mm cannot be applied to structural models directly. They must first be translated into actual mechanical forces: **wind pressures (Pascals)** and **unit weights (N/m)**.

1.  **Translating Wind Speed to Dynamic Wind Pressure ($q_0$):**
    The kinetic energy of wind is converted to potential pressure on projected vertical surfaces. We utilize air mass density ($\rho = 1.225$ kg/m) corrected for temperature. Colder winter air is dense, heavy, and packs more structural punch than warm summer air, necessitating the temperature correction factor $\tau$:
    $$\tau_{\text{wind}} = 1.04 \quad \text{(Wind-Only cases)}$$
    $$\tau_{\text{ice}} = 1.10 \quad \text{(Wind-on-Ice cases)}$$
    The math for wind-only dynamic pressure reduces to:
    $$q_0 = 0.5 \times \rho \times \tau_{\text{wind}} \times \left(\frac{W_T}{3.6}\right)^2 \approx 0.049 \times W_T^2 \quad \text{(Pa)}$$

2.  **Height and Spatial Ice Adjustments ($t_{\text{design}}$):**
    Point-measured weather stations are isolated. A transmission corridor stretches across dozens of kilometers and is highly likely to intercept a storm's maximum intensity. Therefore, we scale up radial ice using geographic and physical factors:
    *   **Spatial Factor ($S_a = 1.3$):** Accounts for wide line exposure across varying terrain.
    *   **Height Factor ($K_h = 1.15$):** Reflects that conductors are suspended high in the air (around 30m vs. 10m weather station gauges), where cold air pocketing occurs.
    *   **Transmission Lines ($\geq 70$ kV):** Design ice thickness is multiplied by both factors:
        $$t_{\text{design}} = t_T \times 1.3 \times 1.15 = t_T \times 1.5$$
    *   **Distribution Lines ($< 70$ kV):** Assumed to sit at lower elevations around 10m, so we omit the height factor:
        $$t_{\text{design}} = t_T \times 1.3$$

3.  **Equivalent Radial Ice Weight ($g_R$):**
    Ice forms a hollow cylindrical ring around our wire. The cross-sectional area of this ring is multiplied by the density of solid glaze ice ($\delta_{\text{ice}} = 900$ kg/m) to yield its linear weight.
    $$g_R = \delta_{\text{ice}} \times g \times \pi \times t_{\text{design}} \times (t_{\text{design}} + d) \times 10^{-6}$$
    When simplified, this yields the standard CSA design formula:
    $$g_R = 0.0277 \times t_{\text{design}} \times (t_{\text{design}} + d) \quad \text{(N/m)}$$
    *Where conductor diameter ($d$) and $t_{\text{design}}$ are entered in millimeters.* Note that larger conductors carry significantly more ice load because they have a larger physical surface area for ice to accumulate.

4.  **Coincident Combined Loading (Cases C1 and C2):**
    Mother Nature rarely delivers peak hurricanes and historic ice storms at the exact same moment. Designing for both peaks combined would result in prohibitively expensive, over-engineered structures. Thus, we model joint-probabilities via two scenarios:
    *   **Case C1 (Heavy Ice + Low Wind):** Full design ice weight ($g_R$) combined with a steady, coincident winter breeze equal to **40%** of extreme wind velocity ($0.4 \times W_T$).
    *   **Case C2 (Reduced Ice + High Wind):** Represents partial ice shedding under high wind. We assume **50%** of full design ice weight ($0.5 \times g_R$). The coincident wind velocity is increased to **60%** of extreme wind ($0.6 \times W_T$). We must back-calculate the reduced radial ice thickness ($t_{\text{reduced}}$) to find the conductor's ice-covered projected wind surface area.

#### B. Tables and Clauses
*   *Wind pressure formulas:* **CSA 60826-10 Clause 6.2.5**
*   *Conductor wind force:* **CSA 60826-10 Equation 8**
*   *Glaze ice weight equation:* **CSA 60826-10 Equation 13 & Clause CB.3.2**
*   *Coincident combined logic:* **CSA 60826-10 Clause 6.4.1 & Clause 6.4.6.2**

#### C. React Math Engine Core
```typescript
export interface PhysicsInputs {
  W_T: number;             // km/h
  t_T: number;             // mm
  conductorDia: number;    // mm
  isTransmission: boolean;
}

export function computePhysics(inputs: PhysicsInputs): PhysicsResults {
  const { W_T, t_T, conductorDia, isTransmission } = inputs;
  const d = conductorDia;
  const rho = 1.225; // kg/m^3

  // 1. Extreme Wind Only Case (tau = 1.04)
  const q0_extreme = 0.5 * rho * 1.04 * Math.pow((W_T / 3.6), 2); // Pa

  // 2. Adjusted Ice Thickness
  const t_design = isTransmission ? (t_T * 1.5) : (t_T * 1.3);

  // 3. Design Ice Weight (N/m)
  const g_R = 0.0277 * t_design * (t_design + d);

  // 4. Combined Case C1 (Heavy Ice + 40% Coincident Wind)
  const ice_C1 = t_design;
  const weight_C1 = g_R;
  const wind_C1 = 0.40 * W_T;
  const q0_C1 = 0.5 * rho * 1.10 * Math.pow((wind_C1 / 3.6), 2); // Pa
  const ice_dia_C1 = d + 2 * ice_C1;

  // 5. Combined Case C2 (50% Ice Weight + 60% Coincident Wind)
  const weight_C2 = 0.5 * g_R;
  // Back-calculate reduced ice thickness from 50% ice weight
  const t_reduced = 0.5 * (Math.sqrt(Math.pow(d, 2) + (4 * weight_C2) / 0.0277) - d);
  const ice_C2 = t_reduced;
  const wind_C2 = 0.60 * W_T;
  const q0_C2 = 0.5 * rho * 1.10 * Math.pow((wind_C2 / 3.6), 2); // Pa
  const ice_dia_C2 = d + 2 * t_reduced;

  return {
    W_T,
    t_T,
    t_design,
    q0_extreme,
    g_R,
    ice_C1,
    wind_C1,
    q0_C1,
    weight_C1,
    ice_dia_C1,
    ice_C2,
    wind_C2,
    q0_C2,
    weight_C2,
    ice_dia_C2
  };
}
```

---

### MODULE 4: Deterministic Minimums Guardrail (`ModuleDeterministic`)

#### A. Junior Engineer Guide & Physics Principles
Module 4 is your **"Legal Safety Net."** To prevent catastrophic structural failures, Canadian utility design operates under legal boundary restrictions.
*   Your local statistical weather calculations may indicate that Ottawa has very mild weather and only requires designing for 8 mm of ice.
*   However, the Canadian Electrical Code (CSA C22.3 No. 1) mandates that Ottawa sits within the **Heavy Loading District** and **must** be designed for a minimum of 12.5 mm of glaze ice and 400 Pa of wind pressure.
*   No matter how low your statistical return-period math is, **the legislated minimums always govern.**
*   Module 4 runs a side-by-side comparison between Module 3 calculated values and Table 30 regional minima, selecting the maximum value to compile into your criteria file.

#### B. Tables and Clauses
*   *Deterministic Loading Districts Minima:* **CSA C22.3 No. 1-15 Table 30**
*   *Nonlinear Structure Load Factors:* **CSA C22.3 No. 1-15 Table 31 & Table 32**

```typescript
const DISTRICT_MINIMA: Record<string, { radialIce: number; windPressure: number }> = {
  'Severe':   { radialIce: 19.0,  windPressure: 400 },
  'Heavy':    { radialIce: 12.5,  windPressure: 400 },
  'Medium A': { radialIce: 6.5,   windPressure: 400 },
  'Medium B': { radialIce: 12.5,  windPressure: 300 }
};
```

#### C. Code Implementation (Governing Override logic)
```typescript
export interface GoverningCriteria {
  windPressure: number;      // Pa
  iceThicknessC1: number;    // mm
  iceOverridden: boolean;
  windOverridden: boolean;
}

export function applyDeterministicMinima(
  district: string, 
  calculatedWindPa: number, 
  calculatedIceC1: number
): GoverningCriteria {
  const minima = DISTRICT_MINIMA[district];
  if (!minima) {
    return {
      windPressure: calculatedWindPa,
      iceThicknessC1: calculatedIceC1,
      iceOverridden: false,
      windOverridden: false
    };
  }

  return {
    windPressure: Math.max(calculatedWindPa, minima.windPressure),
    iceThicknessC1: Math.max(calculatedIceC1, minima.radialIce),
    windOverridden: minima.windPressure > calculatedWindPa,
    iceOverridden: minima.radialIce > calculatedIceC1
  };
}
```

---

### MODULE 5: Conductor Tension & Aeolian Vibration Engine (`ModuleTension`)

#### A. Junior Engineer Guide & Physics Principles
Module 5 is our **"Asset Lifetime Protector."** Overhead lines must be pulled tight enough to avoid electrical clearance ground faults, but not so tight that they destroy themselves over time.
1.  **The Threat (Aeolian Vibration):** A gentle, steady, perpendicular wind (1 to 7 m/s) blowing across the conductor sheds alternating vortices on its top and bottom leeward sides. This creates high-frequency (3 to 150 Hz) vertical vibrations. Over decades, this cyclic bending stress snaps aluminum strands at the suspension clamps, resulting in line drops.
2.  **The Paradigm Shift (Catenary Constant vs. %RTS):** Historically, engineers limited tension using a percentage of Rated Tensile Strength (e.g., maximum 25% RTS). However, physical fatigue is governed by the **tension-to-mass ratio ($T/w$)**, represented as the **Catenary Constant ($C$)**:
    $$C = \frac{T}{w} \quad \text{(meters)}$$
    Tensioning a wire locks the strands, destroying its natural self-damping capabilities. Conductors sagged to the same catenary constant (C) exhibit identical physical propensity to vibrate, regardless of material size.
3.  **The Short-Span Escalation Rule:** Short spans (under 100 meters) on distribution lines do not gain significant clearance benefits from being pulled exceptionally tight, but high tensions would drastically overload angle structures. Therefore, CSA No. 1 enforces a stepped staircase limit that reduces allowable Everyday Initial tensions on shorter spans.

#### B. Tables and Clauses
*   *Everyday initial tension limits:* **CSA C22.3 No. 1-15 Table 33**
*   *Maximum design loaded tension:* **CSA C22.3 No. 1-15 Table 34 & Clause 8.7.3.2.1**
*   *Unloaded tension after long-term creep:* **CSA C22.3 No. 1-15 Clause 8.7.3.1.3**

#### C. React Math Engine Core
```typescript
export function getEverydayCatenaryLimit(rulingSpan: number): number {
  if (rulingSpan >= 400) return 2000; // Full Limit (meters)
  if (rulingSpan >= 350) return 1900;
  if (rulingSpan >= 300) return 1800;
  if (rulingSpan >= 250) return 1700;
  if (rulingSpan >= 200) return 1600;
  if (rulingSpan >= 150) return 1500;
  if (rulingSpan >= 100) return 1400;
  return 1300; // Spans shorter than 100 meters
}

export function computeTensionLimits(conductor: ConductorProperties): { maxLoadedN: number; everydayLimitN: number; creepLimitN: number } {
  // Rule 1: Ultimate Loaded Tension Limit (60% RTS)
  const maxLoadedN = 0.60 * conductor.rts;

  // Rule 2: Everyday Initial Tension Limit (January Cold) using Catenary Constant Limit
  const catenaryLimit = getEverydayCatenaryLimit(conductor.rulingSpan);
  const everydayLimitN = catenaryLimit * conductor.unitWeight;

  // Rule 3: Final Unloaded Tension after Creep Limit (75% RTS)
  const creepLimitN = 0.75 * conductor.rts;

  return {
    maxLoadedN,
    everydayLimitN,
    creepLimitN
  };
}
```

---

### MODULE 6: PLS-CADD Criteria Exporter (`ModuleCRIExporter`)

#### A. Junior Engineer Guide & Physics Principles
Module 6 is our **"Publisher."** PLS-CADD criteria files (`.cri`) are plain-text ASCII files organized into structured, space-delimited blocks. Our React module uses string template manipulation and the browser's **Blob API** to generate and download a compliant `.cri` file directly in the browser, eliminating the need for backend compilers.

1.  **Line Endings:** PLS-CADD is a Windows program. You must format your text generator with explicit Windows-standard carriage returns and line feeds (**`\r\n`**). Standard Unix `\n` line endings can cause file corruption in older PLS-CADD installations.
2.  **Single Quotes Wrapper:** Any string parameter containing spaces (like weather case or structure loading descriptions) **must** be wrapped in single straight quotes (e.g., `'Combined Case C1'`). If you omit the quotes, the space-delimited parser interprets the space as a column jump, corrupting downstream parameters and crashing the software.
3.  **Units Conversion:** PLS-CADD metric units expect wire ice thicknesses to be entered in **centimeters (cm)**, while your calculation modules operate in millimeters (mm). You must divide your calculated radial thickness by 10 (`mm / 10`) during the text assembly.

#### B. Tables and Clauses
*   *Criteria & File Formats manual:* **PLS-CADD Version 16.0 Chapter 7 & Appendix K**

#### C. Criteria File Assembler & Downloader Script
This TypeScript template generates the exact ASCII file blocks for PLS-CADD:

```typescript
export function compileCRI(state: AppState, physics: PhysicsResults, tension: EverydayTensionLimits): string {
  const CRLF = "\r\n";
  const { cityData, voltageKv, reliabilityLevel, conductor } = state;
  const timestamp = new Date().toLocaleString();

  let text = `; PLS-CADD CRITERIA FILE GENERATED COMPLIANT WITH CSA CODES${CRLF}`;
  text += `; Generated: ${timestamp}${CRLF}`;
  text += `; Location: ${state.selectedCity}, ${state.selectedProvince} (Elevation: ${cityData?.elevation}m)$${CRLF}`;
  text += `; Ruling Span: ${conductor.rulingSpan}m | Voltage: ${voltageKv}kV (${state.isTransmission ? "Transmission" : "Distribution"})${CRLF}`;
  text += `; Conductor: ${conductor.name} | Everyday January Temp: ${cityData?.min_temp}C${CRLF}`;
  text += `; --------------------------------------------------------------------------------${CRLF}`;
  text += CRLF;

  // WEATHER CASES BLOCK
  text += `WEATHER_CASES${CRLF}`;
  text += `; Desc | Q | Wind_Velocity | Ice_Thick(cm) | Ice_Dens(N/m3) | Wire_Temp(C) | Height_Adjust | GRFC_Model${CRLF}`;
  
  // Extreme Wind-Only Case (Metric Q = 0.049)
  text += `'Extreme Wind (${reliabilityLevel})' 0.049 ${physics.W_T.toFixed(2)} 0.00 0.00 -10.0 'CAN/CSA-C22.3 No. 60826-10' 'CAN/CSA-C22.3 No. 60826-10'${CRLF}`;
  
  // Combined Case C1 (Heavy Ice - Convert mm to cm)
  const iceC1Cm = physics.ice_C1 / 10;
  text += `'Combined Case C1 (Heavy Ice)' 0.049 ${physics.wind_C1.toFixed(2)} ${iceC1Cm.toFixed(3)} 900.00 -10.0 'CAN/CSA-C22.3 No. 60826-10' 'CAN/CSA-C22.3 No. 60826-10'${CRLF}`;
  
  // Combined Case C2 (Reduced Ice)
  const iceC2Cm = physics.ice_C2 / 10;
  text += `'Combined Case C2 (Reduced Ice)' 0.049 ${physics.wind_C2.toFixed(2)} ${iceC2Cm.toFixed(3)} 900.00 -10.0 'CAN/CSA-C22.3 No. 60826-10' 'CAN/CSA-C22.3 No. 60826-10'${CRLF}`;
  
  // Everyday January low temperature case for Aeolian Vibration / Tension Limit Checking
  const janTemp = cityData ? cityData.min_temp : -20.0;
  text += `'Everyday Cold (January)' 0.049 0.00 0.00 0.00 ${janTemp.toFixed(1)} 'None' 'None'${CRLF}`;
  text += `END_WEATHER_CASES${CRLF}`;
  text += CRLF;

  // STRUCTURE LOADS BLOCK (LRFD Method 4 Mapping)
  text += `STRUCTURE_LOADS${CRLF}`;
  text += `; Name | Weather Case | Cable Condition | LFV | LFW | LFT | LFS | Steel_Phi | Wood_Phi | Wind_Model${CRLF}`;
  text += `'Extreme Wind Case' 'Extreme Wind (${reliabilityLevel})' 'Initial FE' 1.00 1.00 1.00 1.00 1.00 0.75 'CAN/CSA-C22.3 No. 60826-10'${CRLF}`;
  text += `'Combined C1 Case' 'Combined Case C1 (Heavy Ice)' 'Initial FE' 1.00 1.00 1.00 1.00 1.00 0.75 'CAN/CSA-C22.3 No. 60826-10'${CRLF}`;
  text += `'Combined C2 Case' 'Combined Case C2 (Reduced Ice)' 'Initial FE' 1.00 1.00 1.00 1.00 1.00 0.75 'CAN/CSA-C22.3 No. 60826-10'${CRLF}`;
  text += `END_STRUCTURE_LOADS${CRLF}`;
  text += CRLF;

  // CABLE TENSIONS AUTOSAG BLOCK
  text += `CABLE_TENSIONS${CRLF}`;
  text += `; Weather Case | Cable Condition | Max % RTS | Max Catenary Constant (m)${CRLF}`;
  text += `'Extreme Wind (${reliabilityLevel})' 'Initial RS' 60.00 0.00${CRLF}`;
  text += `'Combined Case C1 (Heavy Ice)' 'Initial RS' 60.00 0.00${CRLF}`;
  text += `'Everyday Cold (January)' 'Initial RS' 100.00 ${tension.catenaryLimit.toFixed(1)}${CRLF}`;
  text += `END_CABLE_TENSIONS${CRLF}`;
  text += CRLF;

  return text;
}

// Client-Side download utility using standard browser Web API Blob
export function triggerCRIDownload(state: AppState, physics: PhysicsResults, tension: EverydayTensionLimits) {
  const criContent = compileCRI(state, physics, tension);
  const blob = new Blob([criContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  const sanitizedCity = state.selectedCity.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  link.download = `csa_${sanitizedCity}_${state.reliabilityLevel.toLowerCase().replace(/\s+/g, '')}.cri`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
```

---

## SECTION 3: COMPREHENSIVE COMPUTATIONAL COUPLING MATRIX

To guarantee that your React developer ("antigravity agent") sets up the code connections perfectly, utilize this mapping table which traces every calculated app variable to its exact parameter slot in PLS-CADD:

| Calculated React State / Physics Output | React Code / State Path | Target PLS-CADD Criteria Sub-Menu | Target CRI ASCII Column Mappings | Engineering Verification / Unit Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Air Density mass coefficient (Q)** | Constant in calculation engine | `Criteria > Weather...` | `Air Density Factor (Q)` | Entered as **`0.049`** for metric systems using wind speed in km/h. |
| **Return Period Wind Speed ($W_T$)** | `physics.W_T` | `Criteria > Weather...` | `Wind Velocity` | Scaled to selected reliability level. Expressed in **km/h**. |
| **Design Ice Thickness ($t_{\text{design}}$)** | `physics.ice_C1` | `Criteria > Weather...` | `Wire Ice Thickness` | **Must divide by 10 during export.** PLS-CADD expects **centimeters (cm)**, calculation engine runs in millimeters (mm). |
| **Glaze Ice Density** | Constant (`900.00`) | `Criteria > Weather...` | `Wire Ice Density` | Hardcoded standard glaze ice density value of **`900 kg/m³`**. |
| **January Extreme Temp ($T_{\min}$)** | `cityData.min_temp` | `Criteria > Weather...` | `Wire Temp` | Evaluated at everyday initial unloaded tension state. Units: **C**. |
| **Wind Height Escalation Model** | Dropdown option | `Criteria > Weather...` | `Wire Wind Height Adjust Model` | String dropdown mapped: **`'CAN/CSA-C22.3 No. 60826-10'`** |
| **Conductor Gust Factor Model** | Dropdown option | `Criteria > Weather...` | `Wire Gust Response Factor` | String dropdown mapped: **`'CAN/CSA-C22.3 No. 60826-10'`** |
| **Dynamic Wind Pressures ($q_{0H}, q_{0L}$)**| `physics.q0_C1` / `physics.q0_C2` | `Criteria > Weather...` | `Wind Pressure` | Populated dynamically in Pascals (Pa). |
| **LRFD Safety Factor (LFV / LFW / LFT)**| Mapped ultimate state multipliers | `Criteria > Structure Loads...` | `LFV`, `LFW`, `LFT` | Set to **`1.00`** because the physics engine calculates ultimate climatic limit states. |
| **Wood Pole Strength Factor ($\phi$)** | Constant based on COV class | `Criteria > Structure Loads...` | `Strength Wood` | Mapped to **`0.75`** per Table 31 (wood coefficient of variation $\geq 15\%$) [120]. |
| **Steel Pole Strength Factor ($\phi$)** | Constant based on COV class | `Criteria > Structure Loads...` | `Strength Steel` | Mapped to **`1.00`** per Table 31 (steel coefficient of variation $\leq 10\%$) [120]. |
| **Peak Storm Loaded Tension Limit**| Mapped ultimate strength constraint | `Criteria > Cable Tensions...` | `% of Ultimate` | Tension cap restricted to **`60.0% RTS`** under design weather loaded case [120]. |
| **Everyday Initial Tension Limit** | `tension.catenaryLimit` | `Criteria > Cable Tensions...` | `Maximum Catenary (m)` | Populated dynamically using ruling span and **Table 33** staircase values [120]. |

---

## SECTION 4: MATHEMATICAL VALIDATION TEST CASE (Ottawa Benchmark)

To verify that your React calculations are 100% mathematically correct during coding, execute an automated verification check against this verified mathematical benchmark from **CSA 60826-10 Annex CB (Ottawa Distribution Pole Case)** [Clause CB.3].

### A. Input Test Parameters
*   **Selected Province:** Ontario
*   **Selected City:** Ottawa (City Hall)
*   **Selected Voltage:** 12 kV
*   **Reliability Level:** Level 1 ($T = 50$ Years, Scaling Factors $T_w = 1.0$, $T_i = 1.0$) [Table CA.2]
*   **Conductor Outer Diameter ($d$):** 22 mm
*   **Conductor Unit Weight ($w$):** 11 N/m
*   **Ruling Span ($S$):** 80 meters
*   **Air Density Baseline ($\rho$):** 1.225 kg/m³

### B. Expected Target Calculation Values to Verify:
1.  **Baseline Wind Speed ($W_{50}$):** 90 km/h [Table CA.1]
2.  **Baseline Ice Thickness ($t_{50}$):** 30 mm [Table CA.1]
3.  **Scaled Wind Speed ($W_T$):** $90 \times 1.0 = \mathbf{90\text{ km/h}}$
4.  **Scaled Ice Thickness ($t_T$):** $30 \times 1.0 = \mathbf{30\text{ mm}}$
5.  **Extreme Wind Only Dynamic Wind Pressure ($q_0$):**
    $$q_0 = 0.5 \times 1.225 \times 1.04 \times \left(\frac{90}{3.6}\right)^2 = \mathbf{396.9\text{ Pa}}$$
    *The deterministic Table 30 minimum wind pressure for the Heavy District is **400 Pa**. Module 4 must trigger a warning flag and override this value to **400 Pa**.*
6.  **Height/Spatial Ice Adjustment ($t_{\text{design}}$):**
    Since voltage is 12 kV, this is a distribution line ($<70$ kV), so we ignore the height factor [Clause 6.3.4.1]:
    $$t_{\text{design}} = 30\text{ mm} \times 1.3 = \mathbf{39\text{ mm}}$$
7.  **Equivalent Design Ice Weight ($g_R$):**
    $$g_R = 0.0277 \times 39 \times (39 + 22) = \mathbf{65.9\text{ N/m}}$$
8.  **Case C1 Coincident Wind Pressure ($q_{0H}$):**
    *Coincident wind speed is 40% of 90 km/h = 36 km/h (10 m/s).* [Clause 6.4.6.2]
    $$q_{0H} = 0.5 \times 1.225 \times 1.10 \times \left(\frac{36}{3.6}ight)^2 = \mathbf{67.4\text{ Pa}}$$
9.  **Case C2 Coincident Wind Pressure ($q_{0L}$):**
    *Coincident wind speed is 60% of 90 km/h = 54 km/h (15 m/s).* [Clause 6.4.6.2]
    $$q_{0L} = 0.5 \times 1.225 \times 1.10 \times \left(\frac{54}{3.6}ight)^2 = \mathbf{151.7\text{ Pa}}$$
10. **Everyday Catenary Constant Limit ($C$):**
    Since ruling span is 80 meters ($<100$ m), Table 33 limits everyday initial catenary constant to:
    $$C = \mathbf{1300\text{ m}}$$
    The corresponding maximum Everyday Initial tension force limit on the conductor is:
    $$T_{\text{limit}} = 1300\text{ m} \times 11\text{ N/m} = \mathbf{14,300\text{ N}}$$
