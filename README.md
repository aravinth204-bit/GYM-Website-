# FitZone Gym Website

A modern, fully responsive gym website with member authentication and management dashboard built with HTML, CSS, and JavaScript.

## 📁 Project Structure

```
Responsive Design/
├── index.html              # Gym landing page
├── login.html             # Member login page
├── register.html          # Membership registration
├── admin.html             # Gym management dashboard
├── css/
│   ├── styles.css         # Main website styles
│   ├── auth.css          # Authentication pages styles
│   └── admin.css         # Dashboard styles
├── js/
│   ├── script.js         # Main website functionality
│   ├── auth.js           # Member authentication logic
│   └── admin.js          # Gym management logic
└── assets/               # For future images/media
```

## ✨ Features

### Gym Website (index.html)
- **Fully Responsive Design** - Works on mobile, tablet, and desktop
- **Modern Fitness UI/UX** - Energetic design with purple gradient theme
- **Interactive Navigation** - Smooth scrolling, active link highlighting
- **Mobile Menu** - Hamburger menu with animations
- **Sections**: Hero, About FitZone, Programs, Gym Gallery, Contact, Footer

### Member Authentication
- **Login Page** (login.html)
  - Email and password validation
  - Password visibility toggle
  - Remember me functionality
  - Demo credentials displayed
  - Client-side authentication using localStorage

- **Registration Page** (register.html)
  - Membership sign-up form
  - Password strength indicator
  - Password confirmation matching
  - Terms & conditions checkbox
  - Duplicate email detection

### Gym Management Dashboard (admin.html)
- **Dashboard Overview**
  - Statistics: Active Members, Classes, Trainers, Revenue
  - Recent gym activity feed
  - Quick action buttons
  
- **Member Management**
  - Member table with membership type badges
  - Edit and delete member actions
  
- **Class Management**
  - Yoga, HIIT, Zumba class schedules
  - Class session management
  
- **Trainer Management**
  - Staff and personal trainer roster
  - Trainer certifications
  
- **Settings**
  - Gym configuration
  - Operational preferences
  
- **Additional Features**
  - Responsive sidebar navigation
  - User profile dropdown
  - Session management (30-minute timeout)
  - Auto logout functionality

## 🚀 Getting Started

1. **Open the Website**
   - Simply open `index.html` in your web browser
   - Or use VS Code Live Server for better development experience

2. **Test Member Authentication**
   - Navigate to `login.html` or click "Member Login"
   - Use demo credentials:
     - **Email**: member@fitzone.com
     - **Password**: fitzone123

3. **Register New Membership**
   - Go to `register.html` or click "Join Now"
   - Fill in the form with valid information
   - Registered members are stored in localStorage

4. **Access Gym Management Dashboard**
   - After successful login, you'll be redirected to `admin.html`
   - Explore: Members, Classes, Trainers, Settings
   - Session expires after 30 minutes of inactivity

## 🎨 Design Features

- **Color Scheme**: Modern purple/blue gradient theme
- **Typography**: System fonts for optimal performance
- **Layout**: CSS Grid and Flexbox for responsive layouts
- **Animations**: Smooth transitions and scroll animations
- **Mobile-First**: Designed for mobile devices first, then scaled up

## 🔒 Security (Client-Side Demo)

**Note**: This is a demo project without a real database.

- User sessions stored in `localStorage`
- No actual backend or database
- Passwords NOT encrypted (demo only)
- Demo credentials provided for testing
- 30-minute session timeout
- Auto logout on inactivity

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1023px
- **Desktop**: ≥ 1024px

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling, Grid, Flexbox
- **JavaScript (Vanilla)** - No frameworks or libraries
- **LocalStorage** - Client-side data persistence

## 📄 Pages Overview

| Page | Description | Access |
|------|-------------|--------|
| index.html | FitZone Gym landing page | Public |
| login.html | Member login | Public |
| register.html | Membership registration | Public |
| admin.html | Gym management dashboard | Protected (requires login) |

## 🎯 Key Features

✅ Fully responsive on all devices  
✅ Modern gym-themed design  
✅ Smooth animations and transitions  
✅ Member authentication system  
✅ Password strength checker  
✅ Session management  
✅ Mobile-friendly navigation  
✅ Professional folder structure  
✅ Clean, maintainable code  
✅ No external dependencies  
✅ Gym management dashboard  
✅ Member, class & trainer management  

## 💡 Usage Tips

- **Development**: Use Live Server extension in VS Code
- **Testing**: Try different screen sizes using browser dev tools
- **Login**: Use demo credentials (member@fitzone.com / fitzone123)
- **Mobile**: Test hamburger menu and responsive layouts
- **Dashboard**: Explore gym management features
- **Session**: Dashboard logs out after 30 minutes of inactivity

## 📝 Future Enhancements

- Backend integration (Node.js, PHP, etc.)
- Real database (MySQL, MongoDB, etc.)
- Password encryption
- Email verification
- Payment gateway integration
- Online class booking system
- Member attendance tracking
- Workout plan builder
- Progress tracking & analytics
- Nutrition calculator
- Mobile app integration
- QR code check-in system

## 📧 Demo Credentials

**Email**: member@fitzone.com  
**Password**: fitzone123

---

**Built with ❤️ using HTML, CSS, and JavaScript**

Created: December 25, 2025
