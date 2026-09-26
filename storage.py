"""
SkillSprint AI - Shared Document Storage Module
Migrated from volatile in-memory global list to SQLite persistence.

Why SQLite?
1. Eliminates state desynchronization between app.py, setup.py, and worker threads.
2. Persists extracted PDF/DOCX chunks across Flask dev-server restarts and hot-reloads.
3. Enforces structured traceability metadata (doc_id, page_number, section, heading).
"""

import os
import sqlite3
from typing import List, Dict, Any, Set

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "documents.db")

def get_connection() -> sqlite3.Connection:
    """Creates a thread-safe connection to the SQLite documents database."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db() -> None:
    """Initializes tables for documents and document chunks if they do not exist."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS documents (
                doc_id TEXT PRIMARY KEY,
                filename TEXT,
                file_format TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS document_chunks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                doc_id TEXT NOT NULL,
                text TEXT NOT NULL,
                page_number INTEGER,
                section TEXT,
                heading TEXT,
                filename TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (doc_id) REFERENCES documents (doc_id)
            )
        """)
        conn.commit()

# Automatically ensure database schema exists upon module import
init_db()

def add_document(doc_id: str, filename: str = "", file_format: str = "") -> None:
    """Registers or updates a document in the documents table."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO documents (doc_id, filename, file_format)
            VALUES (?, ?, ?)
            ON CONFLICT(doc_id) DO UPDATE SET
                filename = excluded.filename,
                file_format = excluded.file_format
        """, (doc_id.strip(), filename, file_format))
        conn.commit()

def add_chunk(
    doc_id: str,
    text: str,
    page_number: int = None,
    section: str = None,
    heading: str = None,
    filename: str = None,
    file_format: str = None
) -> None:
    """Stores an extracted text chunk with full traceability metadata."""
    clean_doc_id = doc_id.strip().upper()
    add_document(clean_doc_id, filename or "", file_format or "")
    
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO document_chunks (doc_id, text, page_number, section, heading, filename)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            clean_doc_id,
            text.strip(),
            page_number,
            section or (f"Page {page_number}" if page_number else "General"),
            heading or "General",
            filename or ""
        ))
        conn.commit()

def get_all_chunks() -> List[Dict[str, Any]]:
    """Retrieves all stored document chunks as dictionaries."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, doc_id, text, page_number, section, heading, filename, created_at
            FROM document_chunks
            ORDER BY id ASC
        """)
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

def get_all_doc_ids() -> Set[str]:
    """Returns the set of unique document IDs currently stored."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT DISTINCT doc_id FROM document_chunks")
        rows = cursor.fetchall()
        return {row["doc_id"] for row in rows}

def find_chunks(keyword: str) -> List[Dict[str, Any]]:
    """Simple keyword-based RAG search across stored chunk contents."""
    if not keyword:
        return get_all_chunks()

    pattern = f"%{keyword.strip().lower()}%"
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, doc_id, text, page_number, section, heading, filename, created_at
            FROM document_chunks
            WHERE LOWER(text) LIKE ? OR LOWER(heading) LIKE ? OR LOWER(doc_id) LIKE ?
            ORDER BY id ASC
        """, (pattern, pattern, pattern))
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

def count_chunks() -> int:
    """Returns the total number of document chunks in storage."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) as cnt FROM document_chunks")
        row = cursor.fetchone()
        return row["cnt"] if row else 0

def clear_storage() -> None:
    """Clears all stored documents and chunks. Used for testing and resets."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM document_chunks")
        cursor.execute("DELETE FROM documents")
        conn.commit()

def get_documents_summary() -> List[Dict[str, Any]]:
    """Returns a summary of each stored document with chunk count."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT d.doc_id, d.filename, d.file_format, d.created_at, COUNT(c.id) as chunk_count
            FROM documents d
            LEFT JOIN document_chunks c ON d.doc_id = c.doc_id
            GROUP BY d.doc_id, d.filename, d.file_format, d.created_at
        """)
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
