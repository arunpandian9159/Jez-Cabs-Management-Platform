# Jez Cabs Management Platform - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

This guide will help you get the Jez Cabs Management Platform up and running quickly.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- MongoDB database running
- Git (optional)

## Step 1: Start the Backend

1. Open a terminal and navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Make sure your `.env` file is configured:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/jez_cabs
MONGODB_URI=mongodb://localhost:27017/jez_cabs
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
```

4. Run database migrations:
```bash
npm run migration:run
```

5. Start the backend server:
```bash
npm run start:dev
```

✅ Backend should now be running at http://localhost:3000

## Step 2: Start the Frontend

1. Open a **new terminal** and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Verify the `.env` file exists with:
```env
VITE_API_URL=http://localhost:3000/api
```

4. Start the frontend development server:
```bash
npm run dev
```

✅ Frontend should now be running at http://localhost:5173

## Step 3: Access the Application

1. Open your browser and go to:
```
http://localhost:5173
```

2. You should see the login page

## Step 4: Create Your First Account

1. Click on **"Register here"** link on the login page

2. Fill in the registration form:
   - **Personal Information:**
     - First Name: John
     - Last Name: Doe
     - Email: john@example.com
     - Password: password123
   
   - **Company Information:**
     - Company Name: My Cab Company
     - Company Email: info@mycabcompany.com
     - Company Phone: +1234567890 (optional)
     - Company Address: 123 Main St (optional)

3. Click **"Create Account"**

4. You'll be automatically logged in and redirected to the dashboard

## Step 5: Explore the Platform

### Dashboard
- View your fleet statistics
- See revenue trends
- Monitor active bookings
- Check alerts and notifications

### Add Your First Vehicle
1. Click **"Fleet"** in the sidebar
2. Click **"Add Vehicle"** button
3. Fill in the vehicle details:
   - Make: Toyota
   - Model: Camry
   - Year: 2023
   - Registration Number: ABC-1234
   - Status: Available
   - Daily Rental Rate: 50
4. Click **"Add Vehicle"**

### Add Your First Driver
1. Click **"Drivers"** in the sidebar
2. Click **"Add Driver"** button
3. Fill in the driver details:
   - First Name: Mike
   - Last Name: Smith
   - Email: mike@example.com
   - Phone: +1234567890
   - License Number: DL123456
   - License Expiry: (select a future date)
4. Click **"Add Driver"**

### Create Your First Booking
1. Click **"Bookings"** in the sidebar
2. Click **"New Booking"** button
3. Fill in the booking details:
   - Vehicle: Select the vehicle you created
   - Customer Name: Jane Customer
   - Customer Email: jane@example.com
   - Customer Phone: +0987654321
   - Start Date: (select today)
   - End Date: (select a future date)
   - Pickup Location: Airport
   - Status: Active
4. Click **"Create Booking"**

### Generate Your First Invoice
1. Click **"Invoices"** in the sidebar
2. Click **"New Invoice"** button
3. Fill in the invoice details:
   - Booking: Select the booking you created
   - Subtotal: 500
   - Tax Rate: 10
   - Discount: 0
   - Due Date: (select a future date)
   - Status: Sent
4. Click **"Create Invoice"**
5. You can mark it as paid by clicking **"Mark as Paid"**

### View Reports
1. Click **"Reports"** in the sidebar
2. View revenue trends, fleet utilization, and statistics

## 🎯 Common Tasks

### Updating Vehicle Status
1. Go to Fleet
2. Click **"Edit"** on any vehicle
3. Change the status (Available, Rented, In Maintenance)
4. Click **"Update Vehicle"**

### Activating/Deactivating Drivers
1. Go to Drivers
2. Click **"Activate"** or **"Deactivate"** button on any driver card

### Filtering and Searching
- Use the search bar to find specific items
- Use status filters to narrow down results
- All lists support real-time filtering

### Logging Out
1. Click on your avatar in the top-right corner
2. Click **"Logout"**

## 📱 Mobile Access

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

Simply access http://localhost:5173 from any device on your network.

## 🔧 Troubleshooting

### Backend Not Starting
- Check if PostgreSQL is running
- Check if MongoDB is running
- Verify database credentials in `.env`
- Run `npm install` again

### Frontend Not Starting
- Check if backend is running
- Verify `VITE_API_URL` in `.env`
- Run `npm install` again
- Clear browser cache

### Cannot Login
- Make sure you registered an account
- Check if backend is running
- Check browser console for errors
- Try clearing localStorage

### API Errors
- Check backend logs in the terminal
- Verify backend is running on port 3000
- Check Swagger docs at http://localhost:3000/api/docs

## 📚 Additional Resources

- **Backend API Documentation:** http://localhost:3000/api/docs
- **Frontend README:** `frontend/README.md`
- **Architecture Guide:** `ARCHITECTURE.md`
- **API Testing Guide:** `API_TESTING_GUIDE.md`

## 🎓 Learning Path

1. **Day 1:** Set up and explore the dashboard
2. **Day 2:** Add vehicles and drivers
3. **Day 3:** Create bookings and manage rentals
4. **Day 4:** Generate invoices and track payments
5. **Day 5:** Explore reports and analytics

## 💡 Tips

- **Use Search:** All lists have search functionality
- **Check Alerts:** Dashboard shows important alerts
- **Monitor Expiry:** System alerts for expiring documents
- **Track Revenue:** Use reports for business insights
- **Stay Organized:** Use status filters to manage workflow

## 🆘 Getting Help

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the error messages in browser console
3. Check backend logs in the terminal
4. Refer to the documentation files

## 🎉 You're All Set!

You now have a fully functional cab rental management platform. Start managing your fleet, bookings, and revenue with ease!

---

**Happy Managing! 🚕**

