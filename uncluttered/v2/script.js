/* ========================================
   Uncluttered v2 — JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Mark JS as ready for progressive enhancement
    document.body.classList.add('js-ready');

    // ========================================
    // Dark Mode Toggle - Simple & Reliable
    // ========================================
    
    // Get current theme or default to light
    function getCurrentTheme() {
        return localStorage.getItem('theme') || 'light';
    }
    
    // Apply theme to document
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        console.log('Theme set to:', theme);
    }
    
    // Toggle between light and dark
    function handleToggleClick(e) {
        e.preventDefault();
        const current = getCurrentTheme();
        const newTheme = current === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    }
    
    // Initialize theme on page load
    applyTheme(getCurrentTheme());
    
    // Attach click handlers to ALL toggle buttons
    const toggleButtons = document.querySelectorAll('.theme-toggle');
    console.log('Found toggle buttons:', toggleButtons.length);
    
    toggleButtons.forEach((btn, i) => {
        btn.addEventListener('click', handleToggleClick);
        console.log('Attached handler to toggle', i);
    });

    // Navigation scroll effect
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Scroll animations with Intersection Observer
    // Use setTimeout to ensure elements are visible before hiding for animation
    setTimeout(() => {
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        const observerOptions = {
            root: null,
            rootMargin: '50px',  // Start animation 50px before element enters viewport
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);  // Only animate once
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }, 100);  // Small delay to ensure CSS is applied

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add stagger animation to stage cards
    const stageCards = document.querySelectorAll('.stage-card');
    stageCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Add stagger to philosophy cards
    const philCards = document.querySelectorAll('.philosophy-card');
    philCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Add stagger to who tags
    const whoTags = document.querySelectorAll('.who-tag');
    whoTags.forEach((tag, index) => {
        tag.style.transitionDelay = `${index * 0.1}s`;
    });

    // Parallax effect for gradient orbs (subtle)
    const orbs = document.querySelectorAll('.gradient-orb');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.05;
            orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });

    // Tool cards hover effect enhancement
    const toolFeatures = document.querySelectorAll('.tool-feature');
    toolFeatures.forEach(feature => {
        feature.addEventListener('mouseenter', () => {
            feature.style.transform = 'translateX(8px)';
        });
        feature.addEventListener('mouseleave', () => {
            feature.style.transform = 'translateX(0)';
        });
    });
});

// Optional: Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ========================================
// Stack Finder Feature
// ========================================

const stackDatabase = {
    saas: {
        title: "SaaS Starter Stack",
        description: "Everything you need to build and launch a SaaS product",
        link: "stacks/saas.html",
        tools: [
            { icon: "📝", name: "Notion", desc: "Planning & documentation" },
            { icon: "⚡", name: "Next.js", desc: "Frontend framework" },
            { icon: "🗄️", name: "Supabase", desc: "Database & auth" },
            { icon: "🚀", name: "Vercel", desc: "Hosting & deployment" },
            { icon: "💳", name: "Stripe", desc: "Payments" },
            { icon: "📧", name: "ConvertKit", desc: "Email marketing" }
        ]
    },
    ecommerce: {
        title: "E-commerce Stack",
        description: "Build and run an online store",
        link: "stacks/ecommerce.html",
        tools: [
            { icon: "🛒", name: "Shopify", desc: "Store platform" },
            { icon: "📸", name: "Canva", desc: "Product images" },
            { icon: "📦", name: "ShipStation", desc: "Shipping & fulfillment" },
            { icon: "📧", name: "Klaviyo", desc: "Email marketing" },
            { icon: "📊", name: "Triple Whale", desc: "Analytics" },
            { icon: "💬", name: "Gorgias", desc: "Customer support" }
        ]
    },
    newsletter: {
        title: "Newsletter Stack",
        description: "Launch and monetize a newsletter",
        link: "stacks/creator.html",
        tools: [
            { icon: "📧", name: "ConvertKit", desc: "Email platform" },
            { icon: "🌐", name: "Carrd", desc: "Landing page" },
            { icon: "📝", name: "Notion", desc: "Content planning" },
            { icon: "💰", name: "Stripe", desc: "Paid subscriptions" },
            { icon: "📊", name: "SparkLoop", desc: "Referral growth" },
            { icon: "🎨", name: "Figma", desc: "Graphics & templates" }
        ]
    },
    portfolio: {
        title: "Portfolio Stack",
        description: "Showcase your work beautifully",
        link: "stacks/freelancer.html",
        tools: [
            { icon: "🌐", name: "Framer", desc: "Website builder" },
            { icon: "🎨", name: "Figma", desc: "Design work" },
            { icon: "📁", name: "Notion", desc: "Project case studies" },
            { icon: "📧", name: "Calendly", desc: "Booking calls" },
            { icon: "📊", name: "Plausible", desc: "Analytics" }
        ]
    },
    mobile: {
        title: "Mobile App Stack",
        description: "Build cross-platform mobile apps",
        link: "stacks/saas.html",
        tools: [
            { icon: "📱", name: "React Native", desc: "Cross-platform framework" },
            { icon: "🔥", name: "Firebase", desc: "Backend & auth" },
            { icon: "🎨", name: "Figma", desc: "UI design" },
            { icon: "🚀", name: "Expo", desc: "Development & deployment" },
            { icon: "📊", name: "Mixpanel", desc: "Analytics" },
            { icon: "🔔", name: "OneSignal", desc: "Push notifications" }
        ]
    },
    ai: {
        title: "AI-First Stack",
        description: "Build products powered by AI",
        link: "stacks/ai-first.html",
        tools: [
            { icon: "🤖", name: "OpenAI API", desc: "AI models" },
            { icon: "🧠", name: "Pinecone", desc: "Vector database" },
            { icon: "⚡", name: "Next.js", desc: "Frontend" },
            { icon: "🐍", name: "FastAPI", desc: "Python backend" },
            { icon: "🚀", name: "Vercel", desc: "Edge deployment" },
            { icon: "📊", name: "Langfuse", desc: "LLM analytics" }
        ]
    },
    nocode: {
        title: "No-Code Stack",
        description: "Build without writing code",
        link: "stacks/nocode.html",
        tools: [
            { icon: "🔮", name: "Bubble", desc: "Web app builder" },
            { icon: "🌐", name: "Webflow", desc: "Website builder" },
            { icon: "⚡", name: "Zapier", desc: "Automation" },
            { icon: "📊", name: "Airtable", desc: "Database" },
            { icon: "💳", name: "Stripe", desc: "Payments" },
            { icon: "📧", name: "Mailchimp", desc: "Email" }
        ]
    },
    blog: {
        title: "Blog/Content Stack",
        description: "Start a blog or content site",
        link: "stacks/creator.html",
        tools: [
            { icon: "📝", name: "Ghost", desc: "Publishing platform" },
            { icon: "🌐", name: "Vercel", desc: "Hosting" },
            { icon: "📧", name: "ConvertKit", desc: "Newsletter" },
            { icon: "📊", name: "Plausible", desc: "Analytics" },
            { icon: "🎨", name: "Canva", desc: "Graphics" }
        ]
    }
};

function findBestStack(query) {
    query = query.toLowerCase();
    
    // Keyword matching
    if (query.includes('saas') || query.includes('subscription') || query.includes('software')) {
        return stackDatabase.saas;
    }
    if (query.includes('store') || query.includes('shop') || query.includes('ecommerce') || query.includes('sell product')) {
        return stackDatabase.ecommerce;
    }
    if (query.includes('newsletter') || query.includes('email list') || query.includes('substack')) {
        return stackDatabase.newsletter;
    }
    if (query.includes('portfolio') || query.includes('freelance') || query.includes('agency') || query.includes('showcase')) {
        return stackDatabase.portfolio;
    }
    if (query.includes('mobile') || query.includes('app') || query.includes('ios') || query.includes('android')) {
        return stackDatabase.mobile;
    }
    if (query.includes('ai') || query.includes('gpt') || query.includes('machine learning') || query.includes('chatbot')) {
        return stackDatabase.ai;
    }
    if (query.includes('no-code') || query.includes('nocode') || query.includes('without code') || query.includes('bubble')) {
        return stackDatabase.nocode;
    }
    if (query.includes('blog') || query.includes('content') || query.includes('writing') || query.includes('article')) {
        return stackDatabase.blog;
    }
    
    // Default to SaaS as it's most versatile
    return stackDatabase.saas;
}

function showStackModal(stack) {
    const modal = document.getElementById('stackModal');
    const title = document.getElementById('modalTitle');
    const desc = document.getElementById('modalDescription');
    const stackContainer = document.getElementById('modalStack');
    const link = document.getElementById('modalLink');
    
    title.textContent = stack.title;
    desc.textContent = stack.description;
    link.href = stack.link;
    
    stackContainer.innerHTML = stack.tools.map(tool => `
        <div class="modal-tool">
            <div class="modal-tool-icon">${tool.icon}</div>
            <div class="modal-tool-info">
                <h4>${tool.name}</h4>
                <p>${tool.desc}</p>
            </div>
        </div>
    `).join('');
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeStackModal() {
    const modal = document.getElementById('stackModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Event Listeners for Stack Finder
const searchInput = document.getElementById('stackSearch');
const findBtn = document.getElementById('findStack');
const suggestionTags = document.querySelectorAll('.suggestion-tag');
const closeModalBtn = document.getElementById('closeModal');
const closeModalBtn2 = document.getElementById('closeModalBtn');
const modalOverlay = document.querySelector('.modal-overlay');

if (findBtn) {
    findBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            const stack = findBestStack(query);
            showStackModal(stack);
        }
    });
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                const stack = findBestStack(query);
                showStackModal(stack);
            }
        }
    });
}

suggestionTags.forEach(tag => {
    tag.addEventListener('click', () => {
        const query = tag.dataset.query;
        searchInput.value = query;
        const stack = findBestStack(query);
        showStackModal(stack);
    });
});

if (closeModalBtn) closeModalBtn.addEventListener('click', closeStackModal);
if (closeModalBtn2) closeModalBtn2.addEventListener('click', closeStackModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeStackModal);

// Close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeStackModal();
});

// ========================================
// Dark Mode Toggle functions removed - now handled in main DOMContentLoaded

// ========================================
// Newsletter Floating Bar
// ========================================

function initNewsletterBar() {
    const bar = document.querySelector('.newsletter-bar');
    if (!bar) return;
    
    const closeBtn = bar.querySelector('.newsletter-bar-close');
    const dismissed = sessionStorage.getItem('newsletter-bar-dismissed');
    
    if (dismissed) return;
    
    // Show bar after scrolling 50% of page
    const showBar = () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent > 30) {
            bar.classList.add('visible');
            window.removeEventListener('scroll', showBar);
        }
    };
    
    window.addEventListener('scroll', showBar);
    
    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            bar.classList.remove('visible');
            sessionStorage.setItem('newsletter-bar-dismissed', 'true');
        });
    }
}

// Initialize newsletter bar
initNewsletterBar();

// ========================================
// Newsletter Form Handling
// ========================================

function initNewsletterForms() {
    const forms = document.querySelectorAll('.newsletter-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            const button = form.querySelector('button');
            const email = emailInput.value.trim();
            
            if (!email || !isValidEmail(email)) {
                emailInput.style.borderColor = '#FF453A';
                return;
            }
            
            // Store original button text
            const originalText = button.textContent;
            button.textContent = 'Subscribing...';
            button.disabled = true;
            
            // Simulate API call (replace with actual ConvertKit/Mailchimp integration)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Success state
            button.textContent = 'Subscribed! ✓';
            button.style.background = '#30D158';
            emailInput.value = '';
            
            // Reset after 3 seconds
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
                button.disabled = false;
            }, 3000);
        });
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Initialize newsletter forms
initNewsletterForms();

// ========================================
// Pricing Calculator
// ========================================

const calculatorTools = [
    { id: 'notion', name: 'Notion', price: 10, freeTier: 'Free for personal', category: 'Productivity' },
    { id: 'vercel', name: 'Vercel', price: 20, freeTier: 'Generous free tier', category: 'Hosting' },
    { id: 'supabase', name: 'Supabase', price: 25, freeTier: 'Free tier available', category: 'Database' },
    { id: 'stripe', name: 'Stripe', price: 0, freeTier: '2.9% + 30¢ per transaction', category: 'Payments' },
    { id: 'convertkit', name: 'ConvertKit', price: 29, freeTier: 'Free up to 1,000 subs', category: 'Email' },
    { id: 'plausible', name: 'Plausible', price: 9, freeTier: 'No free tier', category: 'Analytics' },
    { id: 'figma', name: 'Figma', price: 15, freeTier: 'Free for 3 projects', category: 'Design' },
    { id: 'linear', name: 'Linear', price: 8, freeTier: 'Free for small teams', category: 'Project Management' },
    { id: 'crisp', name: 'Crisp', price: 25, freeTier: 'Free basic chat', category: 'Support' },
    { id: 'github', name: 'GitHub', price: 4, freeTier: 'Free for public repos', category: 'Development' },
];

function initCalculator() {
    const toolsContainer = document.getElementById('calculatorTools');
    const summaryContainer = document.getElementById('calculatorSummary');
    const totalEl = document.getElementById('calculatorTotal');
    
    if (!toolsContainer) return;
    
    let selectedTools = [];
    
    // Render tools
    toolsContainer.innerHTML = calculatorTools.map(tool => `
        <label class="calculator-tool" data-id="${tool.id}">
            <input type="checkbox" value="${tool.id}">
            <div class="calc-tool-check">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <div class="calc-tool-icon">
                ${getToolIcon(tool.id)}
            </div>
            <div class="calc-tool-info">
                <h4>${tool.name}</h4>
                <p>${tool.category}</p>
            </div>
            <div class="calc-tool-price">
                ${tool.price > 0 ? `
                    <div class="price">$${tool.price}</div>
                    <div class="period">/month</div>
                ` : `
                    <div class="price">$0</div>
                    <div class="period">base</div>
                `}
                <div class="free-tier">${tool.freeTier}</div>
            </div>
        </label>
    `).join('');
    
    // Add event listeners
    const toolCards = toolsContainer.querySelectorAll('.calculator-tool');
    toolCards.forEach(card => {
        card.addEventListener('click', () => {
            const checkbox = card.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            card.classList.toggle('selected', checkbox.checked);
            updateSummary();
        });
    });
    
    function updateSummary() {
        const selected = Array.from(toolsContainer.querySelectorAll('input:checked')).map(input => {
            return calculatorTools.find(t => t.id === input.value);
        });
        
        if (selected.length === 0) {
            summaryContainer.innerHTML = '<p class="summary-empty">Select tools to calculate your stack cost</p>';
            totalEl.textContent = '$0';
            return;
        }
        
        summaryContainer.innerHTML = selected.map(tool => `
            <div class="summary-tool">
                <span>${tool.name}</span>
                <span>${tool.price > 0 ? '$' + tool.price : 'Free*'}</span>
            </div>
        `).join('');
        
        const total = selected.reduce((sum, tool) => sum + tool.price, 0);
        totalEl.textContent = '$' + total;
    }
}

function getToolIcon(id) {
    const icons = {
        notion: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M6.017 4.313l55.333-4.087c6.797-.583 8.543-.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277-1.553 6.807-6.99 7.193L24.467 99.967c-4.08.193-6.023-.39-8.16-3.113L3.3 79.94c-2.333-3.113-3.3-5.443-3.3-8.167V11.113c0-3.497 1.553-6.413 6.017-6.8z"/></svg>`,
        vercel: `<svg viewBox="0 0 76 65" fill="currentColor"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z"/></svg>`,
        supabase: `<svg viewBox="0 0 109 113" fill="currentColor"><path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"/><path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z"/></svg>`,
        stripe: `<svg viewBox="0 0 60 25" fill="currentColor"><path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.02 1.04-.06 1.48z"/></svg>`,
        convertkit: `<svg viewBox="0 0 32 32" fill="currentColor"><circle cx="16" cy="16" r="16"/></svg>`,
        plausible: `<svg viewBox="0 0 74 74" fill="currentColor"><circle cx="37" cy="37" r="37"/></svg>`,
        figma: `<svg viewBox="0 0 38 57" fill="currentColor"><path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/><path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/><path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"/><path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"/><path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"/></svg>`,
        linear: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M1.22541 61.5228c-.2225-.9485.90748-1.5459 1.59638-.857L39.3342 97.1782c.6889.6889.0915 1.8189-.857 1.5765C20.0515 94.4522 5.54779 81.3612 1.22541 61.5228zM.00189135 46.8891c-.01764375.2833.08887215.5765.28957165.7772L52.3503 99.7085c.2007.2006.4939.3072.7772.2896C75.1319 98.4754 93.8402 85.3762 99.9989 66.1445c.1601-.5001-.0751-.9961-.5228-1.1562L20.1163.516406c-.1601-.051233-.3295-.063797-.4968-.023232C8.06611 4.00268.153858 14.4315.00189135 46.8891z"/></svg>`,
        crisp: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
        github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
    };
    return icons[id] || `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>`;
}

// Initialize calculator if on calculator page
document.addEventListener('DOMContentLoaded', initCalculator);
