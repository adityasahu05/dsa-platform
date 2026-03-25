    """
    Student Routes
    API endpoints for student operations — Firebase Realtime Database
    """

    from fastapi import APIRouter, Depends
    from firebase_admin import db
    from app.routes.auth import get_current_user

    router = APIRouter(prefix="/api/student", tags=["student"])


    @router.get("/my-submissions")
    def get_my_submissions(current_user: dict = Depends(get_current_user)):
        """
        Returns all submissions made by the currently logged-in student.
        Joins with /tests to include the test title.
        """
        student_id = current_user["id"]

        all_subs = db.reference("/submissions").get() or {}
        all_tests = db.reference("/tests").get() or {}

        result = []
        seen_test_ids = set()

        for sub_id, sub in all_subs.items():
            if sub.get("student_id") != student_id:
                continue

            test_id = sub.get("test_id")

            # Only show the latest submission per test (highest score)
            # We'll collect all and deduplicate after
            test = all_tests.get(test_id, {})
            current_session_id = test.get("current_session_id")
            if current_session_id and sub.get("session_id") != current_session_id:
                continue

            result.append({
                "submission_id": sub_id,
                "test_id":       test_id,
                "test_title":    test.get("title", "Unknown Test"),
                "score":         sub.get("score", 0),
                "language":      sub.get("language"),
                "submitted_at":  sub.get("submitted_at"),
                "session_id":    sub.get("session_id"),
            })

        # Sort by submitted_at descending
        result.sort(key=lambda x: x.get("submitted_at") or "", reverse=True)

        # Deduplicate by test_id — keep only the latest submission per test
        seen = set()
        deduped = []
        for item in result:
            if item["test_id"] not in seen:
                seen.add(item["test_id"])
                deduped.append(item)

        return deduped
