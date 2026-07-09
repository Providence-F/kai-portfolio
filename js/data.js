window.PianoApp = window.PianoApp || {};

window.PianoApp.data = {
  projects: [
    {
      id: "1",
      name: "深度调研系统 / Research OS",
      nameEn: "Research OS",
      description: "自建的一套可审计研究操作系统。用状态机把「找资料—验证—写结论」的反复摩擦压缩成可复用的工作流：每个强结论必须回链到假设与原始证据，否则 validator 报 FAIL；变更留痕、来源可追溯、偏差可复盘。已应用于南芥智能等真实商业研究项目，累计输出 37 份可回链证据的深度调研报告。",
      descriptionEn: "A self-built auditable research operating system. A state machine compresses the repeated friction of searching, verifying, and writing into a reusable workflow: every strong conclusion must link back to hypotheses and raw evidence, or the validator fails; changes are logged, sources traceable, and biases reviewable. Already applied to real business research projects such as Nanjie Intelligence, producing 37 evidence-linked research reports.",
      year: "2026",
      category: "AI 产品",
      categoryEn: "AI Product",
      image: "assets/images/research-os.png",
      tech: ["Python", "状态机", "Validator"],
      techEn: ["Python", "State Machine", "Validator"],
      link: "https://providence-f.github.io/research-os/",
    },
    {
      id: "2",
      name: "知识塔罗",
      nameEn: "Knowledge Tarot",
      description: "AI 驱动的自我对话工具。v1.1 已上线，完成 24 位老用户迁移；支持多牌堆、系统牌堆、示范牌堆、分享克隆、日签与三牌阵，并配有多风格 AI 解读与「反应浮窗」。我把随机抽牌设计成一场结构化的自我访谈，帮助用户在不确定中整理思绪，把碎片化感受沉淀为可回顾的认知卡片。",
      descriptionEn: "An AI-powered self-dialogue tool. v1.1 is live with 24 legacy users migrated; it supports multiple decks, system decks, demo decks, share-and-clone, daily draw, three-card spread, multi-style AI interpretation, and a reaction floating window. I designed the random draw as a structured self-interview, helping users sort out their thoughts amid uncertainty and turn fragmented feelings into reviewable cognitive cards.",
      year: "2025",
      category: "AI 产品",
      categoryEn: "AI Product",
      image: "assets/images/knowledge-tarot.png",
      tech: ["Express", "DeepSeek API", "腾讯云"],
      techEn: ["Express", "DeepSeek API", "Tencent Cloud"],
      link: "http://110.40.140.131:8080/v2.html",
    },
    {
      id: "3",
      name: "森林精灵萤火虫科普展会",
      nameEn: "Forest Spirit Firefly Exhibition",
      description: "南京少年得志网络科技有限公司 · 项目经理实习生。独立负责 350㎡ 科普展会全链路：搭建 7 大板块内容架构、完成物料采买、编写团队招募与培训 SOP，跨职能协调平面 / 3D / 布展设计师，以目标拆解 + 日复盘推进项目，五一上线运营 1 个月。负责叙事说服与资源整合，展会抖音本地热度排名第二，辐射 1 万+ 用户。",
      descriptionEn: "Project manager intern at Nanjing Shaoniande Zhi Network Technology. Independently owned the full chain of a 350㎡ science exhibition: 7 content sections, procurement, team recruitment and training SOPs, cross-functional coordination of graphic / 3D / exhibition designers, daily goal breakdown and retrospectives, launched for one month during May Day. Led narrative persuasion and resource integration; ranked second in local Douyin buzz, reaching 10,000+ users.",
      year: "2024",
      category: "科普策展",
      categoryEn: "Science Curation",
      image: "assets/images/firefly/07526b43d77772878c7d9334e13ae84b.jpg",
      images: [
        "assets/images/firefly/07526b43d77772878c7d9334e13ae84b.jpg",
        "assets/images/firefly/1c05264f3149f3bc6c0584a728025bd8.jpg",
        "assets/images/firefly/592c397dac318fa6b62eedf4bbf8e850.jpg",
        "assets/images/firefly/8117715f65bb89eea1fd9346f7108e20.jpg",
        "assets/images/firefly/8a28b2bbfd27aa5272b300297e8b56ed.jpg",
        "assets/images/firefly/8c3799d73a2aabaeefb213c0b8e64976.jpg",
        "assets/images/firefly/adccfa4676dc26ea770cc85976600eac.jpg",
        "assets/images/firefly/b6b2865b569d7365851ce6f53d98dac4.jpg",
        "assets/images/firefly/de3b2075aad3ad326179f0b8b21dda44.jpg",
      ],
      tech: ["项目管理", "科普策展", "运营传播"],
      techEn: ["Project Management", "Science Curation", "Operations"],
      link: "#",
    },
  ],

  experiences: [
    {
      id: "1",
      orgName: "南京信息工程大学",
      orgNameEn: "Nanjing University of Information Science & Technology",
      orgLocation: "南京",
      orgLocationEn: "Nanjing",
      tags: ["本科", "物理学（师范）"],
      tagsEn: ["B.S.", "Physics Education"],
      position: "物理学（师范）· 本科",
      positionEn: "Physics Education · B.S.",
      startDate: "2023-09",
      endDate: "2027-06",
      roles: [
        {
          titleZh: "核心课程",
          titleEn: "Core Courses",
          description: "量子力学、电动力学、固体物理、热力学与统计物理、数学物理方程、普通物理。",
          descriptionEn: "Quantum Mechanics, Electrodynamics, Solid State Physics, Thermodynamics & Statistical Physics, Equations of Mathematical Physics, General Physics."
        },
        {
          titleZh: "学业方向",
          titleEn: "Academic Focus",
          description: "在师范物理的训练中打磨拆解复杂概念的能力，同时向 AI 产品开发者转型，尝试把科研方法与产品思维结合。",
          descriptionEn: "Trained in physics education to break down complex concepts; transitioning toward AI product development by combining research methods with product thinking."
        }
      ]
    },
    {
      id: "2",
      orgName: "南京南芥智能科技有限公司",
      orgNameEn: "Nanjing Nanjie Intelligence Technology Co., Ltd.",
      orgLocation: "南京",
      orgLocationEn: "Nanjing",
      tags: ["AI Agent", "商业研究"],
      tagsEn: ["AI Agent", "Business Research"],
      position: "商业研究实习（AI Agent 方向）",
      positionEn: "Business Research Intern (AI Agent)",
      startDate: "2026-03",
      endDate: "2026-06",
      roles: [
        {
          titleZh: "公司研究",
          titleEn: "Company Research",
          description: "调研中国 AI 创业公司背景、融资、产品、目标客户与商业化进展，通过官网、招聘、公开报道、招投标、社媒等多源信息交叉验证。"
        },
        {
          titleZh: "产品拆解与报告",
          titleEn: "Product Analysis & Reports",
          description: "体验 AI 产品并记录功能、流程、付费点与竞品对比，输出公司研究卡片、赛道分析表与竞品对比表；对重点公司做深度拆解，产出 6 份可回链证据的深度调研报告。"
        }
      ]
    },
    {
      id: "3",
      orgName: "南京少年得志网络科技有限公司",
      orgNameEn: "Nanjing Shaoniande Zhi Network Technology Co., Ltd.",
      orgLocation: "南京",
      orgLocationEn: "Nanjing",
      tags: ["项目管理", "科普策展"],
      tagsEn: ["Project Management", "Science Curation"],
      position: "项目经理实习生 · 森林精灵萤火虫展会",
      positionEn: "Project Manager Intern · Firefly Exhibition",
      startDate: "2023-09",
      endDate: "2024-05",
      roles: [
        {
          titleZh: "全链路统筹",
          titleEn: "End-to-End Ownership",
          description: "独立负责 350㎡ 科普展会全链路：7 大板块内容架构、物料采买、团队招募与培训 SOP。"
        },
        {
          titleZh: "跨职能协同",
          titleEn: "Cross-Functional Coordination",
          description: "协调平面 / 3D / 布展设计师，以目标拆解 + 日复盘推进项目，五一上线运营 1 个月。"
        },
        {
          titleZh: "传播与资源整合",
          titleEn: "Promotion & Resource Integration",
          description: "负责叙事说服与资源整合，展会抖音本地热度排名第二，辐射 1 万+ 用户。"
        }
      ]
    },
    {
      id: "4",
      orgName: "成都好奇教育科技有限公司",
      orgNameEn: "Chengdu Haoqi Education Technology Co., Ltd.",
      orgLocation: "成都",
      orgLocationEn: "Chengdu",
      tags: ["心理疗愈", "教育"],
      tagsEn: ["Psychological Healing", "Education"],
      position: "心理疗愈师 · 暑期实习",
      positionEn: "Psychological Healing Facilitator · Summer Intern",
      startDate: "2025-06",
      endDate: "2025-09",
      roles: [
        {
          titleZh: "青少年心理支持",
          titleEn: "Youth Psychological Support",
          description: "在好奇学习社区为青少年提供一对一心理疏导与访谈，处理情绪、成长与关系议题；运用深度访谈技术识别真实需求，整理结构化来访档案并参与社群运营。"
        }
      ]
    },
    {
      id: "5",
      orgName: "南京青职云教育科技有限公司",
      orgNameEn: "Nanjing Qingzhi Cloud Education Technology Co., Ltd.",
      orgLocation: "南京",
      orgLocationEn: "Nanjing",
      tags: ["销售运营", "用户研究"],
      tagsEn: ["Sales Operations", "User Research"],
      position: "电话审核组长",
      positionEn: "Call Audit Team Lead",
      startDate: "2023-06",
      endDate: "2023-09",
      roles: [
        {
          titleZh: "话术审核与 SOP",
          titleEn: "Script Audit & SOP",
          description: "审核销售团队电话录音与话术，提炼高转化话术模板并输出 SOP；通过用户画像分析判断客户真实需求与付费意愿，优化线索分层标准。"
        }
      ]
    },
  ],

  about: {
    name: "房宇航",
    nameEn: "Kai",
    typewriter: [
      "你好，我是房宇航。",
      "一个从物理学师范走向 AI 产品的人。",
      "我相信好的研究系统，能帮人在信息洪流里守住判断力；",
      "也相信好的产品，应该帮人把生活还给自己。",
    ],
    typewriterEn: [
      "Hi, I'm Kai.",
      "A physics-education major turning toward AI product development.",
      "I believe a good research system helps people keep their judgment in the flood of information;",
      "and that good products should give life back to people.",
    ],
    avatar: "assets/images/portrait-new.png?v=2",
    avatarAlt: "房宇航的自画像",
    avatarAltEn: "Kai's self-portrait",
    bio: [
      "物理学师范背景，正在向 AI 产品开发者转型。做过 350㎡ 科普展的项目经理，也在 AI Agent 方向的商业研究里打磨可审计的研究流程。",
      "现在的关注点是：如何把严谨的调研方法产品化，让个人和小团队也能做出有依据的决策。",
      "工作方式上，我习惯用 AI 原生工作流完成信息搜集、证据矩阵、Red Team 反方审计、结论回链与可视化输出；用 Obsidian + RAG 把碎片化信息沉淀为可复用的认知资产。",
      "长期目标是跑通一人公司：把知识塔罗、Research OS 和持续的内容输出，变成能独立验证的产品组合。",
      "欢迎通过电话或邮件联系我，一起聊聊研究、产品，或者如何把复杂问题讲清楚。"
    ],
    bioEn: [
      "Physics-education background, transitioning into AI product development. I've managed a 350㎡ science exhibition and worked on auditable research workflows in AI-agent business research.",
      "My current focus: productizing rigorous research methods so individuals and small teams can make evidence-based decisions.",
      "In my workflow, I use AI-native loops for information gathering, evidence matrices, red-team critique, evidence-linked conclusions, and visual output; I use Obsidian + RAG to turn fragmented information into reusable cognitive assets.",
      "My long-term goal is to run a one-person company: turning Knowledge Tarot, Research OS, and continuous content output into an independently verifiable product portfolio.",
      "Feel free to reach out by phone or email to talk about research, product, or how to make complex ideas clear."
    ],
    socialLinks: [
      { name: "电话", nameEn: "Phone", type: "link", url: "tel:18951391402" },
      { name: "邮箱", nameEn: "Email", type: "link", url: "mailto:3166831387@qq.com" },
    ],
  },

  navMappings: {
    keys: [
      { note: "C3", label: "portfolio", href: "portfolio.html" },
      { note: "G3", label: "experience", href: "experience.html" },
      { note: "B3", label: "about", href: "about.html" },
    ],
    pageToNote: {
      "portfolio.html": "C3",
      "experience.html": "G3",
      "about.html": "B3",
    },
    variants: {
      "portfolio.html": "circle-reveal",
      "experience.html": "circle-reveal",
      "about.html": "circle-reveal",
    },
  },
};
