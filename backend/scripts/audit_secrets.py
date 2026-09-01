"""Pattern scan of worktree, built frontend and Git history; never prints matches.

This detects common credential formats, not every possible secret or live deploy.
"""
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PATTERNS = {
    'github-token': re.compile(rb'(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})'),
    'private-key': re.compile(rb'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----'),
    'aws-access-key': re.compile(rb'AKIA[0-9A-Z]{16}'),
    'credential-url': re.compile(rb'(?:postgres(?:ql)?(?:\+psycopg)?|mysql)://[^\s:/]+:([^\s@]+)@'),
}


def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT)


def main():
    findings = []
    def scan(label, data):
        for rule, pattern in PATTERNS.items():
            for match in pattern.finditer(data):
                # Templates are references, not concrete credentials.
                if rule == 'credential-url' and (b'${' in match[1] or match[1] in (b'password', b'PASSWORD', b'pass', b'example', b'replace_me')):
                    continue
                findings.append((label, rule))
    paths = git('ls-files', '-z', '--cached', '--others', '--exclude-standard').split(b'\0')
    for raw in paths:
        if raw:
            path = ROOT / raw.decode('utf-8')
            if path.is_file():
                scan(path.relative_to(ROOT).as_posix(), path.read_bytes())
    for path in (ROOT / 'frontend/dist').rglob('*'):
        if path.is_file():
            scan(path.relative_to(ROOT).as_posix(), path.read_bytes())
    objects = git('rev-list', '--objects', '--all').splitlines()
    for entry in objects:
        oid = entry.split(b' ', 1)[0].decode()
        if git('cat-file', '-t', oid).strip() == b'blob':
            scan('Git blob ' + oid, git('cat-file', 'blob', oid))
    for label, rule in sorted(set(findings)):
        print(f'REVIEW: {label} ({rule})')
    print(f'Scanned worktree, frontend build and {len(objects)} Git objects; {len(set(findings))} findings.')
    raise SystemExit(bool(findings))


if __name__ == '__main__':
    main()
