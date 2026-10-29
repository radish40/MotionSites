# GPT‑6.1 Sol High 网页生成清单

当前状态：已完成 194/380；以 manifest.json 和在线索引的最新状态为准。

- 范围：380 个设计，每个设计生成 1 个可运行网页。
- 全库含 601 个文本版本；本轮使用 `data/catalog-text-index.json` 指定的画廊默认主提示词，不另行挑选最长版本。
- 每条记录已核验提示词文件存在，并在 manifest.json / inventory.csv 中保存原文 SHA‑256。
- 预览：193 个设计有本地图像、134 个有本地视频、53 个无本地预览。
- 模型要求：`gpt-6.1-sol`，推理强度 `high`；这是计划设置，当前没有生成会话。

## 分类统计

| 分类 | 数量 |
| --- | ---: |
| Hero Section | 90 |
| Landing Page | 64 |
| SaaS | 36 |
| Components | 18 |
| Features Section | 13 |
| Agency | 12 |
| CTA Section | 9 |
| Animations & Backgrounds | 9 |
| Portfolio | 7 |
| Travel | 7 |
| E-commerce | 7 |
| About Section | 6 |
| Footer Section | 6 |
| Pricing Page | 5 |
| Fintech | 5 |
| Waitlist & Coming Soon | 5 |
| Cards | 5 |
| Healthcare | 4 |
| AI | 4 |
| Mobile App | 3 |
| Wellness | 3 |
| Testimonials | 3 |
| Products | 3 |
| Social Media | 3 |
| Transportation | 2 |
| Technology | 2 |
| Education | 2 |
| 3D Website | 2 |
| 404 Pages | 2 |
| Services | 2 |
| Forms & Contact | 2 |
| Process & Stats | 2 |
| Dashboards | 2 |
| Benefits | 2 |
| Web3 | 2 |
| Community | 1 |
| Sustainability | 1 |
| Loyalty | 1 |
| Entertainment | 1 |
| Real Estate | 1 |
| Categories | 1 |
| Blog & Editorial | 1 |
| Info | 1 |
| Why Us | 1 |
| Use Cases | 1 |
| Website | 1 |
| Case Studies | 1 |
| Projects | 1 |
| FAQ & Help | 1 |
| Interactive | 1 |
| AI Apps | 1 |
| HR | 1 |
| Automotive | 1 |
| Onboarding | 1 |
| 404 | 1 |
| Fashion | 1 |
| Analytics | 1 |
| Cybersecurity | 1 |
| Sign in | 1 |
| 3D | 1 |
| Investor Presentations | 1 |
| AI / SaaS | 1 |
| Component | 1 |
| Email Marketing | 1 |
| Presentation | 1 |
| Pricing | 1 |

## 完整清单

顺序沿用画廊数据顺序，不代表难度或最终执行顺序。每条对应的完整路径、来源与正文摘要见 CSV/JSON。

| 序号 | 设计 ID | 名称 | 分类 | 文本版本数 | 本地预览 | 状态 |
| ---: | --- | --- | --- | ---: | --- | --- |
| 1 | `dreamcore-landing` | Dreamcore Landing | Landing Page | 2 | 图片 | 已完成 |
| 2 | `bold-studio` | Bold Studio | Hero Section | 2 | 图片 | 已完成 |
| 3 | `interactive-discovery` | Interactive Discovery | Hero Section | 2 | 图片 | 已完成 |
| 4 | `prisma-landing` | Prisma Creative Studio | Landing Page | 1 | 图片 | 已完成 |
| 5 | `3d-jack-portfolio-hero` | 3D Jack Portfolio | Portfolio | 1 | 视频 | 已完成 |
| 6 | `art-landing` | Art Landing | Landing Page | 2 | 视频 | 已完成 |
| 7 | `aetheris-voyage-hero` | Aetheris Voyage | Hero Section | 1 | 图片 | 已完成 |
| 8 | `codercrest-hero` | CoderCrest | SaaS | 3 | 图片 | 已完成 |
| 9 | `urban-jungle-hero` | Urban Jungle | Landing Page | 3 | 视频 | 已完成 |
| 10 | `reveal-hero` | Reveal Hero | Hero Section | 2 | 图片 | 已完成 |
| 11 | `modern-agency` | Modern Agency | Agency | 2 | 图片 | 已完成 |
| 12 | `liquid-glass-agency` | Liquid Glass Agency | Landing Page | 3 | 视频 | 已完成 |
| 13 | `luxury-editorial-ecommerce-design` | Luxury Ecommerce Design | Landing Page | 2 | 图片 | 已完成 |
| 14 | `asme-hero` | Asme | Hero Section | 1 | 视频 | 已完成 |
| 15 | `max-reed-portfolio` | Max Reed Portfolio | Features Section | 2 | 图片 | 已完成 |
| 16 | `mindloop-landing` | Mindloop Landing | Landing Page | 2 | 视频 | 已完成 |
| 17 | `ember-dsgn-hero` | EMBER.dsgn | Hero Section | 2 | 图片 | 已完成 |
| 18 | `solar-energy-hero` | Solar Energy Hero | Hero Section | 2 | 图片 | 已完成 |
| 19 | `halo-usd-landing` | USD Halo | Landing Page | 2 | 图片 | 已完成 |
| 20 | `ai-designer-agency` | AI Designer Agency | Landing Page | 1 | 视频 | 已完成 |
| 21 | `convix-software-hero` | SAAS Software | SaaS | 1 | 图片 | 已完成 |
| 22 | `dot-hero` | Dot | Hero Section | 1 | 图片 | 已完成 |
| 23 | `orbit-engineers` | Orbit Engineers | Agency | 1 | 视频 | 已完成 |
| 24 | `3d-studio-pricing` | 3D Studio Pricing | Pricing Page | 2 | 视频 | 已完成 |
| 25 | `adhd-planner` | ADHD Planner | Mobile App | 1 | 视频 | 已完成 |
| 26 | `ai-driving-assistant` | AI Driving Assistant | SaaS | 2 | 视频 | 已完成 |
| 27 | `ai-interface` | AI Interface | Landing Page | 2 | 视频 | 已完成 |
| 28 | `ai-meeting-notes` | AI Meeting Notes | SaaS | 2 | 视频 | 已完成 |
| 29 | `ai-workflow-agents` | AI Workflow Agents | SaaS | 1 | 视频 | 已完成 |
| 30 | `cargo-group` | Cargo Group | Hero Section | 2 | 视频 | 已完成 |
| 31 | `cargox-mobile` | CARGOX Mobile | Transportation | 2 | 视频 | 已完成 |
| 32 | `celestial-renewal` | Celestial Renewal | Wellness | 2 | 视频 | 已完成 |
| 33 | `church-community` | Church Community | Community | 1 | 视频 | 已完成 |
| 34 | `cleantech` | CleanTech | Sustainability | 2 | 视频 | 已完成 |
| 35 | `coffee-rewards` | Coffee Rewards | Loyalty | 2 | 视频 | 已完成 |
| 36 | `cosmos-interface` | Cosmos Interface | Landing Page | 2 | 视频 | 已完成 |
| 37 | `cozypaws` | CozyPaws | Hero Section | 1 | 视频 | 已完成 |
| 38 | `cross-border` | Cross-Border | Transportation | 2 | 视频 | 已完成 |
| 39 | `f1-racing-hub` | F1 Racing Hub | Mobile App | 1 | 视频 | 已完成 |
| 40 | `financial-suite` | Financial Suite | Landing Page | 2 | 视频 | 已完成 |
| 41 | `innovation-lab` | Innovation Lab | Technology | 1 | 视频 | 已完成 |
| 42 | `innovation-studio` | Innovation Studio | Hero Section | 2 | 视频 | 已完成 |
| 43 | `innovation-summit` | Innovation Summit | Mobile App | 2 | 视频 | 已完成 |
| 44 | `integration-saas` | Integration SaaS | Hero Section | 2 | 视频 | 已完成 |
| 45 | `lead-funnel` | Lead Funnel | Hero Section | 2 | 视频 | 已完成 |
| 46 | `luxury-escapes` | Luxury Escapes | Travel | 2 | 视频 | 已完成 |
| 47 | `mind-body-healing` | Mind-Body Healing | Healthcare | 1 | 视频 | 已完成 |
| 48 | `mood-tracker` | Mood Tracker | Wellness | 2 | 视频 | 已完成 |
| 49 | `movie-premiere` | Movie Premiere | Entertainment | 2 | 视频 | 已完成 |
| 50 | `outdoor-apparel` | Outdoor Apparel | E-commerce | 2 | 视频 | 已完成 |
| 51 | `oyla` | OYLA | E-commerce | 2 | 视频 | 已完成 |
| 52 | `pet-products` | Pet Products | E-commerce | 2 | 视频 | 已完成 |
| 53 | `place-saver` | Place Saver | Travel | 2 | 视频 | 已完成 |
| 54 | `product-studio` | Product Studio | Agency | 2 | 视频 | 已完成 |
| 55 | `prompt-hero` | PROMPT | Landing Page | 2 | 视频 | 已完成 |
| 56 | `remit-race` | Remit Race | Fintech | 2 | 视频 | 已完成 |
| 57 | `skills-lea` | LearnHub | Education | 2 | 视频 | 已完成 |
| 58 | `sky-estate` | Sky Estate | Real Estate | 2 | 视频 | 已完成 |
| 59 | `stillmind` | Stillmind | Hero Section | 2 | 视频 | 已完成 |
| 60 | `subscription-agency` | Subscription Agency | Hero Section | 2 | 视频 | 已完成 |
| 61 | `supplement-shop` | Supplement Shop | Healthcare | 2 | 视频 | 已完成 |
| 62 | `tech-forward` | Tech-Forward | Hero Section | 2 | 视频 | 已完成 |
| 63 | `travel-explorer` | Travel Explorer | Travel | 2 | 视频 | 已完成 |
| 64 | `travel-journal` | Travel Journal | Travel | 2 | 视频 | 已完成 |
| 65 | `vision-reveal` | Vision Reveal | Hero Section | 2 | 视频 | 已完成 |
| 66 | `wellbeing-os` | Wellbeing OS | Hero Section | 2 | 视频 | 已完成 |
| 67 | `wellness-companion` | Wellness Companion | Wellness | 2 | 视频 | 已完成 |
| 68 | `wellness-device` | Wellness Devicex | Healthcare | 1 | 视频 | 已完成 |
| 69 | `3d-collectible-hero` | 3D Collectible Hero | 3D Website | 2 | 图片 | 已完成 |
| 70 | `3d-story` | 3D Story | Landing Page | 2 | 图片 | 已完成 |
| 71 | `404-planet` | 404 Planet | 404 Pages | 2 | 图片 | 已完成 |
| 72 | `aerocore` | AeroCore | Landing Page | 2 | 图片 | 已完成 |
| 73 | `agency-services` | Agency Services | Services | 2 | 图片 | 已完成 |
| 74 | `ai-automation` | AI Automation | Landing Page | 2 | 图片 | 已完成 |
| 75 | `ai-workflow` | AI Workflow Hero | Hero Section | 2 | 图片 | 已完成 |
| 76 | `animated-cards` | Animated Cards | Components | 2 | 图片 | 已完成 |
| 77 | `apex-program-accordion` | Apex Program Accordion | Components | 2 | 图片 | 已完成 |
| 78 | `apex-pulse` | Apex Pulse | Landing Page | 2 | 图片 | 已完成 |
| 79 | `arceage-contact-us` | Arceage Contact Us | Forms & Contact | 2 | 图片 | 已完成 |
| 80 | `arceage-services` | Arceage Services | Services | 2 | 图片 | 已完成 |
| 81 | `arceage-stats` | Arceage Stats | Process & Stats | 2 | 图片 | 已完成 |
| 82 | `arceage-testimonial` | Arceage Testimonial | Testimonials | 2 | 图片 | 已完成 |
| 83 | `audio-showcase` | Audio Showcase | Hero Section | 2 | 图片 | 已完成 |
| 84 | `auramail` | AuraMail | SaaS | 2 | 图片 | 已完成 |
| 85 | `aurora-onboard` | Aurora Onboard | Waitlist & Coming Soon | 2 | 图片 | 已完成 |
| 86 | `axion-about` | Axion About | About Section | 2 | 图片 | 已完成 |
| 87 | `beauty-categories` | Beauty Categories | Categories | 2 | 图片 | 已完成 |
| 88 | `beauty-products` | Beauty Products | Products | 2 | 图片 | 已完成 |
| 89 | `bento-grid-stats` | Bento Grid Stats | Components | 2 | 图片 | 已完成 |
| 90 | `bio-active` | Clarity Core | Landing Page | 2 | 图片 | 已完成 |
| 91 | `bio-age-dashboard` | Bio-Age Dashboard | Hero Section | 2 | 图片 | 已完成 |
| 92 | `bio-digital` | Bio-Digital | Hero Section | 2 | 图片 | 已完成 |
| 93 | `bl` | Bloom | Landing Page | 2 | 图片 | 已完成 |
| 94 | `blog-showcase` | Blog Showcase | Blog & Editorial | 1 | 图片 | 已完成 |
| 95 | `book-hero` | Book Hero | Hero Section | 2 | 图片 | 已完成 |
| 96 | `bookedup` | BookedUp | SaaS | 1 | 图片 | 已完成 |
| 97 | `botanical-shadow-about` | Botanical Shadow About | About Section | 2 | 图片 | 已完成 |
| 98 | `build-with-us` | Build With Us | Forms & Contact | 2 | 图片 | 已完成 |
| 99 | `cinematic-brand` | Cinematic Brand | Hero Section | 2 | 图片 | 已完成 |
| 100 | `cinematic-landing-page` | Cinematic Landing Page | Landing Page | 2 | 图片 | 已完成 |
| 101 | `cognitra-feature` | Cognitra Feature | Features Section | 2 | 图片 | 已完成 |
| 102 | `cognitra-offer` | Cognitra Offer | Cards | 2 | 图片 | 已完成 |
| 103 | `contact-cybernetic` | Contact Cybernetic | Hero Section | 2 | 图片 | 已完成 |
| 104 | `conversion` | Conversion | Hero Section | 1 | 图片 | 已完成 |
| 105 | `cosmic` | Cosmic | Hero Section | 2 | 图片 | 已完成 |
| 106 | `creative-agency` | Creative Agency | Landing Page | 2 | 图片 | 已完成 |
| 107 | `creative-portfolio` | Creative Portfolio | Hero Section | 2 | 图片 | 已完成 |
| 108 | `creative-studio` | Creative Studio | Agency | 2 | 图片 | 已完成 |
| 109 | `cursor-follow` | Cursor Follow | Hero Section | 2 | 图片 | 已完成 |
| 110 | `cyberpunk-reveal` | Cyberpunk Reveal | Hero Section | 2 | 图片 | 已完成 |
| 111 | `cybersecurity-hero` | Cybersecurity Hero | Hero Section | 2 | 图片 | 已完成 |
| 112 | `cybersecurity-hero-v2` | Cybersecurity Hero v2 | Hero Section | 2 | 图片 | 已完成 |
| 113 | `daisy-sweet` | Daisy Sweet | Products | 2 | 图片 | 已完成 |
| 114 | `daisy-wild` | Daisy Wild | Products | 2 | 图片 | 已完成 |
| 115 | `dashboard` | Dashboard UI | Dashboards | 2 | 图片 | 已完成 |
| 116 | `digital-experiences` | Digital Experiences | Landing Page | 1 | 图片 | 已完成 |
| 117 | `eco-intelligence` | Eco Intelligence | Hero Section | 2 | 图片 | 已完成 |
| 118 | `editorial-collection-cta` | Editorial Collection CTA | CTA Section | 2 | 图片 | 已完成 |
| 119 | `email-landing-page` | Email Landing Page | Landing Page | 2 | 图片 | 已完成 |
| 120 | `equilibrium` | Equilibrium | Hero Section | 2 | 图片 | 已完成 |
| 121 | `evergreen-finance` | Evergreen Finance | Fintech | 2 | 图片 | 已完成 |
| 122 | `faq-cta` | FAQ CTA | CTA Section | 2 | 图片 | 已完成 |
| 123 | `features` | Capabilities Overview | Features Section | 2 | 图片 | 已完成 |
| 124 | `feedback-slider` | Feedback Slider | Components | 2 | 图片 | 已完成 |
| 125 | `financialfocus` | FinancialFocus | Hero Section | 2 | 图片 | 已完成 |
| 126 | `finflow` | FinFlow | Fintech | 2 | 图片 | 已完成 |
| 127 | `flowmate-carousal` | FlowMate Carousal | Components | 1 | 图片 | 已完成 |
| 128 | `fun-404-page` | Fun 404 Page | Education | 1 | 图片 | 已完成 |
| 129 | `future-state` | Future-State | Landing Page | 2 | 图片 | 已完成 |
| 130 | `futuristic-cinematic` | Futuristic Cinematic | Hero Section | 2 | 图片 | 已完成 |
| 131 | `futuristic-tech` | Futuristic Tech | Hero Section | 2 | 图片 | 已完成 |
| 132 | `gateway-portal` | Gateway Portal | Landing Page | 2 | 图片 | 已完成 |
| 133 | `gear-shop` | Gear Shop | E-commerce | 2 | 图片 | 已完成 |
| 134 | `glassmorphic-feature-tabs` | Glassmorphic Feature Tabs | Components | 2 | 图片 | 已完成 |
| 135 | `glitch-pulse` | Glitch Pulse | Landing Page | 2 | 图片 | 已完成 |
| 136 | `global-cta-footer` | Global CTA Footer | CTA Section | 2 | 图片 | 已完成 |
| 137 | `golden-portal` | Golden Portal | Landing Page | 2 | 图片 | 已完成 |
| 138 | `growth-marketing-saas` | Growth Marketing SaaS | Hero Section | 2 | 图片 | 已完成 |
| 139 | `guardnet-benefits` | Guardnet Benefits | Benefits | 1 | 图片 | 已完成 |
| 140 | `guardnet-demo` | Guardnet Demo | Info | 1 | 图片 | 已完成 |
| 141 | `halo-benefits` | Halo Benefits | Why Us | 2 | 图片 | 已完成 |
| 142 | `halo-use-case` | Halo Use Case | Use Cases | 2 | 图片 | 已完成 |
| 143 | `health-portal` | Health Portal | Landing Page | 2 | 图片 | 已完成 |
| 144 | `immersive-ocean` | Immersive Ocean | Hero Section | 2 | 图片 | 已完成 |
| 145 | `impact-ventures` | Impact Ventures | Hero Section | 2 | 图片 | 已完成 |
| 146 | `intelligentx` | IntelligentX | Hero Section | 1 | 图片 | 已完成 |
| 147 | `interactive-portfolio` | Interactive Portfolio | Hero Section | 2 | 图片 | 已完成 |
| 148 | `interior-features` | Interior Features | Features Section | 2 | 图片 | 已完成 |
| 149 | `investment-hero` | Investment Gate | Landing Page | 2 | 图片 | 已完成 |
| 150 | `jewelry-store` | Jewelry Store | E-commerce | 2 | 图片 | 已完成 |
| 151 | `kova-features` | Kova Features | Benefits | 2 | 图片 | 已完成 |
| 152 | `kova-testimonial` | Kova Testimonial | Testimonials | 2 | 图片 | 已完成 |
| 153 | `launchex-about` | LaunchEx About | About Section | 2 | 图片 | 已完成 |
| 154 | `launchex-submissions` | LaunchEx Submissions | Features Section | 2 | 图片 | 已完成 |
| 155 | `layered-depth` | Layered Depth | Landing Page | 2 | 图片 | 已完成 |
| 156 | `learnly` | Learnly | Hero Section | 2 | 图片 | 已完成 |
| 157 | `liquid-glass-cta` | Liquid Glass CTA | CTA Section | 2 | 图片 | 已完成 |
| 158 | `liquid-glass-features` | Liquid Glass Features | Features Section | 2 | 图片 | 已完成 |
| 159 | `lodge-booking-app` | Lodge Booking App | Travel | 1 | 图片 | 已完成 |
| 160 | `luminara` | Luminara | Hero Section | 2 | 图片 | 已完成 |
| 161 | `luxury-botanical` | Luxury Botanical | Landing Page | 2 | 图片 | 已完成 |
| 162 | `luxury-focus` | Luxury Focus | E-commerce | 2 | 图片 | 已完成 |
| 163 | `luxury-hero` | Luxury Hero | Hero Section | 2 | 图片 | 已完成 |
| 164 | `luxury-real-estate` | Luxury Real Estate | Landing Page | 2 | 图片 | 已完成 |
| 165 | `media-card-carousel` | Media Card Carousel | Components | 1 | 图片 | 已完成 |
| 166 | `minimal-workflow-saas` | Minimal Workflow SaaS | SaaS | 2 | 图片 | 已完成 |
| 167 | `mouse-trail-cta` | Mouse Trail CTA | CTA Section | 2 | 图片 | 已完成 |
| 168 | `mythic-naturecore` | Mythic Naturecore | Landing Page | 2 | 图片 | 已完成 |
| 169 | `naturecore-saas` | Naturecore SaaS | Hero Section | 2 | 图片 | 已完成 |
| 170 | `neo-museum` | Neo Museum | Website | 2 | 图片 | 已完成 |
| 171 | `neon-logic` | Neon Logic | Landing Page | 2 | 图片 | 已完成 |
| 172 | `network-hero` | Network Hero | Hero Section | 2 | 图片 | 已完成 |
| 173 | `neural-interface` | Neural Interface | Landing Page | 2 | 图片 | 已完成 |
| 174 | `nex-max-upgrade` | Nex Max Upgrade | Pricing Page | 2 | 图片 | 已完成 |
| 175 | `nexacore-control` | NexaCore Control | Features Section | 2 | 图片 | 已完成 |
| 176 | `nexacore-process` | NexaCore Process | Process & Stats | 2 | 图片 | 已完成 |
| 177 | `nexacore-results` | NexaCore Results | Features Section | 2 | 图片 | 已完成 |
| 178 | `nike-hover` | Nike Hover | Features Section | 2 | 图片 | 已完成 |
| 179 | `nimbus-demo` | Nimbus Demo | Dashboards | 2 | 图片 | 已完成 |
| 180 | `nimbus-grid` | Nimbus Grid | Landing Page | 2 | 图片 | 已完成 |
| 181 | `nimbus-ops` | Nimbus Ops | CTA Section | 2 | 图片 | 已完成 |
| 182 | `nimbus-pricing` | NimBus Pricing | Pricing Page | 2 | 图片 | 已完成 |
| 183 | `nimbus-security` | Nimbus Security | Cards | 2 | 图片 | 已完成 |
| 184 | `nimbus-sticky-cards` | Nimbus Sticky Cards | Cards | 2 | 图片 | 已完成 |
| 185 | `no-code-waitlist` | No-Code Waitlist | Waitlist & Coming Soon | 2 | 图片 | 已完成 |
| 186 | `novadesk-signup` | NovaDesk Signup | Waitlist & Coming Soon | 2 | 图片 | 已完成 |
| 187 | `obsidian-hero` | Obsidian Hero | Hero Section | 2 | 图片 | 已完成 |
| 188 | `orbis-cards` | Orbis Cards | Cards | 2 | 图片 | 已完成 |
| 189 | `orbis-cta` | Orbis CTA | CTA Section | 2 | 图片 | 已完成 |
| 190 | `orbis-hello` | Orbis Hello | About Section | 2 | 图片 | 已完成 |
| 191 | `organic-odyssey` | Organic Odyssey | Hero Section | 2 | 图片 | 生成中 |
| 192 | `pixel-grid-hover` | Pixel Grid Hover | Case Studies | 2 | 图片 | 已完成 |
| 193 | `portal` | Portal | Hero Section | 3 | 图片 | 已完成 |
| 194 | `portfolio-about` | Portfolio About | About Section | 2 | 图片 | 已完成 |
| 195 | `projects-catalog` | Projects Catalog | Projects | 2 | 图片 | 生成中 |
| 196 | `prosthetics-hero` | Prosthetics Hero | Hero Section | 1 | 图片 | 已完成 |
| 197 | `pulse-3d` | Pulse 3D | 3D Website | 2 | 图片 | 生成中 |
| 198 | `radial-diagram` | Radial Diagram | Testimonials | 2 | 图片 | 生成中 |
| 199 | `retro-futurist` | Retro-Futurist | Hero Section | 2 | 图片 | 待修复 |
| 200 | `rocket-cta` | Rocket CTA | CTA Section | 2 | 图片 | 生成中 |
| 201 | `rocket-faq` | Rocket FAQ | FAQ & Help | 2 | 图片 | 未开始 |
| 202 | `rocket-pricing` | Rocket Pricing | Pricing Page | 2 | 图片 | 未开始 |
| 203 | `saas-pricing-flow` | SaaS Pricing Flow | Pricing Page | 2 | 图片 | 未开始 |
| 204 | `scroll-landing` | Scroll Landing Page | Interactive | 2 | 图片 | 未开始 |
| 205 | `scroll-marquee` | Scroll Marquee | Components | 2 | 图片 | 未开始 |
| 206 | `shop` | Daisy Shop | E-commerce | 2 | 图片 | 未开始 |
| 207 | `solace-sign-in` | Solace sign-in | Waitlist & Coming Soon | 2 | 图片 | 未开始 |
| 208 | `speakup-venture-hero` | SpeakUp Venture Hero | Hero Section | 2 | 图片 | 未开始 |
| 209 | `stark-minimal-footer` | Stark Minimal Footer | Footer Section | 2 | 图片 | 未开始 |
| 210 | `stellar-launch` | Stellar Launch | Landing Page | 2 | 图片 | 未开始 |
| 211 | `synthesis` | Synthesis | Landing Page | 2 | 图片 | 未开始 |
| 212 | `tech-noir-about` | Tech-Noir About | About Section | 2 | 图片 | 未开始 |
| 213 | `technical-specifications` | Technical Specifications | Components | 2 | 图片 | 未开始 |
| 214 | `travel-hero` | Scenic Travel | Landing Page | 2 | 图片 | 未开始 |
| 215 | `unwind-hero` | Unwind Hero | Hero Section | 2 | 图片 | 未开始 |
| 216 | `vaultshield` | VaultShield | Hero Section | 2 | 图片 | 未开始 |
| 217 | `veloce-cards` | Veloce Cards | Cards | 2 | 图片 | 未开始 |
| 218 | `velorix-iic` | Velorix IIC | Hero Section | 2 | 图片 | 未开始 |
| 219 | `vertex-sci` | Vertex Sci | Hero Section | 2 | 图片 | 未开始 |
| 220 | `visual-hero` | Visual Hero | Hero Section | 2 | 图片 | 未开始 |
| 221 | `waitlist-hero` | Waitlist Hero | Hero Section | 2 | 图片 | 未开始 |
| 222 | `wanderful-hero` | Wanderful Hero | Travel | 2 | 图片 | 未开始 |
| 223 | `wellness-balance` | Wellness Balance | Hero Section | 2 | 图片 | 未开始 |
| 224 | `wellness-hero` | Wellness Hero | Hero Section | 2 | 图片 | 未开始 |
| 225 | `yoga-coach` | Yoga Coach | Landing Page | 2 | 图片 | 未开始 |
| 226 | `404` | Nexto 404 | 404 Pages | 2 | 图片 | 未开始 |
| 227 | `ai-image-generator-ui` | AI Image Generator UI | AI Apps | 1 | 图片 | 未开始 |
| 228 | `modern-hr-dashboard` | Modern HR Dashboard | HR | 2 | 图片 | 未开始 |
| 229 | `saas-value` | SaaS Value | SaaS | 2 | 图片 | 未开始 |
| 230 | `acreage-farming-hero` | Acreage Farming | Landing Page | 3 | 视频 | 未开始 |
| 231 | `akor-security` | AKOR Security | Landing Page | 1 | 视频 | 未开始 |
| 232 | `apex-saa-s` | Apex SaaS | SaaS | 2 | 视频 | 未开始 |
| 233 | `bloom-ai` | Bloom AI | Hero Section | 1 | 视频 | 未开始 |
| 234 | `club-x-investors` | ClubX Investors | Landing Page | 2 | 视频 | 未开始 |
| 235 | `design-pro-academy` | DesignPro Academy | Hero Section | 1 | 视频 | 未开始 |
| 236 | `evr-ventures` | EVR Ventures | Hero Section | 1 | 视频 | 未开始 |
| 237 | `finlytic-ai-agent` | Finlytic AI Agent | SaaS | 1 | 视频 | 未开始 |
| 238 | `grow-ai-talent-platform` | Grow AI Talent Platform | SaaS | 2 | 视频 | 未开始 |
| 239 | `hr-saa-s-hero` | HR SaaS Hero | SaaS | 1 | 视频 | 未开始 |
| 240 | `mindloop` | Mindloop | SaaS | 2 | 视频 | 未开始 |
| 241 | `neo-vision` | NeoVision | Landing Page | 2 | 视频 | 未开始 |
| 242 | `neuralyn` | Neuralyn | SaaS | 2 | 视频 | 未开始 |
| 243 | `nexora-automation` | Nexora Automation | SaaS | 1 | 视频 | 未开始 |
| 244 | `nexus-it-solutions` | Nexus IT Solutions | Hero Section | 1 | 视频 | 未开始 |
| 245 | `nickel-payments` | Nickel Payments | SaaS | 1 | 视频 | 未开始 |
| 246 | `orbis-nft` | Orbis NFT | Landing Page | 2 | 视频 | 未开始 |
| 247 | `orbit-web3` | Orbit Web3 | Web3 | 1 | 视频 | 未开始 |
| 248 | `planet-orbit` | Planet Orbit | SaaS | 2 | 视频 | 未开始 |
| 249 | `power-ai` | Power AI | Hero Section | 1 | 视频 | 未开始 |
| 250 | `railroad.ai` | Railroad.ai | Hero Section | 2 | 视频 | 未开始 |
| 251 | `sky-elite-private-jets` | SkyElite Private Jets | Landing Page | 1 | 视频 | 未开始 |
| 252 | `stellar-ai` | Stellar AI | Hero Section | 1 | 视频 | 未开始 |
| 253 | `taskly` | Taskly | Hero Section | 1 | 图片 | 未开始 |
| 254 | `taskora-saa-s-hero` | Taskora SaaS Hero | SaaS | 1 | 视频 | 未开始 |
| 255 | `terra-geo-map` | Terra Geo Map | SaaS | 2 | 视频 | 未开始 |
| 256 | `transform-data` | Transform Data | Hero Section | 1 | 视频 | 未开始 |
| 257 | `velorah` | Velorah | Agency | 2 | 视频 | 未开始 |
| 258 | `x-portfolio-hero` | xPortfolio Hero | Hero Section | 1 | 视频 | 未开始 |
| 259 | `aethera-studio` | Aethera Studio | Hero Section | 1 | 图片 | 未开始 |
| 260 | `buzzentic-agency` | Buzzentic Agency | Agency | 1 | 图片 | 未开始 |
| 261 | `datacore-booking` | Datacore Booking | SaaS | 1 | 图片 | 未开始 |
| 262 | `framelix-3d-studios` | Framelix 3D Studios | Agency | 1 | 图片 | 未开始 |
| 263 | `logoisum-video-agency` | Logoisum Video Agency | Agency | 1 | 图片 | 未开始 |
| 264 | `new-era-automotive-hero` | New Era Automotive Hero | Automotive | 1 | 图片 | 未开始 |
| 265 | `new-era-bold-hero` | New Era Bold Hero | Agency | 1 | 图片 | 未开始 |
| 266 | `space-voyage` | Space Voyage | Landing Page | 2 | 图片 | 未开始 |
| 267 | `sync-ai` | Sync AI | Hero Section | 2 | 图片 | 未开始 |
| 268 | `targo-logistics-hero` | Targo Logistics Hero | SaaS | 1 | 图片 | 未开始 |
| 269 | `viktor-portfolio` | Viktor Portfolio | Portfolio | 1 | 图片 | 未开始 |
| 270 | `wealth-video-hero` | Wealth Video Hero | Fintech | 1 | 图片 | 未开始 |
| 271 | `web3-eos-hero` | Web3 EOS Hero | Web3 | 1 | 图片 | 未开始 |
| 272 | `weblex-dark-hero` | Weblex Dark Hero | Landing Page | 1 | 图片 | 未开始 |
| 273 | `community-superdesign-synapse` | Synapse | Landing Page | 1 | 视频 | 未开始 |
| 274 | `community-superdesign-card-swap` | Card Swap | Components | 1 | 视频 | 未开始 |
| 275 | `community-superdesign-hover-reveal-effect` | Hover reveal effect | Animations & Backgrounds | 1 | 视频 | 未开始 |
| 276 | `community-superdesign-scroll-journey-line` | Scroll Journey Line | Animations & Backgrounds | 1 | 视频 | 未开始 |
| 277 | `community-superdesign-gooey-gradient-background` | Gooey Gradient Background | Animations & Backgrounds | 1 | 视频 | 未开始 |
| 278 | `community-superdesign-horizontal-gallery` | Horizontal Gallery | Animations & Backgrounds | 1 | 视频 | 未开始 |
| 279 | `community-superdesign-disruptor-beta-launch` | Disruptor Beta Launch | Waitlist & Coming Soon | 1 | 图片 | 未开始 |
| 280 | `community-superdesign-ghost-cursor` | Ghost Cursor | Components | 1 | 视频 | 未开始 |
| 281 | `community-superdesign-interactive-folder` | Interactive Folder | Components | 1 | 视频 | 未开始 |
| 282 | `community-superdesign-parallax-stars-background` | Parallax Stars Background | Animations & Backgrounds | 1 | 视频 | 未开始 |
| 283 | `community-superdesign-typing-animation` | Typing animation | Components | 1 | 视频 | 未开始 |
| 284 | `community-superdesign-pill-nav` | Pill Nav | Components | 1 | 视频 | 未开始 |
| 285 | `community-superdesign-exploded-view-assembly` | "Exploded View" Assembly | Animations & Backgrounds | 1 | 视频 | 未开始 |
| 286 | `community-superdesign-rolodex-text` | Rolodex Text | Components | 1 | 视频 | 未开始 |
| 287 | `community-superdesign-lightning-background` | Lightning Background | Animations & Backgrounds | 1 | 视频 | 未开始 |
| 288 | `community-superdesign-hyperspeed-background` | Hyperspeed Background | Animations & Backgrounds | 1 | 视频 | 未开始 |
| 289 | `community-superdesign-light-rays-background` | Light Rays Background | Animations & Backgrounds | 1 | 视频 | 未开始 |
| 290 | `community-superdesign-glow-cursor-button` | Glow Cursor Button | Components | 1 | 视频 | 未开始 |
| 291 | `community-superdesign-interactive-card-stack` | Interactive Card Stack | Components | 1 | 视频 | 未开始 |
| 292 | `community-superdesign-counter` | Counter | Components | 1 | 视频 | 未开始 |
| 293 | `community-superdesign-modal-design-success-celebration-pastel-legibility-fixed-9fbd65` | Modal Design · success-celebration (pastel) — legibility fixed | Onboarding | 1 | 图片 | 未开始 |
| 294 | `personal-showcase` | Personal Showcase | Portfolio | 1 | 视频 | 未开始 |
| 295 | `digital-director` | Digital Director | Portfolio | 1 | 视频 | 未开始 |
| 296 | `intelligent-operations` | Intelligent Operations | Agency | 1 | 视频 | 未开始 |
| 297 | `skybridge-404` | Skybridge 404 | 404 | 1 | 视频 | 未开始 |
| 298 | `synth-mode` | Synth Mode | Fashion | 1 | 视频 | 未开始 |
| 299 | `agent-grove` | Agent Grove | SaaS | 1 | 视频 | 未开始 |
| 300 | `mostar-guide` | Mostar Guide | Travel | 1 | 视频 | 未开始 |
| 301 | `talent-collective` | Talent Collective | Agency | 1 | 视频 | 未开始 |
| 302 | `intelligence-layer` | Intelligence Layer | Technology | 1 | 视频 | 未开始 |
| 303 | `task-engine` | Task Engine | SaaS | 1 | 视频 | 未开始 |
| 304 | `autonomous-ops` | Autonomous Ops | SaaS | 1 | 视频 | 未开始 |
| 305 | `orbit-flora` | Orbit Flora | AI | 1 | 视频 | 未开始 |
| 306 | `data-signal` | Data Signal | Analytics | 1 | 视频 | 未开始 |
| 307 | `cyber-layer` | Cyber Layer | Cybersecurity | 1 | 视频 | 未开始 |
| 308 | `ai-runtime` | AI Runtime | AI | 1 | 视频 | 未开始 |
| 309 | `real-time-alerts` | Real-Time Alerts | Sign in | 1 | 视频 | 未开始 |
| 310 | `pet-diagnostics` | Pet Diagnostics | Healthcare | 1 | 视频 | 未开始 |
| 311 | `growth-decisions` | Growth Decisions | SaaS | 1 | 视频 | 未开始 |
| 312 | `aurex-finance` | Aurex Finance | Fintech | 1 | 视频 | 未开始 |
| 313 | `agent-wave` | Agent Wave | AI | 1 | 视频 | 未开始 |
| 314 | `palomar-labs` | Palomar Labs | AI | 1 | 视频 | 未开始 |
| 315 | `scaling-platform` | Scaling Platform | SaaS | 1 | 视频 | 未开始 |
| 316 | `quantum-lucid` | Quantum Lucid | SaaS | 1 | 视频 | 未开始 |
| 317 | `space-planet` | Space planet | 3D | 1 | 视频 | 未开始 |
| 318 | `7` | Synapse Dark Hero | SaaS | 1 | 视频 | 未开始 |
| 319 | `portfolio-cosmic-hero` | Portfolio Cosmic | Portfolio | 1 | 视频 | 未开始 |
| 320 | `3` | ClearInvoice SaaS Hero | SaaS | 1 | 视频 | 未开始 |
| 321 | `codenest-hero` | CodeNest Coding Platform | Landing Page | 1 | 视频 | 未开始 |
| 322 | `digitwist-hero` | Digitwist AI Builder | SaaS | 1 | 视频 | 未开始 |
| 323 | `deck-investor` | Investor Deck | Investor Presentations | 1 | 视频 | 未开始 |
| 324 | `bionova-hero` | Bionova Biotech | SaaS | 1 | 视频 | 未开始 |
| 325 | `nova-space-landing` | NOVA Space Systems | Landing Page | 1 | 视频 | 未开始 |
| 326 | `4` | Datacore SaaS Hero | SaaS | 1 | 视频 | 未开始 |
| 327 | `15` | Dark Portfolio Hero | Portfolio | 1 | 视频 | 未开始 |
| 328 | `vex-ventures-hero` | VEX Ventures | Hero Section | 1 | 无 | 未开始 |
| 329 | `5` | Glassmorphism Agency Hero | Agency | 1 | 无 | 未开始 |
| 330 | `innovation-landing` | Innovation | Landing Page | 1 | 无 | 未开始 |
| 331 | `10` | AI Automation Hero | AI / SaaS | 1 | 无 | 未开始 |
| 332 | `securify-hero` | Securify Data Security | SaaS | 1 | 无 | 未开始 |
| 333 | `18` | Loader Animation | Component | 1 | 无 | 未开始 |
| 334 | `rivr-hero` | RIVR | Hero Section | 1 | 无 | 未开始 |
| 335 | `wisa-space-hero` | WISA Space | Hero Section | 1 | 无 | 未开始 |
| 336 | `vortex-studio-hero` | AI Designer Portfolio | Landing Page | 2 | 无 | 未开始 |
| 337 | `impressive-hero` | Impressive Hero | Hero Section | 1 | 无 | 未开始 |
| 338 | `flowmate-landing` | FlowMate | Landing Page | 2 | 无 | 未开始 |
| 339 | `luminex-hero` | Luminex | Hero Section | 1 | 无 | 未开始 |
| 340 | `nike-premium-landing` | Nike Premium Landing | Landing Page | 1 | 无 | 未开始 |
| 341 | `sentinel-ai-hero` | Sentinel AI | Hero Section | 1 | 无 | 未开始 |
| 342 | `slam-dunk-hero` | Slam Dunk | Hero Section | 1 | 无 | 未开始 |
| 343 | `crypto-wealth-hero` | Crypto Wealth | Hero Section | 1 | 无 | 未开始 |
| 344 | `shamoni-hero` | Shamoni | Hero Section | 1 | 无 | 未开始 |
| 345 | `glow-features` | Glow Features | Features Section | 1 | 无 | 未开始 |
| 346 | `lumina-footer` | Lumina | Footer Section | 1 | 无 | 未开始 |
| 347 | `nexacore-hero` | NexaCore | Landing Page | 1 | 无 | 未开始 |
| 348 | `guardnet-landing` | Guardnet | Landing Page | 1 | 无 | 未开始 |
| 349 | `automation-machines-hero` | Automation Machines | Hero Section | 1 | 无 | 未开始 |
| 350 | `focus-ai-landing` | Focus AI | Landing Page | 1 | 无 | 未开始 |
| 351 | `design-rocket-email-hero` | Email Marketing | Email Marketing | 1 | 无 | 未开始 |
| 352 | `rivr-defi-landing` | RIVR DeFi | Landing Page | 1 | 无 | 未开始 |
| 353 | `duolingo-styleguide-hero` | Duolingo Styleguide | Hero Section | 1 | 无 | 未开始 |
| 354 | `velorah-focus-hero` | Velorah Focus | Social Media | 1 | 无 | 未开始 |
| 355 | `price-calculator` | Price Calculator | SaaS | 1 | 无 | 未开始 |
| 356 | `yacht-club-hero` | Yacht Club | Landing Page | 1 | 无 | 未开始 |
| 357 | `social-media-posts-hero` | Social Media Posts | Social Media | 1 | 无 | 未开始 |
| 358 | `ecommerce-website-landing` | E-commerce Website | Landing Page | 1 | 无 | 未开始 |
| 359 | `digital-epoch-hero` | Digital Epoch | Hero Section | 1 | 无 | 未开始 |
| 360 | `ecovolta-hero` | EcoVolta | Hero Section | 1 | 无 | 未开始 |
| 361 | `kresna-footer` | Kresna Footer | Footer Section | 1 | 无 | 未开始 |
| 362 | `vize-footer` | Vize Footer | Footer Section | 1 | 无 | 未开始 |
| 363 | `pro-ai-deck` | Pro AI Deck | Presentation | 1 | 无 | 未开始 |
| 364 | `haul-footer` | HAUL! | Footer Section | 1 | 无 | 未开始 |
| 365 | `veloce-finance-landing` | Veloce Finance | Landing Page | 1 | 无 | 未开始 |
| 366 | `6` | Bold Portfolio Hero | Portfolio | 1 | 无 | 未开始 |
| 367 | `slate-hero` | Slate | SaaS | 1 | 无 | 未开始 |
| 368 | `ecovolta-v2-hero` | EcoVolta V2 | Hero Section | 1 | 无 | 未开始 |
| 369 | `nexora-features` | Nexora Features | Features Section | 1 | 无 | 未开始 |
| 370 | `vitara-hero` | Vitara | Landing Page | 1 | 无 | 未开始 |
| 371 | `zenith-realty-landing` | Zenith Realty | Landing Page | 1 | 无 | 未开始 |
| 372 | `nexar-hero` | Nexar | Hero Section | 1 | 无 | 未开始 |
| 373 | `prioritize-hero` | Prioritize | Hero Section | 1 | 无 | 未开始 |
| 374 | `vertex-ai-hero` | VertexAI Hero | Hero Section | 1 | 无 | 未开始 |
| 375 | `keep-ahead-features` | Keep Ahead Features | Features Section | 1 | 无 | 未开始 |
| 376 | `benefits-features` | Benefits Features | Features Section | 1 | 无 | 未开始 |
| 377 | `zenith-footer` | Zenith Footer | Footer Section | 1 | 无 | 未开始 |
| 378 | `digital-reality-hero` | Digital Reality | Social Media | 1 | 无 | 未开始 |
| 379 | `community-cta` | Community CTA | CTA Section | 1 | 无 | 未开始 |
| 380 | `package-fits-pricing` | What Package Fits You | Pricing | 1 | 无 | 未开始 |
