import os
import json
from typing import List, Dict, Any, Set
from dotenv import load_dotenv

# LangChain and Gemini imports
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

# Import shared storage module (SQLite-backed)
import storage

load_dotenv()
Gemini_API_KEY = os.getenv("GOOGLE_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")

# Ground-truth Role Requirement Matrix for deterministic verification
role_info = [
    {"req_id": "R001", "role": "Sales Executive", "mandatory": True, "source_doc_id": "SOP-07"},
    {"req_id": "R002", "role": "Customer Support Executive", "mandatory": True, "source_doc_id": "POL-01"},
    {"req_id": "R003", "role": "Software Support Engineer", "mandatory": True, "source_doc_id": "SEC-03"},
    {"req_id": "R004", "role": "HR Executive", "mandatory": True, "source_doc_id": "SEC-04"},
    {"req_id": "R005", "role": "Finance Associate", "mandatory": True, "source_doc_id": "SEC-05"},
    {"req_id": "R006", "role": "Marketing Executive", "mandatory": True, "source_doc_id": "SEC-06"},
    {"req_id": "R007", "role": "Brand Manager", "mandatory": True, "source_doc_id": "SEC-07"},
    {"req_id": "R008", "role": "Data Analyst", "mandatory": True, "source_doc_id": "SEC-08"},
    {"req_id": "R009", "role": "Team Lead", "mandatory": True, "source_doc_id": "SEC-09"}
]


class DocumentMemoryProxy:
    """
    Backward-compatible proxy providing list-like semantics for DOCUMENT_MEMORY.
    Delegates directly to storage.py so upload and generation always share the exact same SQLite store.
    """
    def __iter__(self):
        return iter(storage.get_all_chunks())

    def __len__(self):
        return storage.count_chunks()

    def __bool__(self):
        return storage.count_chunks() > 0

    def append(self, item: Dict[str, Any]):
        storage.add_chunk(
            doc_id=item.get("doc_id", "UNKNOWN"),
            text=item.get("text", ""),
            page_number=item.get("page_number"),
            section=item.get("section"),
            heading=item.get("heading"),
            filename=item.get("filename")
        )


# Exported DOCUMENT_MEMORY for backwards compatibility
DOCUMENT_MEMORY = DocumentMemoryProxy()


def find_pdf_pages(role_keyword: str) -> List[Dict[str, Any]]:
    """
    Simple keyword-based RAG search: finds document chunks matching the job role or keyword.
    Falls back to all available document chunks if no specific keyword match is found.
    """
    if not role_keyword:
        return storage.get_all_chunks()

    matched_chunks = storage.find_chunks(role_keyword)
    return matched_chunks if matched_chunks else storage.get_all_chunks()


def genai_accuracy(user_role: str, ai_json: Dict[str, Any]) -> Dict[str, Any]:
    """
    Pipeline 2: Independent deterministic ground-truth verification engine.
    Checks:
    1. Coverage of mandatory requirements for user_role from role_info.
    2. Verification that every cited source_doc_id matches an actual uploaded document (detects hallucinations).
    """
    if not isinstance(ai_json, dict):
        return {
            "score": 0.0,
            "fake_docs_count": 0,
            "status": "NEEDS HUMAN REVIEW",
            "error": "ai_json is not a valid dictionary",
            "items": []
        }

    ai_modules = ai_json.get("modules", [])
    if not isinstance(ai_modules, list):
        ai_modules = []

    real_doc_ids = storage.get_all_doc_ids()

    # Case-insensitive match on role requirements
    role_rules = [
        rule for rule in role_info
        if rule["role"].strip().lower() == user_role.strip().lower()
    ]
    total_mandatory = len(role_rules)

    # Track covered requirements (avoid duplicate counting)
    covered_req_ids: Set[str] = set()
    unsupported_count = 0
    verification_items: List[Dict[str, Any]] = []

    for idx, module in enumerate(ai_modules, start=1):
        if not isinstance(module, dict):
            continue

        req_id = str(module.get("req_id", "")).strip()
        source_doc_id = str(module.get("source_doc_id", "")).strip().upper()
        module_title = module.get("module_title", f"Module {idx}")

        # Check if the req_id matches an expected ground-truth requirement for this role
        matches_rule = any(rule["req_id"] == req_id for rule in role_rules)
        if matches_rule:
            covered_req_ids.add(req_id)

        # Check if the source document is genuine or hallucinated
        is_real_doc = source_doc_id in real_doc_ids if source_doc_id else False
        if not is_real_doc:
            unsupported_count += 1
            item_status = "Unsupported Requirement"
            item_note = f"Source doc '{source_doc_id}' not found in uploaded documents store."
        else:
            item_status = "Verified"
            item_note = f"Source doc '{source_doc_id}' confirmed in local knowledge base."

        verification_items.append({
            "id": f"VAL-{idx:02d}",
            "req_id": req_id,
            "module_title": module_title,
            "source_doc_id": source_doc_id,
            "source_section": module.get("source_section", "General"),
            "status": item_status,
            "is_source_verified": is_real_doc,
            "matches_role_req": matches_rule,
            "notes": item_note
        })

    # Coverage score: percentage of mandatory role requirements satisfied
    rules_covered = len(covered_req_ids)
    score = (rules_covered / total_mandatory * 100) if total_mandatory > 0 else 100.0

    # Overall validation status
    status = "PASSED ALL CHECKS" if (score >= 100.0 and unsupported_count == 0) else "NEEDS HUMAN REVIEW"

    return {
        "score": round(score, 2),
        "fake_docs_count": unsupported_count,
        "status": status,
        "mandatory_rules_total": total_mandatory,
        "mandatory_rules_covered": rules_covered,
        "covered_req_ids": list(covered_req_ids),
        "real_doc_ids": list(real_doc_ids),
        "items": verification_items
    }


def run_langchain_pipeline(user_role: str, employee_name: str, role_info_arg: Any = None) -> Dict[str, Any]:
    """
    Pipeline 1 & 2 Execution:
    1. Retrieves relevant document context using keyword RAG (find_pdf_pages).
    2. Synthesizes a structured JSON onboarding plan using Gemini via LangChain.
    3. Runs independent deterministic validation via genai_accuracy().
    """
    if not Gemini_API_KEY:
        return {
            "error": "GOOGLE_API_KEY environment variable is missing or empty. Please configure it in .env file."
        }

    # Bug Fix 1: Call find_pdf_pages(user_role) instead of calling role_info(user_role)
    relevant_chunks = find_pdf_pages(user_role)
    if not relevant_chunks:
        return {
            "error": "No documents found in knowledge base. Please upload an SOP or policy document first."
        }

    context_lines = []
    for p in relevant_chunks:
        doc_id = p.get("doc_id", "DOC")
        sec = p.get("section", f"Page {p.get('page_number', 1)}")
        txt = p.get("text", "")
        context_lines.append(f"[Doc ID: {doc_id} | Section: {sec}]\n{txt}")
    document_text = "\n\n".join(context_lines)

    real_doc_ids = sorted(list(storage.get_all_doc_ids()))
    doc_id_list_str = ", ".join(real_doc_ids) if real_doc_ids else "None"

    # Find mandatory requirements for this role to provide grounded guidance
    expected_reqs = [r for r in role_info if r["role"].strip().lower() == user_role.strip().lower()]
    req_hints = "\n".join([f"- Req ID: {r['req_id']}, Source Doc: {r['source_doc_id']}" for r in expected_reqs])

    # Bug Fix 2: Pipe the prompt template INSTANCE (prompt | llm | StrOutputParser()), NOT the class PromptTemplate
    prompt = PromptTemplate.from_template("""
You are an enterprise HR and compliance onboarding AI.
Generate a structured, personalized onboarding plan for {employee_name} for the role of {role}.

Available Valid Document IDs in Knowledge Base:
{available_docs}

Known Role Requirements:
{role_requirements}

Context from Uploaded Company Documents:
{document_context}

CRITICAL RULES:
1. Every module MUST include a valid 'req_id' and 'source_doc_id'.
2. Use ONLY the real document IDs listed under 'Available Valid Document IDs' above. Do not hallucinate fictitious document IDs.
3. Return ONLY valid, parseable JSON with NO markdown commentary or preamble.

Exact JSON structure:
{{
    "role": "{role}",
    "employee": "{employee_name}",
    "plan_title": "{role} Comprehensive Onboarding Roadmap",
    "modules": [
        {{
            "req_id": "R001",
            "module_title": "Module Title Here",
            "mandatory": true,
            "source_doc_id": "SOP-07",
            "source_section": "Page 1",
            "objectives": ["Understand policy compliance", "Execute procedures"]
        }}
    ]
}}
""")

    llm = ChatGoogleGenerativeAI(
        model=GEMINI_MODEL,
        google_api_key=Gemini_API_KEY,
        temperature=0.2,
        max_retries=3
    )

    chain = prompt | llm | StrOutputParser()

    # Resilient invocation loop with exponential backoff for transient 503/network spikes
    import time
    max_attempts = 3
    backoff = 2
    raw_response = None

    for attempt in range(1, max_attempts + 1):
        try:
            raw_response = chain.invoke({
                "employee_name": employee_name,
                "role": user_role,
                "available_docs": doc_id_list_str,
                "role_requirements": req_hints or "None specified",
                "document_context": document_text
            })
            break
        except Exception as api_err:
            err_str = str(api_err)
            if ("503" in err_str or "UNAVAILABLE" in err_str or "ResourceExhausted" in err_str or "ConnectError" in err_str) and attempt < max_attempts:
                time.sleep(backoff)
                backoff *= 2
                continue
            return {
                "error": f"Gemini API request failed: {str(api_err)}"
            }

    # Clean markdown fences if Gemini wrapped the JSON response in ```json ... ```
    raw_text = str(raw_response).strip()
    clean_json_str = raw_text
    if clean_json_str.startswith("```json"):
        clean_json_str = clean_json_str[7:]
    elif clean_json_str.startswith("```"):
        clean_json_str = clean_json_str[3:]
    if clean_json_str.endswith("```"):
        clean_json_str = clean_json_str[:-3]
    clean_json_str = clean_json_str.strip()

    # Explicit JSON parse error handling
    try:
        ai_plan = json.loads(clean_json_str)
    except json.JSONDecodeError as json_err:
        return {
            "error": f"Failed to parse Gemini output as JSON: {str(json_err)}",
            "raw_output": raw_text[:500]
        }

    # Validate top-level schema
    if not isinstance(ai_plan, dict) or "modules" not in ai_plan or not isinstance(ai_plan["modules"], list):
        return {
            "error": "Gemini response does not contain the required 'modules' list.",
            "raw_output": ai_plan
        }

    # Deterministic ground-truth verification
    validation_results = genai_accuracy(user_role, ai_plan)

    return {
        "ai_plan": ai_plan,
        "validation": validation_results
    }
