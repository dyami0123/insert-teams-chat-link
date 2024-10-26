# Insert Teams Chat Link

super simple plugin to automatically parse and insert a link to a Teams chat based on the chat ID.

## Context:

Teams allows you to quickly generate a link to a specific message in a chat, but not the chat itself. You can generate a link to a specific chat via modifying the URL, but its a bit of a pain to do repeatedly.

this plugin automates that process, it adds a command: `Insert Teams Chat Link` which will prompt you for the chat ID and then insert a link to the chat in the format `[Chat](someurl)` where `someurl` is the URL to the chat.