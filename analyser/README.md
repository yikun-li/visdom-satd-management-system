# Analyser - Technical Debt Analyser

## Requirements

This module requires a word embedding file and a model. Set the paths to these with the environment variables
`WEIGHT_FILE` and `WORD_EMBEDDING_FILE` to the path to these files.

## Description

This module will run on port `5000`. The communication is very basic, as it uses a simple Flask server to accept
incoming HTTP requests. The following requests are available:

- `GET /` - This respond with either `{"status":"running"}` or `{"status":"idling"}`.
- `POST /` (no body required) - This will start the analyser.
- `POST /analyse` (Body required: `{"content":"Some comment content"}`) - This will to a single analysis of the given
comment.

