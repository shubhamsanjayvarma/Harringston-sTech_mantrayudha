#!/usr/bin/env python3
"""
Pre-Commit / Pre-Push Security Guard: Hardcoded Secrets Scanner
Repository: NovaMart / Mantra Yudha
Verifies that no .env files, private credentials, or live API keys are staged.
"""

import os
import re
import subprocess
import sys

PATTERNS = [
    ("Google / Gemini API Key", re.compile(r"AIza[0-9A-Za-z-_]{35}")),
    ("OpenAI Secret Key", re.compile(r"sk-[a-zA-Z0-9_\-]{20,}")),
    ("GitHub Personal Token", re.compile(r"gh[pousr]_[A-Za-z0-9_]{36,}")),
    ("Generic High-Entropy Secret", re.compile(r"""(?:api_key|apikey|secret|token|password)\s*[:=]\s*['"][A-Za-z0-9_\-\.]{16,}['"]""", re.IGNORECASE)),
]

BLOCKED_FILENAMES = {
    ".env",
    ".env.local",
    ".env.production",
    ".env.development",
    "id_rsa",
    "id_ed25519",
}

BLOCKED_EXTENSIONS = {
    ".pem",
    ".key",
    ".pfx",
    ".pkcs12",
}

SAFE_PLACEHOLDERS = [
    "your_gemini_api_key_here",
    "dummy",
    "placeholder",
    "example",
    "fake",
    "changeme",
    "test_key",
    "<your",
]


def is_placeholder(val: str) -> bool:
    val_lower = val.lower()
    return any(p in val_lower for p in SAFE_PLACEHOLDERS)


def scan_file(filepath: str) -> list:
    violations = []
    base = os.path.basename(filepath)
    ext = os.path.splitext(filepath)[1].lower()

    if base in BLOCKED_FILENAMES:
        violations.append((filepath, "Blocked environment/secret filename", base))
        return violations

    if ext in BLOCKED_EXTENSIONS:
        violations.append((filepath, "Blocked private key/certificate extension", ext))
        return violations

    if not os.path.isfile(filepath):
        return violations

    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            for line_no, line in enumerate(f, start=1):
                for name, pat in PATTERNS:
                    for match in pat.finditer(line):
                        matched_str = match.group(0)
                        if not is_placeholder(matched_str):
                            masked = matched_str[:6] + "..." + matched_str[-4:] if len(matched_str) > 10 else "***"
                            violations.append((filepath, f"{name} on line {line_no}", masked))
    except Exception as e:
        pass

    return violations


def main():
    # If checking staged files
    try:
        staged_files = subprocess.check_output(
            ["git", "diff", "--cached", "--name-only"],
            text=True
        ).splitlines()
    except Exception:
        staged_files = []

    files_to_check = staged_files if staged_files else []
    
    # If no staged files, inspect all tracked + untracked files in git status
    if not files_to_check:
        try:
            status_files = subprocess.check_output(
                ["git", "status", "--porcelain"],
                text=True
            ).splitlines()
            for line in status_files:
                if line.strip():
                    fname = line[3:].strip()
                    if os.path.exists(fname):
                        files_to_check.append(fname)
        except Exception:
            pass

    all_violations = []
    for f in files_to_check:
        # Ignore deleted files
        if os.path.exists(f):
            v = scan_file(f)
            if v:
                all_violations.extend(v)

    if all_violations:
        print("\n================================================================================")
        print("  SECURITY ALERT: SENSITIVE DATA OR CREDENTIALS DETECTED")
        print("================================================================================")
        for filepath, desc, sample in all_violations:
            print(f"  [X] {filepath} -> {desc} ({sample})")
        print("\nPlease remove all credentials, API keys, and sensitive files before proceeding.")
        print("================================================================================\n")
        sys.exit(1)

    print("[SECURITY CHECK PASSED] No secrets, private keys, or .env files detected.")
    sys.exit(0)


if __name__ == "__main__":
    main()
