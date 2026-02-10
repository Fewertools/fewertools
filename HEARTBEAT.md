# HEARTBEAT.md

# Betting engine daemon - check if running, restart if dead and matches are live
- Check if betting daemon process is running (`ps aux | grep daemon.ts`)
- If not running and it's between 10:00-23:00 GMT, restart it: `cd /Users/clinton/clawd/projects/betting-engine && npx tsx src/daemon.ts &`
- Log status to memory/heartbeat-state.json
