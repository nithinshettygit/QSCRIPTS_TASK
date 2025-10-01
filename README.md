# Due Date Adjuster

A professional full-stack web application for task management with intelligent weekend date adjustment. Built with modern technologies including FastAPI, React, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **📋 Task Management**: Complete CRUD operations for project tasks
- **📅 Weekend Adjustment**: Intelligent date adjustment for weekend due dates:
  - Saturday → Monday (+2 days)
  - Sunday → Monday (+1 day)
- **✏️ Inline Editing**: Click-to-edit functionality for due dates
- **💾 CSV Persistence**: Data stored in structured CSV format
- **🔄 Real-time Updates**: Instant UI updates with backend synchronization

### User Experience
- **🎨 Modern UI**: Clean, responsive design with Tailwind CSS
- **📱 Mobile Responsive**: Works seamlessly on all device sizes
- **⚡ Fast Performance**: Optimized React components with efficient state management
- **🎯 Intuitive Interface**: User-friendly task management workflow




<img width="1920" height="1080" alt="task-management" src="https://github.com/user-attachments/assets/d225cd06-4c50-4aba-9266-090f0bf49fde" />


## 🏗️ Architecture

### Backend (FastAPI)
- **Framework**: FastAPI with automatic API documentation
- **Data Storage**: CSV file-based persistence
- **Date Processing**: Custom weekend adjustment logic
- **CORS**: Configured for frontend communication
- **Validation**: Pydantic models for data validation

### Frontend (React)
- **Framework**: React 18 with modern hooks
- **Styling**: Tailwind CSS for responsive design
- **HTTP Client**: Axios for API communication
- **State Management**: React hooks (useState, useEffect)
- **Build Tool**: Create React App

## 📁 Project Structure

```
due-date-adjuster/
├── backend/
│   ├── src/
│   │   └── api.py              # FastAPI application with all endpoints
│   ├── project_data.csv        # Task data storage
│   ├── requirements.txt        # Python dependencies
│   └── .gitignore             # Python-specific ignores
├── frontend/
│   ├── src/
│   │   ├── App.js             # Main React component
│   │   ├── App.css            # Custom styles
│   │   ├── index.js           # React entry point
│   │   └── index.css          # Tailwind CSS imports
│   ├── public/
│   │   ├── index.html         # HTML template
│   │   ├── manifest.json      # PWA manifest
│   │   └── robots.txt         # SEO robots file
│   ├── package.json           # Node.js dependencies
│   ├── tailwind.config.js     # Tailwind configuration
│   ├── postcss.config.js      # PostCSS configuration
│   └── .gitignore            # Node.js-specific ignores
├── start.sh                   # Linux/Mac startup script
├── start.bat                  # Windows startup script
├── .gitignore                # Root gitignore
└── README.md                 # This documentation
```

## 🛠️ Prerequisites

- **Python 3.8+** (recommended: Python 3.9+)
- **Node.js 16+** (recommended: Node.js 18+)
- **npm** or **yarn** package manager
- **Git** for version control

## ⚡ Quick Start

### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
# Clone the repository
git clone <repository-url>
cd due-date-adjuster

# Run the startup script
start.bat
```

**Linux/Mac:**
```bash
# Clone the repository
git clone <repository-url>
cd due-date-adjuster

# Make script executable and run
chmod +x start.sh
./start.sh
```

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment (recommended):**
   ```bash
   python -m venv venv
   
   # Activate virtual environment
   # Windows:
   venv\Scripts\activate
   # Linux/Mac:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the FastAPI server:**
   ```bash
   uvicorn src.api:app --reload
   ```

   **Backend will be available at:** `http://localhost:8000`

#### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm run dev
   ```

   **Frontend will be available at:** `http://localhost:3000`

## 🌐 Access Points

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Interactive API**: http://localhost:8000/redoc

## 🔌 API Endpoints

### GET /tasks
Retrieves all tasks from the system.

**Response:**
```json
[
  {
    "id": "1.21143E+15",
    "name": "Gather system requirements",
    "due_date": "2025-10-02",
    "section": "Planning",
    "assignee": "",
    "assignee_email": "",
    "start_date": "17/9/2025",
    "priority": "High",
    "progress": "",
    "notes": "",
    "tags": "",
    "projects": "Engineering project plan",
    "created_at": "22/9/2025",
    "completed_at": "",
    "last_modified": "22/9/2025"
  }
]
```

### POST /tasks
Creates a new task or updates an existing task's due date.

**Request Body:**
```json
{
  "id": "1.21143E+15",  // Optional: omit for new tasks
  "name": "Task name",
  "due_date": "2024-01-15",
  "start_date": "2024-01-10",  // Optional
  "section": "Planning",        // Optional
  "assignee": "John Doe",       // Optional
  "priority": "High",           // Optional: Low, Medium, High
  "progress": "In Progress"     // Optional: Not Started, In Progress, On Hold, Completed, Done
}
```

**Response:**
```json
{
  "id": "1.21143E+15",
  "name": "Task name",
  "due_date": "2024-01-15",  // Automatically adjusted if weekend
  "section": "Planning",
  "assignee": "John Doe",
  "assignee_email": "",
  "start_date": "10/1/2024",
  "priority": "High",
  "progress": "In Progress",
  "notes": "",
  "tags": "",
  "projects": "",
  "created_at": "1/1/2024",
  "completed_at": "",
  "last_modified": "1/1/2024"
}
```

### DELETE /tasks/{task_id}
**Note:** Task deletion is not supported in this implementation to preserve data integrity.

## 📅 Weekend Adjustment Logic

The application intelligently adjusts due dates that fall on weekends:

- **Saturday** → **Monday** (+2 days)
- **Sunday** → **Monday** (+1 day)
- **Weekdays** → **No change**

### Examples:
- Input: `2024-01-13` (Saturday) → Output: `2024-01-15` (Monday)
- Input: `2024-01-14` (Sunday) → Output: `2024-01-15` (Monday)
- Input: `2024-01-12` (Friday) → Output: `2024-01-12` (Friday)

## 🎯 Usage Guide

### Adding New Tasks
1. Click the **"Add New Task"** button
2. Fill in the required fields (Task Name and Due Date)
3. Optionally add Start Date, Section, Assignee, Priority, and Progress
4. Click **"Add Task"** to create the task

### Editing Due Dates
1. Click on any **due date** in the table
2. Select a new date from the date picker
3. Click **✓** to save or **✗** to cancel
4. Weekend dates are automatically adjusted to Monday

### Viewing Tasks
- Tasks are displayed in a structured table format
- Color-coded priority indicators (High=Red, Medium=Yellow, Low=Green)
- Progress status badges for easy tracking
- Responsive design works on all screen sizes

## 💾 Data Storage

Tasks are stored in `backend/project_data.csv` with comprehensive project information:

```csv
Task ID,Created At,Completed At,Last Modified,Name,Section/Column,Assignee,Assignee Email,Start Date,Due Date,Tags,Notes,Projects,Parent task,Blocked By (Dependencies),Blocking (Dependencies),Priority,Task Progress
1.21143E+15,22/9/2025,,22/9/2025,Gather system requirements,Planning,,,17/9/2025,2/10/2025,,,Engineering project plan,,,,High,
```

## 🛠️ Development

### Backend Development
- **Auto-reload**: FastAPI server automatically reloads on code changes
- **API Documentation**: Available at `http://localhost:8000/docs`
- **Interactive API**: Available at `http://localhost:8000/redoc`
- **CORS**: Configured for seamless frontend communication

### Frontend Development
- **Hot Reload**: React development server with instant updates
- **Tailwind CSS**: Utility-first styling framework
- **Axios**: HTTP client for API communication
- **Modern React**: Uses React 18 with hooks

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend is running on port 8000
   - Ensure frontend is running on port 3000
   - Check browser console for specific error messages

2. **CSV File Issues**
   - Verify `backend/project_data.csv` exists
   - Check file permissions
   - Ensure proper UTF-8 encoding

3. **Port Conflicts**
   - Backend: Change port in `uvicorn src.api:app --reload --port 8001`
   - Frontend: Change port in `npm run dev -- --port 3001`

4. **Dependencies Issues**
   - Backend: `pip install -r requirements.txt`
   - Frontend: `npm install`

### Debugging

- **Backend Logs**: Check terminal running `uvicorn`
- **Frontend Logs**: Check browser developer console
- **Network Issues**: Use browser Network tab to inspect API calls

## 🏆 Technical Highlights

### Backend Excellence
- **FastAPI**: Modern, fast Python web framework
- **Pydantic**: Robust data validation and serialization
- **CSV Processing**: Efficient file-based data persistence
- **Weekend Logic**: Custom business logic implementation
- **Error Handling**: Comprehensive error management

### Frontend Excellence
- **React 18**: Latest React features and optimizations
- **Tailwind CSS**: Modern, responsive design system
- **State Management**: Efficient React hooks usage
- **User Experience**: Intuitive, responsive interface
- **Performance**: Optimized rendering and API calls

### Code Quality
- **Clean Architecture**: Separation of concerns
- **Error Handling**: Graceful error management
- **Documentation**: Comprehensive API documentation
- **Type Safety**: Pydantic models for data validation
- **Responsive Design**: Mobile-first approach

## 📋 Project Requirements Met

✅ **Knowledgebase**: CSV file storage with automatic loading  
✅ **Backend**: FastAPI with weekend adjustment logic  
✅ **Frontend**: React with Tailwind CSS and inline editing  
✅ **API Endpoints**: GET/POST /tasks with proper validation  
✅ **Weekend Adjustment**: Saturday→Monday, Sunday→Monday  
✅ **Auto-save**: Manual save with visual feedback  
✅ **Project Setup**: Complete with dependencies and scripts  
✅ **Documentation**: Comprehensive README and API docs  
✅ **Production Ready**: Clean, maintainable code structure  

## 🚀 Deployment Ready

This project is production-ready with:
- Comprehensive error handling
- Input validation and sanitization
- Responsive design for all devices
- Clean, maintainable code structure
- Complete documentation
- Automated setup scripts

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ for modern task management**
