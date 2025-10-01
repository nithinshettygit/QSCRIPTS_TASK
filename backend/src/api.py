from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import csv
import os
from datetime import datetime, date

app = FastAPI(title="Due Date Adjuster API", version="1.0.0")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data model
class Task(BaseModel):
    id: Optional[str] = None
    name: str
    due_date: str  # ISO date format (YYYY-MM-DD)
    start_date: Optional[str] = ""
    section: Optional[str] = ""
    assignee: Optional[str] = ""
    priority: Optional[str] = "Medium"
    progress: Optional[str] = "Not Started"

class TaskResponse(BaseModel):
    id: str
    name: str
    due_date: str
    section: Optional[str] = ""
    assignee: Optional[str] = ""
    assignee_email: Optional[str] = ""
    start_date: Optional[str] = ""
    priority: Optional[str] = ""
    progress: Optional[str] = ""
    notes: Optional[str] = ""
    tags: Optional[str] = ""
    projects: Optional[str] = ""
    created_at: Optional[str] = ""
    completed_at: Optional[str] = ""
    last_modified: Optional[str] = ""

# CSV file path
CSV_FILE = os.path.join(os.path.dirname(__file__), "..", "project_data.csv")

def ensure_data_directory():
    """Ensure the data directory exists"""
    os.makedirs("data", exist_ok=True)

def load_tasks() -> List[dict]:
    """Load tasks from CSV file"""
    if not os.path.exists(CSV_FILE):
        return []
    
    try:
        tasks = []
        seen_ids = set()
        with open(CSV_FILE, 'r', newline='', encoding='utf-8-sig') as file:
            reader = csv.DictReader(file)
            for row_num, row in enumerate(reader, start=2):  # Start at 2 for CSV row numbers
                # Handle BOM in Task ID field
                task_id = row.get('Task ID') or row.get('ï»¿Task ID')
                if task_id and row.get('Name'):  # Only include valid rows
                    # Create unique ID by combining task_id with row number to handle duplicates
                    unique_id = f"{task_id}_{row_num}"
                    
                    # Convert due date from DD/MM/YYYY to YYYY-MM-DD if it exists
                    due_date = row.get('Due Date', '').strip()
                    if due_date:
                        try:
                            # Parse DD/MM/YYYY format
                            day, month, year = due_date.split('/')
                            due_date = f"{year}-{month.zfill(2)}-{day.zfill(2)}"
                        except:
                            due_date = ''
                    
                    # Convert start date from DD/MM/YYYY to YYYY-MM-DD if it exists
                    start_date = row.get('Start Date', '').strip()
                    if start_date:
                        try:
                            # Parse DD/MM/YYYY format
                            day, month, year = start_date.split('/')
                            start_date = f"{year}-{month.zfill(2)}-{day.zfill(2)}"
                        except:
                            start_date = ''
                    
                    tasks.append({
                        'id': unique_id,
                        'original_id': task_id,  # Keep original ID for CSV updates
                        'row_number': row_num,  # Keep row number for CSV updates
                        'name': row['Name'],
                        'due_date': due_date,
                        'section': row.get('Section/Column', ''),
                        'assignee': row.get('Assignee', ''),
                        'assignee_email': row.get('Assignee Email', ''),
                        'start_date': start_date,
                        'priority': row.get('Priority', ''),
                        'progress': row.get('Task Progress', ''),
                        'notes': row.get('Notes', ''),
                        'tags': row.get('Tags', ''),
                        'projects': row.get('Projects', ''),
                        'created_at': row.get('Created At', ''),
                        'completed_at': row.get('Completed At', ''),
                        'last_modified': row.get('Last Modified', '')
                    })
        return tasks
    except Exception as e:
        print(f"Error loading CSV: {e}")
        return []

def save_tasks(tasks: List[dict]):
    """Save tasks to CSV file"""
    if not tasks:
        return
    
    # Read the original CSV to preserve all columns
    original_data = []
    fieldnames = []
    
    try:
        with open(CSV_FILE, 'r', newline='', encoding='utf-8-sig') as file:
            reader = csv.DictReader(file)
            fieldnames = reader.fieldnames
            original_data = list(reader)
    except:
        # If file doesn't exist or is empty, create new with default headers
        fieldnames = ['Task ID', 'Created At', 'Completed At', 'Last Modified', 'Name', 'Section/Column', 'Assignee', 'Assignee Email', 'Start Date', 'Due Date', 'Tags', 'Notes', 'Projects', 'Parent task', 'Blocked By (Dependencies)', 'Blocking (Dependencies)', 'Priority', 'Task Progress']
        original_data = []
    
    # Create a map of unique_id to task data for quick lookup
    task_map = {str(task['id']): task for task in tasks}
    
    # Update existing rows using row_number for precise targeting
    for task in tasks:
        if 'row_number' in task:
            row_index = task['row_number'] - 2  # Convert to 0-based index (subtract 2 for header + 1-based row)
            if 0 <= row_index < len(original_data):
                row = original_data[row_index]
                
                # Convert YYYY-MM-DD back to DD/MM/YYYY
                if task.get('due_date'):
                    try:
                        year, month, day = task['due_date'].split('-')
                        row['Due Date'] = f"{day}/{month}/{year}"
                    except:
                        row['Due Date'] = task['due_date']
                else:
                    row['Due Date'] = ''
                
                # Update last_modified if provided
                if 'last_modified' in task:
                    row['Last Modified'] = task['last_modified']
    
    # Add new tasks that don't have row_number (completely new tasks)
    for task in tasks:
        if 'row_number' not in task:
            new_row = {}
            for field in fieldnames:
                if field == 'ï»¿Task ID' or field == 'Task ID':
                    new_row[field] = task.get('original_id', task['id'])
                elif field == 'Name':
                    new_row[field] = task['name']
                elif field == 'Due Date':
                    if task.get('due_date'):
                        try:
                            year, month, day = task['due_date'].split('-')
                            new_row[field] = f"{day}/{month}/{year}"
                        except:
                            new_row[field] = task['due_date']
                    else:
                        new_row[field] = ''
                elif field == 'Start Date':
                    if task.get('start_date'):
                        try:
                            year, month, day = task['start_date'].split('-')
                            new_row[field] = f"{day}/{month}/{year}"
                        except:
                            new_row[field] = task['start_date']
                    else:
                        new_row[field] = ''
                elif field == 'Section/Column':
                    new_row[field] = task.get('section', '')
                elif field == 'Assignee':
                    new_row[field] = task.get('assignee', '')
                elif field == 'Priority':
                    new_row[field] = task.get('priority', 'Medium')
                elif field == 'Task Progress':
                    new_row[field] = task.get('progress', 'Not Started')
                elif field == 'Created At':
                    new_row[field] = task.get('created_at', '')
                elif field == 'Last Modified':
                    new_row[field] = task.get('last_modified', '')
                else:
                    new_row[field] = ''
            original_data.append(new_row)
    
    # Write back to CSV
    with open(CSV_FILE, 'w', newline='', encoding='utf-8-sig') as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(original_data)

def adjust_weekend_date(due_date_str: str) -> str:
    """Adjust due date if it falls on weekend (Saturday -> Monday, Sunday -> Monday)"""
    try:
        due_date = datetime.strptime(due_date_str, "%Y-%m-%d").date()
        weekday = due_date.weekday()  # Monday=0, Sunday=6
        
        if weekday == 5:  # Saturday
            adjusted_date = due_date.replace(day=due_date.day + 2)
        elif weekday == 6:  # Sunday
            adjusted_date = due_date.replace(day=due_date.day + 1)
        else:
            adjusted_date = due_date
            
        return adjusted_date.strftime("%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

@app.on_event("startup")
async def startup_event():
    """Load CSV data on startup"""
    load_tasks()

@app.get("/tasks", response_model=List[TaskResponse])
async def get_tasks():
    """Get all tasks"""
    tasks_data = load_tasks()
    tasks = []
    
    for task in tasks_data:
        tasks.append(TaskResponse(
            id=task['id'],
            name=task['name'],
            due_date=task['due_date'],
            section=task.get('section', ''),
            assignee=task.get('assignee', ''),
            assignee_email=task.get('assignee_email', ''),
            start_date=task.get('start_date', ''),
            priority=task.get('priority', ''),
            progress=task.get('progress', ''),
            notes=task.get('notes', ''),
            tags=task.get('tags', ''),
            projects=task.get('projects', ''),
            created_at=task.get('created_at', ''),
            completed_at=task.get('completed_at', ''),
            last_modified=task.get('last_modified', '')
        ))
    
    return tasks

@app.post("/tasks", response_model=TaskResponse)
async def create_or_update_task(task: Task):
    """Create or update a task"""
    tasks_data = load_tasks()
    
    # Adjust due date if it falls on weekend (only if due_date is provided)
    adjusted_due_date = ""
    if task.due_date and task.due_date.strip():
        adjusted_due_date = adjust_weekend_date(task.due_date)
    
    if task.id is None or task.id == "":
        # Create new task
        import time
        new_id = str(int(time.time() * 1000))  # Generate unique ID
        # Convert start_date from YYYY-MM-DD to DD/MM/YYYY if provided
        start_date_formatted = ''
        if task.start_date and task.start_date.strip():
            try:
                year, month, day = task.start_date.split('-')
                start_date_formatted = f"{day}/{month}/{year}"
            except:
                start_date_formatted = task.start_date

        new_task = {
            'id': new_id,
            'name': task.name,
            'due_date': adjusted_due_date,
            'section': task.section,
            'assignee': task.assignee,
            'assignee_email': '',
            'start_date': start_date_formatted,
            'priority': task.priority,
            'progress': task.progress,
            'notes': '',
            'tags': '',
            'projects': '',
            'created_at': datetime.now().strftime('%d/%m/%Y'),
            'completed_at': '',
            'last_modified': datetime.now().strftime('%d/%m/%Y')
        }
        tasks_data.append(new_task)
        task_id = new_id
    else:
        # Update existing task due date only
        task_found = False
        for i, existing_task in enumerate(tasks_data):
            if existing_task['id'] == task.id:
                tasks_data[i]['due_date'] = adjusted_due_date
                tasks_data[i]['last_modified'] = datetime.now().strftime('%d/%m/%Y')
                # Preserve row_number for CSV updates
                if 'row_number' in existing_task:
                    tasks_data[i]['row_number'] = existing_task['row_number']
                if 'original_id' in existing_task:
                    tasks_data[i]['original_id'] = existing_task['original_id']
                task_found = True
                break
        
        if not task_found:
            raise HTTPException(status_code=404, detail="Task not found")
        
        task_id = task.id
    
    # Save to CSV
    save_tasks(tasks_data)
    
    # Find the task to return full details
    task_details = None
    for t in tasks_data:
        if t['id'] == task_id:
            task_details = t
            break
    
    if not task_details:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return TaskResponse(
        id=task_details['id'],
        name=task_details['name'],
        due_date=task_details['due_date'],
        section=task_details.get('section', ''),
        assignee=task_details.get('assignee', ''),
        assignee_email=task_details.get('assignee_email', ''),
        start_date=task_details.get('start_date', ''),
        priority=task_details.get('priority', ''),
        progress=task_details.get('progress', ''),
        notes=task_details.get('notes', ''),
        tags=task_details.get('tags', ''),
        projects=task_details.get('projects', ''),
        created_at=task_details.get('created_at', ''),
        completed_at=task_details.get('completed_at', ''),
        last_modified=task_details.get('last_modified', '')
    )

@app.delete("/tasks/{task_id}")
async def delete_task(task_id: str):
    """Delete a task - not supported for this CSV structure"""
    raise HTTPException(status_code=400, detail="Deleting tasks not supported. Only due date updates allowed.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
