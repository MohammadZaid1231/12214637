# 🔗 URL Shortener with Logging Middleware

A React-based URL shortener app that supports real-time statistics, custom shortcodes, expiration management, and a robust logging middleware. Designed with performance, accessibility, and developer experience in mind.

---

## 📁 Project Structure

url-shortener/
├── public/
│ ├── index.html
│ └── favicon.ico
├── src/
│ ├── components/
│ │ ├── URLShortener.js
│ │ ├── Statistics.js
│ │ └── LoggingMiddleware.js
│ ├── App.js
│ ├── App.css
│ └── index.js
├── package.json
└── README.md


---

## 🚀 Getting Started

### 1️⃣ Installation Steps

```bash
# Step 1: Create the project
npx create-react-app url-shortener
cd url-shortener

# Step 2: Install dependencies
npm install

# Step 3: Start development server
npm start
✨ Features Implemented
✅ URL Shortening
Shorten up to 5 concurrent URLs

Custom shortcodes supported

Auto-generated shortcodes

Set validity period (default: 30 minutes)

Client-side validation

✅ Statistics Page
View all shortened URLs

Click tracking with timestamp

Creation & expiry dates

Status indicators: Active / Expired

Detailed click history

✅ Logging Middleware
Logs to console and localStorage

Sends logs to external evaluation service API

Tracks user interactions, errors, and debug info

Frontend/backend stack tracing

✅ User Interface
Responsive design

Tab-based navigation

One-click copy to clipboard

URL redirection

Modal dialogs for detailed stats

🗂 Folder Structure for Submission
your-roll-number/
├── logging-middleware/
│   ├── logger.js
│   └── middleware.js
├── backend-frontend-test-submission/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
└── README.md
🛠 Key Implementation Details
🔧 Logging Middleware
Logs info, error, and debug levels

Sends log events to:

http://20.244.56.144/evaluation-service/logs
Uses localStorage for log persistence

Graceful error handling

🔗 URL Shortening
Generates unique 6-character codes

Validates URLs on client side

Expiry time management

Stores data in localStorage (mock backend)

📊 Statistics
Tracks real-time click count

Provides analytics & history

Responsive, scrollable data tables

Export stats functionality

🧪 Testing the Application
✅ URL Shortening
Enter a long URL

Optionally set validity period

Confirm shortened link is generated

✅ Statistics
View all shortened links

Click on links to track

Review click timestamps and metadata

✅ Logging
Open browser console

Validate logged events

Ensure logs are sent to API endpoint

📦 GitHub Deployment Steps
# Initialize Git repo
git init

# Create folders
mkdir logging-middleware
mkdir backend-frontend-test-submission

# Add and commit files
git add .
git commit -m "Initial commit: URL Shortener application with logging middleware"

# Push to GitHub
git remote add origin https://github.com/yourusername/your-roll-number.git
git branch -M main
git push -u origin main
🌟 Best Practices Followed
✅ Clean, modular folder structure
✅ Component-based architecture
✅ Robust error handling & validation
✅ Mobile-first, responsive UI
✅ Accessibility-first design
✅ Optimized rendering performance
✅ Git commit best practices
