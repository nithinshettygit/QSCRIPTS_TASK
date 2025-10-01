# Deployment Guide

This guide covers various deployment options for the Due Date Adjuster application.

## 🚀 Deployment Options

### 1. Local Development
See the main README.md for local development setup instructions.

### 2. Docker Deployment

#### Backend Dockerfile
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "src.api:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Frontend Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend/project_data.csv:/app/project_data.csv
    environment:
      - PYTHONPATH=/app

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - REACT_APP_API_URL=http://localhost:8000
```

### 3. Cloud Deployment

#### Heroku

**Backend (Heroku)**
```bash
# Install Heroku CLI
# Create Procfile
echo "web: uvicorn src.api:app --host 0.0.0.0 --port \$PORT" > Procfile

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

**Frontend (Netlify/Vercel)**
```bash
# Build command
npm run build

# Publish directory
build/

# Environment variables
REACT_APP_API_URL=https://your-backend.herokuapp.com
```

#### AWS EC2

1. **Launch EC2 Instance**
   - Choose Ubuntu 20.04 LTS
   - Configure security groups (ports 22, 80, 443, 3000, 8000)

2. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install python3 python3-pip nodejs npm nginx
   ```

3. **Deploy Application**
   ```bash
   git clone <repository-url>
   cd due-date-adjuster
   
   # Backend
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   
   # Frontend
   cd ../frontend
   npm install
   npm run build
   ```

4. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           root /path/to/frontend/build;
           index index.html;
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### 4. Production Considerations

#### Environment Variables
```bash
# Backend
DATABASE_URL=your-database-url
SECRET_KEY=your-secret-key
DEBUG=False

# Frontend
REACT_APP_API_URL=https://your-api-domain.com
```

#### Security
- Use HTTPS in production
- Implement proper CORS settings
- Add rate limiting
- Use environment variables for sensitive data
- Regular security updates

#### Performance
- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies
- Monitor application performance

#### Monitoring
- Set up logging
- Monitor error rates
- Track performance metrics
- Set up alerts

## 🔧 Configuration

### Backend Configuration
```python
# src/config.py
import os

class Settings:
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tasks.db")
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

settings = Settings()
```

### Frontend Configuration
```javascript
// src/config.js
const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  environment: process.env.NODE_ENV || 'development'
};

export default config;
```

## 📊 Health Checks

### Backend Health Check
```python
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}
```

### Frontend Health Check
```javascript
// Add to package.json scripts
"health-check": "curl -f http://localhost:3000 || exit 1"
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CORS configuration
   - Verify frontend URL in backend settings

2. **Port Conflicts**
   - Use environment variables for ports
   - Check if ports are already in use

3. **File Permissions**
   - Ensure proper file permissions
   - Check CSV file access

4. **Memory Issues**
   - Monitor memory usage
   - Optimize large datasets

### Logs
```bash
# Backend logs
tail -f backend.log

# Frontend logs
npm run build 2>&1 | tee frontend.log

# System logs
journalctl -u your-service-name
```

## 📈 Scaling

### Horizontal Scaling
- Use load balancers
- Implement session management
- Database clustering

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Backend
        run: |
          # Deploy backend
          
      - name: Deploy Frontend
        run: |
          # Deploy frontend
```

## 📝 Maintenance

### Regular Tasks
- Update dependencies
- Security patches
- Performance monitoring
- Backup data
- Review logs

### Updates
- Test in staging environment
- Plan deployment windows
- Monitor after deployment
- Rollback plan ready

---

For specific deployment questions, please refer to the documentation of your chosen platform or open an issue.
