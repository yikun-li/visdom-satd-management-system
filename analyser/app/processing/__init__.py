import os
from urllib.parse import urlparse
import psycopg2
from app.processing.classifier import Classifier
from app.processing.wordprocesser import WordProcessor
from app.processing.commentscanner import CommentScanner
from app.processing.issuescanner import IssueScanner

# Database connection
db_url = urlparse(os.environ.get("DATABASE_URL"))
db_conn = psycopg2.connect(
    host=db_url.hostname,
    port=db_url.port,
    database=db_url.path[1:],
    user=os.environ.get("DATABASE_USER"),
    password=os.environ.get("DATABASE_PASS")
)

# Fasttext word processor
word_processor = WordProcessor(os.environ.get("WORD_EMBEDDING_FILE"))

# Comment classifier
comment_classifier = Classifier(os.environ.get("COMMENT_MODEL_FILE"), word_processor)
comment_scanner = CommentScanner(db_conn, comment_classifier)

# Issue classifier
issue_classifier = Classifier(os.environ.get("ISSUE_MODEL_FILE"), word_processor)
issue_scanner = IssueScanner(db_conn, issue_classifier)
