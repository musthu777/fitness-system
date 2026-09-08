/* ====== SCRIPT.JS — KeralFit Interactive Logic ====== */

// ================================
// NAVBAR SCROLL EFFECT
// ================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('backToTop');
const hamburger = document.getElementById('hamburger');
const navLinksMenu = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
    backToTop.classList.add('visible');
  } else {
    navbar.classList.remove('scrolled');
    backToTop.classList.remove('visible');
  }
  updateActiveNavLink();
});

// Active nav link on scroll
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}

// Hamburger
hamburger.addEventListener('click', () => {
  navLinksMenu.classList.toggle('open');
});
navLinksMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinksMenu.classList.remove('open'));
});

// ================================
// COUNTER ANIMATION
// ================================
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const start = performance.now();
  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

// ================================
// SCROLL ANIMATIONS (Intersection Observer)
// ================================
const animateObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, parseInt(delay));
      animateObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.feature-card, .workout-card, .diet-card, .trainer-card, .testimonial-card, .pricing-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  animateObserver.observe(el);
});

// ================================
// WORKOUT TABS FILTER
// ================================
const tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    document.querySelectorAll('.workout-card').forEach(card => {
      const show = tab === 'all' || card.dataset.category === tab;
      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      if (show) {
        card.style.display = '';
        setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(12px)';
        setTimeout(() => card.style.display = 'none', 300);
      }
    });
  });
});

// ================================
// CALCULATOR
// ================================
function switchCalc(type) {
  const bmiCalc = document.getElementById('bmiCalc');
  const calCalc = document.getElementById('calCalc');
  const bmiTab = document.getElementById('bmiTab');
  const calTab = document.getElementById('calTab');
  const result = document.getElementById('calcResult');

  if (type === 'bmi') {
    bmiCalc.style.display = '';
    calCalc.style.display = 'none';
    bmiTab.classList.add('active');
    calTab.classList.remove('active');
  } else {
    bmiCalc.style.display = 'none';
    calCalc.style.display = '';
    calTab.classList.add('active');
    bmiTab.classList.remove('active');
  }
  result.innerHTML = `<div class="result-placeholder"><div class="result-icon">📊</div><p>Fill in the form and hit Calculate to see your personalized health metrics.</p></div>`;
}

function calculateBMI() {
  const height = parseFloat(document.getElementById('heightInput').value);
  const weight = parseFloat(document.getElementById('weightInput').value);
  const age = parseInt(document.getElementById('ageInput').value);
  const gender = document.getElementById('genderInput').value;

  if (!height || !weight || !age || !gender) {
    showToast('⚠️ Please fill in all fields.');
    return;
  }
  if (height < 100 || height > 250 || weight < 30 || weight > 300) {
    showToast('⚠️ Please enter realistic values.');
    return;
  }

  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  const rounded = Math.round(bmi * 10) / 10;

  let category, color, advice, icon, keralaTip;
  if (bmi < 18.5) {
    category = 'Underweight'; color = '#FF9800'; icon = '⚡';
    advice = 'You need to gain weight. Increase caloric intake with nutrient-rich Kerala foods.';
    keralaTip = '💡 Kerala Tip: Try our Muscle Gain plan with Pathiri, Mutton Curry & Coconut Milk for healthy weight gain!';
  } else if (bmi < 25) {
    category = 'Normal Weight'; color = '#4CAF50'; icon = '✅';
    advice = 'Excellent! You\'re in a healthy weight range. Maintain with balanced Kerala diet.';
    keralaTip = '💡 Kerala Tip: Continue with our Balanced Sadya Plan to maintain your great shape!';
  } else if (bmi < 30) {
    category = 'Overweight'; color = '#FF7043'; icon = '⚠️';
    advice = 'Consider our Kerala Weight Loss plan with lower-calorie traditional meals.';
    keralaTip = '💡 Kerala Tip: Switch to Kanji, Thoran & grilled fish diet. Reduce coconut oil gradually.';
  } else {
    category = 'Obese'; color = '#f44336'; icon = '🏥';
    advice = 'Please consult Dr. Arun Nair, our chief nutritionist, for a personalized plan.';
    keralaTip = '💡 Kerala Tip: Start with gentle morning walks along Kerala beaches and light Kanji-based diet.';
  }

  const idealMin = Math.round(18.5 * heightM * heightM);
  const idealMax = Math.round(24.9 * heightM * heightM);

  document.getElementById('calcResult').innerHTML = `
    <div class="result-content">
      <div class="bmi-circle" style="border-color: ${color}; color: ${color};">
        <div class="bmi-value">${rounded}</div>
        <div class="bmi-label">BMI</div>
      </div>
      <div class="bmi-category" style="color: ${color}">${icon} ${category}</div>
      <div class="bmi-advice">${advice}</div>
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 14px 16px; font-size: 0.85rem; color: #166534; margin-bottom: 16px; text-align: left;">${keralaTip}</div>
      <div class="result-stats">
        <div class="result-stat"><strong>${rounded}</strong><span>Your BMI</span></div>
        <div class="result-stat"><strong style="color:${color}">${category}</strong><span>Category</span></div>
        <div class="result-stat"><strong>${idealMin}–${idealMax} kg</strong><span>Ideal Weight Range</span></div>
        <div class="result-stat"><strong>${age} yrs</strong><span>Your Age</span></div>
      </div>
      <a href="#nutrition" class="btn btn-primary" style="margin-top: 20px; display: inline-flex;">View Recommended Diet Plan</a>
    </div>
  `;
}

function calculateCalories() {
  const height = parseFloat(document.getElementById('calHeight').value);
  const weight = parseFloat(document.getElementById('calWeight').value);
  const age = parseInt(document.getElementById('calAge').value);
  const gender = document.getElementById('calGender').value;
  const activity = parseFloat(document.getElementById('activityLevel').value);
  const goal = document.getElementById('fitnessGoal').value;

  if (!height || !weight || !age || !gender) {
    showToast('⚠️ Please fill in all fields.');
    return;
  }

  // Mifflin-St Jeor
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  let tdee = Math.round(bmr * activity);
  let target = tdee;
  let goalLabel, goalColor, goalIcon;

  if (goal === 'lose') {
    target = tdee - 500;
    goalLabel = 'Weight Loss Target';
    goalColor = '#4CAF50';
    goalIcon = '📉';
  } else if (goal === 'gain') {
    target = tdee + 400;
    goalLabel = 'Muscle Gain Target';
    goalColor = '#1565C0';
    goalIcon = '📈';
  } else {
    goalLabel = 'Maintenance Calories';
    goalColor = '#FF9800';
    goalIcon = '⚖️';
  }

  const protein = Math.round(weight * 1.6);
  const fat = Math.round(target * 0.28 / 9);
  const carbs = Math.round((target - protein * 4 - fat * 9) / 4);

  document.getElementById('calcResult').innerHTML = `
    <div class="result-content">
      <div class="bmi-circle" style="border-color: ${goalColor}; color: ${goalColor}; width: 180px; height: 180px;">
        <div class="bmi-value" style="font-size: 2rem">${target.toLocaleString()}</div>
        <div class="bmi-label">kcal/day</div>
      </div>
      <div class="bmi-category" style="color: ${goalColor}">${goalIcon} ${goalLabel}</div>
      <div class="bmi-advice">Your Base Metabolic Rate: <strong>${Math.round(bmr)} kcal</strong> · Daily needs: <strong>${tdee} kcal</strong></div>
      <div class="result-stats">
        <div class="result-stat"><strong>${protein}g</strong><span>🥩 Protein</span></div>
        <div class="result-stat"><strong>${carbs}g</strong><span>🍚 Carbs</span></div>
        <div class="result-stat"><strong>${fat}g</strong><span>🥥 Fat</span></div>
        <div class="result-stat"><strong>${target.toLocaleString()}</strong><span>🔥 Calories</span></div>
      </div>
      <div style="background: #e3f2fd; border: 1px solid #90caf9; border-radius: 12px; padding: 14px 16px; font-size: 0.85rem; color: #0d47a1; margin-top: 16px; text-align: left;">
        💡 <strong>Kerala Suggestion:</strong> Use red rice instead of white for extra fiber. Add coconut oil (1-2 tsp/day) for healthy fats!
      </div>
      <a href="#nutrition" class="btn btn-primary" style="margin-top: 20px; display: inline-flex;">View Kerala Diet Plans</a>
    </div>
  `;
}

// ================================
// WORKOUT MODAL
// ================================
const workoutData = {
  workout1: {
    title: '🏃‍♀️ Morning Walk & Stretch',
    badge: 'Beginner',
    time: '30 min',
    cal: '150 kcal',
    steps: [
      { name: 'Warm-up Walk', duration: '5 min', desc: 'Easy pace, arms swinging naturally.' },
      { name: 'Brisk Walk', duration: '10 min', desc: 'Pick up the pace, breathe deeply.' },
      { name: 'Full Body Stretches', duration: '10 min', desc: 'Neck rolls, shoulder shrugs, hamstring stretch, calf stretch.' },
      { name: 'Deep Breathing & Cool Down', duration: '5 min', desc: 'Pranayama breathing, light neck and back stretch.' },
    ]
  },
  workout2: {
    title: '🏋️ Full Body Strength',
    badge: 'Intermediate',
    time: '45 min',
    cal: '320 kcal',
    steps: [
      { name: 'Warm-up Cardio', duration: '5 min', desc: 'Jumping jacks, high knees, arm circles.' },
      { name: 'Squats', duration: '3×12 reps', desc: 'Bodyweight or with dumbbells. Keep knees behind toes.' },
      { name: 'Push-ups', duration: '3×10 reps', desc: 'Keep core engaged, lower chest to ground.' },
      { name: 'Dumbbell Rows', duration: '3×12 reps', desc: 'One arm at a time on a bench or chair.' },
      { name: 'Plank', duration: '3×45 sec', desc: 'Hold position, breathe steadily.' },
      { name: 'Cool Down Stretch', duration: '5 min', desc: 'Hip flexor, quad, and shoulder stretch.' },
    ]
  },
  workout3: {
    title: '🧘‍♂️ Kerala Yoga Flow',
    badge: 'Popular',
    time: '60 min',
    cal: '200 kcal',
    steps: [
      { name: 'Surya Namaskar (Sun Salutation)', duration: '15 min', desc: '5 rounds of the classic 12-pose sequence.' },
      { name: 'Trikonasana (Triangle Pose)', duration: '8 min', desc: '3 reps each side. Open the hips and shoulders.' },
      { name: 'Virabhadrasana (Warrior Poses)', duration: '10 min', desc: 'Warrior I, II, and III flow sequence.' },
      { name: 'Balasana (Child\'s Pose)', duration: '5 min', desc: 'Rest and breathe. Release tension.' },
      { name: 'Setu Bandhasana (Bridge Pose)', duration: '8 min', desc: 'Strengthens lower back and glutes.' },
      { name: 'Savasana (Final Rest)', duration: '10 min', desc: 'Complete relaxation. Traditional Kerala yoga ending.' },
    ]
  },
  workout4: {
    title: '⚡ HIIT Cardio Blast',
    badge: 'Advanced',
    time: '25 min',
    cal: '450 kcal',
    steps: [
      { name: 'Dynamic Warm-up', duration: '3 min', desc: 'Leg swings, arm circles, quick jog.' },
      { name: 'Burpees', duration: '40 sec on / 20 sec off', desc: '4 rounds. Full body explosive movement.' },
      { name: 'Jump Squats', duration: '40 sec on / 20 sec off', desc: '4 rounds. Land softly to protect knees.' },
      { name: 'Mountain Climbers', duration: '40 sec on / 20 sec off', desc: '4 rounds. Fast pace core and cardio combo.' },
      { name: 'Sprint in Place', duration: '30 sec on / 30 sec off', desc: '4 rounds. Maximum effort sprinting.' },
      { name: 'Cool Down', duration: '2 min', desc: 'Walk it out, deep breathing to recover.' },
    ]
  },
  workout5: {
    title: '🚴 Cycling & Cardio',
    badge: 'Beginner',
    time: '40 min',
    cal: '280 kcal',
    steps: [
      { name: 'Easy Cycling Warm-up', duration: '5 min', desc: 'Low resistance, comfortable pace.' },
      { name: 'Moderate Pace Cycling', duration: '20 min', desc: 'Steady cadence at 70-80 RPM.' },
      { name: 'Interval Burst', duration: '10 min', desc: '1 min hard, 1 min easy, repeat 5 times.' },
      { name: 'Cool Down Ride', duration: '5 min', desc: 'Slow pace, low resistance to recover.' },
    ]
  },
  workout6: {
    title: '🏊 Swim & Tone',
    badge: 'Advanced',
    time: '50 min',
    cal: '380 kcal',
    steps: [
      { name: 'Warm-up Freestyle', duration: '5 min', desc: '4 laps at easy pace, focus on breathing rhythm.' },
      { name: 'Freestyle Intervals', duration: '20 min', desc: '2 laps hard / 1 lap easy. Repeat 5 times.' },
      { name: 'Backstroke Laps', duration: '10 min', desc: 'Upper body focus. 6 relaxed laps.' },
      { name: 'Breaststroke', duration: '10 min', desc: 'Full body coordination. 6 laps moderate pace.' },
      { name: 'Cool Down Float', duration: '5 min', desc: 'Easy back float, controlled breathing.' },
    ]
  }
};

function openModal(id) {
  const data = workoutData[id];
  if (!data) return;
  const stepsHtml = data.steps.map(s => `
    <div style="display:flex;gap:16px;padding:14px 0;border-bottom:1px solid #e5e7eb;align-items:flex-start;">
      <div style="min-width:90px;font-size:0.75rem;font-weight:700;color:#1a5c2e;background:#e8f5e9;padding:4px 10px;border-radius:999px;text-align:center;margin-top:2px;">${s.duration}</div>
      <div><div style="font-weight:700;font-size:0.9rem;color:#0f1d13;margin-bottom:4px;">${s.name}</div><div style="font-size:0.82rem;color:#6b7280;line-height:1.6;">${s.desc}</div></div>
    </div>
  `).join('');

  document.getElementById('modalContent').innerHTML = `
    <div style="margin-bottom:20px;">
      <span style="background:#e8f5e9;color:#1a5c2e;font-size:0.73rem;font-weight:700;padding:4px 14px;border-radius:999px;text-transform:uppercase;">${data.badge}</span>
    </div>
    <h2 style="font-size:1.5rem;font-weight:800;color:#0f1d13;margin-bottom:8px;">${data.title}</h2>
    <div style="display:flex;gap:16px;margin-bottom:24px;font-size:0.85rem;color:#6b7280;font-weight:500;">
      <span>⏱ ${data.time}</span>
      <span>🔥 ${data.cal}</span>
    </div>
    <h3 style="font-size:0.85rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;margin-bottom:8px;">Workout Breakdown</h3>
    ${stepsHtml}
    <a href="#pricing" onclick="closeModal()" class="btn btn-primary" style="margin-top:24px;width:100%;justify-content:center;display:flex;">Start This Program 🌿</a>
  `;
  document.getElementById('workoutModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('workoutModal').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ================================
// NEWSLETTER
// ================================
function subscribeNewsletter(e) {
  e.preventDefault();
  const email = document.getElementById('nlEmail').value;
  if (!email) return;
  showToast(`🌿 Thanks for subscribing! Weekly Kerala wellness tips coming to ${email}`);
  document.getElementById('nlEmail').value = '';
}

// ================================
// CONTACT FORM
// ================================
function submitContact(e) {
  e.preventDefault();
  const name = document.getElementById('contactName').value;
  showToast(`🌿 Thanks ${name}! Our team will contact you within 24 hours.`);
  document.getElementById('contactForm').reset();
}

// ================================
// TOAST NOTIFICATION
// ================================
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ================================
// SMOOTH SCROLL FOR NAV LINKS
// ================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ================================
// METRIC BARS ANIMATION
// ================================
const metricObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.metric-bar').forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => bar.style.width = width, 100);
      });
      entry.target.querySelectorAll('.bar').forEach(bar => {
        const height = bar.style.height;
        bar.style.height = '0';
        setTimeout(() => bar.style.height = height, 100);
      });
      metricObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.tracker-card').forEach(card => metricObserver.observe(card));

console.log('🌿 KeralFit — Wellness Platform Loaded');
