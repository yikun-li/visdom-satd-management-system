import json

from app.processing.classifier import Classifier
import threading


class IssueScanner:
    def __init__(self, db, classifier: Classifier):
        self._classifier = classifier
        self._running = False
        self._db = db
        self._cursor = db.cursor()

    def start(self):
        if self._running:
            return

        thr = threading.Thread(target=self.runner)
        thr.start()

    def status(self):
        return "RUNNING" if self._running else "IDLING"

    def runner(self):
        self._running = True

        while self._running:
            select_query = """
            SELECT jc.id, jc.content FROM jira_classifiable jc 
            WHERE jc.debt_type = 'NOT_ANALYSED' ORDER BY jc.id LIMIT 1
            """
            self._cursor.execute(select_query)
            record = self._cursor.fetchall()
            if len(record) is not 1:
                self._running = False
                break

            comment_id, content = record[0]
            prob, label, words = self._classifier.classify_prob_comment(content)

            words_json = json.dumps({word: str(word_prob) for word, word_prob in words.items()})

            update_query = """
            UPDATE jira_classifiable SET debt_type=%s, debt_probability=%s, keywords=%s WHERE id=%s
            """
            self._cursor.execute(update_query, (label, prob.item(), words_json, comment_id))
            self._db.commit()
