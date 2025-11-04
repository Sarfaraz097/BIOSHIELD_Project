# 🛡️ BIOSHIELD - Smart Digital Farm Management Portal

**Version 1.0.0**

A comprehensive web-based farm management system designed specifically for pig and poultry farms, focusing on animal health tracking, vaccine management, environmental monitoring, and biosecurity compliance.

## 🌟 Features

### 🔐 User Authentication
- Secure user registration and login system
- Farm-specific profiles with contact information
- Local data storage with automatic backup

### 🐷 Animal Management
- Add and manage farm animals (pigs, chickens, ducks, turkeys)
- Comprehensive animal profiles with health status tracking
- Search and filter capabilities
- Animal health history and notes

### 💉 Vaccine Management
- Automated vaccine scheduling based on animal type
- Reminder system for due and overdue vaccinations
- Comprehensive vaccine library for different animals
- Vaccination history tracking
- Automatic calculation of next due dates

### 🌡️ Environmental Monitoring
- Real-time sensor data simulation (Temperature, Humidity, Ammonia)
- Visual charts and graphs for trend analysis
- Automated alerts for out-of-range conditions
- Historical data storage and analysis

### 🔔 Alert & Notification System
- Real-time notifications for critical events
- Toast notifications with sound alerts
- Comprehensive alert management dashboard
- Automatic vaccine reminders
- Environmental condition alerts

### 🦠 Biosecurity Guidelines
- Interactive multilingual biosecurity checklists
- Step-by-step compliance tracking
- Progress monitoring and reporting
- Available in English, Spanish, French, and German

### 📊 Reporting System
- Animal inventory reports
- Vaccination schedule reports
- Environmental monitoring reports
- Comprehensive farm management reports
- HTML report generation with download capability

### 📱 Responsive Design
- Mobile-friendly interface
- Optimized for tablets and smartphones
- Touch-friendly interactions
- Adaptive layouts

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation

1. **Download the project files**
   ```bash
   # Option 1: Clone the repository (if available)
   git clone [repository-url]
   
   # Option 2: Download and extract the ZIP file
   ```

2. **Navigate to the project directory**
   ```bash
   cd BIOSHIELD
   ```

3. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local development server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

4. **Access the application**
   - Open your browser and navigate to the appropriate URL
   - For local file: `file:///path/to/BIOSHIELD/index.html`
   - For local server: `http://localhost:8000`

## 📚 User Guide

### First Time Setup

1. **Registration**
   - Click "Register here" on the login page
   - Fill in your farm details:
     - Full Name
     - Email Address
     - Phone Number
     - Farm Name
     - Farm Location
     - Password
   - Click "Register" to create your account

2. **Login**
   - Use your email and password to login
   - Check "Remember me" for automatic login

### Dashboard Overview

The main dashboard provides:
- **Key Metrics**: Total animals, pending vaccines, active alerts, average temperature
- **Recent Activities**: Timeline of farm management activities
- **Live Sensor Data**: Real-time environmental monitoring
- **Quick Navigation**: Access to all modules

### Managing Animals

1. **Adding Animals**
   - Go to Animals section
   - Click "Add New Animal"
   - Fill in animal details:
     - Name and Tag/ID
     - Type (pig, chicken, duck, turkey)
     - Breed (auto-populated based on type)
     - Gender, birth date, weight
     - Health status and notes
   - Click "Add Animal"

2. **Managing Animal Records**
   - View animal cards with key information
   - Click "View" for detailed information
   - Click "Edit" to modify animal details
   - Click "Vaccine" to add vaccination records
   - Use search and filters to find specific animals

### Vaccine Management

1. **Scheduling Vaccines**
   - Access through Animals → Vaccine button
   - Select vaccine type from recommended list
   - Set dates and administration details
   - System automatically calculates next due dates

2. **Monitoring Schedules**
   - View upcoming vaccinations in Vaccines section
   - Receive automatic reminders
   - Mark vaccinations as completed
   - Postpone if necessary

### Environmental Monitoring

1. **Sensor Data**
   - View real-time temperature, humidity, and ammonia levels
   - Monitor trends through interactive charts
   - Receive alerts for out-of-range conditions

2. **Alert Management**
   - Configure alert thresholds
   - Receive notifications for critical conditions
   - Resolve or dismiss alerts as appropriate

### Biosecurity Compliance

1. **Guidelines**
   - Access multilingual biosecurity checklists
   - Track compliance progress
   - Mark completed steps
   - Generate compliance reports

2. **Language Support**
   - Switch between English, Spanish, French, German
   - Localized content and instructions

### Generating Reports

1. **Report Types**
   - **Animal Report**: Complete livestock inventory
   - **Vaccine Report**: Vaccination schedules and history
   - **Sensor Report**: Environmental monitoring data
   - **Comprehensive Report**: Complete farm overview

2. **Generating Reports**
   - Go to Reports section
   - Click desired report type
   - Reports are automatically downloaded as HTML files

## 🔧 Technical Details

### Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: Browser localStorage
- **Icons**: Font Awesome 6.0
- **Fonts**: Google Fonts (Poppins)
- **Architecture**: Modular JavaScript with class-based components

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Data Storage
- All data is stored locally in browser localStorage
- No external servers or databases required
- Data persists between sessions
- Automatic backup and cleanup features

### Security Features
- Client-side data encryption (basic)
- Input validation and sanitization
- XSS protection measures
- Secure password handling

## 📁 Project Structure

```
BIOSHIELD/
├── index.html              # Main application entry point
├── README.md               # This file
├── css/
│   ├── style.css          # Global styles and components
│   ├── auth.css           # Authentication page styles
│   └── dashboard.css      # Dashboard and module styles
├── js/
│   ├── app.js             # Main application controller
│   ├── auth.js            # Authentication management
│   ├── dashboard.js       # Dashboard functionality
│   ├── animals.js         # Animal management
│   ├── vaccines.js        # Vaccine scheduling
│   ├── alerts.js          # Notification system
│   ├── biosecurity.js     # Biosecurity guidelines
│   └── sensors.js         # Sensor monitoring & reports
├── data/                  # Sample data files (if needed)
└── images/                # Application images and icons
```

## 🎯 Key Features in Detail

### Animal Management
- **Comprehensive Profiles**: Store detailed information for each animal
- **Health Tracking**: Monitor health status and maintain medical records
- **Smart Search**: Find animals quickly by name, ID, or type
- **Batch Operations**: Manage multiple animals efficiently

### Vaccine Scheduling
- **Automated Reminders**: Never miss a vaccination deadline
- **Species-Specific**: Tailored vaccine schedules for different animals
- **Progress Tracking**: Monitor vaccination completion rates
- **History Maintenance**: Complete vaccination history for each animal

### Environmental Monitoring
- **Multi-Parameter**: Temperature, humidity, and ammonia monitoring
- **Real-Time Alerts**: Immediate notifications for dangerous conditions
- **Trend Analysis**: Visual charts showing environmental patterns
- **Data Export**: Generate environmental reports for analysis

### Biosecurity Compliance
- **Interactive Checklists**: Step-by-step biosecurity protocols
- **Progress Tracking**: Monitor compliance across all categories
- **Multilingual Support**: Available in multiple languages
- **Report Generation**: Create compliance reports for audits

## 🚦 System Requirements

### Minimum Requirements
- Modern web browser with JavaScript enabled
- 50MB available storage space
- Internet connection for initial loading of external fonts/icons

### Recommended
- High-resolution display (1920x1080 or higher)
- Fast internet connection for optimal experience
- Regular browser updates for security and performance

## 🔄 Data Management

### Backup and Export
- **Manual Export**: Use Ctrl+S to export all farm data
- **Automatic Backup**: System creates periodic backups
- **Data Import**: Import previously exported data
- **Report Generation**: Create detailed reports in HTML format

### Data Privacy
- All data stored locally on your device
- No data sent to external servers
- Complete privacy and control over your information
- Optional data sharing for backup purposes

## 🆘 Troubleshooting

### Common Issues

1. **Application won't load**
   - Check browser compatibility
   - Ensure JavaScript is enabled
   - Clear browser cache and cookies
   - Try in incognito/private mode

2. **Data not saving**
   - Check available storage space
   - Ensure localStorage is enabled
   - Try refreshing the page
   - Clear browser data and re-register

3. **Notifications not working**
   - Allow notifications in browser settings
   - Check if audio is muted
   - Verify alert thresholds are configured

4. **Reports not generating**
   - Ensure popup blocker is disabled
   - Check download permissions
   - Try different browser

### Getting Help
- Check browser console for error messages
- Use browser developer tools to inspect issues
- Clear application data and start fresh if needed

## 🔮 Future Enhancements

### Planned Features
- **Data Synchronization**: Cloud backup and sync across devices
- **Advanced Analytics**: Machine learning insights and predictions
- **Mobile App**: Native mobile applications for iOS and Android
- **Multi-Farm Support**: Manage multiple farm locations
- **Integration**: Connect with external IoT sensors and systems
- **Collaboration**: Multi-user support with role-based access

### Contributing
This is currently a demonstration project. For production use, consider:
- Adding proper backend infrastructure
- Implementing real database storage
- Adding user authentication with proper security
- Integrating with actual IoT sensors
- Adding more comprehensive reporting features

## 📄 License

This project is provided as-is for demonstration and educational purposes. 

## 📞 Support

For technical support or questions about this demonstration:
- Review the troubleshooting section above
- Check browser console for error messages
- Ensure all project files are properly loaded

---

**BIOSHIELD - Protecting Your Farm Through Smart Management** 🛡️

*Built with modern web technologies for the future of farm management*