from flask import request
from app import bp
from app.processing import comment_scanner, comment_classifier, issue_scanner


@bp.route("/comments/scanner", methods=["GET"])
def get_comment_status():
    return {"status": comment_scanner.status()}


@bp.route("/comments/scanner", methods=["POST"])
def start_running_comment_scanner():
    comment_scanner.start()
    return {"status": comment_scanner.status()}


@bp.route("/comments/scanner", methods=["DELETE"])
def stop_running_comment_scanner():
    comment_scanner._running = False
    return {"status": comment_scanner.status()}


@bp.route("/comments/analyse", methods=["POST"])
def analyse_comment():
    comment = request.json["content"]
    prob, label, words = comment_classifier.classify_prob_comment(comment)
    return {
        "label": label,
        "probability": str(prob),
        "words": {word: str(word_prob) for word, word_prob in words.items()}
    }


@bp.route("/issues/scanner", methods=["GET"])
def get_issue_status():
    return {"status": issue_scanner.status()}


@bp.route("/issues/scanner", methods=["POST"])
def start_running_issue_scanner():
    issue_scanner.start()
    return {"status": issue_scanner.status()}


@bp.route("/issues/scanner", methods=["DELETE"])
def stop_running_issue_scanner():
    issue_scanner._running = False
    return {"status": issue_scanner.status()}

