#!/bin/bash
# Stock Watcher Content Generator
# Run: ./generate-content.sh [quick-take|thread|roundup] [SYMBOL]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_DIR="$SCRIPT_DIR/config"
CONTENT_DIR="$SCRIPT_DIR/daily-content"
TODAY=$(date +%Y-%m-%d)
OUTPUT_FILE="$CONTENT_DIR/$TODAY.md"

# Load settings
SETTINGS=$(cat "$CONFIG_DIR/settings.json")
SCORES=$(cat "$CONFIG_DIR/scores-cache.json")
WATCHLIST=$(cat "$CONFIG_DIR/watchlist.json")

# Get content type from argument or day of week
CONTENT_TYPE="${1:-auto}"
SYMBOL="${2:-}"

if [ "$CONTENT_TYPE" = "auto" ]; then
    DAY_OF_WEEK=$(date +%A | tr '[:upper:]' '[:lower:]')
    case $DAY_OF_WEEK in
        monday)    CONTENT_TYPE="quick-take" ;;
        tuesday)   CONTENT_TYPE="thread" ;;
        wednesday) CONTENT_TYPE="quick-take" ;;
        thursday)  CONTENT_TYPE="educational" ;;
        friday)    CONTENT_TYPE="thread" ;;
        saturday)  CONTENT_TYPE="engagement" ;;
        sunday)    CONTENT_TYPE="rest" ;;
    esac
fi

echo "📊 Stock Watcher Content Generator"
echo "Date: $TODAY"
echo "Content Type: $CONTENT_TYPE"
echo "Symbol: ${SYMBOL:-auto}"
echo ""

# Create output file header
cat > "$OUTPUT_FILE" << EOF
# Stock Watcher Content — $TODAY

Generated at: $(date +%H:%M:%S)
Content Type: $CONTENT_TYPE

---

EOF

case $CONTENT_TYPE in
    quick-take)
        # Select stock if not specified
        if [ -z "$SYMBOL" ]; then
            SYMBOL=$(echo $WATCHLIST | jq -r '.stocks[0]')
        fi
        
        # Get score data
        SCORE_DATA=$(echo $SCORES | jq -r ".scores.$SYMBOL")
        TOTAL=$(echo $SCORE_DATA | jq -r '.score')
        GM=$(echo $SCORE_DATA | jq -r '.growthMoat')
        RQ=$(echo $SCORE_DATA | jq -r '.revenueQuality')
        OO=$(echo $SCORE_DATA | jq -r '.ownerOperator')
        VW=$(echo $SCORE_DATA | jq -r '.valuationWisdom')
        
        cat >> "$OUTPUT_FILE" << EOF
## Quick Take: $SYMBOL

### Tweet (copy this):

\`\`\`
$SYMBOL G.R.O.W. score: $TOTAL/100

🏰 Growth Moat: $GM
📈 Revenue Quality: $RQ
🤝 Owner-Operator: $OO
💰 Valuation: $VW

[Add verdict here]
\`\`\`

### To Post:
\`\`\`bash
source ~/.config/bird/stockwatcher.env
bird tweet "[PASTE TWEET HERE]"
\`\`\`

---

**Status:** Ready for review
**Action needed:** Add verdict sentence, then post or schedule
EOF
        ;;
        
    thread)
        if [ -z "$SYMBOL" ]; then
            # Get next in rotation
            INDEX=$(echo $WATCHLIST | jq -r '.lastThreadIndex')
            SYMBOL=$(echo $WATCHLIST | jq -r ".threadRotation[$INDEX]")
        fi
        
        SCORE_DATA=$(echo $SCORES | jq -r ".scores.$SYMBOL")
        TOTAL=$(echo $SCORE_DATA | jq -r '.score')
        GM=$(echo $SCORE_DATA | jq -r '.growthMoat')
        RQ=$(echo $SCORE_DATA | jq -r '.revenueQuality')
        OO=$(echo $SCORE_DATA | jq -r '.ownerOperator')
        VW=$(echo $SCORE_DATA | jq -r '.valuationWisdom')
        
        cat >> "$OUTPUT_FILE" << EOF
## Deep Dive Thread: $SYMBOL

### Thread (6 tweets):

**Tweet 1:**
\`\`\`
I scored $SYMBOL using G.R.O.W.

Result: $TOTAL/100

Here's the full breakdown 🧵
\`\`\`

**Tweet 2:**
\`\`\`
🏰 Growth Moat: $GM/100

[Company]'s competitive advantage:

• [Factor 1]
• [Factor 2]
• [Factor 3]

[Assessment]
\`\`\`

**Tweet 3:**
\`\`\`
📈 Revenue Quality: $RQ/100

How predictable is the money?

• [Factor 1]
• [Factor 2]
• [Factor 3]

[Assessment]
\`\`\`

**Tweet 4:**
\`\`\`
🤝 Owner-Operator: $OO/100

Who's running the ship?

• [Factor 1]
• [Factor 2]
• [Factor 3]

[Assessment]
\`\`\`

**Tweet 5:**
\`\`\`
💰 Valuation Wisdom: $VW/100

Is the price right?

• Current P/E: [X]
• Forward P/E: [X]
• Comparison: [X]

[Assessment]
\`\`\`

**Tweet 6:**
\`\`\`
📊 Final G.R.O.W. score: $TOTAL/100

Verdict: [Summary]

Track $SYMBOL on your watchlist → stockwatcher.app
\`\`\`

### To Post:
\`\`\`bash
source ~/.config/bird/stockwatcher.env
bird thread "Tweet 1

---

Tweet 2

---

Tweet 3

---

Tweet 4

---

Tweet 5

---

Tweet 6"
\`\`\`

---

**Status:** Needs research and completion
**Action needed:** Fill in specific details, verify data, then post
EOF
        ;;
        
    roundup)
        cat >> "$OUTPUT_FILE" << EOF
## Weekly Roundup

### Tweet:

\`\`\`
📊 G.R.O.W. Weekly — $(date +"%b %d, %Y")

Score movers this week:

⬆️ [STOCK]: [OLD] → [NEW] ([reason])
⬆️ [STOCK]: [OLD] → [NEW] ([reason])
⬇️ [STOCK]: [OLD] → [NEW] ([reason])
➡️ [STOCK]: [SCORE] (stable)

[Insight]

Free watchlist tracking → stockwatcher.app
\`\`\`

### To Post:
\`\`\`bash
source ~/.config/bird/stockwatcher.env
bird tweet "[PASTE TWEET HERE]"
\`\`\`

---

**Status:** Ready for review
**Action needed:** Fill in weekly changes, add insight
EOF
        ;;
        
    educational)
        cat >> "$OUTPUT_FILE" << EOF
## Educational Content

Select topic from rotation:
1. Growth Moat — What it means and why it matters
2. Revenue Quality — Not all money is equal
3. Owner-Operator — Skin in the game
4. Valuation Wisdom — Good company ≠ good price
5. Value Traps — How to avoid them
6. Moat Erosion — Warning signs

See TWITTER-PLAYBOOK.md for thread templates.

---

**Status:** Needs creation
**Action needed:** Pick topic, use template, create thread
EOF
        ;;
        
    engagement|rest)
        cat >> "$OUTPUT_FILE" << EOF
## $CONTENT_TYPE Day

No scheduled content today.

Optional activities:
- Reply to comments
- Engage with finance accounts
- Quote-tweet interesting analysis
- Rest

---

**Status:** Optional
EOF
        ;;
esac

echo "✅ Content generated: $OUTPUT_FILE"
echo ""
cat "$OUTPUT_FILE"
