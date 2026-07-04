
"""
Guardian AI — Sanitizer + Explainer Agent (Combined)
File: server/agents/sanitizer_explainer_agent.py

Step 1 — Regex sanitizes the prompt        (fast, free, no API)
Step 2 — Fuzzy / obfuscation detection     (catches typos, leet speak, etc.)
Step 3 — Groq explains what was found      (only if attack detected)
"""

import re
import os
import difflib
from typing import Dict, List, Tuple

from groq import Groq


# =========================================================
# CONFIG
# =========================================================

def _load_api_key() -> str:
    try:
        from google.colab import userdata
        key = userdata.get("GROQ_API_KEY")
        if key:
            return key
    except Exception:
        pass
    return os.getenv("GROQ_API_KEY", "")


GROQ_MODEL = "llama-3.1-8b-instant"

RULE_DESCRIPTIONS = {
    "instruction_override":  "Instruction Override Attack",
    "direct_override":       "Direct Command Override",
    "system_prompt_leak":    "System Prompt Extraction Attempt",
    "role_hijack":           "Role / Identity Hijacking",
    "safety_disable":        "Safety Mechanism Disable Attempt",
    "without_restrictions":  "Unrestricted Mode Request",
    "no_restrictions":       "Restriction Removal Attempt",
    "jailbreak_token":       "Known Jailbreak Token",
    "delimiter_injection":   "Delimiter / Context Injection",
    "prompt_chaining":       "Prompt Chaining Attack",
    "encoded_payload":       "Encoded / Obfuscated Payload",
    "exfiltration":          "Data Exfiltration Attempt",
    "control_char_strip":    "Hidden Control Characters",
    "repetition_collapse":   "Repetition / Overflow Attack",
    "length_truncation":     "Oversized Prompt (Truncated)",
    "fuzzy_typo":            "Misspelled Attack Keyword (Typo)",
    "fuzzy_leet":            "Leet Speak / Symbol Substitution",
    "fuzzy_space":           "Space-Insertion Obfuscation",
    "fuzzy_separator":       "Separator-Insertion Obfuscation (hyphen/dot)",
}


# =========================================================
# FUZZY MATCHING CONFIG
# =========================================================

# Leet speak + symbol + unicode lookalike → letter mapping
LEET_MAP = str.maketrans({
    '0': 'o',  '1': 'i',  '2': 'z',  '3': 'e',  '4': 'a',
    '5': 's',  '6': 'g',  '7': 't',  '8': 'b',  '9': 'g',
    '@': 'a',  '$': 's',  '!': 'i',  '+': 't',  '|': 'i',
    # Cyrillic lookalikes
    '\u0430': 'a', '\u0435': 'e', '\u0456': 'i', '\u043e': 'o',
    '\u0440': 'r', '\u0441': 'c', '\u0445': 'x', '\u0443': 'u',
    # Greek lookalikes
    '\u03b1': 'a', '\u03b5': 'e', '\u03b9': 'i', '\u03bf': 'o',
    '\u03c1': 'r', '\u03c5': 'u',
    # Common punctuation noise
    '*': '', '#': '', '^': '', '~': '', '`': '', "'": '', '"': '',
})

# All attack-related keywords to match against
FUZZY_KEYWORDS = [
    # Instruction manipulation
    'ignore', 'forget', 'disregard', 'override', 'bypass', 'skip',
    'neglect', 'violate', 'dismiss', 'overwrite',
    # Information extraction
    'reveal', 'display', 'output', 'repeat', 'leak', 'expose',
    'share', 'print', 'show', 'extract', 'dump', 'exfiltrate',
    # Core attack targets
    'instructions', 'instruction', 'prompt', 'prompts', 'rules',
    'rule', 'constraints', 'guidelines', 'context', 'training',
    'system', 'confidential', 'secret', 'hidden', 'developer',
    # Identity / role
    'admin', 'root', 'superuser', 'unrestricted', 'jailbroken',
    'uncensored', 'unfiltered', 'pretend', 'impersonate',
    'simulate', 'roleplay', 'imagine',
    # Safety mechanisms
    'safety', 'filter', 'guardrail', 'restriction', 'limit',
    'policy', 'mechanism', 'censorship', 'moderation',
    'disable', 'deactivate', 'remove', 'neutralize',
    # Jailbreak tokens
    'jailbreak', 'dan', 'stan', 'dude', 'aim',
    # Credentials / data
    'password', 'credentials', 'credential', 'token',
    'database', 'manipulate', 'exploit', 'attack', 'inject',
]
FUZZY_KEYWORDS_SET = set(FUZZY_KEYWORDS)

# Minimum word length before fuzzy matching (avoids short-word false positives)
FUZZY_MIN_LEN   = 5
# Similarity cutoff (0.0–1.0). 0.85 = must be 85% similar
FUZZY_CUTOFF    = 0.85


# =========================================================
# INJECTION PATTERNS
# =========================================================

INJECTION_PATTERNS: List[Dict] = [

    {
        "name": "instruction_override",
        "pattern": re.compile(
            r"\b(ignore|forget|disregard|override|bypass|skip|neglect|violate)\b"
            r".{0,40}"
            r"\b(previous|prior|above|all|any|your|the|these|those|my)\b"
            r".{0,40}"
            r"\b(instructions?|prompts?|rules?|constraints?|guidelines?|context|training)\b",
            re.IGNORECASE | re.DOTALL
        ),
        "replacement": "[INSTRUCTION OVERRIDE REMOVED]"
    },

    {
        "name": "direct_override",
        "pattern": re.compile(
            r"\b(ignore|disregard|forget|bypass)\b.{0,20}"
            r"\b(everything|anything|all|every).{0,20}"
            r"\b(above|before|prior|previous|said|told|written)\b",
            re.IGNORECASE | re.DOTALL
        ),
        "replacement": "[DIRECT OVERRIDE REMOVED]"
    },

    {
        "name": "system_prompt_leak",
        "pattern": re.compile(
            r"\b(reveal|print|show|display|output|repeat|leak|expose|share|give me|tell me|what (is|are|was))\b"
            r".{0,50}"
            r"\b(system\s*prompt|hidden\s*(prompt|instructions?|message)|developer\s*(prompt|mode|message)"
            r"|original\s*(prompt|instructions?)|confidential|secret\s*(instructions?|prompt)"
            r"|initial\s*(prompt|instructions?))\b",
            re.IGNORECASE | re.DOTALL
        ),
        "replacement": "[SYSTEM PROMPT EXTRACTION REMOVED]"
    },

    {
        "name": "role_hijack",
        "pattern": re.compile(
            r"\b(act\s*as|pretend\s*(to\s*be|you\s*(are|were))|you\s*are\s*now|roleplay\s*as"
            r"|simulate|impersonate|become|switch\s*to|respond\s*as|behave\s*as|imagine\s*you\s*are)\b"
            r".{0,60}"
            r"\b(admin|root|superuser|unrestricted|jailbroken|uncensored|unfiltered|DAN|STAN|DUDE"
            r"|developer|god\s*mode|no\s*(filter|restriction|limit|rule)|evil|hacker|villain)\b",
            re.IGNORECASE | re.DOTALL
        ),
        "replacement": "[ROLE HIJACK REMOVED]"
    },

    {
        "name": "safety_disable",
        "pattern": re.compile(
            r"\b(disable|turn\s*off|remove|deactivate|circumvent|neutralize|eliminate|suppress|ignore)\b"
            r".{0,50}"
            r"\b(safety|filter|guardrail|restriction|limit|policy|rule|mechanism|censorship|moderation)\b",
            re.IGNORECASE | re.DOTALL
        ),
        "replacement": "[SAFETY BYPASS ATTEMPT REMOVED]"
    },

    {
        "name": "without_restrictions",
        "pattern": re.compile(
            r"\b(answer|respond|reply|act|behave|operate|work|run|execute|do\s*this)\b"
            r".{0,40}"
            r"\b(without\s*(any\s*)?(restrictions?|limits?|filters?|rules?|guidelines?|censorship"
            r"|oversight|constraint|moderation|safety))\b",
            re.IGNORECASE | re.DOTALL
        ),
        "replacement": "[UNRESTRICTED MODE REQUEST REMOVED]"
    },

    {
        "name": "no_restrictions",
        "pattern": re.compile(
            r"\b(no\s+(restrictions?|limits?|filters?|rules?|guidelines?|censorship|safety|moderation)"
            r"|free\s+from\s+(restrictions?|limits?|filters?|rules?)"
            r"|uncensored|unfiltered|unrestricted)\b",
            re.IGNORECASE
        ),
        "replacement": "[RESTRICTION REMOVAL REMOVED]"
    },

    {
        "name": "jailbreak_token",
        "pattern": re.compile(
            r"\b(DAN|STAN|DUDE|AIM|KEVIN|BasedGPT|AntiGPT|JailBreak|EvilBot|DevMode"
            r"|ChatGPT\s*classic|developer\s*mode\s*enabled|jailbroken\s*mode)\b",
            re.IGNORECASE
        ),
        "replacement": "[JAILBREAK TOKEN REMOVED]"
    },

    {
        "name": "delimiter_injection",
        "pattern": re.compile(
            r"(---+\s*(system|user|assistant|instruction)\s*---+"
            r"|\[INST\]|\[\/INST\]"
            r"|<\|im_start\|>|<\|im_end\|>"
            r"|<<SYS>>|<</SYS>>"
            r"|\{system\}|\{user\}|\{assistant\}"
            r"|<system>|</system>|<user>|</user>)",
            re.IGNORECASE
        ),
        "replacement": "[DELIMITER INJECTION REMOVED]"
    },

    {
        "name": "prompt_chaining",
        "pattern": re.compile(
            r"\b(new\s*(task|prompt|instruction|context|goal|objective)"
            r"|from\s*now\s*on\s*(you\s*(are|will|must|should)|ignore|forget)"
            r"|your\s*(new\s*)?(task|objective|goal|mission|purpose|job)\s*is"
            r"|instead\s*of\s*(that|this|the\s*above)\s*(do|answer|say|respond|act)"
            r"|starting\s*now|henceforth|hereafter)\b",
            re.IGNORECASE
        ),
        "replacement": "[PROMPT CHAINING REMOVED]"
    },

    {
        "name": "encoded_payload",
        "pattern": re.compile(
            r"(?<!\w)([A-Za-z0-9+/]{20,}={0,2})(?!\w)",
        ),
        "replacement": "[ENCODED CONTENT REMOVED]"
    },

    {
        "name": "exfiltration",
        "pattern": re.compile(
            r"\b(send|transmit|upload|exfiltrate|forward|email|post|leak|share|export)\b"
            r".{0,60}"
            r"\b(passwords?|credentials?|api\s*key|token|secret|database|user\s*(data|credentials?)"
            r"|personal\s*info|private\s*key|access\s*key|login|auth)\b",
            re.IGNORECASE | re.DOTALL
        ),
        "replacement": "[EXFILTRATION ATTEMPT REMOVED]"
    },
]

UNICODE_CONTROL_RE = re.compile(
    r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f"
    r"\u200b-\u200f"
    r"\u202a-\u202e"
    r"\ufeff"
    r"\u2028\u2029]"
)

REPETITION_RE = re.compile(r"(.{3,}?)\1{5,}", re.DOTALL)


# =========================================================
# COMBINED AGENT
# =========================================================

class SanitizerExplainerAgent:

    def __init__(self):
        api_key = _load_api_key()
        if not api_key:
            print("[SanitizerExplainerAgent] ⚠️  No GROQ_API_KEY found.")
            print("   Sanitization works but explanations will be skipped.")
            self.client = None
        else:
            self.client = Groq(api_key=api_key)
            print("[SanitizerExplainerAgent] Initialised ✅")

    # =====================================================
    # NORMALISATION HELPERS
    # =====================================================

    def _normalize(self, word: str) -> str:
        """
        Normalise a single token to its plain-letter form:
        1. Lowercase
        2. Leet speak + symbol substitution  (3→e, @→a, $→s, etc.)
        3. Strip remaining non-alpha chars
        4. Collapse repeated chars           (reveaal→reveal)
        """
        w = word.lower()
        w = w.translate(LEET_MAP)
        w = re.sub(r'[^a-z]', '', w)
        w = re.sub(r'(.)\1+', r'\1', w)
        return w

    # =====================================================
    # FUZZY MATCHING  (all obfuscation types)
    # =====================================================

    def _fuzzy_detect(self, text: str) -> Dict[str, List]:
        results = {
            "leet":              [],
            "typo":              [],
            "space_insertion":   [],
            "separator":         [],
        }

        # ── Pre-process ──────────────────────────────────
        clean = re.sub(r'[\u200b-\u200f\u202a-\u202e\ufeff]', '', text)
        joined_nospace   = re.sub(r'\s+', '', clean.lower())
        tokens = re.split(r'[\s\-\.,_/\\]+', clean)

        # ── Strategy 1: Token-level normalisation ─────────
        for token in tokens:
            if len(token) < 3:
                continue
            norm = self._normalize(token)
            if len(norm) < 3:
                continue

            orig_lower = token.lower()

            if norm in FUZZY_KEYWORDS_SET:
                if norm != orig_lower:
                    results["leet"].append({
                        "original": token,
                        "matched":  norm,
                        "type":     "leet/symbol/number"
                    })
                continue

            if len(norm) >= FUZZY_MIN_LEN:
                matches = difflib.get_close_matches(
                    norm, FUZZY_KEYWORDS, n=1, cutoff=FUZZY_CUTOFF
                )
                if matches and matches[0] != orig_lower:
                    results["typo"].append({
                        "original": token,
                        "matched":  matches[0],
                        "type":     "typo/missing_letters"
                    })

        # Pre-build normalized keyword lookup for pair matching
        norm_kw_map = {self._normalize(k): k for k in FUZZY_KEYWORDS}

        # ── Strategy 2: Consecutive token pairs ──────────
        for i in range(len(tokens) - 1):
            pair      = (tokens[i] + tokens[i+1]).lower()
            pair_norm = self._normalize(pair)
            matched_kw = norm_kw_map.get(pair_norm)
            if matched_kw and len(pair_norm) >= 4:
                t1 = self._normalize(tokens[i])
                t2 = self._normalize(tokens[i+1])
                if t1 not in FUZZY_KEYWORDS_SET and t2 not in FUZZY_KEYWORDS_SET:
                    results["separator"].append({
                        "original": f"{tokens[i]}-{tokens[i+1]}",
                        "matched":  matched_kw,
                        "type":     "separator_insertion"
                    })

        # ── Strategy 3: Space insertion ──────────────────
        clean_token_set = set(self._normalize(t) for t in tokens if len(t) >= 3)
        clean_token_lower = set(t.lower() for t in tokens if len(t) >= 3)
        already_matched = {h["matched"] for h in results["leet"] + results["typo"] + results["separator"]}
        for kw in FUZZY_KEYWORDS:
            if len(kw) >= FUZZY_MIN_LEN and kw in joined_nospace:
                if kw in already_matched:
                    continue
                if kw in clean_token_set or kw in clean_token_lower:
                    continue
                if any(t.startswith(kw) or kw.startswith(t)
                       for t in clean_token_lower if len(t) >= FUZZY_MIN_LEN):
                    continue
                results["space_insertion"].append({
                    "original": "(spaced letters)",
                    "matched":  kw,
                    "type":     "space_insertion"
                })

        return results

    def _fuzzy_rules_triggered(self, fuzzy: Dict) -> List[str]:
        rules = []
        if fuzzy["leet"]:            rules.append("fuzzy_leet")
        if fuzzy["typo"]:            rules.append("fuzzy_typo")
        if fuzzy["space_insertion"]: rules.append("fuzzy_space")
        if fuzzy["separator"]:       rules.append("fuzzy_separator")
        return rules

    # =====================================================
    # SANITIZER HELPERS
    # =====================================================

    def _strip_control_chars(self, text: str) -> str:
        return UNICODE_CONTROL_RE.sub("", text)

    def _collapse_repetition(self, text: str) -> str:
        return REPETITION_RE.sub(r"\1 [REPEATED CONTENT TRUNCATED]", text)

    def _apply_injection_patterns(self, text: str) -> Tuple[str, List[str]]:
        triggered: List[str] = []
        for rule in INJECTION_PATTERNS:
            new_text, n = rule["pattern"].subn(rule["replacement"], text)
            if n:
                triggered.append(rule["name"])
                text = new_text
        return text, triggered

    def _truncate(self, text: str, max_chars: int = 4096) -> str:
        if len(text) > max_chars:
            return text[:max_chars] + " [TRUNCATED]"
        return text

    def _sanitize(
        self, text: str, max_chars: int = 4096
    ) -> Tuple[str, bool, List[str], int, int, Dict]:
        if not text or not text.strip():
            return text, False, [], 0, 0, {}

        original        = text
        original_length = len(text)
        rules_triggered: List[str] = []

        # Step 1 — strip invisible / control chars
        text = self._strip_control_chars(text)
        if text != original:
            rules_triggered.append("control_char_strip")

        # Step 2 — collapse pathological repetition
        pre_rep = text
        text    = self._collapse_repetition(text)
        if text != pre_rep:
            rules_triggered.append("repetition_collapse")

        # Step 3 — regex injection patterns
        text, injection_rules = self._apply_injection_patterns(text)
        rules_triggered.extend(injection_rules)

        # Step 4 — fuzzy / obfuscation detection
        fuzzy_hits  = self._fuzzy_detect(text)
        fuzzy_rules = self._fuzzy_rules_triggered(fuzzy_hits)
        rules_triggered.extend(fuzzy_rules)

        # Step 5 — hard length cap
        pre_trunc = text
        text      = self._truncate(text, max_chars)
        if text != pre_trunc:
            rules_triggered.append("length_truncation")

        # Step 6 — normalise whitespace
        text = re.sub(r"\r\n|\r", "\n", text)
        text = re.sub(r"[ \t]{2,}", " ", text)
        text = re.sub(r"\n{3,}", "\n\n", text)
        text = text.strip()

        was_modified = (text != original.strip())
        return text, was_modified, rules_triggered, original_length, len(text), fuzzy_hits

    # =====================================================
    # EXPLAINER HELPERS
    # =====================================================

    def _build_prompt(
        self,
        original_text:   str,
        sanitized_text:  str,
        rules_triggered: List[str],
        fuzzy_hits:      Dict,
    ) -> List[Dict]:
        """
        Constructs the message list (system + user) to send to Groq.
        Strongly instructs the LLM to explain the PROBLEM in the original prompt.
        """
        rule_names = "\n".join([
            f"  - {RULE_DESCRIPTIONS.get(r, r)}"
            for r in rules_triggered
        ])

        fuzzy_summary = ""
        all_hits = (
            fuzzy_hits.get("leet", []) +
            fuzzy_hits.get("typo", []) +
            fuzzy_hits.get("space_insertion", []) +
            fuzzy_hits.get("separator", [])
        )
        if all_hits:
            fuzzy_summary = "\nOBFUSCATED KEYWORDS DETECTED:\n" + "\n".join([
                f"  - \"{h['original']}\" looks like \"{h['matched']}\" ({h['type']})"
                for h in all_hits
            ])

        system_prompt = (
            "You are an expert cybersecurity analyst AI for GuardianAI. "
            "Your primary job is to explain exactly WHAT was malicious or problematic in the user's prompt. "
            "Do NOT just rephrase the rule names. You must quote or reference the specific parts of the original prompt that triggered the security rules, "
            "and explain why those parts are dangerous. Be direct and analytical."
        )

        user_prompt = f"""Analyze the following prompt that was flagged as a prompt injection attack.

ORIGINAL PROMPT:
\"\"\"{original_text}\"\"\"

SANITIZED PROMPT:
\"\"\"{sanitized_text}\"\"\"

ATTACK TYPES DETECTED:
{rule_names}
{fuzzy_summary}

Write a clear security report that explicitly explains the PROBLEM WITH THE ORIGINAL PROMPT. Structure your response exactly like this:

1. PROBLEM SUMMARY (1-2 sentences explaining exactly what the user was trying to achieve maliciously)
2. ATTACK BREAKDOWN (For EACH detected rule above, quote the specific text from the original prompt that caused it and explain why it's a threat)
3. RISK LEVEL (LOW / MEDIUM / HIGH / CRITICAL + one line reason)
4. WHAT WAS REMOVED (Explain what was stripped or replaced in the sanitized version)
5. RECOMMENDATION (How the system/admin should handle this)

Keep it concise, highly specific to the text, and professional."""

        return [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]

    def _call_groq(self, messages: List[Dict]) -> str:
        if not self.client:
            return "⚠️ Explanation unavailable — GROQ_API_KEY not configured."
        try:
            response = self.client.chat.completions.create(
                model=GROQ_MODEL,
                messages=messages,
                max_tokens=1024,  # Increased slightly to allow for detailed breakdowns
                temperature=0.3,
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            error = str(e)
            if "401" in error or "auth" in error.lower():
                return "❌ Explanation failed — Invalid Groq API key."
            elif "429" in error:
                return "❌ Explanation failed — Groq rate limit hit. Try again shortly."
            elif "timeout" in error.lower():
                return "❌ Explanation failed — Groq API timed out."
            else:
                return f"❌ Explanation failed — {error}"

    # =====================================================
    # PUBLIC API
    # =====================================================

    def process(self, text: str, max_chars: int = 4096) -> Dict:
        """
        Full sanitize + fuzzy detect + explain pipeline.

        Returns
        -------
        {
            "sanitized_text"  : str,
            "was_modified"    : bool,
            "rules_triggered" : list,
            "original_length" : int,
            "sanitized_length": int,
            "fuzzy_hits"      : dict,  — detailed obfuscation findings
            "explanation"     : str,   — Groq security report
            "groq_called"     : bool,
        }
        """
        # ── Step 1: Sanitize + fuzzy detect ──────────────
        sanitized_text, was_modified, rules_triggered, orig_len, clean_len, fuzzy_hits = \
            self._sanitize(text, max_chars)

        # ── Step 2: Mark as modified if fuzzy found anything
        any_fuzzy = any(fuzzy_hits.get(k) for k in fuzzy_hits)
        if any_fuzzy and not was_modified:
            was_modified = True

        # ── Step 3: Explain (only if attack found) ───────
        explanation = ""
        groq_called = False

        if was_modified and rules_triggered:
            groq_messages = self._build_prompt(
                text, sanitized_text, rules_triggered, fuzzy_hits
            )
            explanation = self._call_groq(groq_messages)
            groq_called = True

        return {
            "sanitized_text":   sanitized_text,
            "was_modified":     was_modified,
            "rules_triggered":  rules_triggered,
            "original_length":  orig_len,
            "sanitized_length": clean_len,
            "fuzzy_hits":       fuzzy_hits,
            "explanation":      explanation,
            "groq_called":      groq_called,
        }


# =========================================================
# SINGLETON INSTANCE
# =========================================================

sanitizer_explainer = SanitizerExplainerAgent()


# =========================================================
# HELPER FUNCTION
# =========================================================

def sanitize_and_explain(text: str, max_chars: int = 4096) -> Dict:
    return sanitizer_explainer.process(text, max_chars)
