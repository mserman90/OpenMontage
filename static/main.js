document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const promptInput = document.getElementById('promptInput');
  const generateBtn = document.getElementById('generateBtn');
  const pipelinePills = document.querySelectorAll('.pill-option');
  const promptChips = document.querySelectorAll('.prompt-chip');
  const terminalConsole = document.getElementById('terminalConsole');
  const sceneFilmstrip = document.getElementById('sceneFilmstrip');
  const galleryGrid = document.getElementById('galleryGrid');
  const projectTitleBadge = document.getElementById('projectTitleBadge');
  const narrationPlayer = document.getElementById('narrationPlayer');

  let currentPipeline = 'explainer';
  let isGenerating = false;

  function log(msg, type = 'info') {
    if (!terminalConsole) return;
    const time = new Date().toLocaleTimeString();
    const line = document.createElement('div');
    const color = type === 'success' ? '#4ade80' : type === 'error' ? '#f87171' : type === 'warn' ? '#fbbf24' : '#a3e635';
    line.innerHTML = `<span style="color:#6b7280">[${time}]</span> <span style="color:${color}">${msg}</span>`;
    terminalConsole.appendChild(line);
    terminalConsole.scrollTop = terminalConsole.scrollHeight;
  }

  // Pipeline selection
  pipelinePills.forEach(pill => {
    pill.addEventListener('click', () => {
      pipelinePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentPipeline = pill.dataset.pipeline;
      log(`Pipeline mode switched to: ${currentPipeline.toUpperCase()}`);
    });
  });

  // Prompt suggestions
  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      promptInput.value = chip.dataset.prompt;
      promptInput.focus();
    });
  });

  // Load rendered video gallery
  async function loadVideos() {
    try {
      const res = await fetch('/api/videos/rendered');
      const videos = await res.json();
      if (!galleryGrid) return;
      
      galleryGrid.innerHTML = '';
      if (!videos || videos.length === 0) {
        galleryGrid.innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1;">No pre-rendered videos found. Use the studio to render demo compositions.</p>';
        return;
      }

      videos.forEach(v => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
          <div class="video-wrapper">
            <span class="video-overlay-badge">1080p • 60fps</span>
            <video src="${v.url}" controls preload="metadata"></video>
          </div>
          <div class="video-info">
            <h3 class="video-title">${v.title}</h3>
            <p class="video-tags">${v.tags}</p>
            <div class="video-card-footer">
              <span>Size: ${v.size_mb} MB</span>
              <button class="pill-option active" style="padding:0.25rem 0.6rem;font-size:0.75rem" onclick="playInStudio('${v.url}', '${v.title}')">Preview in Studio</button>
            </div>
          </div>
        `;
        galleryGrid.appendChild(card);
      });
      log(`Loaded ${videos.length} production video compositions.`, 'success');
    } catch (e) {
      log(`Failed loading gallery: ${e.message}`, 'error');
    }
  }

  window.playInStudio = function(videoUrl, title) {
    const mainPlayer = document.getElementById('mainStudioVideo');
    if (mainPlayer) {
      mainPlayer.src = videoUrl;
      mainPlayer.play();
      if (projectTitleBadge) projectTitleBadge.textContent = title;
      const studioSec = document.getElementById('studioSection');
      if (studioSec) studioSec.scrollIntoView({ behavior: 'smooth' });
      log(`Now playing: ${title}`, 'success');
    }
  };

  // Generate Script & Scene Plan using Free AI
  async function generateProduction() {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      alert('Please enter a concept, topic, or script idea.');
      return;
    }

    if (isGenerating) return;
    isGenerating = true;
    generateBtn.disabled = true;
    generateBtn.innerHTML = `
      <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg>
      Directing Production...
    `;

    log(`Initializing agentic video pipeline for: "${prompt}"`);
    log(`Selecting pipeline manifest: pipeline_defs/${currentPipeline}.yaml`);
    log(`Connecting to keyless AI generator (Pollinations / Wikimedia / Piper)...`);

    try {
      const res = await fetch('/api/script/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          pipeline: currentPipeline,
          duration: 60,
          style: 'Cinematic Documentary'
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      log(`Script generated: "${data.title}" (${data.scenes.length} scenes)`, 'success');
      log(`Cost breakdown: ${data.estimated_cost}`);
      if (projectTitleBadge) projectTitleBadge.textContent = `${data.title} (${currentPipeline.toUpperCase()})`;

      // Render Filmstrip scenes
      if (sceneFilmstrip) {
        sceneFilmstrip.innerHTML = '';
        data.scenes.forEach(s => {
          const item = document.createElement('div');
          item.className = 'scene-card-item';
          item.innerHTML = `
            <img class="scene-thumb-img" src="${s.generated_image_url}" alt="Scene ${s.scene_number}" loading="lazy">
            <div class="scene-card-content">
              <div class="scene-card-badge">SCENE ${s.scene_number} • ${s.start_time}s - ${s.end_time}s</div>
              <strong style="display:block;font-size:0.85rem;margin-bottom:0.25rem;">${s.card_text}</strong>
              <p class="scene-narration-preview">${s.narration}</p>
              <div style="margin-top:0.75rem;display:flex;gap:0.4rem;">
                <button class="pill-option" style="padding:0.2rem 0.5rem;font-size:0.7rem;" onclick="speakNarration('${encodeURIComponent(s.narration)}')">🔊 Speak Narration</button>
              </div>
            </div>
          `;
          sceneFilmstrip.appendChild(item);
        });
      }

      // Update Stages
      document.querySelectorAll('.stage-item').forEach(stg => {
        stg.classList.add('completed');
      });

      log(`Production plan complete. Visual art, screenplay cards, and sound direction mounted on living storyboard.`, 'success');

      // Scroll to studio
      const studioSec = document.getElementById('studioSection');
      if (studioSec) studioSec.scrollIntoView({ behavior: 'smooth' });

    } catch (e) {
      log(`Error generating production: ${e.message}`, 'error');
    } finally {
      isGenerating = false;
      generateBtn.disabled = false;
      generateBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        Generate Video Production
      `;
    }
  }

  // Free Web Speech TTS
  window.speakNarration = function(encodedText) {
    const text = decodeURIComponent(encodedText);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
      log(`Synthesizing voiceover: "${text.substring(0, 45)}..."`, 'success');
    } else {
      alert('Web Speech API is not supported in this browser.');
    }
  };

  if (generateBtn) {
    generateBtn.addEventListener('click', generateProduction);
  }

  promptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      generateProduction();
    }
  });

  // Initial load
  loadVideos();
  log("OpenMontage Studio ready. Connected to keyless AI generation engine.", "success");
});
