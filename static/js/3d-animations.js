// === 3D PORTFOLIO ANIMATIONS ===

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const initFns = [
        initializeAnimations,
        initializeParticles,
        initializeScrollAnimations,
        initializeNavigation,
        initializeSkillBars,
        initializeTypingEffect,
        initializeCursorEffects,
        initializeAdvancedEffects,
        initializeScrollProgress,
        initializeChatBot,
        () => { if (typeof AOS !== 'undefined') AOS.init({ duration: 1000, once: true }); }
    ];
    initFns.forEach(fn => { try { fn && fn(); } catch (e) {} });
});

// === 3D Background Animation ===
function initializeAnimations() {
    // Create animated background
    createAnimatedBackground();
    
    // Initialize floating elements
    initializeFloatingElements();
    
    // Add mouse parallax effect
    addParallaxEffect();
}

function createAnimatedBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 40;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 255, 255, ${particle.opacity})`;
            ctx.fill();
            
            // Draw connections
            particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(0, 255, 255, ${0.1 * (1 - distance / 100)})`;
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// === Particle System ===
function initializeParticles() {
    const particles = document.querySelectorAll('.particle');
    
    
    particles.forEach((particle, index) => {
        // Add random movement
        const moveParticle = () => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const duration = 3000 + Math.random() * 2000;
            
            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.transition = `transform ${duration}ms ease-in-out`;
            
            setTimeout(moveParticle, duration);
        };
        
        // Start with delay
        setTimeout(moveParticle, index * 500);
    });
}

// === Scroll Animations ===
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Trigger skill bar animations
                if (entry.target.classList.contains('skills-3d')) {
                    animateSkillBars();
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('.section-3d').forEach(section => {
        section.classList.add('animate-on-scroll');
        observer.observe(section);
    });
}



// === Skill Bars Animation ===
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const percentage = bar.getAttribute('data-percentage') || '0';
        bar.style.width = '0%';
    });
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        const percentage = bar.getAttribute('data-percentage') || '0';
        
        setTimeout(() => {
            bar.style.width = percentage + '%';
        }, index * 200);
    });
}

// === Typing Effect ===
function initializeTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const texts = [
        'AI & Data Science Developer',
        'Flask & Streamlit Expert',
        'Machine Learning Engineer',
        'Creative Problem Solver'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500; // Pause before next text
        }
        
        setTimeout(typeText, typeSpeed);
    }
    
    typeText();
}

// === Parallax Effect ===
function addParallaxEffect() {
    let mouseX = 0;
    let mouseY = 0;

    // Mouse effects only
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;

        applyParallaxEffects(mouseX, mouseY);
    });
}

function applyParallaxEffects(x, y) {
    const intensity = 5;
        
        // Apply parallax to floating cube
        const cube = document.querySelector('.floating-cube');
        if (cube) {
            const rotateX = y * intensity;
            const rotateY = x * intensity;
            cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
        
        // Apply parallax to profile image
        const profileCard = document.querySelector('.profile-card');
        if (profileCard) {
            const rotateX = y * (intensity * 0.6);
            const rotateY = x * (intensity * 0.6);
            profileCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
    }


// === Floating Elements ===
function initializeFloatingElements() {
    const floatingElements = document.querySelectorAll('#whatsapp-float, #chat-float-btn');
    floatingElements.forEach((element, index) => {
        element.style.animation = `float 3s ease-in-out infinite ${index * 0.5}s`;
    });
}

// === Mobile Navigation & Drawer ===
function initializeNavigation() {
    const body = document.body;
    const nav = document.querySelector('.navbar-3d');
    const navToggle = document.querySelector('.nav-toggle');
    const desktopMenu = document.querySelector('.nav-menu-3d');

    if (!nav || !navToggle || !desktopMenu) {
        console.warn('Navigation elements missing.');
        return;
    }

    // Hamburger menu toggle
    navToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        navToggle.classList.toggle('active');
        desktopMenu.classList.toggle('active');
        body.classList.toggle('nav-open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !desktopMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            desktopMenu.classList.remove('active');
            body.classList.remove('nav-open');
        }
    });

    // Navigation link click: smooth scroll
    desktopMenu.querySelectorAll('.nav-link-3d').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) {
                console.warn('Navigation link missing or invalid href:', targetId);
                return;
            }
            const targetSection = document.querySelector(targetId);
            if (!targetSection) {
                console.warn('Target section not found:', targetId);
                return;
            }
            navToggle.classList.remove('active');
            desktopMenu.classList.remove('active');
            body.classList.remove('nav-open');
            setTimeout(() => {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 300);
        });
    });

    let startX = 0;
    let currentX = 0;
    let isSwiping = false;

    function openDrawer() {
        navToggle.classList.add('active');
        drawer.classList.add('open');
        backdrop.classList.add('visible');
        body.classList.add('nav-open');
        navToggle.setAttribute('aria-expanded', 'true');
    }

    function closeDrawer() {
        navToggle.classList.remove('active');
        drawer.classList.remove('open');
        backdrop.classList.remove('visible');
        body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        drawer.style.transform = '';
    }

    navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (drawer.classList.contains('open')) closeDrawer(); else openDrawer();
    });

    backdrop.addEventListener('click', closeDrawer);

    clonedMenu.querySelectorAll('.nav-link-3d').forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            closeDrawer();
        });
    });

    drawer.addEventListener('touchstart', (e) => {
        if (!drawer.classList.contains('open')) return;
        startX = e.touches[0].clientX;
        currentX = startX;
        isSwiping = true;
        drawer.style.transition = 'none';
    }, { passive: true });

    drawer.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;
        if (deltaX < 0) {
            drawer.style.transform = `translateX(${deltaX}px)`;
        }
    }, { passive: true });

    drawer.addEventListener('touchend', () => {
        if (!isSwiping) return;
        const deltaX = currentX - startX;
        drawer.style.transition = '';
        drawer.style.transform = '';
        isSwiping = false;
        if (deltaX < -60) closeDrawer();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
    });
}

// === GROQ API CONFIGURATION ===
const GROQ_API_KEY = "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"; // Replace with your actual Groq API key
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

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


// === Enhanced Chat Bot with Voice Features & Groq API ===
function initializeChatBot() {
    let isVoiceEnabled = true;
    let recognition = null;
    let synthesis = window.speechSynthesis;
    
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        try {
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
            recognition.maxAlternatives = 1;
            
            console.log('Speech recognition initialized successfully');
        } catch (error) {
            console.error('Failed to initialize speech recognition:', error);
            recognition = null;
        }
    } else {
        console.log('Speech recognition not supported in this browser');
    }

    const chatButton = document.querySelector('.chat-button');
    const userInput = document.getElementById('userInput');
    const chatbox = document.getElementById('chatbox');
    const voiceInputBtn = document.getElementById('voice-input-btn');
    const voiceToggleBtn = document.getElementById('voice-toggle-btn');
    const voiceStatus = document.getElementById('voice-status');
    const voiceDebug = document.getElementById('voice-debug');
    const chatFloatBtn = document.getElementById('chat-float-btn');
    
    // Show debug info
    if (voiceDebug) {
        if (recognition) {
            voiceDebug.textContent = '✅ Voice recognition available - Click microphone to test';
        } else {
            voiceDebug.textContent = '❌ Voice recognition not available in this browser';
        }
    }
    
    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    // Also add click listener to chat button
    if (chatButton) {
        chatButton.addEventListener('click', (e) => {
            e.preventDefault();
            sendMessage();
        });
    }

    if (voiceInputBtn) {
        voiceInputBtn.addEventListener('click', function() {
            console.log('Voice input button clicked');
            if (voiceDebug) {
                voiceDebug.textContent = '🔄 Voice input button clicked...';
            }
            startVoiceInput();
        });
    }

    if (voiceToggleBtn) {
        voiceToggleBtn.addEventListener('click', toggleVoiceResponse);
    }

    // === FUNCTION TO CALL GROQ API ===
    window.askGemini = async function(question) {
        console.log('askGemini called with question:', question);

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`
        };

        const prompt = `You are Laddu, Sameer's friendly AI assistant for his personal portfolio website. You should act as Sameer's enthusiastic and professional assistant, answering questions about him with personality and charm.

Use only the facts below to answer questions. If someone asks something not covered in the facts, politely redirect them to ask about Sameer's skills, projects, education, or experience.

Keep responses conversational, helpful, and professional. Always refer to Sameer in third person. Keep responses concise but informative.

FACTS ABOUT SAMEER:
${sameerFacts}

Question: ${question}
Answer:`;

        const payload = {
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: prompt
                },
                {
                    role: "user",
                    content: question
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        };

        console.log('Making API request to:', GROQ_API_URL);
        console.log('Payload:', payload);

        try {
            const response = await fetch(GROQ_API_URL, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            console.log('API response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data = await response.json();
            console.log('API response data:', data);

            if (data.choices && data.choices[0] && data.choices[0].message) {
                return data.choices[0].message.content;
            } else {
                console.error('Unexpected API response structure:', data);
                throw new Error('Unexpected API response structure');
            }
        } catch (error) {
            console.error('Error calling Groq API:', error);

            // Fallback to simple responses if API fails
            return getSimpleResponse(question);
        }
    }
    
    // === FALLBACK SIMPLE RESPONSES ===
    function getSimpleResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return "Hello! I'm Sameer's AI assistant. I can tell you about his skills, projects, internships, and experience. What would you like to know?";
        }
        
        if (lowerMessage.includes('skill')) {
            return "Sameer is skilled in Python, JavaScript, Machine Learning, Data Science, Flask, Streamlit, OpenCV, and Computer Vision. He's also experienced with MySQL, Power BI, and various AI/ML frameworks.";
        }
        
        if (lowerMessage.includes('project')) {
            return "Sameer has worked on several exciting projects: 1) Facial Recognition System using OpenCV, 2) Disease Prediction App with ML, 3) Personal Portfolio Website, 4) IoT Gas Leak Detection System, and 5) AutoFeel Car Sentiment Analyzer.";
        }
        
        if (lowerMessage.includes('internship') || lowerMessage.includes('experience')) {
            return "Sameer has completed 4 internships: AI Intern at TechSaksham Edunet Foundation, Data Science Intern at SkillDzire Technologies, AI Intern at Skillbit Technologies, and Data Analytics Intern at APSCHE x SmartBridge.";
        }
        
        if (lowerMessage.includes('education')) {
            return "Sameer is pursuing B.Tech in AI & Data Science from Aditya College of Engineering (2021-2026). He completed his intermediate in Maths, Physics, Chemistry at Vidyanikethan Junior College.";
        }
        
        if (lowerMessage.includes('contact')) {
            return "You can reach Sameer at shaiksameershubhan@gmail.com or connect with him on LinkedIn: https://www.linkedin.com/in/shaik-sameer-69a3422a8";
        }
        
        return "I'm Sameer's AI assistant! I can help you learn about his skills, projects, internships, education, and experience. Feel free to ask me anything about his background!";
    }



    function startVoiceInput() {
        if (!recognition) {
            showVoiceStatus('Voice input not supported in this browser. Please use Chrome or Edge.');
            return;
        }

        try {
            voiceInputBtn.classList.add('listening');
            showVoiceStatus('🎤 Listening... Speak now!');

            recognition.start();

            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                userInput.value = transcript;
                voiceInputBtn.classList.remove('listening');
                showVoiceStatus('✅ Voice input received: "' + transcript + '"');
                
                // Auto-send the message
                setTimeout(() => {
                    sendMessage();
                }, 1000);
            };

            recognition.onerror = function(event) {
                voiceInputBtn.classList.remove('listening');
                console.error('Speech recognition error:', event.error);
                
                let errorMessage = 'Voice input error. ';
                switch(event.error) {
                    case 'no-speech':
                        errorMessage += 'No speech detected. Please try again.';
                        break;
                    case 'audio-capture':
                        errorMessage += 'Microphone not found. Please check your microphone.';
                        break;
                    case 'not-allowed':
                        errorMessage += 'Microphone permission denied. Please allow microphone access.';
                        break;
                    case 'network':
                        errorMessage += 'Network error. Please check your connection.';
                        break;
                    default:
                        errorMessage += 'Please try again.';
                }
                
                showVoiceStatus('❌ ' + errorMessage);
            };

            recognition.onend = function() {
                voiceInputBtn.classList.remove('listening');
            };

            recognition.onnomatch = function() {
                voiceInputBtn.classList.remove('listening');
                showVoiceStatus('❌ No speech recognized. Please try again.');
            };

        } catch (error) {
            voiceInputBtn.classList.remove('listening');
            showVoiceStatus('❌ Voice input error: ' + error.message);
            console.error('Voice input error:', error);
        }
    }

    function toggleVoiceResponse() {
        isVoiceEnabled = !isVoiceEnabled;
        const icon = voiceToggleBtn.querySelector('i');
        const label = voiceToggleBtn.querySelector('.button-label');
        
        if (isVoiceEnabled) {
            icon.className = 'fas fa-volume-up';
            voiceToggleBtn.style.background = 'linear-gradient(135deg, #ff9500 0%, #ff7700 100%)';
            voiceToggleBtn.style.borderColor = '#ff9500';
            if (label) label.textContent = 'Voice';
            showVoiceStatus('🔊 Voice responses enabled');
        } else {
            icon.className = 'fas fa-volume-mute';
            voiceToggleBtn.style.background = 'linear-gradient(135deg, #666 0%, #444 100%)';
            voiceToggleBtn.style.borderColor = '#666';
            if (label) label.textContent = 'Muted';
            showVoiceStatus('🔇 Voice responses disabled');
        }
    }

    function showVoiceStatus(message) {
        if (voiceStatus) {
            voiceStatus.textContent = message;
            voiceStatus.classList.add('show');
            
            setTimeout(() => {
                voiceStatus.classList.remove('show');
            }, 3000);
        }
    }

    function speakResponse(text) {
        if (!isVoiceEnabled || !synthesis) return;

        // Cancel any ongoing speech
        synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1.1;
        utterance.volume = 1;
        
        // Try to use a female voice
        const voices = synthesis.getVoices();
        const femaleVoice = voices.find(voice => 
            voice.name.includes('Female') || 
            voice.name.includes('Samantha') || 
            voice.name.includes('Karen') ||
            voice.name.includes('Moira') ||
            voice.name.includes('Zira')
        );
        
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }

        synthesis.speak(utterance);
    }

    // === ENHANCED SEND MESSAGE FUNCTION ===
    window.sendMessage = async function() {
        console.log('sendMessage function called');
        
        const inputElem = document.getElementById("userInput");
        const chatbox = document.getElementById("chatbox");
        const sendButton = document.querySelector('.chat-button');
        
        console.log('Elements found:', {
            inputElem: !!inputElem,
            chatbox: !!chatbox,
            sendButton: !!sendButton
        });
        
        if (!inputElem || !chatbox) {
            console.error('Required elements not found');
            alert('Chat elements not found. Please refresh the page.');
            return;
        }
        
        const userMessage = inputElem.value.trim();
        console.log('User message:', userMessage);
        
        if (!userMessage) {
            alert('Please enter a message');
            return;
        }

        // Disable send button during processing
        if (sendButton) {
            sendButton.disabled = true;
            sendButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }

        // Display user message
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'message user';
        userMessageDiv.innerHTML = `<strong>You:</strong> ${userMessage}<div class="message-time">${new Date().toLocaleTimeString()}</div>`;
        chatbox.appendChild(userMessageDiv);
        inputElem.value = '';

        // Display bot typing animation
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = `
            <strong>🤖 AI Sameer is thinking with Gemini AI...</strong>
            <span></span><span></span><span></span>
        `;
        chatbox.appendChild(typingDiv);
        
        if (chatFloatBtn) chatFloatBtn.classList.add("talking");
        chatbox.scrollTop = chatbox.scrollHeight;

        // Get response from Gemini API
        try {
            console.log('Calling Gemini API...');
            const reply = await askGemini(userMessage);
            console.log('Gemini response:', reply);
            
            // Remove typing animation
            const typingIndicator = document.getElementById("typing-indicator");
            if (typingIndicator) typingIndicator.remove();
            
            // Display reply
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'message bot';
            botMessageDiv.innerHTML = `<strong>🤖 Laddu:</strong> ${reply}<div class="message-time">${new Date().toLocaleTimeString()}</div>`;
            chatbox.appendChild(botMessageDiv);
            
            if (chatFloatBtn) chatFloatBtn.classList.remove("talking");
            chatbox.scrollTop = chatbox.scrollHeight;
            speakResponse(reply);
        } catch (error) {
            console.error('Error in sendMessage:', error);
            
            // Handle error case
            const typingIndicator = document.getElementById("typing-indicator");
            if (typingIndicator) typingIndicator.remove();
            
            const errorMessage = "I'm sorry, I'm having trouble connecting to Gemini AI right now. Please try asking about Sameer's projects, skills, education, or experience!";
            const errorDiv = document.createElement('div');
            errorDiv.className = 'message bot';
            errorDiv.innerHTML = `<strong>🤖 Laddu:</strong> ${errorMessage}<div class="message-time">${new Date().toLocaleTimeString()}</div>`;
            chatbox.appendChild(errorDiv);
            
            if (chatFloatBtn) chatFloatBtn.classList.remove("talking");
            chatbox.scrollTop = chatbox.scrollHeight;
            speakResponse(errorMessage);
        } finally {
            // Re-enable send button
            if (sendButton) {
                sendButton.disabled = false;
                sendButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send';
            }
        }
    };

    // Load voices when available
    if (synthesis) {
        synthesis.onvoiceschanged = function() {
            // Voices are now loaded
        };
    }
    
    // === TEST FUNCTION ===
    window.testChatbot = function() {
        console.log('Test chatbot function called');
        const userInput = document.getElementById('userInput');
        if (userInput) {
            userInput.value = 'Hello, what are your skills?';
            sendMessage();
        } else {
            alert('User input not found!');
        }
    };
}


// === Form Enhancements ===
document.addEventListener('DOMContentLoaded', function() {
    // Enhanced form validation
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            input.addEventListener('input', function() {
                if (this.value) {
                    this.parentElement.classList.add('has-value');
                } else {
                    this.parentElement.classList.remove('has-value');
                }
            });
        });
    });
});

// === Loading Animation ===
window.addEventListener('load', function() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
        }, 1000);
    }
});

// === Utility Functions ===
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// === Performance Optimizations ===
const debouncedResize = debounce(() => {
    // Handle resize events
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}, 250);

window.addEventListener('resize', debouncedResize);

// === Accessibility Enhancements ===
document.addEventListener('keydown', function(e) {
    // Add keyboard navigation support
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// === Additional 3D Effects ===
function add3DCardEffects() {
    const cards = document.querySelectorAll('.skill-card-3d, .contact-card-3d, .project-card-3d');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
}

// Initialize 3D card effects
document.addEventListener('DOMContentLoaded', add3DCardEffects);

// === Cursor Trail Effects ===
function initializeCursorEffects() {
    
    const cursor = document.createElement('div');
    cursor.className = 'cursor-trail';
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);
    
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });
    
    // Mouse-only handlers
    
    // Touch ripple effect function
    function createTouchRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            left: ${x - 25}px;
            top: ${y - 25}px;
            width: 50px;
            height: 50px;
            border: 2px solid var(--primary-cyan);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9997;
            animation: touchRipple 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Add cursor styles
    const cursorStyles = `
        .cursor-trail {
            position: fixed;
            width: 30px;
            height: 30px;
            background: radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            transform: translate(-50%, -50%);
            transition: width 0.3s ease, height 0.3s ease;
        }
        
        .cursor-dot {
            position: fixed;
            width: 8px;
            height: 8px;
            background: var(--primary-cyan);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 10px var(--primary-cyan);
        }
        
        .cursor-trail.hover {
            width: 50px;
            height: 50px;
            background: radial-gradient(circle, rgba(0, 255, 255, 0.5) 0%, transparent 70%);
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = cursorStyles;
    document.head.appendChild(styleSheet);
    
    // Add hover effects
    const interactiveElements = document.querySelectorAll('a, button, .nav-link-3d, .project-card-3d, .skill-card-3d');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
}

// === Advanced 3D Effects ===
function initializeAdvancedEffects() {
    // Desktop mouse effects only: magnetic and tilt
    const magneticElements = document.querySelectorAll('.project-link, .contact-card-3d, .form-button-3d');

    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            element.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px) scale(1.02)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0px, 0px) scale(1)';
        });
    });

    const tiltElements = document.querySelectorAll('.project-card-3d, .skill-card-3d, .cert-card-3d');
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });

    // Add ripple effect
    const rippleElements = document.querySelectorAll('button, .nav-link-3d');

    rippleElements.forEach(element => {
        element.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, transparent 70%);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            element.style.position = 'relative';
            element.style.overflow = 'hidden';
            element.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple animation
    const rippleStyles = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;

    const rippleStyleSheet = document.createElement('style');
    rippleStyleSheet.textContent = rippleStyles;
    document.head.appendChild(rippleStyleSheet);
}

// === Scroll Progress Indicator ===
function initializeScrollProgress() {
    const progressBar = document.querySelector('.progress-bar');
    
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// === Enhanced Floating Elements Animation ===
function enhanceFloatingElements() {
    // Add more dynamic movement to floating elements (mouse-only)
    const floatingElements = document.querySelectorAll('.floating-cube, .profile-card');

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;

        floatingElements.forEach((element, index) => {
            const intensity = (index + 1) * 2;
            const rotateX = mouseY * intensity;
            const rotateY = mouseX * intensity;

            element.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    });
}


// Initialize enhanced floating elements only for desktop/laptop
if (!('ontouchstart' in window)) {
    document.addEventListener('DOMContentLoaded', enhanceFloatingElements);
}

// === Particle Explosion Effect ===
function createParticleExplosion(x, y) {
    const container = document.getElementById('particle-explosion');
    if (!container) return;
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'explosion-particle';
        
        const angle = (Math.PI * 2 * i) / 15;
        const velocity = 100 + Math.random() * 50;
        const size = 4 + Math.random() * 4;
        
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: var(--primary-cyan);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            box-shadow: 0 0 10px var(--primary-cyan);
        `;
        
        container.appendChild(particle);
        
        // Animate particle
        const deltaX = Math.cos(angle) * velocity;
        const deltaY = Math.sin(angle) * velocity;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${deltaX}px, ${deltaY}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            particle.remove();
        };
    }
}

// Add explosion effect to buttons
document.addEventListener('DOMContentLoaded', function() {
    const explosiveElements = document.querySelectorAll('.project-link, .cert-link, .contact-card-3d, .form-button-3d');
    
    explosiveElements.forEach(element => {
        element.addEventListener('click', (e) => {
            const rect = element.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            createParticleExplosion(x, y);
        });
    });
});

// === Cursor Particle Trail ===
function initializeCursorParticles() {
    
    const container = document.getElementById('cursor-particles');
    if (!container) return;
    
    document.addEventListener('mousemove', (e) => {
        // Create new particle
        if (Math.random() < 0.2) {
            createCursorParticle(e.clientX, e.clientY);
        }
    });
    
    function createCursorParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'cursor-particle';
        
        const size = Math.random() * 4 + 2;
        const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            box-shadow: 0 0 10px ${color};
        `;
        
        container.appendChild(particle);
        
        // Animate particle
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 30 + 10;
        const deltaX = Math.cos(angle) * velocity;
        const deltaY = Math.sin(angle) * velocity;
        
        particle.animate([
            { 
                transform: 'translate(0, 0) scale(1)', 
                opacity: 0.8 
            },
            { 
                transform: `translate(${deltaX}px, ${deltaY}px) scale(0)`, 
                opacity: 0 
            }
        ], {
            duration: 1500,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            particle.remove();
        };
    }
}
// Hide loading overlay when all content is fully loaded
function hideLoadingScreen() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
        console.log('All content loaded - hiding loading overlay');
    }
}

// Check if all critical resources are loaded
function checkResourcesLoaded() {
    const images = document.querySelectorAll('img');
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    
    let allImagesLoaded = true;
    let allStylesheetsLoaded = true;
    
    // Check if all images are loaded
    images.forEach(img => {
        if (!img.complete || img.naturalHeight === 0) {
            allImagesLoaded = false;
        }
    });
    
    // Check if all stylesheets are loaded
    stylesheets.forEach(link => {
        if (!link.sheet) {
            allStylesheetsLoaded = false;
        }
    });
    
    return allImagesLoaded && allStylesheetsLoaded;
}

// Wait for all resources to load (images, stylesheets, scripts, etc.)
window.addEventListener('load', function() {
    console.log('Window load event fired');
    
    // Double-check that critical resources are loaded
    if (checkResourcesLoaded()) {
        setTimeout(hideLoadingScreen, 300); // Small delay for smooth transition
    } else {
        // If some resources aren't loaded, wait a bit more
        setTimeout(() => {
            hideLoadingScreen();
            console.log('Loading screen hidden after additional wait');
        }, 1000);
    }
});

// Fallback: Hide after 8 seconds if something goes wrong
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay && !loadingOverlay.classList.contains('hidden')) {
            loadingOverlay.classList.add('hidden');
            console.log('Fallback: Force hiding loading overlay after 8 seconds');
        }
    }, 8000); // 8 seconds fallback
});


// Initialize cursor particles
document.addEventListener('DOMContentLoaded', initializeCursorParticles);

// === Navigation Functionality ===
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu-3d');
    const navLinks = document.querySelectorAll('.nav-link-3d');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}











function updateScrollProgress() {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;
    
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    progressBar.style.width = scrollPercent + '%';
}



// Set initial viewport height

// Update on resize and orientation change
window.addEventListener('orientationchange', () => {
});

// === Performance Optimizations ===
function initializePerformanceOptimizations() {
    // Use Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger skill bar animations when skills section is visible
                if (entry.target.id === 'skills') {
                    animateSkillBars();
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('.section-3d');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', initializePerformanceOptimizations);

// === MOUSE-FOLLOWING PROJECT CARDS ===
function initializeMouseFollowingCards() {
    const projectCards = document.querySelectorAll('.project-card-3d');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -10;
            const rotateY = (x - centerX) / centerX * 10;
            
            card.style.transform = `translateY(-8px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1) rotateX(0deg) rotateY(0deg)';
        });
    });
}

// Initialize mouse-following cards
document.addEventListener('DOMContentLoaded', initializeMouseFollowingCards);