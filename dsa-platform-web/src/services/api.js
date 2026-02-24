import axios from 'axios';

// ✅ Attach JWT token to every request automatically
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Backend API base URL
const API_BASE_URL = 'https://dsa-platform-production-64f6.up.railway.app';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Attach JWT to apiClient requests too
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// API Methods
const api = {
  // Health check
  async ping() {
    const response = await apiClient.get('/ping');
    return response.data;
  },

  // Execute code
  async executeCode(request) {
    const response = await apiClient.post('/api/execute', request);
    return response.data;
  },

  // Submit solution
  async submitSolution(data) {
    const response = await apiClient.post('/api/teacher/student/submit', data);
    return response.data;
  },

  // ── Teacher: Tests ──────────────────────────────────────────────
  async getTeacherTests() {
    const response = await apiClient.get('/api/teacher/tests');
    return response.data;
  },

  async createTest(testData) {
    const response = await apiClient.post('/api/teacher/tests', testData);
    return response.data;
  },

  // ── Teacher: Questions ──────────────────────────────────────────
  async getTestQuestions(testId) {
    const response = await apiClient.get(`/api/teacher/test/${testId}/questions`);
    return response.data;
  },

  async createQuestion(questionData) {
    const response = await apiClient.post('/api/teacher/questions', questionData);
    return response.data;
  },

  // ── Teacher: Submissions & Analytics ───────────────────────────
  async getSubmissions() {
    const response = await apiClient.get('/api/teacher/submissions');
    return response.data;
  },

  async getTestAnalytics(testId) {
    const response = await apiClient.get(`/api/teacher/analytics/test/${testId}`);
    return response.data;
  },

  // ── Student ─────────────────────────────────────────────────────
  async getAvailableTests() {
    const response = await apiClient.get('/api/teacher/student/tests');
    return response.data;
  },

  async getStudentTestQuestions(testId) {
    const response = await apiClient.get(`/api/teacher/student/test/${testId}/questions`);
    return response.data;
  },
  // ── Auth ─────────────────────────────────────────────────────────
  async login(credentials) {
    const response = await apiClient.post('/api/auth/login', credentials);
    return response.data;
},

  async register(userData) {
    const response = await apiClient.post('/api/auth/register', userData);
    return response.data;
},
};

export default api;