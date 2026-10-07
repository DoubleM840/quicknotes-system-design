const API_URL = "https://jsonplaceholder.typicode.com/posts";

// --- REUSABLE REQUEST FUNCTION ---
async function request(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        // Re-throw network errors or HTTP errors for caller to handle
        throw error;
    }
}

// --- UI STATE MANAGEMENT ---
const statusEl = document.getElementById("status");
const loadBtn = document.getElementById("load-btn");
const submitBtn = document.getElementById("submit-btn");
const notesList = document.getElementById("notes-list");
const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");

function setStatus(message, type = "") {
    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;
}

function setLoading(isLoading) {
    loadBtn.disabled = isLoading;
    submitBtn.disabled = isLoading;
    if (isLoading) {
        setStatus("Loading...", "loading");
    }
}

// --- GET: LOAD NOTES ---
async function loadNotes() {
    setLoading(true);
    notesList.innerHTML = "";
    
    try {
        const notes = await request(`${API_URL}?_limit=10`);
        
        if (notes.length === 0) {
            setStatus("No notes found.", "empty");
            notesList.innerHTML = "<li class='empty-state'>No notes available.</li>";
            return;
        }
        
        renderNotes(notes);
        setStatus(`Loaded ${notes.length} notes from the server.`, "success");
    } catch (error) {
        setStatus(`Error loading notes: ${error.message}`, "error");
        console.error(error);
    } finally {
        setLoading(false);
    }
}

// --- POST: CREATE NOTE ---
noteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();
    
    // Validation
    if (!title) {
        setStatus("Title is required.", "error");
        return;
    }
    if (title.length > 100) {
        setStatus("Title must be 100 characters or less.", "error");
        return;
    }
    
    setLoading(true);
    
    try {
        const newNote = await request(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, body, userId: 1 })
        });
        
        // Prepend new note to list
        const li = createNoteElement(newNote);
        notesList.prepend(li);
        
        setStatus(`Note created (status 201, id ${newNote.id}).`, "success");
        noteForm.reset();
    } catch (error) {
        setStatus(`Error creating note: ${error.message}`, "error");
        console.error(error);
    } finally {
        setLoading(false);
    }
});

// --- DELETE: REMOVE NOTE ---
function deleteNote(id, element) {
    if (!confirm("Delete this note?")) return;
    
    setLoading(true);
    
    request(`${API_URL}/${id}`, { method: "DELETE" })
        .then(() => {
            element.remove();
            setStatus(`Note ${id} deleted successfully.`, "success");
            
            if (notesList.children.length === 0) {
                notesList.innerHTML = "<li class='empty-state'>No notes remaining.</li>";
                setStatus("All notes deleted.", "empty");
            }
        })
        .catch(error => {
            setStatus(`Error deleting note: ${error.message}`, "error");
            console.error(error);
        })
        .finally(() => setLoading(false));
}

// --- SAFE DOM RENDERING ---
function createNoteElement(note) {
    const li = document.createElement("li");
    li.dataset.id = note.id;
    
    const title = document.createElement("strong");
    title.textContent = note.title; // Safe textContent usage
    
    const body = document.createElement("p");
    body.textContent = note.body || ""; // Safe textContent usage
    
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => deleteNote(note.id, li));
    
    li.appendChild(title);
    li.appendChild(body);
    li.appendChild(deleteBtn);
    
    return li;
}

function renderNotes(notes) {
    notes.forEach(note => {
        notesList.appendChild(createNoteElement(note));
    });
}

// Initialize
loadBtn.addEventListener("click", loadNotes);