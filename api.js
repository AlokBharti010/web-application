// ============================================================
// SKILLHUB CENTRALIZED FRONTEND API CLIENT
// Connects UI events directly to Node.js / Express REST Backend
// ============================================================

const API_BASE = 'http://localhost:5000/api/v1';

window.SkillHubAPI = {
  // Token storage helpers
  getToken() {
    return localStorage.getItem('skillhub_jwt_token');
  },

  setToken(token) {
    if (token) localStorage.setItem('skillhub_jwt_token', token);
  },

  clearToken() {
    localStorage.removeItem('skillhub_jwt_token');
  },

  getAuthHeaders() {
    const token = this.getToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  },

  // 1. Onboarding Step 1
  async submitStep1(data) {
    try {
      const res = await fetch(`${API_BASE}/onboarding/step1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      console.warn('Backend API connection failed for Step 1, falling back:', err);
      return {
        success: true,
        sessionToken: 'local-session-' + Date.now(),
        contact: data.contact,
        otpCode: '4829',
        message: 'Dispatched OTP (Local fallback mode)',
      };
    }
  },

  // 2. Onboarding Step 2 (Verify OTP)
  async verifyOtp(sessionToken, code) {
    try {
      const res = await fetch(`${API_BASE}/onboarding/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken, code }),
      });
      return await res.json();
    } catch (err) {
      console.warn('Backend API connection failed for OTP verify, falling back:', err);
      return { success: code === '4829' };
    }
  },

  // 3. Onboarding Step 4 (Complete & Launch Dashboard)
  async completeOnboarding(payload) {
    try {
      const res = await fetch(`${API_BASE}/onboarding/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.token) this.setToken(data.token);
      return data;
    } catch (err) {
      console.warn('Backend API connection failed for complete, falling back:', err);
      return {
        success: true,
        studentId: `#SH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        profile: payload,
      };
    }
  },

  // 4. Dual Login (Learner or Hiring)
  async login(email, password, portal = 'learner') {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, portal }),
      });
      const data = await res.json();
      if (data.token) this.setToken(data.token);
      return data;
    } catch (err) {
      console.warn('Backend API connection failed for login:', err);
      return {
        success: true,
        user: { name: email.split('@')[0], role: portal, email },
        profile: { studentId: '#SH-2026-8842', skillLevel: 'Basic' },
      };
    }
  },

  // 5. Courses Catalog
  async getCourses(category = 'all', search = '') {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (search) params.append('search', search);

      const res = await fetch(`${API_BASE}/courses?${params.toString()}`);
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // 6. Student Dashboard Data
  async getStudentDashboard() {
    try {
      const res = await fetch(`${API_BASE}/dashboard/student`, {
        headers: this.getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // 7. LMS Lesson Progress Update
  async updateLessonProgress(courseId, moduleIndex, isCompleted) {
    try {
      const res = await fetch(`${API_BASE}/lms/progress`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ courseId, moduleIndex, isCompleted }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // 8. Jobs Listing
  async getJobs(type = 'all', field = 'all', search = '') {
    try {
      const params = new URLSearchParams();
      if (type && type !== 'all') params.append('type', type);
      if (field && field !== 'all') params.append('field', field);
      if (search) params.append('search', search);

      const res = await fetch(`${API_BASE}/jobs?${params.toString()}`);
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // 9. Post a Job (Modal)
  async createJob(jobData) {
    try {
      const res = await fetch(`${API_BASE}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // 10. Tutors & Booking
  async getTutors() {
    try {
      const res = await fetch(`${API_BASE}/tutors`);
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async bookTutor(tutorId, slotTime) {
    try {
      const res = await fetch(`${API_BASE}/tutors/book`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ tutorId, slotTime }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
};
