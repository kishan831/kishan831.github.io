

Here is a professional, high-quality **README.md** file. You can copy the content below and save it as a file named `README.md` in the root folder of your project.

```markdown
# 🚀 Kishan Jaiswal | Immersive Portfolio

<div align="center">
  <h3>High-Performance • 3D Interactive • Animations</h3>
  
  ![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
  ![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
  ![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
  ![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)

  [Live Demo](#) • [Report Bug](#) • [Request Feature](#)
</div>

---

## 📖 About The Project

A next-generation portfolio website designed specifically for **Game Developers and Creative Technicians**. Unlike standard templates, this project utilizes **WebGL (Three.js)** to render an interactive 3D background, showcasing technical proficiency in graphics programming right from the landing page.

Built with a focus on performance and visual impact, it eliminates the need for heavy frameworks (like React/Next.js) by using vanilla JavaScript enhanced with industry-standard animation libraries.

### ✨ Key Features

*   **🎮 3D Interactive Background:** A custom Three.js scene featuring a wireframe Icosahedron and particle field that reacts to mouse movement (perfect for showcasing Unity/3D skills).
*   **🎬 Cinematic Scroll Animations:** Powered by **GSAP ScrollTrigger**, elements fade, slide, and scale seamlessly as the user navigates.
*   **📝 Real-time Contact Form:** Integrated with **Formspree** to handle form submissions without a backend server.
*   **📱 Fully Responsive:** A mobile-first approach with a glassmorphism UI design using Tailwind-inspired aesthetics.
*   **⚡ High Performance:** No build tools required. Pure, optimized HTML/CSS/JS.

---

## 🛠️ Tech Stack

This project uses modern frontend libraries via CDN to maintain a lightweight footprint while delivering heavy results.

| Category | Technology |
| :--- | :--- |
| **Structure** | Semantic HTML5 |
| **Styling** | CSS3 (Glassmorphism, Grid, Flexbox), CSS Variables |
| **3D Engine** | Three.js (WebGL) |
| **Animation** | GSAP (GreenSock) + ScrollTrigger |
| **Icons** | Lucide Icons |
| **Forms** | Formspree (Serverless Backend) |

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   A modern web browser (Chrome, Firefox, Edge, Safari).
*   A code editor (VS Code recommended).

### Installation

1.  **Clone the repo**
   ```sh
   git clone https://github.com/kishan831/portfolio.git
   ```
2.  **Navigate to the folder**
   ```sh
   cd portfolio
   ```
3.  **Open `index.html`**
   You can simply double-click `index.html` to open it in your browser.

---

## ⚙️ Configuration

### 1. Contact Form Setup
The contact form uses Formspree to send emails. To make it work for you:

1.  Go to [Formspree.io](https://formspree.io/) and create a free account.
2.  Create a new form and copy your **Form ID**.
3.  Open `index.html` and look for line ~180:
   ```html
   <form class="contact-form" id="contactForm" action="https://formspree.io/f/YOUR_FORMSPREE_ID" method="POST">
   ```
4.  Replace `YOUR_FORMSPREE_ID` with the ID you copied.

### 2. Resume Link
Ensure your PDF resume is located at `assets/resume.pdf`, or update the link in the Hero section of `index.html`.

---

## 📂 Project Structure

```text
.
├── index.html          # Main HTML structure
├── README.md           # This file
├── css/
│   └── style.css       # All styling and animations
├── js/
│   └── main.js         # Three.js logic, GSAP triggers, Form handling
└── assets/
    └── resume.pdf      # Your resume
```

---

## 🌐 Deployment

Since this is a static site, deployment is incredibly easy and free.

**Option 1: Netlify (Drag & Drop)**
1.  Create an account on [Netlify](https://www.netlify.com/).
2.  Drag and drop your project folder onto their dashboard.
3.  Done! Your site is live in seconds.

**Option 2: GitHub Pages**
1.  Push this code to your GitHub repository.
2.  Go to **Settings** > **Pages**.
3.  Under **Source**, select `main` (or master) branch and save.

---

## 🎨 Customization

### Changing Colors
The theme uses CSS Variables in `css/style.css`. Edit the `:root` section at the top:

```css
:root {
    --primary: #8b5cf6; /* Change this for main theme color */
    --secondary: #06b6d4; /* Change this for accent color */
    --bg-dark: #0f172a;
}
```

### Modifying 3D Background
You can tweak the 3D scene in `js/main.js` inside the `initThreeJS` function:
*   `geometry`: Change `IcosahedronGeometry` to `TorusKnotGeometry` or others.
*   `wireframe`: Set to `false` for a solid object.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

## 📄 License

Distributed under the MIT License.

---

## 👨‍💻 Author

**Kishan Jaiswal**
*   Portfolio: [kishanjaiswal.site](https://kishanjaiswal.site)
*   LinkedIn: [Kishan Jaiswal](https://www.linkedin.com/in/kishan-jaiswal-2586a4220/)
*   Email: jaiswalkishan628@gmail.com

---

**⚡ Built with passion and code.**
```
