#!/bin/bash
# @Unserious_boy posting script

source ~/.config/bird/unserious_boy.env

TWEET_TEXT="$1"

if [ -z "$TWEET_TEXT" ]; then
    echo "Usage: ./post.sh \"tweet text\""
    exit 1
fi

bird --auth-token "$AUTH_TOKEN" --ct0 "$CT0" tweet "$TWEET_TEXT"
