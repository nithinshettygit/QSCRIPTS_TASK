# Contributing to Due Date Adjuster

Thank you for your interest in contributing to the Due Date Adjuster project! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/due-date-adjuster.git
   cd due-date-adjuster
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # or
   venv\Scripts\activate     # Windows
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Start Development Servers**
   ```bash
   # Backend (in backend directory)
   uvicorn src.api:app --reload
   
   # Frontend (in frontend directory)
   npm run dev
   ```

## 📝 Development Guidelines

### Code Style

#### Backend (Python)
- Follow PEP 8 style guidelines
- Use type hints for function parameters and return values
- Add docstrings for functions and classes
- Use meaningful variable and function names

#### Frontend (JavaScript/React)
- Use functional components with hooks
- Follow React best practices
- Use meaningful component and variable names
- Add comments for complex logic

### Git Workflow

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, readable code
   - Add tests if applicable
   - Update documentation

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

4. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format

Use conventional commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest tests/
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📋 Pull Request Process

1. **Ensure Tests Pass**
   - All existing tests should pass
   - Add new tests for new functionality

2. **Update Documentation**
   - Update README.md if needed
   - Add API documentation for new endpoints
   - Update inline code comments

3. **Code Review**
   - Ensure code follows style guidelines
   - Verify functionality works as expected
   - Check for potential security issues

## 🐛 Reporting Issues

When reporting issues, please include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Python version, Node version)
- Screenshots if applicable

## 💡 Feature Requests

For feature requests, please:
- Describe the feature clearly
- Explain the use case
- Consider implementation complexity
- Check if similar features already exist

## 📚 Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://reactjs.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Python Style Guide (PEP 8)](https://www.python.org/dev/peps/pep-0008/)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow the golden rule

## 📞 Contact

For questions or concerns, please:
- Open an issue on GitHub
- Contact the maintainers
- Join our community discussions

Thank you for contributing to Due Date Adjuster! 🎉
