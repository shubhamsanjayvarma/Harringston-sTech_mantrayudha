# NovaMart Product Catalog & Category Business Rules
## 14 Product Categories, Operational Constraints & Restocking Matrix

> **Source of Truth:** [`spec/Problem Statement(PS)/public-20261003T063850Z-1-001/public/products/`](file:///c:/Project/Hackathon/Hackathon_Boilerplate_speedrun/spec/Problem%20Statement(PS)/public-20261003T063850Z-1-001/public/products/) & [`products.csv`](file:///c:/Project/Hackathon/Hackathon_Boilerplate_speedrun/spec/Problem%20Statement(PS)/public-20261003T063850Z-1-001/public/products.csv)  
> **Designated Skills:** `spec-driven-development`, `api-and-interface-design`

---

## 1. Catalog Distribution & Operational Constraints

The NovaMart catalog contains 300 electronic products across 14 distinct categories. Each category has specific operational policies regarding change-of-mind returnability, replacement availability, warranty duration, device reset requirements, and restocking fee applicability.

```yaml
category_summary_table:
  total_categories: 14
  total_products: 300
  categories:
    Accessories:
      count: 34
      restocking_fee_v2: false
      returnable_exceptions: "Cables, chargers, phone cases, and screen protectors marked returnable=false for change of mind once opened."
    Smartphones:
      count: 30
      restocking_fee_v2: false
      device_security_requirement: "Must remove Google/Apple account locks, disable 'Find My', and perform factory reset before return."
    Earbuds:
      count: 24
      restocking_fee_v2: false
      hygiene_restriction: "In-ear earbuds (TWS, sports, wired earphones) are strictly non-returnable for change of mind due to hygiene. Defect returns permitted."
    Laptops:
      count: 24
      restocking_fee_v2: true
      restocking_fee_details: "5% of item refund, capped at ₹2,500 for Change-of-Mind under v2."
      device_security_requirement: "Must remove user accounts, BitLocker, and perform factory reset."
    Gaming:
      count: 22
      restocking_fee_v2: false
      returnable_exceptions: "Consoles, controllers, and accessories. Digital codes/gift cards are strictly non-returnable."
    Headphones:
      count: 22
      restocking_fee_v2: false
      returnable_exceptions: "Over-ear models returnable if complete; selected neckbands non-returnable."
    Networking:
      count: 20
      restocking_fee_v2: false
      specs_focus: "Bandwidth, frequency bands (2.4/5GHz), Wi-Fi standard (Wi-Fi 6)."
    Smartwatches:
      count: 20
      restocking_fee_v2: false
      hygiene_exceptions: "Straps considered consumables; must unpair device before return."
    Speakers:
      count: 20
      restocking_fee_v2: false
      specs_focus: "Wattage, battery life, IPX water resistance rating."
    Keyboards:
      count: 18
      restocking_fee_v2: false
      specs_focus: "Mechanical switch types, layout percentage (60%, 75%, TKL, Full)."
    Mice:
      count: 18
      restocking_fee_v2: false
      specs_focus: "DPI sensors, polling rate, wireless connectivity."
    Monitors:
      count: 18
      restocking_fee_v2: true
      restocking_fee_details: "5% of item refund, capped at ₹2,500 for Change-of-Mind under v2."
      qc_inspection: "Dead pixel checks and panel inspection during return QC."
    Tablets:
      count: 16
      restocking_fee_v2: true
      restocking_fee_details: "5% of item refund, capped at ₹2,500 for Change-of-Mind under v2."
      device_security_requirement: "Must remove cloud accounts and factory reset."
    Cameras:
      count: 14
      restocking_fee_v2: true
      restocking_fee_details: "5% of item refund, capped at ₹2,500 for Change-of-Mind under v2."
      specs_focus: "Sensor size, lens mounts, shutter actuation counts during return QC."
```

---

## 2. Restocking Fee Applicability Matrix (Policy v2)

Under Policy v2 (orders placed $\ge$ 2026-06-01), returns requested for **Change of Mind** on high-value sensitive categories incur a mandatory **5% restocking fee**, capped at **₹2,500**.

$$\text{Restocking Fee} = \begin{cases} 
\min(0.05 \times \text{Item Refund Amount}, 2500) & \text{if Policy v2, Change-of-Mind, and Category} \in \{\text{Laptops}, \text{Tablets}, \text{Cameras}, \text{Monitors}\} \\ 
0 & \text{otherwise} 
\end{cases}$$

### Category Applicability Table
| Category | Restocking Fee (v1) | Restocking Fee (v2 - Change of Mind) | Restocking Fee (v2 - Defect / Damage) |
| :--- | :--- | :--- | :--- |
| **Laptops** | ₹0 | **5% (Max ₹2,500)** | ₹0 |
| **Tablets** | ₹0 | **5% (Max ₹2,500)** | ₹0 |
| **Cameras** | ₹0 | **5% (Max ₹2,500)** | ₹0 |
| **Monitors** | ₹0 | **5% (Max ₹2,500)** | ₹0 |
| **All Other 10 Categories** | ₹0 | ₹0 | ₹0 |

---

## 3. Category Specification Schemas

Each product category markdown document in `public/products/` contains rich technical attributes that the agent must parse and leverage to answer compatibility, specification, and feature queries accurately.

```yaml
category_technical_attributes:
  laptops:
    attributes: ["Processor", "RAM", "Storage", "Display", "Graphics", "Battery", "Weight", "Operating System"]
    common_queries: "RAM upgradability, display refresh rate, USB-C charging support, battery life."
  smartphones:
    attributes: ["Processor", "Display", "Rear Camera", "Front Camera", "Battery", "Charging", "5G Bands", "OS"]
    common_queries: "Charger in box, 5G band compatibility, dual SIM support, camera megapixels."
  earbuds:
    attributes: ["Driver Size", "Battery Life", "Noise Cancellation (ANC)", "Bluetooth Version", "Water Resistance (IPX)", "Charging Port"]
    common_queries: "ANC dB rating, latency for gaming, microphone count, replacement ear tips."
  headphones:
    attributes: ["Driver", "Frequency Response", "Impedance", "Connectivity", "Battery", "Microphone"]
    common_queries: "Wired 3.5mm passive playback when battery dead, ear cushion material."
  monitors:
    attributes: ["Panel Type (IPS/VA/OLED)", "Resolution", "Refresh Rate", "Response Time", "Color Gamut", "Ports (HDMI/DP/Type-C)", "Stand Adjustments"]
    common_queries: "VESA mount compatibility, Mac USB-C display support, console 120Hz support."
  cameras:
    attributes: ["Sensor Type", "Megapixels", "Lens Mount", "Video Resolution", "ISO Range", "Autofocus Points", "Image Stabilization"]
    common_queries: "Lens compatibility, 4K 60fps recording limits, clean HDMI out for streaming."
  accessories:
    attributes: ["Power Output (Watts)", "Ports", "Cable Length", "Material", "Compatibility", "Certifications"]
    common_queries: "GaN charger fast-charging protocols (PD 3.0 / QC 4.0), iPhone / Android compatibility."
```

---

## 4. Return Condition & Inspection Invariants

```yaml
return_qc_invariants:
  general:
    - "Original outer packaging, inner trays, user manuals, and serial number labels must be intact."
    - "Accessories included in the box must all be returned (cables, power adapters, styluses)."
  device_locks_and_factory_reset:
    - "Smartphones, Tablets, Laptops must have all biometric locks, PINs, and cloud accounts (iCloud, Google, Microsoft) removed."
    - "If a returned device is cloud-locked upon arrival at the warehouse, QC FAILS and the item is returned to the customer without refund."
  hygiene_seal_integrity:
    - "Earbuds, in-ear monitors, and opened screen protectors cannot be returned for change of mind once the hygienic seal is broken."
```
