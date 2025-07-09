
# 📊 Interactive Data Visualisation Gallery

This project was developed for the **"Introduction to Programming 2"** module and demonstrates the ability to build a modular and interactive data visualisation gallery using **p5.js**. Each tab in the gallery represents a different dataset visualised with a custom-designed chart, allowing users to explore real-world datasets such as climate trends, pay gaps, diversity statistics, and more.

---

## 🗂️ Project Overview

Each visualisation is modular and encapsulated in its own JavaScript class. Users can interact with menus, sliders, checkboxes, and hoverable graphics to explore the data dynamically.

---

## 🌐 Live Preview

https://raw.githack.com/jh-sudo/Interactive-Data-Visualisation-Gallery/refs/heads/main/index.html

---
### 📈 Visualisations Included

| Title                      | Type                  | Interaction           |
|---------------------------|-----------------------|------------------------|
| Tech Diversity: Gender    | Bar chart             | Side-by-side bars for male/female %
| Tech Diversity: Race      | Pie chart             | View racial diversity (hardcoded to Facebook)
| Pay Gap by Job (2017)     | Scatter plot          | Point size based on pay gap
| Pay Gap Over Time         | Line chart            | Line graph from 1997–2017
| Climate Change (NOAA)     | Gradient line chart   | Adjustable smoothing via slider
| Food Consumption          | Bubble chart          | Nutrient breakdown by food type
| Nutrients Over Time       | Multi-line chart      | Toggle individual nutrients via checkboxes
| SG Household Income (2020)| Labeled ellipses      | Income distribution by housing type (checkbox filtering)

---

## 🛠️ Tech Stack

- **JavaScript**
- **p5.js** (Drawing + interactivity)
- **HTML5 + CSS3**
- Modular JS architecture with `helper-functions.js` and shared layout logic.

---

## 📁 File Structure

```
data-visual-final/
└── data-visual-template/
    ├── data/                      # (Not included) CSV datasets
    ├── lib/                       # Optional JS libraries (if used)
    ├── .eslintrc                  # Linting config
    ├── *.js                       # Visualisation modules
    ├── index.html                 # Main entrypoint
    ├── sketch.js                  # Sets up canvas + gallery switcher
    ├── style.css                  # Project styling
    ├── instructions.md            # Project scope and brief
    └── README.md                  # Documentation file
```

---

## ✨ Notable Features

- Fully modular structure: each visualisation is self-contained.
- Interactive UI elements (e.g., sliders, checkboxes, dropdowns).
- Responsive rendering on 1024x576 canvas.
- Data-driven rendering using `loadTable()` and real-world CSVs.

---

## 📌 Educational Purpose

This project was built as coursework to practice:

- Data parsing & transformation
- Modular programming in JavaScript
- Charting & layout logic
- UI component integration using p5.js
- Handling asynchronous data loading

---

