const chatBox = document.getElementById('chatBox');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const charCount = document.getElementById('charCount');
const sendBtn = document.getElementById('sendBtn');
const promptCards = document.querySelectorAll('.prompt-card');
const refreshPrompts = document.getElementById('refreshPrompts');

// Example prompt sets
const promptSets = [
  [
    "Write a to-do list for a personal project or task",
    "Generate an email to reply to a job offer",
    "Summarise this article or text for me in one paragraph",
    "How does AI work in a technical capacity"
  ],
  [
    "Suggest a healthy meal plan for a week",
    "Explain quantum computing in simple terms",
    "Draft a cover letter for a software engineer",
    "What are the benefits of meditation?"
  ],
  [
    "Translate this sentence to French",
    "Give me tips to improve productivity",
    "Summarize the latest AI trends",
    "How to prepare for a job interview?"
  ]
];

let promptIndex = 0;

// Handle prompt card clicks
promptCards.forEach(card => {
  card.addEventListener('click', () => {
    const prompt = card.getAttribute('data-prompt');
    chatInput.value = prompt;
    chatInput.focus();
    updateCharCount();
  });
});

// Refresh prompt cards
refreshPrompts.addEventListener('click', () => {
  promptIndex = (promptIndex + 1) % promptSets.length;
  const prompts = promptSets[promptIndex];

  promptCards.forEach((card, i) => {
    const icon = card.querySelector('.icon')?.textContent || "💡";
    card.setAttribute('data-prompt', prompts[i]);
    card.innerHTML = `<span class="icon">${icon}</span> ${prompts[i]}`;
  });
});

// Character count update
function updateCharCount() {
  charCount.textContent = `${chatInput.value.length}/1000`;
  sendBtn.disabled = chatInput.value.trim().length === 0;
}
chatInput.addEventListener('input', updateCharCount);

// Submit chat
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userMsg = chatInput.value.trim();
  if (!userMsg) return;

  appendMessage(userMsg, 'user');
  chatInput.value = '';
  updateCharCount();
  sendBtn.disabled = true;

  const loadingMsg = appendMessage("🤖 Thinking...", 'ai', true);

  try {
    const res = await fetch('https://ai-chatbot-backend-ivsw.onrender.com/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMsg })
    });
    const data = await res.json();
    loadingMsg.textContent = data.reply || "🤖 No response received.";
  } catch (err) {
    console.error(err);
    loadingMsg.textContent = "❌ Error talking to AI server.";
  }

  sendBtn.disabled = false;
});

// Append a message to the chat
function appendMessage(text, sender, isLoading = false) {
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;
  msg.textContent = text;
  if (isLoading) msg.classList.add('loading');
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}

// Initial setup
updateCharCount();
