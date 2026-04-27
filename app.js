// State Management
let state = {
    hasCompletedSession: localStorage.getItem('intervux_session_complete') === 'true',
    isListening: false,
    questions: [],
    currentQuestionIndex: 0,
    transcript: "",
    mediaStream: null,
    recognition: null
};

// DOM Elements
const els = {
    setupScreen: document.getElementById('setup-screen'),
    dashboardScreen: document.getElementById('dashboard-screen'),
    paywallOverlay: document.getElementById('paywall-overlay'),
    jdInput: document.getElementById('jd-input'),
    startBtn: document.getElementById('start-btn'),
    userVideo: document.getElementById('user-video'),
    muteBtn: document.getElementById('mute-btn'),
    cameraBtn: document.getElementById('camera-btn'),
    endBtn: document.getElementById('end-session-btn'),
    transcriptContent: document.getElementById('transcript-content'),
    liveTranscriptText: document.getElementById('live-transcript-text'),
    userMessagePending: document.querySelector('.user-message.pending'),
    stars: {
        s: document.getElementById('star-s'),
        t: document.getElementById('star-t'),
        a: document.getElementById('star-a'),
        r: document.getElementById('star-r')
    }
};

// [GOAL-ID: 13, 14] Check Paywall on Load
window.addEventListener('DOMContentLoaded', () => {
    if (state.hasCompletedSession) {
        els.paywallOverlay.classList.remove('hidden');
    }
});

// [GOAL-ID: 1] Generate Questions
function generateQuestions(jd) {
    // Mocking an LLM generation based on JD length/keywords
    const baseQuestions = [
        "Can you tell me about a time you had to lead a cross-functional team through a difficult pivot?",
        "Describe a situation where you had to make a tough decision without having all the data.",
        "Tell me about a time you failed or made a significant mistake. How did you handle it?"
    ];
    
    if (jd.toLowerCase().includes('manager')) {
        baseQuestions[0] = "Describe a time you had to manage underperforming team members.";
    } else if (jd.toLowerCase().includes('data')) {
        baseQuestions[1] = "Tell me about a complex data problem you solved that had a direct business impact.";
    }
    
    return baseQuestions;
}

// [GOAL-ID: 2, 10] Init Webcam
async function initCamera() {
    try {
        state.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        els.userVideo.srcObject = state.mediaStream;
    } catch (err) {
        console.error("Camera access denied or unavailable", err);
        alert("Microphone and Camera access is required for the interview simulation.");
        throw err;
    }
}

// [GOAL-ID: 3] Init Speech Recognition
function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.warn("Speech Recognition API not supported in this browser.");
        els.liveTranscriptText.textContent = "[Speech Recognition not supported in this browser. Please use Chrome/Edge.]";
        return;
    }

    state.recognition = new SpeechRecognition();
    state.recognition.continuous = true;
    state.recognition.interimResults = true;

    state.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        if (interimTranscript) {
            els.userMessagePending.classList.remove('hidden');
            els.liveTranscriptText.textContent = interimTranscript;
        }

        if (finalTranscript) {
            state.transcript += " " + finalTranscript;
            appendUserMessage(finalTranscript);
            els.userMessagePending.classList.add('hidden');
            analyzeSTAR(state.transcript);
        }
    };
    
    state.recognition.start();
    state.isListening = true;
}

// UI Helpers
function appendAIMessage(text) {
    const div = document.createElement('div');
    div.className = 'message ai-message';
    div.innerHTML = `<strong>AI:</strong> ${text}`;
    els.transcriptContent.insertBefore(div, els.userMessagePending);
    scrollToBottom();
}

function appendUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'message user-message';
    div.innerHTML = `<strong>Me:</strong> ${text}`;
    els.transcriptContent.insertBefore(div, els.userMessagePending);
    scrollToBottom();
}

function scrollToBottom() {
    els.transcriptContent.scrollTop = els.transcriptContent.scrollHeight;
}

// [GOAL-ID: 4] STAR Analysis Mock Logic
function analyzeSTAR(text) {
    const lowerText = text.toLowerCase();
    
    // S: Context words
    if (lowerText.includes('was working') || lowerText.includes('context') || lowerText.includes('situation') || lowerText.includes('problem was') || lowerText.length > 50) {
        updateStarUI('s', 80, "Context established.", true);
    }
    
    // T: Task words
    if (lowerText.includes('my goal') || lowerText.includes('tasked with') || lowerText.includes('needed to') || lowerText.includes('responsibility')) {
        updateStarUI('t', 90, "Goal clearly defined.", true);
    }
    
    // A: Action words
    if (lowerText.includes('i decided') || lowerText.includes('i implemented') || lowerText.includes('first i') || lowerText.includes('we developed') || lowerText.includes('created')) {
        updateStarUI('a', 85, "Specific actions identified.", true);
    }
    
    // R: Result words
    if (lowerText.includes('result') || lowerText.includes('outcome') || lowerText.includes('increased') || lowerText.includes('decreased') || lowerText.includes('saved') || lowerText.includes('successfully')) {
        updateStarUI('r', 95, "Measurable outcome provided.", true);
    }
}

function updateStarUI(letter, percent, text, isSuccess) {
    const el = els.stars[letter];
    el.classList.add('active');
    if (isSuccess) el.classList.add('success');
    
    el.querySelector('.fill').style.width = `${percent}%`;
    el.querySelector('.feedback-text').textContent = text;
}

// Event Listeners
els.startBtn.addEventListener('click', async () => {
    if (state.hasCompletedSession) return;
    
    const jd = els.jdInput.value || "";
    state.questions = generateQuestions(jd);
    
    els.startBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Initializing...';
    
    try {
        await initCamera();
        
        // Transition screens
        els.setupScreen.classList.add('hidden');
        els.setupScreen.classList.remove('active');
        els.dashboardScreen.classList.remove('hidden');
        els.dashboardScreen.classList.add('active');
        
        // Clear initial mock transcript
        els.transcriptContent.innerHTML = '';
        els.transcriptContent.appendChild(els.userMessagePending);
        els.userMessagePending.classList.add('hidden');
        
        // Start Interview
        setTimeout(() => {
            appendAIMessage(`Welcome to Intervux. Based on the job description you provided, let's start. ${state.questions[0]}`);
            setTimeout(() => {
                initSpeechRecognition();
            }, 1000);
        }, 1000);
        
    } catch (e) {
        els.startBtn.innerHTML = '<i class="fa-solid fa-video"></i> Start Interview Session';
    }
});

els.muteBtn.addEventListener('click', () => {
    const audioTracks = state.mediaStream.getAudioTracks();
    if (audioTracks.length > 0) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
        els.muteBtn.innerHTML = audioTracks[0].enabled ? 
            '<i class="fa-solid fa-microphone"></i> Mute' : 
            '<i class="fa-solid fa-microphone-slash"></i> Unmute';
        els.muteBtn.style.color = audioTracks[0].enabled ? '' : 'var(--danger)';
    }
});

els.cameraBtn.addEventListener('click', () => {
    const videoTracks = state.mediaStream.getVideoTracks();
    if (videoTracks.length > 0) {
        videoTracks[0].enabled = !videoTracks[0].enabled;
        els.cameraBtn.innerHTML = videoTracks[0].enabled ? 
            '<i class="fa-solid fa-video-slash"></i> Camera Off' : 
            '<i class="fa-solid fa-video"></i> Camera On';
    }
});

// [GOAL-ID: 13] End Session / Free Tier Enforcement
els.endBtn.addEventListener('click', () => {
    if (state.recognition) {
        state.recognition.stop();
    }
    if (state.mediaStream) {
        state.mediaStream.getTracks().forEach(track => track.stop());
    }
    
    localStorage.setItem('intervux_session_complete', 'true');
    state.hasCompletedSession = true;
    
    els.dashboardScreen.classList.add('hidden');
    els.setupScreen.classList.remove('hidden');
    els.paywallOverlay.classList.remove('hidden');
});
