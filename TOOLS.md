# TOOLS.md - Local Notes

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

---

## X/Twitter (bird CLI)

### Main Account
- **Handle:** @Clinton_feyi
- **Credentials:** `~/.config/bird/credentials.env`
- **Usage:** `source ~/.config/bird/credentials.env && bird <command>`

### Growth Account
- **Handle:** @Unserious_boy (UnseriousNaijaboy)
- **Credentials:** `~/.config/bird/unserious_boy.env`
- **Usage:** `bird --auth-token "$AUTH_TOKEN" --ct0 "$CT0" <command>`
- **Note:** Use CLI flags directly for this account

**Note:** Tokens may expire; re-grab from browser dev tools if auth fails

---

## What Goes Here

Things like:
- Camera names and locations
- SSH hosts and aliases  
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
