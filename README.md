# Levy Chemelil - Professional Portfolio

A modern, responsive portfolio website showcasing the work and skills of Levy Chemelil, Software Engineer & IT Support Specialist.

## 🌟 Features

### Core Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Theme**: Toggle between light and dark modes with smooth transitions
- **Smooth Animations**: Professional animations and micro-interactions
- **Modern UI/UX**: Clean, contemporary design with gradient accents
- **Contact Form**: Functional contact form that opens email client
- **SEO Optimized**: Semantic HTML5 structure for better search visibility

### Sections
- **Hero**: Eye-catching introduction with call-to-action buttons
- **About**: Professional summary and technical skills showcase
- **Education**: Academic background and qualifications
- **Projects**: Featured projects including Thrive HRMS and Multi-Admission System
- **Experience**: Work history with timeline layout
- **Certificates**: Professional certifications and achievements
- **Contact**: Contact information and functional contact form

## 🎨 Theme Customization

### Color Scheme
The portfolio uses CSS custom properties for easy customization:

#### Light Theme (Default)
- Primary: `#2563eb` (Blue)
- Secondary: `#1e40af` (Dark Blue)
- Background: `#ffffff` (White)
- Text: `#1f2937` (Dark Gray)

#### Dark Theme
- Primary: `#3b82f6` (Light Blue)
- Secondary: `#2563eb` (Blue)
- Background: `#111827` (Dark Gray)
- Text: `#f9fafb` (Light Gray)

### Customizing Colors
To customize the color scheme, modify the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
    --text-dark: #your-color;
    --text-light: #your-color;
    --bg-light: #your-color;
    --bg-white: #your-color;
    /* ... other variables */
}
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup for structure
- **CSS3**: Modern styling with animations and transitions
- **Vanilla JavaScript**: Interactive features and theme switching
- **Font Awesome**: Icon library for UI elements
- **Google Fonts**: Inter font family for typography

## 📁 Project Structure

```
portfolio/
├── index.html          # Main HTML file
├── styles.css          # Complete stylesheet with dark theme
├── script.js           # JavaScript functionality
└── README.md           # This documentation file
```

## 🚀 Getting Started

### Local Development
1. Clone or download the project files
2. Navigate to the project directory
3. Start a local server (Python 3 recommended):

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

4. Open `http://localhost:8000` in your browser

### Deployment
The portfolio can be deployed to any static hosting service:

- **GitHub Pages**: Free hosting for public repositories
- **Netlify**: Drag-and-drop deployment
- **Vercel**: Zero-config deployment
- **Firebase Hosting**: Google's hosting solution

## 🎯 Key Features Explained

### Dark Theme Toggle
- Located in the navigation menu
- Smooth transition between themes
- Theme preference saved in localStorage
- Icon changes between moon (light) and sun (dark)

### Responsive Navigation
- Desktop: Horizontal navigation menu
- Mobile: Hamburger menu with slide-in navigation
- Smooth scrolling to sections

### Interactive Elements
- Hover effects on cards and buttons
- Animated skill tags
- 3D hover effects on certificate cards
- Parallax scrolling in hero section
- Typing animation for hero title

### Contact Form
- Form validation for required fields
- Email validation
- Opens default email client with pre-filled details
- Success message feedback

## 📱 Browser Compatibility

- Chrome/Chromium (Recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Customization Guide

### Adding New Projects
1. Copy an existing project card in `index.html`
2. Update the content with your project details
3. Modify tech tags as needed

### Updating Skills
1. Edit skill categories in the About section
2. Add or remove skill tags as needed
3. Categories: Web Development, Database & Backend, IT Support, Other Skills

### Modifying Contact Information
Update the contact details in the Contact section:
- Email address
- Phone number
- Address
- GitHub profile URL

### Changing Fonts
1. Visit Google Fonts
2. Select your preferred font
3. Update the import link in `index.html`
4. Modify the font-family in `styles.css`

## 🌐 SEO Optimization

The portfolio includes:
- Semantic HTML5 tags
- Meta tags for viewport and charset
- Proper heading hierarchy
- Alt text for images (when added)
- Descriptive page title

## 📊 Performance

- **Lightweight**: Minimal external dependencies
- **Optimized**: Efficient CSS and JavaScript
- **Fast**: Quick loading times
- **Smooth**: Hardware-accelerated animations

## 🤝 Contributing

This is a personal portfolio, but feel free to use it as inspiration for your own projects!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Contact

- **Name**: Levy Chemelil
- **Email**: levichelal87@gmail.com
- **Phone**: +254 718 376 639
- **Location**: Ngong Road, Nairobi, Kenya
- **GitHub**: https://github.com/chememlil

---

**Built with ❤️ using HTML, CSS, and JavaScript**
