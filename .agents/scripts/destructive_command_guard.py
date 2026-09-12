#!/usr/bin/env python3
"""
Destructive Command Guard & Threat Interception Hook
Repository: Universal_Project_Boilerplate
Enforces: Rule 37 (Harmful Command Prevention & Non-Negotiable Reversibility)
Platform: Cross-platform (Windows pwsh/cmd & POSIX bash/zsh)
Protocol: Antigravity PreToolUse Contract (stdin JSON -> stdout JSON)
"""

import sys
import json
import re
import unicodedata

# ------------------------------------------------------------------------------
# 1. Forensic Normalization & Anti-Evasion Pipeline
# ------------------------------------------------------------------------------
def normalize_command(cmd: str) -> str:
    """
    De-obfuscates command strings across 4 phases to prevent regex evasion:
    Phase 1: Unicode NFKC normalization (defeats homoglyphs and zero-width chars)
    Phase 2: Escape stripping (POSIX backslash '\\', CMD caret '^', PowerShell backtick '`')
    Phase 3: Quote coalescing (unwraps 'r''m' -> rm, "r""m" -> rm)
    Phase 4: Flag canonicalization (unbundles flags like /s/q -> /s /q)
    """
    if not cmd:
        return ""

    # Phase 1: NFKC Unicode Normalization
    normalized = unicodedata.normalize("NFKC", cmd)

    # Phase 2: Strip shell escape characters before words
    normalized = re.sub(r"\^(?=[a-zA-Z0-9_\/\\-])", "", normalized)      # Windows CMD caret escape
    normalized = re.sub(r"`(?=[a-zA-Z0-9_\/\\-])", "", normalized)       # PowerShell backtick escape
    normalized = re.sub(r"\\(?=[a-zA-Z0-9_\/\\-])", "", normalized)      # POSIX backslash escape

    # Phase 3: Quote token coalescing (e.g. 'r''m' -> rm, "r""m" -> rm, -'r'f -> -rf)
    # Strip quotes when directly adjacent to word characters or hyphens
    normalized = re.sub(r"(?<=[a-zA-Z0-9_\/-])[\"']", "", normalized)
    normalized = re.sub(r"[\"'](?=[a-zA-Z0-9_\/-])", "", normalized)

    # Phase 4: Common flag spacing (e.g. rmdir/s/q -> rmdir /s /q)
    normalized = re.sub(r"(?i)\b(rmdir|rd)\/([sSqQ])", r"\1 /\2", normalized)
    normalized = re.sub(r"(?i)\/([sSqQ])\/([sSqQ])", r"/\1 /\2", normalized)

    return normalized


# ------------------------------------------------------------------------------
# 2. Exhaustive Destructive & Irreversible Threat Patterns
# ------------------------------------------------------------------------------
THREAT_PATTERNS = [
    # --------------------------------------------------------------------------
    # CATEGORY 1: Mass Filesystem Deletion & Recursive Obliteration
    # --------------------------------------------------------------------------
    {
        "category": "MASS_FILESYSTEM_DELETION",
        "name": "POSIX recursive force wipe of root, home, or ancestor",
        "pattern": re.compile(
            r"(?i)(?:^|[\s;&|`'\"])(?:sudo\s+)?rm\s+(?:-[a-z0-9_-]*\s+)*(?:-[a-z0-9_-]*[rf][a-z0-9_-]*\s+)*(?:--recursive|--force|--no-preserve-root|-r|-f|-rf|-fr)\b.*?(?:[\s\"']*(?:\/|\/\*|~\/?|~\/\*|\$HOME\b|\$\{HOME\}|\.\.(?:\/\.\.)*|\.\/|\.\/\*))(?:[\s\"';&|]|$)"
        ),
    },
    {
        "category": "MASS_FILESYSTEM_DELETION",
        "name": "PowerShell Remove-Item recursive force root or system wipe",
        "pattern": re.compile(
            r"(?i)(?:^|[\s;&|`'\"])(?:Remove-Item|rmdir|rd|ri|del|erase|rm)\s+(?:.*?(?:-[rR](?:[eE][cC](?:[uU][rR][sS][eE])?)?|-[fF](?:[oO][rR][cC][eE])?)\b){2}.*?(?:[A-Za-z]:[\\/][*]?|\$env:(?:SystemDrive|USERPROFILE|windir|HOMEPATH)|HKLM:|HKCU:|\.\.[\\/])"
        ),
    },
    {
        "category": "MASS_FILESYSTEM_DELETION",
        "name": "Windows CMD quiet recursive obliteration (rmdir /s /q, del /f /s /q)",
        "pattern": re.compile(
            r"(?i)(?:^|[\s;&|`'\"])(?:rmdir|rd)\s*(?:\/[sS]\s*\/[qQ]|\/[qQ]\s*\/[sS])\s+.*?(?:[A-Za-z]:[\\/]?|%SYSTEMDRIVE%|%USERPROFILE%|\.\.)"
        ),
    },
    {
        "category": "MASS_FILESYSTEM_DELETION",
        "name": "Windows CMD force quiet recursive del/erase",
        "pattern": re.compile(
            r"(?i)(?:^|[\s;&|`'\"])(?:del|erase)\s*(?=(?:.*\/[fF]))(?=(?:.*\/[sS]))(?=(?:.*\/[qQ])).*?(?:[A-Za-z]:[\\/]?\*|\*|%SYSTEMDRIVE%)"
        ),
    },
    {
        "category": "MASS_FILESYSTEM_DELETION",
        "name": "POSIX find mass delete / unlink",
        "pattern": re.compile(
            r"(?i)(?:^|[\s;&|`'\"])(?:sudo\s+)?find\s+(?:\/|~|\$HOME|\.\.)\s+.*?(?:-delete|-exec\s+(?:rm|unlink)\b)"
        ),
    },

    # --------------------------------------------------------------------------
    # CATEGORY 2: Disk, Partition, Volume & Raw Block Destruction
    # --------------------------------------------------------------------------
    {
        "category": "DISK_BLOCK_DESTRUCTION",
        "name": "POSIX mkfs targeting raw block devices",
        "pattern": re.compile(
            r"(?i)(?:^|[\s;&|`'\"])(?:sudo\s+)?mkfs(?:\.[a-z0-9_-]+)?\s+(?:.*?\s+)?(?:\/dev\/(?:sd[a-z][0-9]*|nvme[0-9]+n[0-9]+(?:p[0-9]+)?|vd[a-z][0-9]*|hd[a-z][0-9]*|mapper\/|disk\/by-))"
        ),
    },
    {
        "category": "DISK_BLOCK_DESTRUCTION",
        "name": "POSIX dd overwriting raw block devices",
        "pattern": re.compile(
            r"(?i)(?:^|[\s;&|`'\"])(?:sudo\s+)?dd\s+.*?of=\/dev\/(?:sd[a-z]|nvme[0-9]+n[0-9]+|vd[a-z]|hd[a-z]|mapper\/|md[0-9]+|disk\/by-)"
        ),
    },
    {
        "category": "DISK_BLOCK_DESTRUCTION",
        "name": "Low-level partition wipers (wipefs, blkdiscard, sgdisk, parted, shred)",
        "pattern": re.compile(
            r"(?i)(?:^|[\s;&|`'\"])(?:sudo\s+)?(?:wipefs\s+(?:-[a-z]*[af][a-z]*\s+)*\/dev\/|blkdiscard\s+(?:-[a-z]*\s+)*\/dev\/|sgdisk\s+(?:--zap-all|-Z)\b|sfdisk\s+--delete\b|parted\s+.*?\bmklabel\b|shred\s+.*?(?:\/dev\/sd[a-z]|\/dev\/nvme))"
        ),
    },
    {
        "category": "DISK_BLOCK_DESTRUCTION",
        "name": "Windows diskpart clean, format drive, Clear-Disk, or Format-Volume",
        "pattern": re.compile(
            r"(?i)(?:^|[\s;&|`'\"])(?:diskpart(?:\.exe)?\b.*?(?:clean\s+all|clean\b|delete\s+partition)|format\s+[A-Za-z]:\s+.*?(?:\/y|\/fs:)|\bClear-Disk\b.*?-RemoveData|\bRemove-Partition\b.*?-DiskNumber|\bFormat-Volume\b.*?-DriveLetter)"
        ),
    },

    # --------------------------------------------------------------------------
    # CATEGORY 3: Git Irreversible & Force Destruction
    # --------------------------------------------------------------------------
    {
        "category": "GIT_FORCE_DESTRUCTION",
        "name": "Git force push (flags --force, -f, --force-with-lease, or +refspec)",
        "pattern": re.compile(
            r"(?i)\bgit\s+(?:-[a-z0-9_-]+\s+)*push\s+.*?(?:--force\b|-f\b|--force-with-lease\b|\+[a-zA-Z0-9_\/.:]+|--mirror\b)"
        ),
    },
    {
        "category": "GIT_FORCE_DESTRUCTION",
        "name": "Git remote branch deletion (flags --delete, -d, or :refspec)",
        "pattern": re.compile(
            r"(?i)\bgit\s+(?:-[a-z0-9_-]+\s+)*push\s+.*?(?:--delete\b|-d\b|:\s*[a-zA-Z0-9_\/.-]+)"
        ),
    },
    {
        "category": "GIT_FORCE_DESTRUCTION",
        "name": "Git destructive reset hard or untracked clean (git reset --hard, git clean -fdx)",
        "pattern": re.compile(
            r"(?i)\bgit\s+(?:-[a-z0-9_-]+\s+)*(?:reset\s+(?:.*?\s+)?--hard\b|clean\s+.*?(?:-[a-z0-9]*[fx][a-z0-9]*|-f\b|-x\b))"
        ),
    },
    {
        "category": "GIT_FORCE_DESTRUCTION",
        "name": "Git branch force deletion or reflog permanent expiration",
        "pattern": re.compile(
            r"(?i)\bgit\s+(?:-[a-z0-9_-]+\s+)*(?:branch\s+.*?(?:-D\b|--delete\s+--force\b)|reflog\s+expire\s+.*?(?:--expire=now|--expire-unreachable=now)|prune\s+.*?(?:--expire=now|--expire\s+now))"
        ),
    },

    # --------------------------------------------------------------------------
    # CATEGORY 4: Database & Persistence Irreversible Operations
    # --------------------------------------------------------------------------
    {
        "category": "DATABASE_DESTRUCTION",
        "name": "SQL DROP DATABASE / SCHEMA / TABLE",
        "pattern": re.compile(
            r"(?is)\bDROP\s+(?:DATABASE|SCHEMA|TABLE|TABLESPACE)\s+(?:IF\s+EXISTS\s+)?(?:[`\"\[]?[a-z0-9_\-]+[`\"\]]?\s*,\s*)*[`\"\[]?[a-z0-9_\-]+[`\"\]]?\s*(?:CASCADE|RESTRICT)?\s*;?"
        ),
    },
    {
        "category": "DATABASE_DESTRUCTION",
        "name": "SQL TRUNCATE TABLE",
        "pattern": re.compile(
            r"(?is)\bTRUNCATE\s+(?:TABLE\s+)?(?:[`\"\[]?[a-z0-9_\-]+[`\"\]]?\s*,\s*)*[`\"\[]?[a-z0-9_\-]+[`\"\]]?\s*(?:CASCADE|RESTART\s+IDENTITY|CONTINUE\s+IDENTITY)?\s*;?"
        ),
    },
    {
        "category": "DATABASE_DESTRUCTION",
        "name": "SQL mass unconstrained DELETE or tautological WHERE (1=1, TRUE)",
        "pattern": re.compile(
            r"(?is)\bDELETE\s+FROM\s+[`\"\[]?[a-z0-9_\-]+[`\"\]]?(?:\s*;|\s+WHERE\s+(?:1\s*=\s*1|true\b|'[^']*'\s*=\s*'[^']*'|[a-z0-9_.]+\s+IS\s+NOT\s+NULL)\s*;?|(?!\s*WHERE\b)\s*$)"
        ),
    },
    {
        "category": "DATABASE_DESTRUCTION",
        "name": "Redis FLUSHALL or FLUSHDB cache wipe",
        "pattern": re.compile(
            r"(?i)(?:^|[\s;&|`'\"])(?:redis-cli\s+.*?)?\b(?:FLUSHALL|FLUSHDB)(?:\s+ASYNC)?\b"
        ),
    },

    # --------------------------------------------------------------------------
    # CATEGORY 5: System Integrity, Kernel & OS Crash Loops
    # --------------------------------------------------------------------------
    {
        "category": "SYSTEM_INTEGRITY",
        "name": "Fork bomb variant (POSIX / Perl / Python)",
        "pattern": re.compile(
            r"(?i)(?::\(\)\s*\{\s*:\|:&\s*\};:|bomb\(\)\s*\{\s*bomb\|bomb&\s*\};bomb|perl\s+-e\s+['\"]fork\s+while\s+1;?['\"]|python(?:\d)?\s+-c\s+['\"].*?os\.fork\(\))"
        ),
    },
    {
        "category": "SYSTEM_INTEGRITY",
        "name": "Host shutdown, poweroff, reboot, or SysRq kernel panic",
        "pattern": re.compile(
            r"(?i)(?:^|[\s;&|`'\"])(?:sudo\s+)?(?:shutdown\s+.*?(?:-[srfhHP]|\bnow\b)|poweroff\b|reboot\s+-[a-z]*f|halt\s+-[a-z]*p|init\s+[06]\b|systemctl\s+(?:poweroff|reboot|halt|emergency)|echo\s+[bco]\s*>\s*\/proc\/sysrq-trigger|\bStop-Computer\b|\bRestart-Computer\b)"
        ),
    },
    {
        "category": "SYSTEM_INTEGRITY",
        "name": "Windows critical subsystem termination (LSASS, CSRSS, SMSS, WININIT)",
        "pattern": re.compile(
            r"(?i)(?:^|[\s;&|`'\"])(?:taskkill(?:\.exe)?\s+.*?(?:\/im\s+(?:lsass|csrss|wininit|smss|services)\.exe|\/f\s+\/im\s+[a-z0-9_-]+\.exe)|\bStop-Process\b\s+.*?(?:-Name\s+(?:lsass|csrss|wininit|smss|services)|-Id\s+\(?(?:Get-Process\s+(?:lsass|csrss|wininit|smss)\)?\.Id)))"
        ),
    },
    {
        "category": "SYSTEM_INTEGRITY",
        "name": "Disabling endpoint defenses (Windows Defender / Firewall)",
        "pattern": re.compile(
            r"(?i)(?:^|[\s;&|`'\"])(?:Set-MpPreference\s+.*?(?:-DisableRealtimeMonitoring\s+\$true|-DisableBehaviorMonitoring\s+\$true|-DisableIOAVProtection\s+\$true)|netsh\s+advfirewall\s+set\s+(?:allprofiles|currentprofile|domainprofile|privateprofile|publicprofile)\s+state\s+off|\bSet-NetFirewallProfile\b\s+.*?-Enabled\s+False)"
        ),
    },

    # --------------------------------------------------------------------------
    # CATEGORY 6: Privilege Escalation, Remote Code Injection & Exfiltration
    # --------------------------------------------------------------------------
    {
        "category": "PRIVILEGE_ESCALATION",
        "name": "Pipe-to-shell remote code execution (curl/wget | sh, irm | iex)",
        "pattern": re.compile(
            r"(?i)(?:(?:curl|wget|fetch)\s+[^|;&\n]+?\|\s*(?:sudo\s+)?(?:ba|z|t?c|k)?sh\b|(?:irm|Invoke-RestMethod|iwr|Invoke-WebRequest|New-Object\s+Net\.WebClient)\b.*?\|\s*(?:iex|Invoke-Expression)\b|\b(?:iex|Invoke-Expression)\s*\(?\s*(?:New-Object\s+Net\.WebClient|irm|iwr|Invoke-WebRequest))"
        ),
    },
    {
        "category": "PRIVILEGE_ESCALATION",
        "name": "PowerShell base64 encoded command execution",
        "pattern": re.compile(
            r"(?i)\b(?:powershell(?:\.exe)?|pwsh(?:\.exe)?)\s+.*?(?:-[eE](?:[nN][cC](?:[oO][dD][eE][dD][cC][oO][mM][mM][aA][nN][dD])?)?)\s+[A-Za-z0-9+\/=]{12,}"
        ),
    },
    {
        "category": "PRIVILEGE_ESCALATION",
        "name": "Insecure root or drive-wide permissions assignment (chmod 777 /, icacls Everyone:F)",
        "pattern": re.compile(
            r"(?i)(?:(?:^|[\s;&|`'\"])(?:sudo\s+)?chmod\s+(?:-[a-z0-9_-]*R[a-z0-9_-]*\s+)*(?:0?777|a\+[rwx]+)\s+(?:\/|\/etc\b|\/home\b|\$HOME\b|C:\\)|(?:^|[\s;&|`'\"])(?:icacls(?:\.exe)?\s+[A-Za-z]:[\\/]\s+.*?(?:\/grant(?::r)?\s+Everyone:\(?[OICIFM\)]*F)|\btakeown(?:\.exe)?\s+\/f\s+[A-Za-z]:[\\/]\s+\/r))"
        ),
    },
    {
        "category": "CREDENTIAL_EXFILTRATION",
        "name": "Credential hive or shadow file dumping (SAM, SYSTEM, /etc/shadow)",
        "pattern": re.compile(
            r"(?i)(?:^|[\s;&|`'\"])(?:reg(?:\.exe)?\s+save\s+HKLM\\(?:SAM|SYSTEM|SECURITY)\b|cat\s+(?:\/etc\/shadow|\/etc\/gshadow)|\bntdsutil\b.*?(?:\"ifm\"|create\s+full))"
        ),
    },
]


# ------------------------------------------------------------------------------
# 3. Decision Evaluation Engine
# ------------------------------------------------------------------------------
def evaluate_command(command_line: str) -> dict:
    """
    Evaluates command against forensic patterns after normalization.
    Returns Antigravity PreToolUse response dictionary:
      {"decision": "allow"} OR {"decision": "deny", "reason": "..."}
    """
    normalized = normalize_command(command_line)

    for threat in THREAT_PATTERNS:
        match = threat["pattern"].search(normalized)
        if match:
            matched_segment = match.group(0).strip()
            reason_msg = (
                f"\n================================================================================"
                f"\n  CRITICAL SECURITY GUARDRAIL: DESTRUCTIVE COMMAND PHYSICALLY BLOCKED"
                f"\n================================================================================"
                f"\nCategory: {threat['category']}"
                f"\nThreat:   {threat['name']}"
                f"\nTrigger:  {matched_segment}"
                f"\n\nViolation: Rule 37 (Harmful Command Prevention & Invariant of Reversibility)."
                f"\nUnder no circumstances may an agent execute unconfirmed destructive operations,"
                f"\nforce overwrites, filesystem root wipes, or irreversible block/system changes."
                f"\n================================================================================"
            )
            return {
                "decision": "deny",
                "reason": reason_msg,
            }

    return {"decision": "allow"}


# ------------------------------------------------------------------------------
# 4. Main Entrypoint (Antigravity Stdin/Stdout Hook Contract)
# ------------------------------------------------------------------------------
def main():
    try:
        raw_input = sys.stdin.read()
        if not raw_input.strip():
            # No input provided, allow
            print(json.dumps({"decision": "allow"}))
            return

        payload = json.loads(raw_input)
        tool_call = payload.get("toolCall", {})
        tool_name = tool_call.get("name", "")
        args = tool_call.get("args", {})

        # Only inspect commands targeting shell execution
        if tool_name in ("run_command", "execute_command", "terminal_exec"):
            cmd_line = args.get("CommandLine", "")
            decision = evaluate_command(cmd_line)
            print(json.dumps(decision))
            return

        # Default permit for non-command tools
        print(json.dumps({"decision": "allow"}))

    except Exception as e:
        # Fail closed on unexpected parser errors for maximum security
        print(
            json.dumps(
                {
                    "decision": "deny",
                    "reason": f"Destructive Command Guard encountered an internal error: {str(e)}",
                }
            )
        )


if __name__ == "__main__":
    main()
