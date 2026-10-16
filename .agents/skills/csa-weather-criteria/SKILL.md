---
name: csa-weather-criteria
description: Reference and implementation patterns for CSA C22.3 No. 60826 / No. 1 Weather Loading & PLS-CADD Criteria (.cri) generation engine.
---

# CSA C22.3 Weather Loading & Physics Engine Workflow

Use this skill when modifying, extending, or building features for Canadian overhead line weather criteria calculations and PLS-CADD `.cri` exporter pipelines.

## Module Pipeline Overview

1. **Module 1: Geoclimatic Data Vault**
   - Source: CAN/CSA-C22.3 No. 60826-10 Table CA.1 (Weather Data).
   - Baseline MRI: 50-year return period ($W_{50}$ in km/h, $t_{50}$ in mm, $T_{\text{jan}}$ in °C).
   - Ground Snow Pack (CSA C22.3 No. 1 Clause 5.3.1.1): Flag `isHeavySnowArea = true` if mean annual maximum snow depth > 0.5 m.

2. **Module 2: Return Period Scaling Engine**
   - Source: CSA 60826-10 Table CA.2 scaling factors ($T_w, T_i$).
   - Scaled values: $W_T = W_{50} \times T_w$, $t_T = t_{50} \times T_i$.
   - Perform linear interpolation for intermediate return periods $T \in [25, 500]$.

3. **Module 3: Reliability-Based Physics Engine**
   - **Wind-Only Pressure ($q_0$)**: $q_0 = \frac{1}{2} \rho \tau \left(\frac{W_T}{3.6}\right)^2 \approx 0.049 W_T^2 \quad [\text{Pa}]$ ($\rho = 1.225 \text{ kg/m}^3, \tau = 1.04$).
   - **Design Ice Thickness ($t_{\text{design}}$)**: $t_{\text{design}} = t_T \times S_a \times K_h$ ($S_a = 1.3$; $K_h = 1.15$ for transmission $\sim 30\text{m}$, $1.00$ for distribution $\sim 10\text{m}$).
   - **Unit Glaze Ice Mass ($g_R$)**: $g_R = 0.0277 \times t_{\text{design}} \times (t_{\text{design}} + d) \quad [\text{N/m}]$ ($\delta = 900 \text{ kg/m}^3$).
   - **Coincident Load Combinations ($\tau = 1.10$)**:
     - **C1 (Heavy Ice + Low Wind)**: $V_{\text{C1}} = 0.4 W_T$, $q_{0H} = 0.5 \rho \tau (V_{\text{C1}} / 3.6)^2$, $100\% g_R$, $D_L = d + 2t_{\text{design}}$.
     - **C2 (Reduced Ice + High Wind)**: $V_{\text{C2}} = 0.6 W_T$, $q_{0L} = 0.5 \rho \tau (V_{\text{C2}} / 3.6)^2$, $50\% g_R$, solve quadratic $0.0277 t_H^2 + 0.0277 d t_H - 0.5 g_R = 0$ for reduced ice $t_H$, $D_H = d + 2t_H$.

4. **Module 4: Deterministic Guardrail**
   - Floor compliance with CSA C22.3 No. 1-15 Table 30 minimums ($t_{\text{final}} = \max(t_{\text{design}}, t_{\text{min}})$, $q_{\text{final}} = \max(q_0, q_{\text{min}})$).
