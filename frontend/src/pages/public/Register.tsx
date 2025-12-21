import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Register.css'; // Import file CSS riêng vừa tạo

// Lấy API URL từ biến môi trường
const API = (import.meta as any).env?.VITE_API_URL || '';

// Asset Import (Logo)
import logo from '../../assets/images/logo-gupjob-primary.png';
import gitHub from '../../assets/images/icon-github.png';
import linkedIn from '../../assets/images/icon-linkedin.png';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // State control form data
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    email: '',
    fullName: '',
    password: '',
    // Step 2: Role
    role: '', 
    // Step 3: Situation
    currentSituation: '', 
    // Step 4: Goals
    careerGoals: [] as string[],
    // Step 5: Interests
    interests: [] as string[],
    primaryGoalNextYear: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSelect = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field: 'careerGoals' | 'interests', value: string) => {
    setFormData(prev => {
      const list = prev[field];
      return list.includes(value) 
        ? { ...prev, [field]: list.filter(item => item !== value) }
        : { ...prev, [field]: [...list, value] };
    });
  };

  const nextStep = () => {
    // Validate Step 1
    if (step === 1 && (!formData.email || !formData.fullName || !formData.password)) {
      setError("Please fill in all fields.");
      return;
    }
    // Validate Step 2
    if (step === 2 && !formData.role) {
      setError("Please select a role.");
      return;
    }
    setError(null);
    setStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  // --- API SUBMIT HANDLER ---
  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Submitting Data:", formData);
      
      // Map role từ frontend values sang backend enum values
      const roleMap: { [key: string]: string } = {
        'learner': 'STUDENT',
        'mentor': 'MENTOR',
        'company': 'COMPANY',
        'admin': 'ADMIN'
      };
      
      const backendRole = roleMap[formData.role.toLowerCase()] || formData.role.toUpperCase();
      
      const payload = {
        email: formData.email,
        password: formData.password,
        name: formData.fullName,
        role: backendRole,  
        jobPriority: formData.interests?.[0] || null, 
        currentSituation: formData.currentSituation,
        careerGoals: formData.careerGoals,
        interests: formData.interests,
        primaryGoalNextYear: formData.primaryGoalNextYear
      };

      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Registration failed');
      }

      // Thành công -> Chuyển sang Login
      navigate('/login');
      
    } catch (err: any) {
      setError(err.message || 'Register error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER FUNCTIONS ---

  // STEP 1: Basic Info
  const renderStep1 = () => (
    <>
      <h2 style={{fontSize: '1.75rem', marginBottom: '0.5rem'}}>Create Account</h2>
      <p style={{color:'#64748b', marginBottom:'1.5rem'}}>Join our community today.</p>

      {error && <div className="error-msg">{error}</div>}

      <div className="social-group">
        <button className="btn-social"><span><img src={gitHub} alt="GitHub" style={{width:'20px', height:'20px'}} /></span> Continue with GitHub</button>
        <button className="btn-social"><span><img src={linkedIn} alt="LinkedIn" style={{width:'20px', height:'20px'}} /></span> Continue with LinkedIn</button>
      </div>

      <div className="divider-or"><span>OR</span></div>

      <div className="reg-form">
        <label className="reg-label">
          Email
          <input className="reg-input" name="email" type="email" placeholder="name@company.com" required value={formData.email} onChange={handleChange} />
        </label>
        <label className="reg-label">
          Full Name
          <input className="reg-input" name="fullName" type="text" placeholder="John Doe" required value={formData.fullName} onChange={handleChange} />
        </label>
        <label className="reg-label">
          Password
          <div style={{position:'relative'}}>
            <input 
              className="reg-input" 
              style={{width:'100%'}}
              name="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="Create a password" 
              required 
              value={formData.password} 
              onChange={handleChange} 
            />
            <span 
              onClick={() => setShowPassword(!showPassword)}
              style={{position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', cursor:'pointer'}}
            >
              {showPassword ? "🔓" : "🔒"}
            </span>
          </div>
        </label>
      </div>
      
      <button className="btn-primary" style={{width:'100%', marginTop:'1.5rem'}} onClick={nextStep}>
        Create Account &rarr;
      </button>

      <div style={{marginTop:'1rem', textAlign:'center', fontSize:'0.9rem'}}>
        Already have an account? <Link to="/login" style={{color:'#2563eb', fontWeight:600}}>Log In</Link>
      </div>
    </>
  );

  // STEP 2: Role
  const renderStep2 = () => (
    <>
      <h2 style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>How will you be joining us?</h2>
      <p style={{color:'#64748b'}}>Choose your primary role.</p>
      {error && <div className="error-msg">{error}</div>}

      <div className="grid-cards">
        {[
          { id: 'learner', icon: '🎓', title: "I'm a Learner", desc: "Gain skills & land jobs." },
          { id: 'mentor', icon: '💡', title: "I'm a Mentor", desc: "Guide & share expertise." },
          { id: 'company', icon: '💼', title: "I'm a Company", desc: "Hire skilled talent." }
        ].map(item => (
          <div 
            key={item.id} 
            className={`card-select ${formData.role === item.id ? 'active' : ''}`}
            onClick={() => handleSelect('role', item.id)}
          >
            <div className="card-icon-box">{item.icon}</div>
            <div className="card-info">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  // STEP 3: Situation
  const renderStep3 = () => (
    <>
      <h2 style={{fontSize: '1.5rem'}}>Current Situation?</h2>
      <div className="grid-cards two-col">
        {[
          { id: 'student', icon: '📚', label: 'Student' },
          { id: 'job-seeker', icon: '🚀', label: 'Job Seeker' },
          { id: 'employed', icon: '💼', label: 'Employed' },
          { id: 'other', icon: '➕', label: 'Other' }
        ].map(item => (
          <div 
            key={item.id}
            className={`card-select centered ${formData.currentSituation === item.id ? 'active' : ''}`}
            onClick={() => handleSelect('currentSituation', item.id)}
          >
            <div className="card-icon-box">{item.icon}</div>
            <div className="card-info"><h3>{item.label}</h3></div>
          </div>
        ))}
      </div>
    </>
  );

  // STEP 4: Goals
  const renderStep4 = () => (
    <>
      <h2 style={{fontSize: '1.5rem'}}>Primary Career Goals?</h2>
      <div className="grid-cards">
        {[
          { id: 'career_change', title: 'Career Change', desc: 'Transition to a new field.' },
          { id: 'skill_up', title: 'Skill Enhancement', desc: 'Deepen current skills.' },
          { id: 'new_job', title: 'Find a New Job', desc: 'Actively seeking opportunities.' },
          { id: 'personal', title: 'Personal Growth', desc: 'Learning for curiosity.' }
        ].map(item => (
          <div 
            key={item.id}
            className={`check-item ${formData.careerGoals.includes(item.id) ? 'active' : ''}`}
            onClick={() => handleMultiSelect('careerGoals', item.id)}
          >
            <div className="check-box-visual">{formData.careerGoals.includes(item.id) && '✓'}</div>
            <div className="card-info">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  // STEP 5: Interests & Final Submit
  const renderStep5 = () => (
    <>
      <div className="step-centered-header">
        <h2>Tell us about your interests & goals</h2>
        <p>This will help us personalize your learning journey.</p>
      </div>

      {/* Section 1: Interests */}
      <div style={{ marginBottom: '2rem' }}>
        <label className="section-label">What areas are you most interested in?</label>
        <span className="section-sub-label">Select all that apply</span>
        
        <div className="grid-cards two-col">
          {[
            { id: 'Business - Marketing', icon: '📢' }, // Icon cái loa
            { id: 'IT', icon: '< >' },                  // Icon code
            { id: 'Design', icon: '🎨' },               // Icon palette
            { id: 'Other', icon: '•••' }                // Icon 3 chấm
          ].map(item => (
            <div 
              key={item.id} 
              className={`interest-card ${formData.interests.includes(item.id) ? 'active' : ''}`}
              onClick={() => handleMultiSelect('interests', item.id)}
            >
              <div className="interest-icon">{item.icon}</div>
              <span>{item.id}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Primary Goal */}
      <div>
        <label className="section-label">What is your primary goal for the next year?</label>
        {/* Khoảng cách nhỏ dưới label */}
        <div style={{ marginTop: '0.75rem' }}>
          {[
            'Obtain a certification',
            'Find a suitable job',
            'Personal development',
            'Start my own business',
            'Other'
          ].map(goal => (
            <div 
              key={goal}
              className={`goal-card ${formData.primaryGoalNextYear === goal ? 'active' : ''}`}
              onClick={() => handleSelect('primaryGoalNextYear', goal)}
            >
              {goal}
            </div>
          ))}
        </div>
      </div>

      {error && <div className="error-msg" style={{ marginTop: '1rem' }}>{error}</div>}
    </>
  );

  return (
    <div className="register-container">
      {/* Dynamic class 'wide' để card to ra khi vào các bước sau */}
      <div className={`register-card ${step > 1 ? 'wide' : ''}`}>
        
        <div style={{textAlign:'center', marginBottom:'1rem'}}>
          <Link to="/"><img src={logo} alt="Logo" style={{height:'40px'}} /></Link>
        </div>

        {/* Progress Bar (Step 2+) */}
        {step > 1 && (
          <div className="step-header">
            <span className="step-count">Step {step} of {totalSteps}</span>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
            </div>
          </div>
        )}

        {/* Content Render */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}

        {/* Navigation Buttons (Step 2+) */}
        {step > 1 && (
          <div className="action-footer">
            <button className="btn-ghost" onClick={prevStep}>Back</button>
            <button 
              className="btn-primary-foot" 
              onClick={step === totalSteps ? handleSubmit : nextStep}
              disabled={isLoading}
            >
              {isLoading 
                ? 'Processing...' 
                : (step === totalSteps ? 'Finish and go to Dashboard' : 'Continue')
              }
            </button>
          </div>
        )}

      </div>
    </div>
  );
}