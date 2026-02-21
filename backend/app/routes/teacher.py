# # # """
# # # Teacher Routes
# # # API endpoints for teacher operations
# # # """

# # # from fastapi import APIRouter, HTTPException, Depends, status
# # # from sqlalchemy.orm import Session
# # # from typing import List
# # # from app.database import get_db
# # # from app.models.db_models import Test, Question, TestCase, Submission, User
# # # from pydantic import BaseModel
# # # from datetime import datetime

# # # router = APIRouter(prefix="/api/teacher", tags=["teacher"])


# # # # Pydantic models for requests/responses
# # # class TestCreate(BaseModel):
# # #     title: str
# # #     description: str
# # #     duration_minutes: int = 60
# # #     is_active: bool = True


# # # class TestResponse(BaseModel):
# # #     id: int
# # #     title: str
# # #     description: str
# # #     teacher_id: int
# # #     duration_minutes: int
# # #     is_active: bool
# # #     created_at: datetime
    
# # #     class Config:
# # #         from_attributes = True


# # # class QuestionCreate(BaseModel):
# # #     test_id: int
# # #     title: str
# # #     description: str
# # #     difficulty: str
# # #     topic: str
# # #     points: int = 10
# # #     time_limit_ms: int = 2000


# # # class TestCaseCreate(BaseModel):
# # #     question_id: int
# # #     input: str
# # #     expected_output: str
# # #     is_hidden: bool = False
# # #     points: int = 1

# # # class TestCaseResponse(BaseModel):
# # #     id: int
# # #     question_id: int
# # #     input: str
# # #     expected_output: str
# # #     is_hidden: bool
# # #     points: int
    
# # #     class Config:
# # #         from_attributes = True


# # # class QuestionResponse(BaseModel):
# # #     id: int
# # #     test_id: int
# # #     title: str
# # #     description: str
# # #     difficulty: str
# # #     topic: str
# # #     points: int
# # #     time_limit_ms: int
# # #     created_at: datetime
# # #     test_cases: List[TestCaseResponse] = []
    
# # #     class Config:
# # #         from_attributes = True

# # # # Routes
# # # @router.get("/tests", response_model=List[TestResponse])
# # # def get_all_tests(
# # #     db: Session = Depends(get_db),
# # #     teacher_id: int = 2  # TODO: Get from JWT
# # # ):
# # #     """Get all tests created by teacher"""
# # #     tests = db.query(Test).filter(Test.teacher_id == teacher_id).all()
# # #     return tests

# # # @router.get("/tests/{test_id}/questions", response_model=List[QuestionResponse])
# # # def get_test_questions(
# # #     test_id: int,
# # #     db: Session = Depends(get_db)
# # # ):
# # #     """Get all questions for a specific test with their test cases"""
# # #     # Verify test exists
# # #     test = db.query(Test).filter(Test.id == test_id).first()
# # #     if not test:
# # #         raise HTTPException(
# # #             status_code=status.HTTP_404_NOT_FOUND,
# # #             detail=f"Test with id {test_id} not found"
# # #         )
    
# # #     # Get all questions with their test cases
# # #     questions = db.query(Question).filter(Question.test_id == test_id).all()
    
# # #     return questions

# # # @router.get("/test/{test_id}/questions")
# # # def get_test_questions(
# # #     test_id: int,
# # #     db: Session = Depends(get_db)
# # # ):
# # #     """Get all questions for a specific test with their test cases"""
# # #     questions = db.query(Question).filter(Question.test_id == test_id).all()
    
# # #     # Format response with test cases
# # #     result = []
# # #     for question in questions:
# # #         test_cases = db.query(TestCase).filter(TestCase.question_id == question.id).all()
        
# # #         result.append({
# # #             "id": question.id,
# # #             "title": question.title,
# # #             "description": question.description,
# # #             "difficulty": question.difficulty.value,
# # #             "topic": question.topic.value,
# # #             "points": question.points,
# # #             "time_limit_ms": question.time_limit_ms,
# # #             "test_cases_count": len(test_cases),
# # #             "test_cases": [
# # #                 {
# # #                     "id": tc.id,
# # #                     "input": tc.input,
# # #                     "expected_output": tc.expected_output,
# # #                     "is_hidden": tc.is_hidden,
# # #                     "points": tc.points
# # #                 }
# # #                 for tc in test_cases
# # #             ]
# # #         })
    
# # #     return result

# # # @router.post("/tests", response_model=TestResponse)
# # # def create_test(
# # #     test: TestCreate,
# # #     db: Session = Depends(get_db),
# # #     teacher_id: int = 2  # TODO: Get from JWT
# # # ):
# # #     """Create a new test"""
# # #     new_test = Test(
# # #         title=test.title,
# # #         description=test.description,
# # #         teacher_id=teacher_id,
# # #         duration_minutes=test.duration_minutes,
# # #         is_active=test.is_active
# # #     )
# # #     db.add(new_test)
# # #     db.commit()
# # #     db.refresh(new_test)
# # #     return new_test


# # # @router.post("/questions")
# # # def create_question(
# # #     question: QuestionCreate,
# # #     db: Session = Depends(get_db)
# # # ):
# # #     """Add a question to a test"""
# # #     new_question = Question(
# # #         test_id=question.test_id,
# # #         title=question.title,
# # #         description=question.description,
# # #         difficulty=question.difficulty.upper(),
# # #         topic=question.topic.upper(),
# # #         points=question.points,
# # #         time_limit_ms=question.time_limit_ms
# # #     )
# # #     db.add(new_question)
# # #     db.commit()
# # #     db.refresh(new_question)
# # #     return new_question


# # # @router.post("/test-cases")
# # # def create_test_case(
# # #     test_case: TestCaseCreate,
# # #     db: Session = Depends(get_db)
# # # ):
# # #     """Add a test case to a question"""
# # #     new_test_case = TestCase(
# # #         question_id=test_case.question_id,
# # #         input=test_case.input,
# # #         expected_output=test_case.expected_output,
# # #         is_hidden=test_case.is_hidden,
# # #         points=test_case.points
# # #     )
# # #     db.add(new_test_case)
# # #     db.commit()
# # #     db.refresh(new_test_case)
# # #     return new_test_case


# # # @router.get("/submissions")
# # # def get_all_submissions(
# # #     db: Session = Depends(get_db),
# # #     limit: int = 50
# # # ):
# # #     """Get recent submissions with student and question details"""
# # #     submissions = db.query(Submission).order_by(
# # #         Submission.submitted_at.desc()
# # #     ).limit(limit).all()
# # #     return submissions


# # # @router.get("/analytics/test/{test_id}")
# # # def get_test_analytics(
# # #     test_id: int,
# # #     db: Session = Depends(get_db)
# # # ):
# # #     """Get analytics for a specific test"""
# # #     # Get all questions in test
# # #     questions = db.query(Question).filter(Question.test_id == test_id).all()
    
# # #     analytics = {
# # #         "test_id": test_id,
# # #         "total_questions": len(questions),
# # #         "questions": []
# # #     }
    
# # #     for question in questions:
# # #         submissions = db.query(Submission).filter(
# # #             Submission.question_id == question.id
# # #         ).all()
        
# # #         total_submissions = len(submissions)
# # #         passed = sum(1 for s in submissions if s.score == 100)
# # #         avg_score = sum(s.score for s in submissions) / total_submissions if total_submissions > 0 else 0
        
# # #         analytics["questions"].append({
# # #             "question_id": question.id,
# # #             "title": question.title,
# # #             "total_submissions": total_submissions,
# # #             "passed": passed,
# # #             "failed": total_submissions - passed,
# # #             "pass_rate": (passed / total_submissions * 100) if total_submissions > 0 else 0,
# # #             "average_score": round(avg_score, 2)
# # #         })
    
# # #     return analytics

# # # @router.get("/test/{test_id}/questions")
# # # def get_test_questions(
# # #     test_id: int,
# # #     db: Session = Depends(get_db)
# # # ):
# # #     """Get all questions for a specific test with their test cases"""
# # #     from app.models.db_models import Question, TestCase
    
# # #     questions = db.query(Question).filter(Question.test_id == test_id).all()
    
# # #     result = []
# # #     for question in questions:
# # #         test_cases = db.query(TestCase).filter(TestCase.question_id == question.id).all()
        
# # #         result.append({
# # #             "id": question.id,
# # #             "title": question.title,
# # #             "description": question.description,
# # #             "difficulty": question.difficulty.value,
# # #             "topic": question.topic.value,
# # #             "points": question.points,
# # #             "time_limit_ms": question.time_limit_ms,
# # #             "test_cases_count": len(test_cases),
# # #             "test_cases": [
# # #                 {
# # #                     "id": tc.id,
# # #                     "input": tc.input,
# # #                     "expected_output": tc.expected_output,
# # #                     "is_hidden": tc.is_hidden,
# # #                     "points": tc.points
# # #                 }
# # #                 for tc in test_cases
# # #             ]
# # #         })
    
# # #     return result

# # # # Student Routes
# # # @router.get("/student/tests", tags=["student"])
# # # def get_available_tests(db: Session = Depends(get_db)):
# # #     """Get all active tests available for students"""
# # #     tests = db.query(Test).filter(Test.is_active == True).all()
    
# # #     result = []
# # #     for test in tests:
# # #         question_count = db.query(Question).filter(Question.test_id == test.id).count()
# # #         result.append({
# # #             "id": test.id,
# # #             "title": test.title,
# # #             "description": test.description,
# # #             "duration_minutes": test.duration_minutes,
# # #             "question_count": question_count,
# # #             "created_at": test.created_at
# # #         })
    
# # #     return result


# # # @router.get("/student/test/{test_id}/questions", tags=["student"])
# # # def get_test_questions_for_student(
# # #     test_id: int,
# # #     db: Session = Depends(get_db)
# # # ):
# # #     """Get questions for a test (student view - without hidden test case details)"""
# # #     questions = db.query(Question).filter(Question.test_id == test_id).all()
    
# # #     result = []
# # #     for question in questions:
# # #         # Get only visible test cases for student
# # #         test_cases = db.query(TestCase).filter(
# # #             TestCase.question_id == question.id,
# # #             TestCase.is_hidden == False
# # #         ).all()
        
# # #         result.append({
# # #             "id": question.id,
# # #             "title": question.title,
# # #             "description": question.description,
# # #             "difficulty": question.difficulty.value,
# # #             "topic": question.topic.value,
# # #             "points": question.points,
# # #             "time_limit_ms": question.time_limit_ms,
# # #             "test_cases": [
# # #                 {
# # #                     "id": tc.id,
# # #                     "input": tc.input,
# # #                     "expected_output": tc.expected_output,
# # #                     "points": tc.points
# # #                 }
# # #                 for tc in test_cases
# # #             ]
# # #         })
    
# # #     return result


# # """
# # Teacher Routes
# # API endpoints for teacher operations
# # """

# # from fastapi import APIRouter, HTTPException, Depends, status
# # from sqlalchemy.orm import Session
# # from typing import List, Optional
# # from app.database import get_db
# # from app.models.db_models import Test, Question, TestCase, Submission, User
# # from pydantic import BaseModel
# # from datetime import datetime

# # router = APIRouter(prefix="/api/teacher", tags=["teacher"])


# # # Pydantic models for requests/responses
# # class TestCreate(BaseModel):
# #     title: str
# #     description: str
# #     duration_minutes: int = 60
# #     is_active: bool = True


# # class TestResponse(BaseModel):
# #     id: int
# #     title: str
# #     description: str
# #     teacher_id: int
# #     duration_minutes: int
# #     is_active: bool
# #     created_at: datetime
    
# #     class Config:
# #         from_attributes = True


# # class QuestionCreate(BaseModel):
# #     test_id: int
# #     title: str
# #     description: str
# #     difficulty: str
# #     topic: str
# #     points: int = 10
# #     time_limit_ms: int = 2000


# # class QuestionUpdate(BaseModel):
# #     title: Optional[str] = None
# #     description: Optional[str] = None
# #     difficulty: Optional[str] = None
# #     topic: Optional[str] = None
# #     points: Optional[int] = None
# #     time_limit_ms: Optional[int] = None


# # class TestCaseCreate(BaseModel):
# #     question_id: int
# #     input: str
# #     expected_output: str
# #     is_hidden: bool = False
# #     points: int = 1

# # class TestCaseResponse(BaseModel):
# #     id: int
# #     question_id: int
# #     input: str
# #     expected_output: str
# #     is_hidden: bool
# #     points: int
    
# #     class Config:
# #         from_attributes = True


# # class QuestionResponse(BaseModel):
# #     id: int
# #     test_id: int
# #     title: str
# #     description: str
# #     difficulty: str
# #     topic: str
# #     points: int
# #     time_limit_ms: int
# #     created_at: datetime
# #     test_cases: List[TestCaseResponse] = []
    
# #     class Config:
# #         from_attributes = True

# # # Routes
# # @router.get("/tests", response_model=List[TestResponse])
# # def get_all_tests(
# #     db: Session = Depends(get_db),
# #     teacher_id: int = 2  # TODO: Get from JWT
# # ):
# #     """Get all tests created by teacher"""
# #     tests = db.query(Test).filter(Test.teacher_id == teacher_id).all()
# #     return tests

# # @router.get("/tests/{test_id}/questions", response_model=List[QuestionResponse])
# # def get_test_questions_detailed(
# #     test_id: int,
# #     db: Session = Depends(get_db)
# # ):
# #     """Get all questions for a specific test with their test cases"""
# #     test = db.query(Test).filter(Test.id == test_id).first()
# #     if not test:
# #         raise HTTPException(
# #             status_code=status.HTTP_404_NOT_FOUND,
# #             detail=f"Test with id {test_id} not found"
# #         )
# #     questions = db.query(Question).filter(Question.test_id == test_id).all()
# #     return questions

# # @router.get("/test/{test_id}/questions")
# # def get_test_questions(
# #     test_id: int,
# #     db: Session = Depends(get_db)
# # ):
# #     """Get all questions for a specific test with their test cases"""
# #     questions = db.query(Question).filter(Question.test_id == test_id).all()
    
# #     result = []
# #     for question in questions:
# #         test_cases = db.query(TestCase).filter(TestCase.question_id == question.id).all()
        
# #         result.append({
# #             "id": question.id,
# #             "title": question.title,
# #             "description": question.description,
# #             "difficulty": question.difficulty.value,
# #             "topic": question.topic.value,
# #             "points": question.points,
# #             "time_limit_ms": question.time_limit_ms,
# #             "test_cases_count": len(test_cases),
# #             "test_cases": [
# #                 {
# #                     "id": tc.id,
# #                     "input": tc.input,
# #                     "expected_output": tc.expected_output,
# #                     "is_hidden": tc.is_hidden,
# #                     "points": tc.points
# #                 }
# #                 for tc in test_cases
# #             ]
# #         })
    
# #     return result

# # @router.post("/tests", response_model=TestResponse)
# # def create_test(
# #     test: TestCreate,
# #     db: Session = Depends(get_db),
# #     teacher_id: int = 2  # TODO: Get from JWT
# # ):
# #     """Create a new test"""
# #     new_test = Test(
# #         title=test.title,
# #         description=test.description,
# #         teacher_id=teacher_id,
# #         duration_minutes=test.duration_minutes,
# #         is_active=test.is_active
# #     )
# #     db.add(new_test)
# #     db.commit()
# #     db.refresh(new_test)
# #     return new_test


# # @router.post("/questions")
# # def create_question(
# #     question: QuestionCreate,
# #     db: Session = Depends(get_db)
# # ):
# #     """Add a question to a test"""
# #     new_question = Question(
# #         test_id=question.test_id,
# #         title=question.title,
# #         description=question.description,
# #         difficulty=question.difficulty.upper(),
# #         topic=question.topic.upper(),
# #         points=question.points,
# #         time_limit_ms=question.time_limit_ms
# #     )
# #     db.add(new_question)
# #     db.commit()
# #     db.refresh(new_question)
# #     return new_question


# # @router.put("/questions/{question_id}")
# # def update_question(
# #     question_id: int,
# #     question_data: QuestionUpdate,
# #     db: Session = Depends(get_db)
# # ):
# #     """Update an existing question (title, description, difficulty, topic, points, time_limit)"""
# #     question = db.query(Question).filter(Question.id == question_id).first()
# #     if not question:
# #         raise HTTPException(
# #             status_code=status.HTTP_404_NOT_FOUND,
# #             detail=f"Question with id {question_id} not found"
# #         )
    
# #     # Update only fields that were provided
# #     if question_data.title is not None:
# #         question.title = question_data.title
# #     if question_data.description is not None:
# #         question.description = question_data.description
# #     if question_data.difficulty is not None:
# #         question.difficulty = question_data.difficulty.upper()
# #     if question_data.topic is not None:
# #         question.topic = question_data.topic.upper()
# #     if question_data.points is not None:
# #         question.points = question_data.points
# #     if question_data.time_limit_ms is not None:
# #         question.time_limit_ms = question_data.time_limit_ms

# #     db.commit()
# #     db.refresh(question)

# #     # Return full question with test cases
# #     test_cases = db.query(TestCase).filter(TestCase.question_id == question.id).all()
# #     return {
# #         "id": question.id,
# #         "title": question.title,
# #         "description": question.description,
# #         "difficulty": question.difficulty.value,
# #         "topic": question.topic.value,
# #         "points": question.points,
# #         "time_limit_ms": question.time_limit_ms,
# #         "test_cases": [
# #             {
# #                 "id": tc.id,
# #                 "input": tc.input,
# #                 "expected_output": tc.expected_output,
# #                 "is_hidden": tc.is_hidden,
# #                 "points": tc.points
# #             }
# #             for tc in test_cases
# #         ]
# #     }


# # @router.delete("/questions/{question_id}")
# # def delete_question(
# #     question_id: int,
# #     db: Session = Depends(get_db)
# # ):
# #     """Delete a question and all its test cases (cascade)"""
# #     question = db.query(Question).filter(Question.id == question_id).first()
# #     if not question:
# #         raise HTTPException(
# #             status_code=status.HTTP_404_NOT_FOUND,
# #             detail=f"Question with id {question_id} not found"
# #         )
    
# #     # Delete test cases first (cascade)
# #     db.query(TestCase).filter(TestCase.question_id == question_id).delete()
    
# #     # Delete related submissions
# #     db.query(Submission).filter(Submission.question_id == question_id).delete()
    
# #     # Delete the question
# #     db.delete(question)
# #     db.commit()
    
# #     return {"message": f"Question {question_id} and all its test cases deleted successfully"}


# # @router.post("/test-cases")
# # def create_test_case(
# #     test_case: TestCaseCreate,
# #     db: Session = Depends(get_db)
# # ):
# #     """Add a test case to a question"""
# #     new_test_case = TestCase(
# #         question_id=test_case.question_id,
# #         input=test_case.input,
# #         expected_output=test_case.expected_output,
# #         is_hidden=test_case.is_hidden,
# #         points=test_case.points
# #     )
# #     db.add(new_test_case)
# #     db.commit()
# #     db.refresh(new_test_case)
# #     return new_test_case


# # @router.get("/submissions")
# # def get_all_submissions(
# #     db: Session = Depends(get_db),
# #     limit: int = 50
# # ):
# #     """Get recent submissions with student and question details"""
# #     submissions = db.query(Submission).order_by(
# #         Submission.submitted_at.desc()
# #     ).limit(limit).all()
# #     return submissions


# # @router.get("/analytics/test/{test_id}")
# # def get_test_analytics(
# #     test_id: int,
# #     db: Session = Depends(get_db)
# # ):
# #     """Get analytics for a specific test"""
# #     questions = db.query(Question).filter(Question.test_id == test_id).all()
    
# #     analytics = {
# #         "test_id": test_id,
# #         "total_questions": len(questions),
# #         "questions": []
# #     }
    
# #     for question in questions:
# #         submissions = db.query(Submission).filter(
# #             Submission.question_id == question.id
# #         ).all()
        
# #         total_submissions = len(submissions)
# #         passed = sum(1 for s in submissions if s.score == 100)
# #         avg_score = sum(s.score for s in submissions) / total_submissions if total_submissions > 0 else 0
        
# #         analytics["questions"].append({
# #             "question_id": question.id,
# #             "title": question.title,
# #             "total_submissions": total_submissions,
# #             "passed": passed,
# #             "failed": total_submissions - passed,
# #             "pass_rate": (passed / total_submissions * 100) if total_submissions > 0 else 0,
# #             "average_score": round(avg_score, 2)
# #         })
    
# #     return analytics


# # # Student Routes
# # @router.get("/student/tests", tags=["student"])
# # def get_available_tests(db: Session = Depends(get_db)):
# #     """Get all active tests available for students"""
# #     tests = db.query(Test).filter(Test.is_active == True).all()
    
# #     result = []
# #     for test in tests:
# #         question_count = db.query(Question).filter(Question.test_id == test.id).count()
# #         result.append({
# #             "id": test.id,
# #             "title": test.title,
# #             "description": test.description,
# #             "duration_minutes": test.duration_minutes,
# #             "question_count": question_count,
# #             "created_at": test.created_at
# #         })
    
# #     return result


# # @router.get("/student/test/{test_id}/questions", tags=["student"])
# # def get_test_questions_for_student(
# #     test_id: int,
# #     db: Session = Depends(get_db)
# # ):
# #     """Get questions for a test (student view - without hidden test case details)"""
# #     questions = db.query(Question).filter(Question.test_id == test_id).all()
    
# #     result = []
# #     for question in questions:
# #         test_cases = db.query(TestCase).filter(
# #             TestCase.question_id == question.id,
# #             TestCase.is_hidden == False
# #         ).all()
        
# #         result.append({
# #             "id": question.id,
# #             "title": question.title,
# #             "description": question.description,
# #             "difficulty": question.difficulty.value,
# #             "topic": question.topic.value,
# #             "points": question.points,
# #             "time_limit_ms": question.time_limit_ms,
# #             "test_cases": [
# #                 {
# #                     "id": tc.id,
# #                     "input": tc.input,
# #                     "expected_output": tc.expected_output,
# #                     "points": tc.points
# #                 }
# #                 for tc in test_cases
# #             ]
# #         })
    
# #     return result




# # """
# # Teacher Routes
# # API endpoints for teacher operations
# # """

# # from fastapi import APIRouter, HTTPException, Depends, status
# # from sqlalchemy.orm import Session
# # from typing import List, Optional
# # from app.database import get_db
# # from app.models.db_models import Test, Question, TestCase, Submission, User
# # from pydantic import BaseModel
# # from datetime import datetime

# # router = APIRouter(prefix="/api/teacher", tags=["teacher"])


# # # Pydantic models for requests/responses
# # class TestCreate(BaseModel):
# #     title: str
# #     description: str
# #     duration_minutes: int = 60
# #     is_active: bool = True


# # class TestResponse(BaseModel):
# #     id: int
# #     title: str
# #     description: str
# #     teacher_id: int
# #     duration_minutes: int
# #     is_active: bool
# #     created_at: datetime
    
# #     class Config:
# #         from_attributes = True


# # class QuestionCreate(BaseModel):
# #     test_id: int
# #     title: str
# #     description: str
# #     difficulty: str
# #     topic: str
# #     points: int = 10
# #     time_limit_ms: int = 2000


# # class QuestionUpdate(BaseModel):
# #     title: Optional[str] = None
# #     description: Optional[str] = None
# #     difficulty: Optional[str] = None
# #     topic: Optional[str] = None
# #     points: Optional[int] = None
# #     time_limit_ms: Optional[int] = None


# # class TestCaseCreate(BaseModel):
# #     question_id: int
# #     input: str
# #     expected_output: str
# #     is_hidden: bool = False
# #     points: int = 1

# # class TestCaseResponse(BaseModel):
# #     id: int
# #     question_id: int
# #     input: str
# #     expected_output: str
# #     is_hidden: bool
# #     points: int
    
# #     class Config:
# #         from_attributes = True


# # class QuestionResponse(BaseModel):
# #     id: int
# #     test_id: int
# #     title: str
# #     description: str
# #     difficulty: str
# #     topic: str
# #     points: int
# #     time_limit_ms: int
# #     created_at: datetime
# #     test_cases: List[TestCaseResponse] = []
    
# #     class Config:
# #         from_attributes = True

# # # Routes
# # @router.get("/tests", response_model=List[TestResponse])
# # def get_all_tests(
# #     db: Session = Depends(get_db),
# #     teacher_id: int = 2  # TODO: Get from JWT
# # ):
# #     """Get all tests created by teacher"""
# #     tests = db.query(Test).filter(Test.teacher_id == teacher_id).all()
# #     return tests

# # @router.get("/tests/{test_id}/questions", response_model=List[QuestionResponse])
# # def get_test_questions_detailed(
# #     test_id: int,
# #     db: Session = Depends(get_db)
# # ):
# #     """Get all questions for a specific test with their test cases"""
# #     test = db.query(Test).filter(Test.id == test_id).first()
# #     if not test:
# #         raise HTTPException(
# #             status_code=status.HTTP_404_NOT_FOUND,
# #             detail=f"Test with id {test_id} not found"
# #         )
# #     questions = db.query(Question).filter(Question.test_id == test_id).all()
# #     return questions

# # @router.get("/test/{test_id}/questions")
# # def get_test_questions(
# #     test_id: int,
# #     db: Session = Depends(get_db)
# # ):
# #     """Get all questions for a specific test with their test cases"""
# #     questions = db.query(Question).filter(Question.test_id == test_id).all()
    
# #     result = []
# #     for question in questions:
# #         test_cases = db.query(TestCase).filter(TestCase.question_id == question.id).all()
        
# #         result.append({
# #             "id": question.id,
# #             "title": question.title,
# #             "description": question.description,
# #             "difficulty": question.difficulty.value,
# #             "topic": question.topic,
# #             "points": question.points,
# #             "time_limit_ms": question.time_limit_ms,
# #             "test_cases_count": len(test_cases),
# #             "test_cases": [
# #                 {
# #                     "id": tc.id,
# #                     "input": tc.input,
# #                     "expected_output": tc.expected_output,
# #                     "is_hidden": tc.is_hidden,
# #                     "points": tc.points
# #                 }
# #                 for tc in test_cases
# #             ]
# #         })
    
# #     return result

# # @router.post("/tests", response_model=TestResponse)
# # def create_test(
# #     test: TestCreate,
# #     db: Session = Depends(get_db),
# #     teacher_id: int = 2  # TODO: Get from JWT
# # ):
# #     """Create a new test"""
# #     new_test = Test(
# #         title=test.title,
# #         description=test.description,
# #         teacher_id=teacher_id,
# #         duration_minutes=test.duration_minutes,
# #         is_active=test.is_active
# #     )
# #     db.add(new_test)
# #     db.commit()
# #     db.refresh(new_test)
# #     return new_test


# # @router.post("/questions")
# # def create_question(
# #     question: QuestionCreate,
# #     db: Session = Depends(get_db)
# # ):
# #     """Add a question to a test"""
# #     new_question = Question(
# #         test_id=question.test_id,
# #         title=question.title,
# #         description=question.description,
# #         difficulty=question.difficulty.upper(),
# #         topic=question.topic.upper(),
# #         points=question.points,
# #         time_limit_ms=question.time_limit_ms
# #     )
# #     db.add(new_question)
# #     db.commit()
# #     db.refresh(new_question)
# #     return new_question


# # @router.put("/questions/{question_id}")
# # def update_question(
# #     question_id: int,
# #     question_data: QuestionUpdate,
# #     db: Session = Depends(get_db)
# # ):
# #     """Update an existing question (title, description, difficulty, topic, points, time_limit)"""
# #     question = db.query(Question).filter(Question.id == question_id).first()
# #     if not question:
# #         raise HTTPException(
# #             status_code=status.HTTP_404_NOT_FOUND,
# #             detail=f"Question with id {question_id} not found"
# #         )
    
# #     # Update only fields that were provided
# #     if question_data.title is not None:
# #         question.title = question_data.title
# #     if question_data.description is not None:
# #         question.description = question_data.description
# #     if question_data.difficulty is not None:
# #         question.difficulty = question_data.difficulty.upper()
# #     if question_data.topic is not None:
# #         question.topic = question_data.topic.upper()
# #     if question_data.points is not None:
# #         question.points = question_data.points
# #     if question_data.time_limit_ms is not None:
# #         question.time_limit_ms = question_data.time_limit_ms

# #     db.commit()
# #     db.refresh(question)

# #     # Return full question with test cases
# #     test_cases = db.query(TestCase).filter(TestCase.question_id == question.id).all()
# #     return {
# #         "id": question.id,
# #         "title": question.title,
# #         "description": question.description,
# #         "difficulty": question.difficulty.value if hasattr(question.difficulty, 'value') else question.difficulty,
# #         "topic": question.topic,
# #         "points": question.points,
# #         "time_limit_ms": question.time_limit_ms,
# #         "test_cases": [
# #             {
# #                 "id": tc.id,
# #                 "input": tc.input,
# #                 "expected_output": tc.expected_output,
# #                 "is_hidden": tc.is_hidden,
# #                 "points": tc.points
# #             }
# #             for tc in test_cases
# #         ]
# #     }


# # @router.delete("/questions/{question_id}")
# # def delete_question(
# #     question_id: int,
# #     db: Session = Depends(get_db)
# # ):
# #     """Delete a question and all its test cases (cascade)"""
# #     question = db.query(Question).filter(Question.id == question_id).first()
# #     if not question:
# #         raise HTTPException(
# #             status_code=status.HTTP_404_NOT_FOUND,
# #             detail=f"Question with id {question_id} not found"
# #         )
    
# #     # Delete test cases first (cascade)
# #     db.query(TestCase).filter(TestCase.question_id == question_id).delete()
    
# #     # Delete related submissions
# #     db.query(Submission).filter(Submission.question_id == question_id).delete()
    
# #     # Delete the question
# #     db.delete(question)
# #     db.commit()
    
# #     return {"message": f"Question {question_id} and all its test cases deleted successfully"}


# # @router.post("/test-cases")
# # def create_test_case(
# #     test_case: TestCaseCreate,
# #     db: Session = Depends(get_db)
# # ):
# #     """Add a test case to a question"""
# #     new_test_case = TestCase(
# #         question_id=test_case.question_id,
# #         input=test_case.input,
# #         expected_output=test_case.expected_output,
# #         is_hidden=test_case.is_hidden,
# #         points=test_case.points
# #     )
# #     db.add(new_test_case)
# #     db.commit()
# #     db.refresh(new_test_case)
# #     return new_test_case


# # class TestCaseUpdate(BaseModel):
# #     input: Optional[str] = None
# #     expected_output: Optional[str] = None
# #     is_hidden: Optional[bool] = None
# #     points: Optional[int] = None


# # @router.put("/test-cases/{test_case_id}")
# # def update_test_case(
# #     test_case_id: int,
# #     data: TestCaseUpdate,
# #     db: Session = Depends(get_db)
# # ):
# #     """Update an existing test case"""
# #     tc = db.query(TestCase).filter(TestCase.id == test_case_id).first()
# #     if not tc:
# #         raise HTTPException(status_code=404, detail=f"Test case {test_case_id} not found")

# #     if data.input is not None:
# #         tc.input = data.input
# #     if data.expected_output is not None:
# #         tc.expected_output = data.expected_output
# #     if data.is_hidden is not None:
# #         tc.is_hidden = data.is_hidden
# #     if data.points is not None:
# #         tc.points = data.points

# #     db.commit()
# #     db.refresh(tc)
# #     return {"id": tc.id, "input": tc.input, "expected_output": tc.expected_output, "is_hidden": tc.is_hidden, "points": tc.points}


# # @router.delete("/test-cases/{test_case_id}")
# # def delete_test_case(
# #     test_case_id: int,
# #     db: Session = Depends(get_db)
# # ):
# #     """Delete a single test case"""
# #     tc = db.query(TestCase).filter(TestCase.id == test_case_id).first()
# #     if not tc:
# #         raise HTTPException(status_code=404, detail=f"Test case {test_case_id} not found")
# #     db.delete(tc)
# #     db.commit()
# #     return {"message": f"Test case {test_case_id} deleted successfully"}


# # @router.get("/submissions")
# # def get_all_submissions(
# #     db: Session = Depends(get_db),
# #     limit: int = 50
# # ):
# #     """Get recent submissions with student and question details"""
# #     submissions = db.query(Submission).order_by(
# #         Submission.submitted_at.desc()
# #     ).limit(limit).all()
# #     return submissions


# # @router.get("/analytics/test/{test_id}")
# # def get_test_analytics(
# #     test_id: int,
# #     db: Session = Depends(get_db)
# # ):
# #     """Get analytics for a specific test"""
# #     questions = db.query(Question).filter(Question.test_id == test_id).all()
    
# #     analytics = {
# #         "test_id": test_id,
# #         "total_questions": len(questions),
# #         "questions": []
# #     }
    
# #     for question in questions:
# #         submissions = db.query(Submission).filter(
# #             Submission.question_id == question.id
# #         ).all()
        
# #         total_submissions = len(submissions)
# #         passed = sum(1 for s in submissions if s.score == 100)
# #         avg_score = sum(s.score for s in submissions) / total_submissions if total_submissions > 0 else 0
        
# #         analytics["questions"].append({
# #             "question_id": question.id,
# #             "title": question.title,
# #             "total_submissions": total_submissions,
# #             "passed": passed,
# #             "failed": total_submissions - passed,
# #             "pass_rate": (passed / total_submissions * 100) if total_submissions > 0 else 0,
# #             "average_score": round(avg_score, 2)
# #         })
    
# #     return analytics


# # # Student Routes
# # @router.get("/student/tests", tags=["student"])
# # def get_available_tests(db: Session = Depends(get_db)):
# #     """Get all active tests available for students"""
# #     tests = db.query(Test).filter(Test.is_active == True).all()
    
# #     result = []
# #     for test in tests:
# #         question_count = db.query(Question).filter(Question.test_id == test.id).count()
# #         result.append({
# #             "id": test.id,
# #             "title": test.title,
# #             "description": test.description,
# #             "duration_minutes": test.duration_minutes,
# #             "question_count": question_count,
# #             "created_at": test.created_at
# #         })
    
# #     return result


# # @router.get("/student/test/{test_id}/questions", tags=["student"])
# # def get_test_questions_for_student(
# #     test_id: int,
# #     db: Session = Depends(get_db)
# # ):
# #     """Get questions for a test (student view - without hidden test case details)"""
# #     questions = db.query(Question).filter(Question.test_id == test_id).all()
    
# #     result = []
# #     for question in questions:
# #         test_cases = db.query(TestCase).filter(
# #             TestCase.question_id == question.id,
# #             TestCase.is_hidden == False
# #         ).all()
        
# #         result.append({
# #             "id": question.id,
# #             "title": question.title,
# #             "description": question.description,
# #             "difficulty": question.difficulty.value if hasattr(question.difficulty, 'value') else question.difficulty,
# #             "topic": question.topic,
# #             "points": question.points,
# #             "time_limit_ms": question.time_limit_ms,
# #             "test_cases": [
# #                 {
# #                     "id": tc.id,
# #                     "input": tc.input,
# #                     "expected_output": tc.expected_output,
# #                     "points": tc.points
# #                 }
# #                 for tc in test_cases
# #             ]
# #         })
    
# #     return result


# # """
# # Teacher Routes
# # API endpoints for teacher operations
# # """

# # from fastapi import APIRouter, HTTPException, Depends, status
# # from sqlalchemy.orm import Session
# # from typing import List, Optional
# # from app.database import get_db
# # from app.models.db_models import Test, Question, TestCase, Submission, User
# # from app.routes.auth import require_teacher, get_current_user
# # from pydantic import BaseModel
# # from datetime import datetime

# # router = APIRouter(prefix="/api/teacher", tags=["teacher"])


# # # ─── Pydantic Models ──────────────────────────────────────────────────────────

# # class TestCreate(BaseModel):
# #     title: str
# #     description: str
# #     duration_minutes: int = 60
# #     is_active: bool = True


# # class TestResponse(BaseModel):
# #     id: int
# #     title: str
# #     description: str
# #     teacher_id: int
# #     duration_minutes: int
# #     is_active: bool
# #     created_at: datetime

# #     class Config:
# #         from_attributes = True


# # class QuestionCreate(BaseModel):
# #     test_id: int
# #     title: str
# #     description: str
# #     difficulty: str
# #     topic: str
# #     points: int = 10
# #     time_limit_ms: int = 2000


# # class QuestionUpdate(BaseModel):
# #     title: Optional[str] = None
# #     description: Optional[str] = None
# #     difficulty: Optional[str] = None
# #     topic: Optional[str] = None
# #     points: Optional[int] = None
# #     time_limit_ms: Optional[int] = None


# # class TestCaseCreate(BaseModel):
# #     question_id: int
# #     input: str
# #     expected_output: str
# #     is_hidden: bool = False
# #     points: int = 1


# # class TestCaseUpdate(BaseModel):
# #     input: Optional[str] = None
# #     expected_output: Optional[str] = None
# #     is_hidden: Optional[bool] = None
# #     points: Optional[int] = None


# # class TestCaseResponse(BaseModel):
# #     id: int
# #     question_id: int
# #     input: str
# #     expected_output: str
# #     is_hidden: bool
# #     points: int

# #     class Config:
# #         from_attributes = True


# # class QuestionResponse(BaseModel):
# #     id: int
# #     test_id: int
# #     title: str
# #     description: str
# #     difficulty: str
# #     topic: str
# #     points: int
# #     time_limit_ms: int
# #     created_at: datetime
# #     test_cases: List[TestCaseResponse] = []

# #     class Config:
# #         from_attributes = True


# # # ─── Helper ───────────────────────────────────────────────────────────────────

# # def safe_difficulty(q) -> str:
# #     return q.difficulty.value if hasattr(q.difficulty, 'value') else q.difficulty


# # # ─── Teacher Routes ───────────────────────────────────────────────────────────

# # @router.get("/tests", response_model=List[TestResponse])
# # def get_all_tests(
# #     db: Session = Depends(get_db),
# #     current_user: User = Depends(require_teacher)   # ✅ JWT teacher_id
# # ):
# #     """Get all tests created by the logged-in teacher"""
# #     tests = db.query(Test).filter(Test.teacher_id == current_user.id).all()
# #     return tests


# # @router.post("/tests", response_model=TestResponse)
# # def create_test(
# #     test: TestCreate,
# #     db: Session = Depends(get_db),
# #     current_user: User = Depends(require_teacher)   # ✅ JWT teacher_id
# # ):
# #     """Create a new test owned by the logged-in teacher"""
# #     new_test = Test(
# #         title=test.title,
# #         description=test.description,
# #         teacher_id=current_user.id,                 # ✅ real teacher id
# #         duration_minutes=test.duration_minutes,
# #         is_active=test.is_active
# #     )
# #     db.add(new_test)
# #     db.commit()
# #     db.refresh(new_test)
# #     return new_test


# # @router.get("/tests/{test_id}/questions", response_model=List[QuestionResponse])
# # def get_test_questions_detailed(
# #     test_id: int,
# #     db: Session = Depends(get_db)
# # ):
# #     """Get all questions for a specific test with their test cases"""
# #     test = db.query(Test).filter(Test.id == test_id).first()
# #     if not test:
# #         raise HTTPException(status_code=404, detail=f"Test {test_id} not found")
# #     return db.query(Question).filter(Question.test_id == test_id).all()


# # @router.get("/test/{test_id}/questions")
# # def get_test_questions(
# #     test_id: int,
# #     db: Session = Depends(get_db)
# # ):
# #     """Get all questions for a test with test cases (teacher detail view)"""
# #     questions = db.query(Question).filter(Question.test_id == test_id).all()
# #     result = []
# #     for question in questions:
# #         test_cases = db.query(TestCase).filter(TestCase.question_id == question.id).all()
# #         result.append({
# #             "id": question.id,
# #             "title": question.title,
# #             "description": question.description,
# #             "difficulty": safe_difficulty(question),
# #             "topic": question.topic,
# #             "points": question.points,
# #             "time_limit_ms": question.time_limit_ms,
# #             "test_cases_count": len(test_cases),
# #             "test_cases": [
# #                 {
# #                     "id": tc.id,
# #                     "input": tc.input,
# #                     "expected_output": tc.expected_output,
# #                     "is_hidden": tc.is_hidden,
# #                     "points": tc.points
# #                 }
# #                 for tc in test_cases
# #             ]
# #         })
# #     return result


# # @router.post("/questions")
# # def create_question(
# #     question: QuestionCreate,
# #     db: Session = Depends(get_db)
# # ):
# #     """Add a question to a test"""
# #     new_question = Question(
# #         test_id=question.test_id,
# #         title=question.title,
# #         description=question.description,
# #         difficulty=question.difficulty.upper(),
# #         topic=question.topic.upper(),
# #         points=question.points,
# #         time_limit_ms=question.time_limit_ms
# #     )
# #     db.add(new_question)
# #     db.commit()
# #     db.refresh(new_question)
# #     return new_question


# # @router.put("/questions/{question_id}")
# # def update_question(
# #     question_id: int,
# #     question_data: QuestionUpdate,
# #     db: Session = Depends(get_db)
# # ):
# #     """Update an existing question"""
# #     question = db.query(Question).filter(Question.id == question_id).first()
# #     if not question:
# #         raise HTTPException(status_code=404, detail=f"Question {question_id} not found")

# #     if question_data.title is not None:
# #         question.title = question_data.title
# #     if question_data.description is not None:
# #         question.description = question_data.description
# #     if question_data.difficulty is not None:
# #         question.difficulty = question_data.difficulty.upper()
# #     if question_data.topic is not None:
# #         question.topic = question_data.topic.upper()
# #     if question_data.points is not None:
# #         question.points = question_data.points
# #     if question_data.time_limit_ms is not None:
# #         question.time_limit_ms = question_data.time_limit_ms

# #     db.commit()
# #     db.refresh(question)

# #     test_cases = db.query(TestCase).filter(TestCase.question_id == question.id).all()
# #     return {
# #         "id": question.id,
# #         "title": question.title,
# #         "description": question.description,
# #         "difficulty": safe_difficulty(question),
# #         "topic": question.topic,
# #         "points": question.points,
# #         "time_limit_ms": question.time_limit_ms,
# #         "test_cases": [
# #             {
# #                 "id": tc.id,
# #                 "input": tc.input,
# #                 "expected_output": tc.expected_output,
# #                 "is_hidden": tc.is_hidden,
# #                 "points": tc.points
# #             }
# #             for tc in test_cases
# #         ]
# #     }


# # @router.delete("/questions/{question_id}")
# # def delete_question(
# #     question_id: int,
# #     db: Session = Depends(get_db)
# # ):
# #     """Delete a question and all its test cases"""
# #     question = db.query(Question).filter(Question.id == question_id).first()
# #     if not question:
# #         raise HTTPException(status_code=404, detail=f"Question {question_id} not found")

# #     db.query(TestCase).filter(TestCase.question_id == question_id).delete()
# #     db.query(Submission).filter(Submission.question_id == question_id).delete()
# #     db.delete(question)
# #     db.commit()
# #     return {"message": f"Question {question_id} deleted successfully"}


# # @router.post("/test-cases")
# # def create_test_case(
# #     test_case: TestCaseCreate,
# #     db: Session = Depends(get_db)
# # ):
# #     """Add a test case to a question"""
# #     new_tc = TestCase(
# #         question_id=test_case.question_id,
# #         input=test_case.input,
# #         expected_output=test_case.expected_output,
# #         is_hidden=test_case.is_hidden,
# #         points=test_case.points
# #     )
# #     db.add(new_tc)
# #     db.commit()
# #     db.refresh(new_tc)
# #     return new_tc


# # @router.put("/test-cases/{test_case_id}")
# # def update_test_case(
# #     test_case_id: int,
# #     data: TestCaseUpdate,
# #     db: Session = Depends(get_db)
# # ):
# #     """Update an existing test case"""
# #     tc = db.query(TestCase).filter(TestCase.id == test_case_id).first()
# #     if not tc:
# #         raise HTTPException(status_code=404, detail=f"Test case {test_case_id} not found")

# #     if data.input is not None:
# #         tc.input = data.input
# #     if data.expected_output is not None:
# #         tc.expected_output = data.expected_output
# #     if data.is_hidden is not None:
# #         tc.is_hidden = data.is_hidden
# #     if data.points is not None:
# #         tc.points = data.points

# #     db.commit()
# #     db.refresh(tc)
# #     return {"id": tc.id, "input": tc.input, "expected_output": tc.expected_output,
# #             "is_hidden": tc.is_hidden, "points": tc.points}


# # @router.delete("/test-cases/{test_case_id}")
# # def delete_test_case(
# #     test_case_id: int,
# #     db: Session = Depends(get_db)
# # ):
# #     """Delete a single test case"""
# #     tc = db.query(TestCase).filter(TestCase.id == test_case_id).first()
# #     if not tc:
# #         raise HTTPException(status_code=404, detail=f"Test case {test_case_id} not found")
# #     db.delete(tc)
# #     db.commit()
# #     return {"message": f"Test case {test_case_id} deleted successfully"}


# # @router.get("/submissions")
# # def get_all_submissions(
# #     db: Session = Depends(get_db),
# #     limit: int = 50
# # ):
# #     """Get recent submissions"""
# #     submissions = db.query(Submission).order_by(
# #         Submission.submitted_at.desc()
# #     ).limit(limit).all()
# #     return submissions


# # @router.get("/analytics/test/{test_id}")
# # def get_test_analytics(
# #     test_id: int,
# #     db: Session = Depends(get_db)
# # ):
# #     """Get analytics for a specific test"""
# #     questions = db.query(Question).filter(Question.test_id == test_id).all()
# #     analytics = {"test_id": test_id, "total_questions": len(questions), "questions": []}

# #     for question in questions:
# #         submissions = db.query(Submission).filter(Submission.question_id == question.id).all()
# #         total = len(submissions)
# #         passed = sum(1 for s in submissions if s.score == 100)
# #         avg = sum(s.score for s in submissions) / total if total > 0 else 0

# #         analytics["questions"].append({
# #             "question_id": question.id,
# #             "title": question.title,
# #             "total_submissions": total,
# #             "passed": passed,
# #             "failed": total - passed,
# #             "pass_rate": (passed / total * 100) if total > 0 else 0,
# #             "average_score": round(avg, 2)
# #         })

# #     return analytics


# # # ─── Student Routes ───────────────────────────────────────────────────────────

# # @router.get("/student/tests", tags=["student"])
# # def get_available_tests(db: Session = Depends(get_db)):
# #     """Get all active tests for students"""
# #     tests = db.query(Test).filter(Test.is_active == True).all()
# #     result = []
# #     for test in tests:
# #         question_count = db.query(Question).filter(Question.test_id == test.id).count()
# #         result.append({
# #             "id": test.id,
# #             "title": test.title,
# #             "description": test.description,
# #             "duration_minutes": test.duration_minutes,
# #             "question_count": question_count,
# #             "created_at": test.created_at
# #         })
# #     return result


# # @router.get("/student/test/{test_id}/questions", tags=["student"])
# # def get_test_questions_for_student(
# #     test_id: int,
# #     db: Session = Depends(get_db)
# # ):
# #     """Get questions for a test (student view — no hidden test case details)"""
# #     questions = db.query(Question).filter(Question.test_id == test_id).all()
# #     result = []
# #     for question in questions:
# #         test_cases = db.query(TestCase).filter(
# #             TestCase.question_id == question.id,
# #             TestCase.is_hidden == False
# #         ).all()
# #         result.append({
# #             "id": question.id,
# #             "title": question.title,
# #             "description": question.description,
# #             "difficulty": safe_difficulty(question),
# #             "topic": question.topic,
# #             "points": question.points,
# #             "time_limit_ms": question.time_limit_ms,
# #             "test_cases": [
# #                 {
# #                     "id": tc.id,
# #                     "input": tc.input,
# #                     "expected_output": tc.expected_output,
# #                     "points": tc.points
# #                 }
# #                 for tc in test_cases
# #             ]
# #         })
# #     return result


# """
# Teacher Routes
# API endpoints for teacher operations
# """

# from fastapi import APIRouter, HTTPException, Depends, status
# from sqlalchemy.orm import Session
# from typing import List, Optional
# from app.database import get_db
# from app.models.db_models import Test, Question, TestCase, Submission, User
# from app.routes.auth import require_teacher, get_current_user
# from pydantic import BaseModel
# from datetime import datetime

# router = APIRouter(prefix="/api/teacher", tags=["teacher"])

# ALL_LANGUAGES = ["python", "c", "cpp", "java"]


# # ─── Pydantic Models ──────────────────────────────────────────────────────────

# class TestCreate(BaseModel):
#     title: str
#     description: str
#     duration_minutes: int = 60
#     is_active: bool = True
#     allowed_languages: List[str] = ["python", "c", "cpp", "java"]  # ✅ NEW


# class TestResponse(BaseModel):
#     id: int
#     title: str
#     description: str
#     teacher_id: int
#     duration_minutes: int
#     is_active: bool
#     allowed_languages: str   # stored as comma-separated string in DB
#     created_at: datetime

#     class Config:
#         from_attributes = True


# class QuestionCreate(BaseModel):
#     test_id: int
#     title: str
#     description: str
#     difficulty: str
#     topic: str
#     points: int = 10
#     time_limit_ms: int = 2000


# class QuestionUpdate(BaseModel):
#     title: Optional[str] = None
#     description: Optional[str] = None
#     difficulty: Optional[str] = None
#     topic: Optional[str] = None
#     points: Optional[int] = None
#     time_limit_ms: Optional[int] = None


# class TestCaseCreate(BaseModel):
#     question_id: int
#     input: str
#     expected_output: str
#     is_hidden: bool = False
#     points: int = 1


# class TestCaseUpdate(BaseModel):
#     input: Optional[str] = None
#     expected_output: Optional[str] = None
#     is_hidden: Optional[bool] = None
#     points: Optional[int] = None


# class TestCaseResponse(BaseModel):
#     id: int
#     question_id: int
#     input: str
#     expected_output: str
#     is_hidden: bool
#     points: int

#     class Config:
#         from_attributes = True


# class QuestionResponse(BaseModel):
#     id: int
#     test_id: int
#     title: str
#     description: str
#     difficulty: str
#     topic: str
#     points: int
#     time_limit_ms: int
#     created_at: datetime
#     test_cases: List[TestCaseResponse] = []

#     class Config:
#         from_attributes = True


# # ─── Helper ───────────────────────────────────────────────────────────────────

# def safe_difficulty(q) -> str:
#     return q.difficulty.value if hasattr(q.difficulty, 'value') else q.difficulty

# def parse_languages(lang_str: str) -> List[str]:
#     """Parse comma-separated language string to list"""
#     return [l.strip() for l in (lang_str or "python").split(",") if l.strip()]

# def format_languages(langs: List[str]) -> str:
#     """Validate and format language list to comma-separated string"""
#     valid = [l.lower() for l in langs if l.lower() in ALL_LANGUAGES]
#     return ",".join(valid) if valid else "python"

# def format_test(test) -> dict:
#     """Format a Test object to dict with parsed allowed_languages"""
#     return {
#         "id": test.id,
#         "title": test.title,
#         "description": test.description,
#         "teacher_id": test.teacher_id,
#         "duration_minutes": test.duration_minutes,
#         "is_active": test.is_active,
#         "allowed_languages": parse_languages(test.allowed_languages or "python"),
#         "created_at": test.created_at,
#     }


# # ─── Teacher Routes ───────────────────────────────────────────────────────────

# @router.get("/tests")
# def get_all_tests(
#     db: Session = Depends(get_db),
#     current_user: User = Depends(require_teacher)
# ):
#     """Get all tests created by the logged-in teacher"""
#     tests = db.query(Test).filter(Test.teacher_id == current_user.id).all()
#     return [format_test(t) for t in tests]


# @router.post("/tests")
# def create_test(
#     test: TestCreate,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(require_teacher)
# ):
#     """Create a new test owned by the logged-in teacher"""
#     new_test = Test(
#         title=test.title,
#         description=test.description,
#         teacher_id=current_user.id,
#         duration_minutes=test.duration_minutes,
#         is_active=test.is_active,
#         allowed_languages=format_languages(test.allowed_languages),  # ✅ save as string
#     )
#     db.add(new_test)
#     db.commit()
#     db.refresh(new_test)
#     return format_test(new_test)


# @router.get("/tests/{test_id}/questions", response_model=List[QuestionResponse])
# def get_test_questions_detailed(
#     test_id: int,
#     db: Session = Depends(get_db)
# ):
#     test = db.query(Test).filter(Test.id == test_id).first()
#     if not test:
#         raise HTTPException(status_code=404, detail=f"Test {test_id} not found")
#     return db.query(Question).filter(Question.test_id == test_id).all()


# @router.get("/test/{test_id}/questions")
# def get_test_questions(
#     test_id: int,
#     db: Session = Depends(get_db)
# ):
#     questions = db.query(Question).filter(Question.test_id == test_id).all()
#     result = []
#     for question in questions:
#         test_cases = db.query(TestCase).filter(TestCase.question_id == question.id).all()
#         result.append({
#             "id": question.id,
#             "title": question.title,
#             "description": question.description,
#             "difficulty": safe_difficulty(question),
#             "topic": question.topic,
#             "points": question.points,
#             "time_limit_ms": question.time_limit_ms,
#             "test_cases_count": len(test_cases),
#             "test_cases": [
#                 {"id": tc.id, "input": tc.input, "expected_output": tc.expected_output,
#                  "is_hidden": tc.is_hidden, "points": tc.points}
#                 for tc in test_cases
#             ]
#         })
#     return result


# @router.post("/questions")
# def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
#     new_question = Question(
#         test_id=question.test_id,
#         title=question.title,
#         description=question.description,
#         difficulty=question.difficulty.upper(),
#         topic=question.topic.upper(),
#         points=question.points,
#         time_limit_ms=question.time_limit_ms
#     )
#     db.add(new_question)
#     db.commit()
#     db.refresh(new_question)
#     return new_question


# @router.put("/questions/{question_id}")
# def update_question(question_id: int, question_data: QuestionUpdate, db: Session = Depends(get_db)):
#     question = db.query(Question).filter(Question.id == question_id).first()
#     if not question:
#         raise HTTPException(status_code=404, detail=f"Question {question_id} not found")

#     if question_data.title is not None: question.title = question_data.title
#     if question_data.description is not None: question.description = question_data.description
#     if question_data.difficulty is not None: question.difficulty = question_data.difficulty.upper()
#     if question_data.topic is not None: question.topic = question_data.topic.upper()
#     if question_data.points is not None: question.points = question_data.points
#     if question_data.time_limit_ms is not None: question.time_limit_ms = question_data.time_limit_ms

#     db.commit()
#     db.refresh(question)

#     test_cases = db.query(TestCase).filter(TestCase.question_id == question.id).all()
#     return {
#         "id": question.id, "title": question.title, "description": question.description,
#         "difficulty": safe_difficulty(question), "topic": question.topic,
#         "points": question.points, "time_limit_ms": question.time_limit_ms,
#         "test_cases": [
#             {"id": tc.id, "input": tc.input, "expected_output": tc.expected_output,
#              "is_hidden": tc.is_hidden, "points": tc.points}
#             for tc in test_cases
#         ]
#     }


# @router.delete("/questions/{question_id}")
# def delete_question(question_id: int, db: Session = Depends(get_db)):
#     question = db.query(Question).filter(Question.id == question_id).first()
#     if not question:
#         raise HTTPException(status_code=404, detail=f"Question {question_id} not found")
#     db.query(TestCase).filter(TestCase.question_id == question_id).delete()
#     db.query(Submission).filter(Submission.question_id == question_id).delete()
#     db.delete(question)
#     db.commit()
#     return {"message": f"Question {question_id} deleted successfully"}


# @router.post("/test-cases")
# def create_test_case(test_case: TestCaseCreate, db: Session = Depends(get_db)):
#     new_tc = TestCase(
#         question_id=test_case.question_id, input=test_case.input,
#         expected_output=test_case.expected_output, is_hidden=test_case.is_hidden,
#         points=test_case.points
#     )
#     db.add(new_tc)
#     db.commit()
#     db.refresh(new_tc)
#     return new_tc


# @router.put("/test-cases/{test_case_id}")
# def update_test_case(test_case_id: int, data: TestCaseUpdate, db: Session = Depends(get_db)):
#     tc = db.query(TestCase).filter(TestCase.id == test_case_id).first()
#     if not tc:
#         raise HTTPException(status_code=404, detail=f"Test case {test_case_id} not found")
#     if data.input is not None: tc.input = data.input
#     if data.expected_output is not None: tc.expected_output = data.expected_output
#     if data.is_hidden is not None: tc.is_hidden = data.is_hidden
#     if data.points is not None: tc.points = data.points
#     db.commit()
#     db.refresh(tc)
#     return {"id": tc.id, "input": tc.input, "expected_output": tc.expected_output,
#             "is_hidden": tc.is_hidden, "points": tc.points}


# @router.delete("/test-cases/{test_case_id}")
# def delete_test_case(test_case_id: int, db: Session = Depends(get_db)):
#     tc = db.query(TestCase).filter(TestCase.id == test_case_id).first()
#     if not tc:
#         raise HTTPException(status_code=404, detail=f"Test case {test_case_id} not found")
#     db.delete(tc)
#     db.commit()
#     return {"message": f"Test case {test_case_id} deleted successfully"}


# @router.get("/submissions")
# def get_all_submissions(db: Session = Depends(get_db), limit: int = 50):
#     submissions = db.query(Submission).order_by(Submission.submitted_at.desc()).limit(limit).all()
#     return submissions


# @router.get("/analytics/test/{test_id}")
# def get_test_analytics(test_id: int, db: Session = Depends(get_db)):
#     questions = db.query(Question).filter(Question.test_id == test_id).all()
#     analytics = {"test_id": test_id, "total_questions": len(questions), "questions": []}
#     for question in questions:
#         submissions = db.query(Submission).filter(Submission.question_id == question.id).all()
#         total = len(submissions)
#         passed = sum(1 for s in submissions if s.score == 100)
#         avg = sum(s.score for s in submissions) / total if total > 0 else 0
#         analytics["questions"].append({
#             "question_id": question.id, "title": question.title,
#             "total_submissions": total, "passed": passed,
#             "failed": total - passed,
#             "pass_rate": (passed / total * 100) if total > 0 else 0,
#             "average_score": round(avg, 2)
#         })
#     return analytics


# # ─── Student Routes ───────────────────────────────────────────────────────────

# @router.get("/student/tests", tags=["student"])
# def get_available_tests(db: Session = Depends(get_db)):
#     tests = db.query(Test).filter(Test.is_active == True).all()
#     result = []
#     for test in tests:
#         question_count = db.query(Question).filter(Question.test_id == test.id).count()
#         result.append({
#             "id": test.id,
#             "title": test.title,
#             "description": test.description,
#             "duration_minutes": test.duration_minutes,
#             "question_count": question_count,
#             "allowed_languages": parse_languages(test.allowed_languages or "python"),  # ✅
#             "created_at": test.created_at
#         })
#     return result


# @router.get("/student/test/{test_id}/questions", tags=["student"])
# def get_test_questions_for_student(test_id: int, db: Session = Depends(get_db)):
#     # Also return allowed_languages from the test
#     test = db.query(Test).filter(Test.id == test_id).first()
#     if not test:
#         raise HTTPException(status_code=404, detail="Test not found")

#     questions = db.query(Question).filter(Question.test_id == test_id).all()
#     result = []
#     for question in questions:
#         test_cases = db.query(TestCase).filter(
#             TestCase.question_id == question.id,
#             TestCase.is_hidden == False
#         ).all()
#         result.append({
#             "id": question.id,
#             "title": question.title,
#             "description": question.description,
#             "difficulty": safe_difficulty(question),
#             "topic": question.topic,
#             "points": question.points,
#             "time_limit_ms": question.time_limit_ms,
#             "allowed_languages": parse_languages(test.allowed_languages or "python"),  # ✅
#             "test_cases": [
#                 {"id": tc.id, "input": tc.input, "expected_output": tc.expected_output,
#                  "points": tc.points}
#                 for tc in test_cases
#             ]
#         })
#     return result



# # ─── Submit Endpoint ──────────────────────────────────────────────────────────

# class SubmitRequest(BaseModel):
#     question_id: int
#     test_id: int
#     language: str
#     code: str
#     score: float
#     passed: int
#     total: int

# @router.post("/student/submit", tags=["student"])
# def submit_solution(
#     data: SubmitRequest,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     question = db.query(Question).filter(Question.id == data.question_id).first()
#     if not question:
#         raise HTTPException(status_code=404, detail="Question not found")
#     submission = Submission(
#         student_id=current_user.id,
#         question_id=data.question_id,
#         language=data.language,
#         code=data.code,
#         score=data.score,
#         submitted_at=datetime.utcnow()
#     )
#     db.add(submission)
#     db.commit()
#     db.refresh(submission)
#     return {"message": "Submitted successfully", "submission_id": submission.id, "score": data.score}









"""
Teacher Routes
API endpoints for teacher operations
"""

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.db_models import Test, Question, TestCase, Submission, User
from app.routes.auth import require_teacher, get_current_user
from pydantic import BaseModel
from datetime import datetime
import random
import string

router = APIRouter(prefix="/api/teacher", tags=["teacher"])

ALL_LANGUAGES = ["python", "c", "cpp", "java"]


# ─── Pydantic Models ──────────────────────────────────────────────────────────

class TestCreate(BaseModel):
    title: str
    description: str
    duration_minutes: int = 60
    is_active: bool = True
    allowed_languages: List[str] = ["python", "c", "cpp", "java"]
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    test_type: str = "invite_only"
    tags: Optional[str] = ""


class TestResponse(BaseModel):
    id: int
    title: str
    description: str
    teacher_id: int
    duration_minutes: int
    is_active: bool
    allowed_languages: str
    created_at: datetime

    class Config:
        from_attributes = True


class QuestionCreate(BaseModel):
    test_id: int
    title: str
    description: str
    difficulty: str
    topic: str
    points: int = 10
    time_limit_ms: int = 2000


class QuestionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[str] = None
    topic: Optional[str] = None
    points: Optional[int] = None
    time_limit_ms: Optional[int] = None


class TestCaseCreate(BaseModel):
    question_id: int
    input: str
    expected_output: str
    is_hidden: bool = False
    points: int = 1


class TestCaseUpdate(BaseModel):
    input: Optional[str] = None
    expected_output: Optional[str] = None
    is_hidden: Optional[bool] = None
    points: Optional[int] = None


class TestCaseResponse(BaseModel):
    id: int
    question_id: int
    input: str
    expected_output: str
    is_hidden: bool
    points: int

    class Config:
        from_attributes = True


class QuestionResponse(BaseModel):
    id: int
    test_id: int
    title: str
    description: str
    difficulty: str
    topic: str
    points: int
    time_limit_ms: int
    created_at: datetime
    test_cases: List[TestCaseResponse] = []

    class Config:
        from_attributes = True


class TestUpdate(BaseModel):
    is_active: Optional[bool] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    test_type: Optional[str] = None
    tags: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    duration_minutes: Optional[int] = None


class SubmitRequest(BaseModel):
    question_id: int
    test_id: int
    language: str
    code: str
    score: float
    passed: int
    total: int


# ─── Helpers ──────────────────────────────────────────────────────────────────

def safe_difficulty(q) -> str:
    return q.difficulty.value if hasattr(q.difficulty, 'value') else q.difficulty

def parse_languages(lang_str: str) -> List[str]:
    return [l.strip() for l in (lang_str or "python").split(",") if l.strip()]

def format_languages(langs: List[str]) -> str:
    valid = [l.lower() for l in langs if l.lower() in ALL_LANGUAGES]
    return ",".join(valid) if valid else "python"

def generate_assessment_id() -> str:
    return ''.join(random.choices(string.digits, k=7))

def parse_date(date_str: Optional[str]):
    if not date_str:
        return None
    try:
        return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
    except Exception:
        return None

def format_test(test) -> dict:
    return {
        "id": test.id,
        "title": test.title,
        "description": test.description,
        "teacher_id": test.teacher_id,
        "duration_minutes": test.duration_minutes,
        "is_active": test.is_active,
        "allowed_languages": parse_languages(test.allowed_languages or "python"),
        "start_date": test.start_date.isoformat() if test.start_date else None,
        "end_date": test.end_date.isoformat() if test.end_date else None,
        "test_type": test.test_type or "invite_only",
        "tags": [t.strip() for t in (test.tags or "").split(",") if t.strip()],
        "assessment_id": test.assessment_id or "",
        "created_at": test.created_at,
    }


# ─── Teacher Routes ───────────────────────────────────────────────────────────

@router.get("/tests")
def get_all_tests(db: Session = Depends(get_db), current_user: User = Depends(require_teacher)):
    tests = db.query(Test).filter(Test.teacher_id == current_user.id).all()
    return [format_test(t) for t in tests]


@router.post("/tests")
def create_test(test: TestCreate, db: Session = Depends(get_db), current_user: User = Depends(require_teacher)):
    new_test = Test(
        title=test.title,
        description=test.description,
        teacher_id=current_user.id,
        duration_minutes=test.duration_minutes,
        is_active=test.is_active,
        allowed_languages=format_languages(test.allowed_languages),
        start_date=parse_date(test.start_date),
        end_date=parse_date(test.end_date),
        test_type=test.test_type or "invite_only",
        tags=test.tags or "",
        assessment_id=generate_assessment_id(),
    )
    db.add(new_test)
    db.commit()
    db.refresh(new_test)
    return format_test(new_test)


@router.patch("/tests/{test_id}")
def update_test(test_id: int, data: TestUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_teacher)):
    test = db.query(Test).filter(Test.id == test_id, Test.teacher_id == current_user.id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    if data.is_active is not None: test.is_active = data.is_active
    if data.start_date is not None: test.start_date = parse_date(data.start_date)
    if data.end_date is not None: test.end_date = parse_date(data.end_date)
    if data.test_type is not None: test.test_type = data.test_type
    if data.tags is not None: test.tags = data.tags
    if data.title is not None: test.title = data.title
    if data.description is not None: test.description = data.description
    if data.duration_minutes is not None: test.duration_minutes = data.duration_minutes
    db.commit()
    db.refresh(test)
    return format_test(test)


@router.get("/tests/{test_id}/questions", response_model=List[QuestionResponse])
def get_test_questions_detailed(test_id: int, db: Session = Depends(get_db)):
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail=f"Test {test_id} not found")
    return db.query(Question).filter(Question.test_id == test_id).all()


@router.get("/test/{test_id}/questions")
def get_test_questions(test_id: int, db: Session = Depends(get_db)):
    questions = db.query(Question).filter(Question.test_id == test_id).all()
    result = []
    for question in questions:
        test_cases = db.query(TestCase).filter(TestCase.question_id == question.id).all()
        result.append({
            "id": question.id, "title": question.title, "description": question.description,
            "difficulty": safe_difficulty(question), "topic": question.topic,
            "points": question.points, "time_limit_ms": question.time_limit_ms,
            "test_cases_count": len(test_cases),
            "test_cases": [{"id": tc.id, "input": tc.input, "expected_output": tc.expected_output,
                            "is_hidden": tc.is_hidden, "points": tc.points} for tc in test_cases]
        })
    return result


@router.post("/questions")
def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    new_question = Question(
        test_id=question.test_id, title=question.title, description=question.description,
        difficulty=question.difficulty.upper(), topic=question.topic.upper(),
        points=question.points, time_limit_ms=question.time_limit_ms
    )
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    return new_question


@router.put("/questions/{question_id}")
def update_question(question_id: int, question_data: QuestionUpdate, db: Session = Depends(get_db)):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail=f"Question {question_id} not found")
    if question_data.title is not None: question.title = question_data.title
    if question_data.description is not None: question.description = question_data.description
    if question_data.difficulty is not None: question.difficulty = question_data.difficulty.upper()
    if question_data.topic is not None: question.topic = question_data.topic.upper()
    if question_data.points is not None: question.points = question_data.points
    if question_data.time_limit_ms is not None: question.time_limit_ms = question_data.time_limit_ms
    db.commit()
    db.refresh(question)
    test_cases = db.query(TestCase).filter(TestCase.question_id == question.id).all()
    return {
        "id": question.id, "title": question.title, "description": question.description,
        "difficulty": safe_difficulty(question), "topic": question.topic,
        "points": question.points, "time_limit_ms": question.time_limit_ms,
        "test_cases": [{"id": tc.id, "input": tc.input, "expected_output": tc.expected_output,
                        "is_hidden": tc.is_hidden, "points": tc.points} for tc in test_cases]
    }


@router.delete("/questions/{question_id}")
def delete_question(question_id: int, db: Session = Depends(get_db)):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail=f"Question {question_id} not found")
    db.query(TestCase).filter(TestCase.question_id == question_id).delete()
    db.query(Submission).filter(Submission.question_id == question_id).delete()
    db.delete(question)
    db.commit()
    return {"message": f"Question {question_id} deleted successfully"}


@router.post("/test-cases")
def create_test_case(test_case: TestCaseCreate, db: Session = Depends(get_db)):
    new_tc = TestCase(
        question_id=test_case.question_id, input=test_case.input,
        expected_output=test_case.expected_output, is_hidden=test_case.is_hidden,
        points=test_case.points
    )
    db.add(new_tc)
    db.commit()
    db.refresh(new_tc)
    return new_tc


@router.put("/test-cases/{test_case_id}")
def update_test_case(test_case_id: int, data: TestCaseUpdate, db: Session = Depends(get_db)):
    tc = db.query(TestCase).filter(TestCase.id == test_case_id).first()
    if not tc:
        raise HTTPException(status_code=404, detail=f"Test case {test_case_id} not found")
    if data.input is not None: tc.input = data.input
    if data.expected_output is not None: tc.expected_output = data.expected_output
    if data.is_hidden is not None: tc.is_hidden = data.is_hidden
    if data.points is not None: tc.points = data.points
    db.commit()
    db.refresh(tc)
    return {"id": tc.id, "input": tc.input, "expected_output": tc.expected_output,
            "is_hidden": tc.is_hidden, "points": tc.points}


@router.delete("/test-cases/{test_case_id}")
def delete_test_case(test_case_id: int, db: Session = Depends(get_db)):
    tc = db.query(TestCase).filter(TestCase.id == test_case_id).first()
    if not tc:
        raise HTTPException(status_code=404, detail=f"Test case {test_case_id} not found")
    db.delete(tc)
    db.commit()
    return {"message": f"Test case {test_case_id} deleted successfully"}


@router.get("/submissions")
def get_all_submissions(db: Session = Depends(get_db), limit: int = 50):
    submissions = db.query(Submission).order_by(Submission.submitted_at.desc()).limit(limit).all()
    return submissions


@router.get("/analytics/test/{test_id}")
def get_test_analytics(test_id: int, db: Session = Depends(get_db)):
    questions = db.query(Question).filter(Question.test_id == test_id).all()
    analytics = {"test_id": test_id, "total_questions": len(questions), "questions": []}
    for question in questions:
        submissions = db.query(Submission).filter(Submission.question_id == question.id).all()
        total = len(submissions)
        passed = sum(1 for s in submissions if s.score == 100)
        avg = sum(s.score for s in submissions) / total if total > 0 else 0
        analytics["questions"].append({
            "question_id": question.id, "title": question.title,
            "total_submissions": total, "passed": passed, "failed": total - passed,
            "pass_rate": (passed / total * 100) if total > 0 else 0,
            "average_score": round(avg, 2)
        })
    return analytics


# ─── Student Routes ───────────────────────────────────────────────────────────

@router.get("/student/tests", tags=["student"])
def get_available_tests(db: Session = Depends(get_db)):
    tests = db.query(Test).filter(Test.is_active == True).all()
    result = []
    for test in tests:
        question_count = db.query(Question).filter(Question.test_id == test.id).count()
        result.append({
            "id": test.id, "title": test.title, "description": test.description,
            "duration_minutes": test.duration_minutes, "question_count": question_count,
            "allowed_languages": parse_languages(test.allowed_languages or "python"),
            "created_at": test.created_at
        })
    return result


@router.get("/student/test/{test_id}/questions", tags=["student"])
def get_test_questions_for_student(test_id: int, db: Session = Depends(get_db)):
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    questions = db.query(Question).filter(Question.test_id == test_id).all()
    result = []
    for question in questions:
        test_cases = db.query(TestCase).filter(
            TestCase.question_id == question.id, TestCase.is_hidden == False
        ).all()
        result.append({
            "id": question.id, "title": question.title, "description": question.description,
            "difficulty": safe_difficulty(question), "topic": question.topic,
            "points": question.points, "time_limit_ms": question.time_limit_ms,
            "allowed_languages": parse_languages(test.allowed_languages or "python"),
            "test_cases": [{"id": tc.id, "input": tc.input, "expected_output": tc.expected_output,
                            "points": tc.points} for tc in test_cases]
        })
    return result


@router.post("/student/submit", tags=["student"])
def submit_solution(data: SubmitRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    question = db.query(Question).filter(Question.id == data.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    submission = Submission(
        student_id=current_user.id, question_id=data.question_id,
        language=data.language, code=data.code, score=data.score,
        submitted_at=datetime.utcnow()
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return {"message": "Submitted successfully", "submission_id": submission.id, "score": data.score}