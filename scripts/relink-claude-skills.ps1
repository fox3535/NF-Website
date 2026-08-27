# Relinks .claude/skills/<name> entries to their canonical source under .agents/skills/<name>.
#
# Why this exists:
# Skills installed via `npx skills add` are stored once under .agents/skills/<name>
# (the canonical, tracked copy) and exposed to Claude Code via a symlink at
# .claude/skills/<name>. Git can track that symlink correctly, but only when the
# machine that clones/checks out the repo can create real Windows symlinks
# (i.e. Developer Mode is on, or the user has SeCreateSymbolicLinkPrivilege) AND
# the repo's local git config has core.symlinks=true.
#
# If either of those isn't true on a given machine, `git checkout` silently
# replaces the symlink with a plain text file containing the link target path
# instead of a real folder. Claude Code will then fail to discover the skill.
#
# Run this script once after cloning (or whenever `.claude/skills/<name>` looks
# like a small text file instead of a folder) to fix it up locally. It does not
# change what's committed to git.
#
# Usage (from repo root):
#   powershell -ExecutionPolicy Bypass -File scripts/relink-claude-skills.ps1

$ErrorActionPreference = "Stop"
$repoRoot = git rev-parse --show-toplevel
if (-not $repoRoot) { throw "Not inside a git repository." }
Set-Location $repoRoot

# One-time local config so `git add`/`git checkout` handle symlinks as real
# symlinks on this machine instead of dereferencing/flattening them.
git config --local core.symlinks true

$agentsSkillsDir = Join-Path $repoRoot ".agents\skills"
$claudeSkillsDir = Join-Path $repoRoot ".claude\skills"

if (-not (Test-Path $agentsSkillsDir)) {
    Write-Host "No .agents/skills directory found — nothing to relink."
    exit 0
}

New-Item -ItemType Directory -Force -Path $claudeSkillsDir | Out-Null

Get-ChildItem -Path $agentsSkillsDir -Directory | ForEach-Object {
    $skillName = $_.Name
    $linkPath = Join-Path $claudeSkillsDir $skillName
    $target = "..\..\.agents\skills\$skillName"

    $isRealSymlink = (Test-Path $linkPath) -and
        ((Get-Item $linkPath -Force).Attributes -band [IO.FileAttributes]::ReparsePoint)

    if ($isRealSymlink) {
        Write-Host "OK: $skillName is already a real symlink."
        return
    }

    if (Test-Path $linkPath) {
        Write-Host "Fixing: $skillName was materialized as a plain file/folder — replacing with a symlink."
        Remove-Item -Recurse -Force $linkPath
    } else {
        Write-Host "Creating: symlink for $skillName."
    }

    New-Item -ItemType SymbolicLink -Path $linkPath -Target $target | Out-Null
}

Write-Host "Done. Verify with: Get-Item .claude\skills\* | Format-List Name, LinkType, Target"
