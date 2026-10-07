# QuickNotes API Design

## Endpoints

| Method | Path | Description | Success Status |
|--------|------|-------------|----------------|
| GET | /api/notes | List all notes for authenticated user | 200 OK |
| GET | /api/notes/{id} | Get single note by ID | 200 OK |
| POST | /api/notes | Create new note | 201 Created |
| PUT | /api/notes/{id} | Fully update note | 200 OK |
| PATCH | /api/notes/{id} | Partially update note | 200 OK |
| DELETE | /api/notes/{id} | Delete note | 204 No Content |

## Request/Response Examples

### Create Note (POST /api/notes)
**Request Body:**
```json
{
  "title": "System Design Notes",
  "body": "Review scaling patterns for Day 7",
  "category": "study"
}