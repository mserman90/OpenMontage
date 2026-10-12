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
  const langToggleBtn = document.getElementById('langToggleBtn');
  const langFlag = document.getElementById('langFlag');
  const langText = document.getElementById('langText');

  let currentPipeline = 'explainer';
  let isGenerating = false;
  let currentLang = localStorage.getItem('openmontage_lang') || 'tr'; // Default to TR as requested

  // Translations Dictionary
  const translations = {
    tr: {
      lang_flag: "🇺🇸",
      lang_text: "EN",
      lang_title: "Switch to English",
      nav_studio: "Stüdyo",
      nav_creations: "Yapımlar",
      nav_philosophy: "Felsefe",
      nav_backlot: "Backlot Panosu",
      nav_github: "GitHub'da Yıldızla",
      nav_launch: "Stüdyoyu Başlat",
      hero_badge: "Açık Kaynak Otonom Video Prodüksiyon Stüdyosu",
      hero_headline: "Fikirleriniz. Onları hayata<br>geçiren koca bir stüdyo.",
      hero_subhead: "Fikirlerinizi eksiksiz sinematik filmlere dönüştürün. İstediğinizi doğal dilinizle anlatın — otonom boru hattımız araştırma, senaryo, görsel üretim, seslendirme ve Remotion kurgusunu yönetsin.",
      input_title: "YÖNETMENE KOMUT VERİN",
      badge_keyless: "✨ Ücretsiz & Keyless AI Modu Aktif",
      prompt_placeholder: "Örn: Kuantum hesaplama ve derin öğrenme hakkında 60 saniyelik animasyonlu bir açıklama videosu hazırla...",
      default_prompt: "İmparatorlukları finanse eden kadim mineral hakkında 60 saniyelik sinematik belgesel: Tuzun Tarihi Nasıl Yazdığı.",
      pipe_explainer: "Açıklayıcı (Explainer)",
      pipe_documentary: "Belgesel (Documentary)",
      pipe_kinetic: "Kinetik Tipografi",
      pipe_showcase: "3D Vitrin (Showcase)",
      pipe_animation: "Animasyon (Pixar)",
      btn_generate: "Video Prodüksiyonunu Başlat",
      starter_label: "Örnek Senaryolar:",
      chip1_text: "Yarından Gelen Sinyal (Bilim Kurgu Fragmanı)",
      chip1_prompt: "YARINDAN GELEN SİNYAL başlıklı, 60 saniyelik sinematik bilim kurgu fragmanı.",
      chip2_text: "Son Muz (Pixar Tarzı Animasyon)",
      chip2_prompt: "Bir kiviyle dostluk kuran yalnız bir muz hakkında 60 saniyelik Pixar tarzı animasyon kısa film.",
      chip3_text: "Aşırı Hızda Nesneler (3D Phonk)",
      chip3_prompt: "Kinetik tipografi eşliğinde yerçekimini büken 10 nesnenin yer aldığı 50 saniyelik müzik odaklı 3D gösterim.",
      chip4_text: "Koddan Ekrana (Yazılımcı Rehberi)",
      chip4_prompt: "Karşılaştırma ve KPI kartları içeren 60 saniyelik yazılımcı iş akışı tanıtım videosu.",
      tab_storyboard: "Film Şeridi (Storyboard)",
      tab_screenplay: "Senaryo (Screenplay)",
      tab_backlot: "Canlı Backlot",
      side_stages_title: "Üretim Boru Hattı Aşamaları",
      stage_1: "✓ 01. Araştırma & Senaryo",
      stage_2: "✓ 02. Sahne Planı & Film Şeridi",
      stage_3: "● 03. Üretken Varlık Derlemesi",
      stage_4: "○ 04. Ses & Müzik Yönetimi",
      stage_5: "○ 05. Remotion Render Motoru",
      side_capabilities_title: "Otonom Yetenekler",
      side_capabilities_desc: "Sıfır API anahtarı gerektirir. Pollinations ile ücretsiz üretken sanat, Web Speech & Piper ile seslendirme, yerel Remotion React yığınıyla yüksek kaliteli render.",
      filmstrip_title: "Prodüksiyon Film Şeridi & Sahne Çekimleri",
      preview_title: "Canlı Remotion Render Önizlemesi",
      console_title: "Yönetmen Aktivite Terminali",
      gallery_headline: "Sıradaki yapımınıza hemen ulaşın",
      gallery_subhead: "Doğrudan kod ve otonom üretim hatları ile üretilen gerçek sinematik renderlar. Manuel montaj programlarına gerek yok.",
      features_headline: "Bir fikirle ya da elinizdeki bir<br>materyalle başlayın.<br><em>Tek bir çalışma alanı. Her adım sizin yönetiminizde.</em>",
      features_subhead: "OpenMontage basit bir API sarmalayıcısı değildir. 12 ayrı üretim hattını, 100'den fazla aracı ve çok noktalı kalite denetimini birleştiren tam teşekküllü bir otonom stüdyodur.",
      card1_title: "Sizin çalışma alanınız. Sizin ajanınız.",
      card1_desc: "Claude Code, Cursor, Copilot, Windsurf ile veya bağımsız bir web iş istasyonu olarak kusursuz çalışır. Her karar şeffaf ve denetlenebilirdir.",
      card2_title: "Önce Açık Kaynak & Ücretsiz",
      card2_desc: "Zorunlu API anahtarı yok. Kutudan çıktığı anda seslendirme, telifsiz arşiv görüntüleri, Pollinations üretken görselleri ve Remotion kurgusu emrinizdedir.",
      card3_title: "Hareketsiz slaytlar değil, gerçek video",
      card3_desc: "Açık arşivlerden ve stok görüntülerden korpus oluşturur, gerçek hareketli klipleri zaman çizgisine yerleştirir, altyazıları senkronize basar.",
      footer_headline: "Ekibe katılın.",
      footer_subhead: "Yapay zeka asistanınızı bugün eksiksiz bir video prodüksiyon stüdyosuna dönüştürün.",
      footer_cta: "Şimdi Yönetmeye Başlayın",
      link_github: "GitHub Deposu",
      link_website: "Resmi Web Sitesi",
      link_backlot: "Backlot Storyboard",
      speak_btn: "🔊 Seslendir"
    },
    en: {
      lang_flag: "🇹🇷",
      lang_text: "TR",
      lang_title: "Türkçe'ye Geç",
      nav_studio: "Studio",
      nav_creations: "Creations",
      nav_philosophy: "Philosophy",
      nav_backlot: "Backlot Board",
      nav_github: "Star on GitHub",
      nav_launch: "Launch Studio",
      hero_badge: "Open-Source Agentic Video Production Studio",
      hero_headline: "Your ideas. A whole<br>studio to make them.",
      hero_subhead: "Turn your ideas into finished films. Describe what you want in plain language — our agentic pipeline handles research, screenplay, visual art, audio direction, and Remotion composition.",
      input_title: "PROMPT THE DIRECTOR",
      badge_keyless: "✨ Free & Keyless AI Mode Enabled",
      prompt_placeholder: "e.g. Make a 60-second animated explainer about quantum computing and neural learning...",
      default_prompt: "A 60-second cinematic documentary about the mineral that funded empires: How Salt Made History.",
      pipe_explainer: "Explainer",
      pipe_documentary: "Documentary",
      pipe_kinetic: "Kinetic Typography",
      pipe_showcase: "3D Showcase",
      pipe_animation: "Pixar Animation",
      btn_generate: "Generate Video Production",
      starter_label: "Starter Prompts:",
      chip1_text: "Signal From Tomorrow (Sci-Fi Trailer)",
      chip1_prompt: "A 60-second cinematic sci-fi trailer titled SIGNAL FROM TOMORROW.",
      chip2_text: "The Last Banana (Animated Short)",
      chip2_prompt: "A 60-second Pixar-style animated short about a lonely banana who finds friendship with a kiwi.",
      chip3_text: "Objects in Overdrive (3D Phonk)",
      chip3_prompt: "A 50-second music-driven showcase of 10 gravity-shifting objects with kinetic typography.",
      chip4_text: "Code to Screen (Dev Explainer)",
      chip4_prompt: "A 60-second developer workflow explainer with comparison and KPI cards.",
      tab_storyboard: "Storyboard",
      tab_screenplay: "Screenplay",
      tab_backlot: "Living Backlot",
      side_stages_title: "Pipeline Stages",
      stage_1: "✓ 01. Research & Script",
      stage_2: "✓ 02. Scene Plan & Storyboard",
      stage_3: "● 03. Generative Asset Assembly",
      stage_4: "○ 04. Voice & Audio Direction",
      stage_5: "○ 05. Remotion Render Engine",
      side_capabilities_title: "Autonomous Capabilities",
      side_capabilities_desc: "Zero API keys required. Free generative art powered by Pollinations, narration via Web Speech & Piper TTS, rendering via local Remotion React stack.",
      filmstrip_title: "Production Filmstrip & Scene Takes",
      preview_title: "Live Remotion Render Preview",
      console_title: "Director Activity Console",
      gallery_headline: "Get to your next creation now",
      gallery_subhead: "Real cinematic renders built entirely from code and agentic pipelines. No manual timeline editing required.",
      features_headline: "Start with an idea or<br>something you already have.<br><em>One workspace. Every step yours to direct.</em>",
      features_subhead: "OpenMontage is not just an API wrapper. It is a full agentic studio combining 12 distinct production pipelines, 100+ tools, and multi-point self-review verification.",
      card1_title: "Your workspace. Your choice of agent.",
      card1_desc: "Works seamlessly with Claude Code, Cursor, Copilot, Windsurf, or as a standalone web workstation. Every pipeline decision is transparent, traceable, and editable.",
      card2_title: "Free & Open-Source First",
      card2_desc: "Zero mandatory API keys. Out of the box, synthesize speech with Piper and Web Speech, generate free art with Pollinations, retrieve public domain footage, and compose with Remotion.",
      card3_title: "Real motion, not still slideshows",
      card3_desc: "Builds a corpus from free stock footage and open archives, edits actual motion clips into the timeline, burns in word-level animated subtitles, and renders via FFmpeg & React Remotion.",
      footer_headline: "Be on the crew.",
      footer_subhead: "Turn your AI coding assistant into a full video production studio today.",
      footer_cta: "Start Directing Now",
      link_github: "GitHub Repository",
      link_website: "Official Website",
      link_backlot: "Backlot Storyboard",
      speak_btn: "🔊 Speak Narration"
    }
  };

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('openmontage_lang', lang);
    const t = translations[lang] || translations.en;

    if (langFlag) langFlag.textContent = t.lang_flag;
    if (langText) langText.textContent = t.lang_text;
    if (langToggleBtn) langToggleBtn.title = t.lang_title;

    // Update text for all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        el.innerHTML = t[key];
      }
    });

    // Update inputs & chips
    if (promptInput) {
      promptInput.placeholder = t.prompt_placeholder;
      if (!promptInput.value || promptInput.value.includes("salt") || promptInput.value.includes("Tuzun")) {
        promptInput.value = t.default_prompt;
      }
    }

    const c1 = document.getElementById('chip1');
    const c2 = document.getElementById('chip2');
    const c3 = document.getElementById('chip3');
    const c4 = document.getElementById('chip4');
    if (c1) { c1.textContent = t.chip1_text; c1.dataset.prompt = t.chip1_prompt; }
    if (c2) { c2.textContent = t.chip2_text; c2.dataset.prompt = t.chip2_prompt; }
    if (c3) { c3.textContent = t.chip3_text; c3.dataset.prompt = t.chip3_prompt; }
    if (c4) { c4.textContent = t.chip4_text; c4.dataset.prompt = t.chip4_prompt; }

    log(lang === 'tr' ? "Arayüz dili Türkçe olarak ayarlandı." : "Interface language set to English.", "info");
  }

  // Toggle Language Handler
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const nextLang = currentLang === 'tr' ? 'en' : 'tr';
      applyLanguage(nextLang);
    });
  }

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
      const t = translations[currentLang];
      log(currentLang === 'tr' 
        ? `Üretim boru hattı seçildi: ${currentPipeline.toUpperCase()}` 
        : `Pipeline mode switched to: ${currentPipeline.toUpperCase()}`);
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
        galleryGrid.innerHTML = `<p style="color:var(--text-muted);grid-column:1/-1;">${currentLang === 'tr' ? 'Render edilmiş video bulunamadı. Stüdyoyu kullanarak demo render başlatabilirsiniz.' : 'No pre-rendered videos found. Use the studio to render demo compositions.'}</p>`;
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
              <button class="pill-option active" style="padding:0.25rem 0.6rem;font-size:0.75rem" onclick="playInStudio('${v.url}', '${v.title}')">${currentLang === 'tr' ? 'Stüdyoda Oynat' : 'Preview in Studio'}</button>
            </div>
          </div>
        `;
        galleryGrid.appendChild(card);
      });
      log(currentLang === 'tr' ? `${videos.length} adet yapım videosu yüklendi.` : `Loaded ${videos.length} production video compositions.`, 'success');
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
      log(currentLang === 'tr' ? `Oynatılıyor: ${title}` : `Now playing: ${title}`, 'success');
    }
  };

  // Generate Script & Scene Plan using Free AI
  async function generateProduction() {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      alert(currentLang === 'tr' ? 'Lütfen bir video fikri veya senaryo konusu girin.' : 'Please enter a concept, topic, or script idea.');
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
      ${currentLang === 'tr' ? 'Yönetmen Kurguluyor...' : 'Directing Production...'}
    `;

    log(currentLang === 'tr' ? `Otonom video hattı başlatılıyor: "${prompt}"` : `Initializing agentic video pipeline for: "${prompt}"`);
    log(`pipeline_defs/${currentPipeline}.yaml (Dil: ${currentLang.toUpperCase()})`);
    log(currentLang === 'tr' ? `Ücretsiz AI motoruna bağlanılıyor (Pollinations / Wikimedia / Web Speech)...` : `Connecting to keyless AI generator (Pollinations / Wikimedia / Piper)...`);

    try {
      const res = await fetch('/api/script/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          pipeline: currentPipeline,
          duration: 60,
          style: 'Cinematic Documentary',
          lang: currentLang
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      log(currentLang === 'tr' ? `Senaryo hazırlandı: "${data.title}" (${data.scenes.length} sahne)` : `Script generated: "${data.title}" (${data.scenes.length} scenes)`, 'success');
      log(currentLang === 'tr' ? `Maliyet özeti: ${data.estimated_cost}` : `Cost breakdown: ${data.estimated_cost}`);
      if (projectTitleBadge) projectTitleBadge.textContent = `${data.title} (${currentPipeline.toUpperCase()})`;

      // Render Filmstrip scenes
      if (sceneFilmstrip) {
        sceneFilmstrip.innerHTML = '';
        data.scenes.forEach(s => {
          const item = document.createElement('div');
          item.className = 'scene-card-item';
          const scenePrefix = currentLang === 'tr' ? 'SAHNE' : 'SCENE';
          const speakTxt = currentLang === 'tr' ? '🔊 Seslendir' : '🔊 Speak Narration';
          item.innerHTML = `
            <img class="scene-thumb-img" src="${s.generated_image_url}" alt="Scene ${s.scene_number}" loading="lazy">
            <div class="scene-card-content">
              <div class="scene-card-badge">${scenePrefix} ${s.scene_number} • ${s.start_time}s - ${s.end_time}s</div>
              <strong style="display:block;font-size:0.85rem;margin-bottom:0.25rem;">${s.card_text}</strong>
              <p class="scene-narration-preview">${s.narration}</p>
              <div style="margin-top:0.75rem;display:flex;gap:0.4rem;">
                <button class="pill-option" style="padding:0.2rem 0.5rem;font-size:0.7rem;" onclick="speakNarration('${encodeURIComponent(s.narration)}')">${speakTxt}</button>
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

      log(currentLang === 'tr' ? `Prodüksiyon planı tamamlandı. Görsel sanat, senaryo kartları ve ses yönetimi panoya eklendi.` : `Production plan complete. Visual art, screenplay cards, and sound direction mounted on living storyboard.`, 'success');

      // Scroll to studio
      const studioSec = document.getElementById('studioSection');
      if (studioSec) studioSec.scrollIntoView({ behavior: 'smooth' });

    } catch (e) {
      log(`Error: ${e.message}`, 'error');
    } finally {
      isGenerating = false;
      generateBtn.disabled = false;
      generateBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <span data-i18n="btn_generate">${translations[currentLang].btn_generate}</span>
      `;
    }
  }

  // Free Web Speech TTS (Supports TR & EN)
  window.speakNarration = function(encodedText) {
    const text = decodeURIComponent(encodedText);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLang === 'tr' ? 'tr-TR' : 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
      log(currentLang === 'tr' ? `Seslendirme sentezleniyor: "${text.substring(0, 45)}..."` : `Synthesizing voiceover: "${text.substring(0, 45)}..."`, 'success');
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

  // Apply language on startup
  applyLanguage(currentLang);
  loadVideos();
});
