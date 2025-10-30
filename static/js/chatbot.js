// === GEMINI API CONFIGURATION ===
const GEMINI_API_KEY = "AIzaSyDNTm9lF4WCEBBDzgTqQ2BJ_R9QQY7iyPU";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// === FACTS ABOUT SAMEER ===
const sameerFacts = `
PERSONAL INFORMATION:
- Name: Shaik Sameer
- Email: shaiksameershubhan@gmail.com
- LinkedIn: https://www.linkedin.com/in/shaik-sameer-69a342a8
- GitHub: https://github.com/Smr2005
- Phone: +91 9652879470
- Location: India

EDUCATION:
- B.Tech in AI & Data Science from Aditya College of Engineering (2021–2026)
- Intermediate in Maths, Physics, Chemistry at Vidyanikethan Junior College (2020–2022)
- Secondary School at Kothaindlu MPL High School (2019–2020)

TECHNICAL SKILLS:
- Programming Languages: Python, JavaScript, HTML, CSS
- Frameworks & Libraries: Flask, Streamlit, OpenCV, Pandas, NumPy
- Databases: MySQL
- Tools & Technologies: Power BI, Git, GitHub, VS Code
- AI/ML: Computer Vision, Data Analysis, Machine Learning
- Web Development: Frontend and Backend development

PROJECTS:
1. Facial Recognition System - Built using OpenCV and Python for real-time face detection and recognition
2. Disease Prediction App - Machine learning application for predicting diseases based on symptoms
3. Personal Portfolio Website - Full-stack web application showcasing skills and projects
4. IoT Gas Leak Detection System - IoT-based safety system for detecting gas leaks
5. AutoFeel- Car Sentiment Analyzer

INTERNSHIPS & EXPERIENCE:
- AI Intern at TechSaksham Edunet Foundation (Microsoft & SAP CSR)
- Data Science Intern at SkillDzire Technologies
- Data Analytics Intern at APSCHE x SmartBridge Virtual Internship (Current)
- Skillbit Technologies Virtual Internship – Artificial Intelligence Intern
- Working at HMG Technologies as a Junior software developer and contributing in projects related to Full Stack Development,agentic AI and AI solutions.

STRENGTHS:
- Dedicated and hardworking
- Innovative problem solver
- Fast learner and adaptable
- Detail-oriented approach
- Strong analytical thinking

AREAS FOR IMPROVEMENT:
- Time management (tends to hyper-focus on problem-solving)
- Working on balancing perfectionism with efficiency

CAREER GOALS:
- Passionate about AI and Data Science
- developing impactful AI solutions
- developping full-stack web applications
- front-end and back-end development
- 
- Interested in developing innovative solutions
- Seeking opportunities to grow in tech industry
- Committed to continuous learning and development

CERTIFICATIONS & ACHIEVEMENTS:
- Various certifications in AI, Data Science, and Web Development
- Active participant in tech communities
- Continuous learner with focus on emerging technologies
`;

// --- GLOBAL VARIABLES ---
const chatbox = document.getElementById("chatbox");
let chatHistory = [];

// === FUNCTION TO CALL GEMINI API ===
async function askGemini(question) {
    const headers = {
        "Content-Type": "application/json"
    };

    // Simplified prompt - less restrictive
    const systemInstruction = {
        parts: [{
            text: `You are Sameer's portfolio chatbot. Answer questions about Sameer based on the information provided. Be helpful and professional. If you don't have specific information, acknowledge it politely and suggest what you can help with.

ABOUT SAMEER:
${sameerFacts}`
        }]
    };
    
    // Create the payload
    const payload = {
        contents: [{
            role: "user",  
            parts: [{
                text: `${systemInstruction.parts[0].text}\n\nUser Question: ${question}`
            }]
        }]
    };

    try {
        console.log('Sending request to Gemini API...'); // Debug log
        
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        console.log('Response status:', response.status); // Debug log

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        console.log('API Response:', data); // Debug log
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid response structure from API');
        }

        const reply = data.candidates[0].content.parts[0].text;
        
        // Update chat history
        chatHistory.push({ role: "user", parts: [{ text: question }] });
        chatHistory.push({ role: "model", parts: [{ text: reply }] });

        return reply;

    } catch (error) {
        console.error('Detailed Error:', error); // Better error logging
        
        // More specific error messages
        if (error.message.includes('401')) {
            return "API key issue detected. Please check the API configuration.";
        } else if (error.message.includes('403')) {
            return "API access forbidden. Please verify API permissions.";
        } else if (error.message.includes('429')) {
            return "API rate limit exceeded. Please try again in a moment.";
        } else {
            return `I'm having trouble connecting (${error.message}). Please try asking about Sameer's projects, skills, education, or experience!`;
        }
    }
}

// === TEXT-TO-SPEECH FUNCTION ===
function speak(text) {
    // Make speech optional and faster for interview demo
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.2; // Slightly faster
        utterance.pitch = 1;
        utterance.volume = 0.8; // Slightly quieter
        speechSynthesis.speak(utterance);
    }
}

// === INITIALIZE AFTER DOM LOAD ===
document.addEventListener("DOMContentLoaded", () => {
    const chatFloatBtn = document.getElementById("chat-float-btn");
    const chatSection = document.getElementById("chat");

    // Scroll to Chat section on floating button click
    if (chatFloatBtn && chatSection) {
        // Initialize floating button position
        updateFloatingButtonPosition();

        // Add click handler
        chatFloatBtn.addEventListener("click", () => {
            chatSection.scrollIntoView({ behavior: "smooth" });
        });

        // Handle scroll events for floating button position
        window.addEventListener("scroll", updateFloatingButtonPosition);
        window.addEventListener("resize", updateFloatingButtonPosition);
    }

    function updateFloatingButtonPosition() {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        
        if (isMobile) {
            // Fixed position for mobile
            chatFloatBtn.style.position = 'fixed';
            chatFloatBtn.style.bottom = '20px';
            chatFloatBtn.style.right = '20px';
            chatFloatBtn.style.top = 'auto';
            chatFloatBtn.style.left = 'auto';
        } else {
            // Dynamic position for desktop
            const sections = ["#about", "#projects", "#certifications", "#skills", "#internships", "#chat", "#contact"];
            const currentSection = sections.find(id => {
                const el = document.querySelector(id);
                if (!el) return false;
                const rect = el.getBoundingClientRect();
                return rect.top <= window.innerHeight/2 && rect.bottom >= window.innerHeight/2;
            });

            if (currentSection) {
                const index = sections.indexOf(currentSection);
                const align = index % 2 === 0 ? "right" : "left";
                const el = document.querySelector(currentSection);
                const rect = el.getBoundingClientRect();
                const topY = window.scrollY + rect.top + rect.height/2;
                
                chatFloatBtn.style.position = 'absolute';
                chatFloatBtn.style.top = `${topY}px`;
                chatFloatBtn.style.left = align === "left" ? "5%" : "90%";
                chatFloatBtn.classList.add("animate");
                setTimeout(() => chatFloatBtn.classList.remove("animate"), 500);
            }
        }
    }

    // Support sending a message on ENTER key press
    const userInput = document.getElementById("userInput");
    if (userInput) {
        userInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    // Add some demo questions for the interview
    addDemoQuestions();
});

// === ADD DEMO QUESTIONS FOR INTERVIEW ===
function addDemoQuestions() {
    const chatSection = document.getElementById("chat");
    if (chatSection && !document.getElementById("demo-questions")) {
        const demoDiv = document.createElement("div");
        demoDiv.id = "demo-questions";
        demoDiv.innerHTML = `
            <div style="margin: 10px 0; padding: 10px; background: #f0f0f0; border-radius: 5px;">
                <strong>Try asking:</strong><br>
                <button onclick="askDemo('Tell me about Sameer\'s projects')" style="margin: 2px; padding: 5px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">Projects</button>
                <button onclick="askDemo('What are Sameer\'s technical skills?')" style="margin: 2px; padding: 5px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">Skills</button>
                <button onclick="askDemo('What internships has Sameer completed?')" style="margin: 2px; padding: 5px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">Experience</button>
            </div>
        `;
        chatSection.insertBefore(demoDiv, chatSection.firstChild);
    }
}

// === DEMO QUESTION FUNCTION ===
function askDemo(question) {
    const userInput = document.getElementById("userInput");
    if (userInput) {
        userInput.value = question;
        sendMessage();
    }
}

// === FUNCTION TO SEND MESSAGE TO THE CHATBOX ===
async function sendMessage() {
    const inputElem = document.getElementById("userInput");
    const chatFloatBtn = document.getElementById("chat-float-btn");
    const userMessage = inputElem.value.trim();
    if (!userMessage) return;

    // Display user message
    if (chatbox) {
        chatbox.innerHTML += `<div style="margin: 5px 0; padding: 5px; background: #e3f2fd; border-radius: 5px;"><strong>You:</strong> ${userMessage}</div>`;
        inputElem.value = '';

        // Display bot typing animation
        chatbox.innerHTML += `
            <div id="typing-indicator" class="typing-indicator" style="margin: 5px 0; padding: 5px; background: #f5f5f5; border-radius: 5px;">
                <strong>Bot is typing</strong>
                <span>.</span><span>.</span><span>.</span>
            </div>
        `;
        
        if (chatFloatBtn) chatFloatBtn.classList.add("talking");
        chatbox.scrollTop = chatbox.scrollHeight;

        // Get response from Gemini API
        try {
            const reply = await askGemini(userMessage);
            
            // Remove typing animation and display reply
            const typingIndicator = document.getElementById("typing-indicator");
            if (typingIndicator) typingIndicator.remove();
            
            chatbox.innerHTML += `<div style="margin: 5px 0; padding: 5px; background: #e8f5e8; border-radius: 5px;"><strong>Bot:</strong> ${reply}</div>`;
            if (chatFloatBtn) chatFloatBtn.classList.remove("talking");
            chatbox.scrollTop = chatbox.scrollHeight;
            
            // Optional speech - comment out if not needed for interview
            // speak(reply);
            
        } catch (error) {
            // Handle error case
            const typingIndicator = document.getElementById("typing-indicator");
            if (typingIndicator) typingIndicator.remove();
            
            const errorMessage = "I'm experiencing some technical difficulties. Let me try to help you with information about Sameer's background, projects, or skills!";
            chatbox.innerHTML += `<div style="margin: 5px 0; padding: 5px; background: #ffe8e8; border-radius: 5px;"><strong>Bot:</strong> ${errorMessage}</div>`;
            if (chatFloatBtn) chatFloatBtn.classList.remove("talking");
            chatbox.scrollTop = chatbox.scrollHeight;
            
            console.error('SendMessage Error:', error);
        }
    }
}