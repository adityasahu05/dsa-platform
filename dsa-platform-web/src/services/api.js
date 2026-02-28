import axios from 'axios';

// Backend API base URL
const API_BASE_URL = 'https://dsa-platform-production-64f6.up.railway.app';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Attach JWT to every request automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Health ────────────────────────────────────────────────────────────────────
export const ping = async () => {
  const response = await apiClient.get('/ping');
  return response.data;
};

// ── Execute Code (Judge0 CE) ──────────────────────────────────────────────────
export const executeCode = async (
  code,
  language,
  testCases,
  questionId = null,
  timeLimit = 5.0,
  memoryLimit = 256000
) => {
  const response = await apiClient.post('/api/execute', {
    code,
    language,
    test_cases: testCases,
    question_id: questionId,
    time_limit: timeLimit,
    memory_limit: memoryLimit,
  });
  return response.data;
};

export const checkExecutionHealth = async () => {
  const response = await apiClient.get('/api/execute/health');
  return response.data;
};

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login = async (credentials) => {
  const response = await apiClient.post('/api/auth/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await apiClient.post('/api/auth/register', userData);
  return response.data;
};

export const googleLogin = async (idToken, role = null) => {
  const response = await apiClient.post('/api/auth/google', { id_token: idToken, role });
  return response.data;
};

export const getMe = async () => {
  const response = await apiClient.get('/api/auth/me');
  return response.data;
};

// ── Teacher: Tests ────────────────────────────────────────────────────────────
export const getTeacherTests = async () => {
  const response = await apiClient.get('/api/teacher/tests');
  return response.data;
};

export const createTest = async (testData) => {
  const response = await apiClient.post('/api/teacher/tests', testData);
  return response.data;
};

export const updateTest = async (testId, testData) => {
  const response = await apiClient.patch(`/api/teacher/tests/${testId}`, testData);
  return response.data;
};

// ── Teacher: Questions ────────────────────────────────────────────────────────
export const getTestQuestions = async (testId) => {
  const response = await apiClient.get(`/api/teacher/test/${testId}/questions`);
  return response.data;
};

export const createQuestion = async (questionData) => {
  const response = await apiClient.post('/api/teacher/questions', questionData);
  return response.data;
};

export const updateQuestion = async (questionId, questionData) => {
  const response = await apiClient.put(`/api/teacher/questions/${questionId}`, questionData);
  return response.data;
};

export const deleteQuestion = async (questionId) => {
  const response = await apiClient.delete(`/api/teacher/questions/${questionId}`);
  return response.data;
};

// ── Teacher: Test Cases ───────────────────────────────────────────────────────
export const createTestCase = async (testCaseData) => {
  const response = await apiClient.post('/api/teacher/test-cases', testCaseData);
  return response.data;
};

export const updateTestCase = async (testCaseId, testCaseData) => {
  const response = await apiClient.put(`/api/teacher/test-cases/${testCaseId}`, testCaseData);
  return response.data;
};

export const deleteTestCase = async (testCaseId) => {
  const response = await apiClient.delete(`/api/teacher/test-cases/${testCaseId}`);
  return response.data;
};

// ── Teacher: Submissions & Analytics ─────────────────────────────────────────
export const getSubmissions = async () => {
  const response = await apiClient.get('/api/teacher/submissions');
  return response.data;
};

export const getTestAnalytics = async (testId) => {
  const response = await apiClient.get(`/api/teacher/analytics/test/${testId}`);
  return response.data;
};

// ── Student ───────────────────────────────────────────────────────────────────
export const getAvailableTests = async () => {
  const response = await apiClient.get('/api/teacher/student/tests');
  return response.data;
};

export const getStudentTestQuestions = async (testId) => {
  const response = await apiClient.get(`/api/teacher/student/test/${testId}/questions`);
  return response.data;
};

export const submitSolution = async (data) => {
  const response = await apiClient.post('/api/teacher/student/submit', data);
  return response.data;
};

// ── Default export (backwards compatible) ────────────────────────────────────
const api = {
  ping,
  executeCode,
  checkExecutionHealth,
  login,
  register,
  googleLogin,
  getMe,
  getTeacherTests,
  createTest,
  updateTest,
  getTestQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  createTestCase,
  updateTestCase,
  deleteTestCase,
  getSubmissions,
  getTestAnalytics,
  getAvailableTests,
  getStudentTestQuestions,
  submitSolution,
};

export default api;