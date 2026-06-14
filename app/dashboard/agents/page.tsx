'use client';

import { useState } from 'react';
import { Plus, Zap, X } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  specialty: string;
  model: string;
  status: 'active' | 'idle' | 'thinking' | 'running';
  tasks: number;
  uptime: string;
}

const SAMPLE_AGENTS: Agent[] = [
  // ──────────── MAESTRÍA & DIRECCIÓN ────────────
  {
    id: 'agente_maestro',
    name: 'Agente Maestro',
    role: 'Dirección General · Orquestación',
    specialty: 'Planificación estratégica, delegación inteligente, síntesis de resultados',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 28,
    uptime: '100%',
  },
  {
    id: 'gerente_ia',
    name: 'Gerente IA',
    role: 'Dirección Ejecutiva · Supervisión',
    specialty: 'Control de calidad, auditoría de tareas, reportes ejecutivos',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 32,
    uptime: '99.9%',
  },
  {
    id: 'director_deep_learning',
    name: 'Director de Deep Learning',
    role: 'Mejora Continua · Aprendizaje',
    specialty: 'Análisis de bitácoras, síntesis de patrones, recomendaciones de evolución',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 16,
    uptime: '99.95%',
  },

  // ──────────── VENTAS & NEGOCIO ────────────
  {
    id: 'calificador_leads',
    name: 'Calificador de Leads',
    role: 'Ventas · Lead Scoring',
    specialty: 'Evaluación de prospectos, priorización, scoring automático',
    model: '⭐ Sonnet 4.6',
    status: 'active',
    tasks: 42,
    uptime: '99.9%',
  },
  {
    id: 'generador_propuestas',
    name: 'Generador de Propuestas',
    role: 'Ventas · Pitch & Copy',
    specialty: 'Redacción de cotizaciones, argumentación de venta, CTAs persuasivos',
    model: '⭐ Sonnet 4.6',
    status: 'active',
    tasks: 38,
    uptime: '99.8%',
  },
  {
    id: 'cierre_automatico',
    name: 'Cierre Automático',
    role: 'Ventas · Negociación',
    specialty: 'Objeción handling, estrategia de cierre, follow-up inteligente',
    model: '⭐ Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.7%',
  },
  {
    id: 'prospector_clientes',
    name: 'Prospector de Clientes',
    role: 'Ventas · Prospecting',
    specialty: 'Identificación de nichos, búsqueda de empresas, lead sourcing',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 18,
    uptime: '99.8%',
  },
  {
    id: 'analista_competencia',
    name: 'Analista de Competencia',
    role: 'Negocio · Inteligencia Competitiva',
    specialty: 'Análisis de rivales, benchmarking, ventajas diferenciables',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 12,
    uptime: '99.9%',
  },

  // ──────────── CONTENIDO & MARKETING ────────────
  {
    id: 'estratega_contenido',
    name: 'Estratega de Contenido',
    role: 'Marketing · Estrategia',
    specialty: 'Planificación de contenido, calendarios editoriales, narrativa de marca',
    model: '⭐ Sonnet 4.6',
    status: 'active',
    tasks: 45,
    uptime: '100%',
  },
  {
    id: 'redactor_blog',
    name: 'Redactor de Blog',
    role: 'Contenido · Copywriting',
    specialty: 'Artículos optimizados, storytelling, engagement narrativo',
    model: 'Sonnet 4.6',
    status: 'thinking',
    tasks: 23,
    uptime: '99.7%',
  },
  {
    id: 'especialista_seo',
    name: 'Especialista SEO',
    role: 'SEO · Posicionamiento',
    specialty: 'Technical SEO, keywords, meta tags, estructura JSON-LD',
    model: 'Haiku 4.5',
    status: 'active',
    tasks: 35,
    uptime: '100%',
  },
  {
    id: 'auditor_seo_tecnico',
    name: 'Auditor SEO Técnico',
    role: 'SEO · Auditoría',
    specialty: 'Análisis de velocidad, crawlability, mobile-first, Core Web Vitals',
    model: 'Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.8%',
  },
  {
    id: 'gestor_redes_sociales',
    name: 'Gestor de Redes Sociales',
    role: 'Marketing · Social Media',
    specialty: 'Calendarios, copywriting, engagement strategy, community management',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 28,
    uptime: '99.9%',
  },
  {
    id: 'diseñador_campañas',
    name: 'Diseñador de Campañas',
    role: 'Marketing · Campaigns',
    specialty: 'Diseño de estrategias, creatividad, brief visual, estructuración de anuncios',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 19,
    uptime: '99.8%',
  },
  {
    id: 'copywriter_premium',
    name: 'Copywriter Premium',
    role: 'Copywriting · Voz de Marca',
    specialty: 'Copy luxury, argumentación de alto nivel, persuasión refinada',
    model: '⭐ Sonnet 4.6',
    status: 'active',
    tasks: 16,
    uptime: '99.9%',
  },
  {
    id: 'especialista_email',
    name: 'Especialista Email Marketing',
    role: 'Marketing · Automatización',
    specialty: 'Secuencias de email, subject lines, funnels de conversión',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 14,
    uptime: '99.8%',
  },

  // ──────────── DISEÑO & CREATIVIDAD ────────────
  {
    id: 'director_arte',
    name: 'Director de Arte',
    role: 'Diseño · Dirección Visual',
    specialty: 'Conceptos visuales, tipografía, paletas, composición, marca',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 26,
    uptime: '99.9%',
  },
  {
    id: 'diseñador_ui_ux',
    name: 'Diseñador UI/UX',
    role: 'Diseño · Interfaces',
    specialty: 'Wireframes, prototipado, accesibilidad, user flows, responsive design',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 31,
    uptime: '99.8%',
  },
  {
    id: 'ilustrador_ia',
    name: 'Ilustrador IA',
    role: 'Creatividad · Generación Visual',
    specialty: 'Ilustraciones custom, estilos artísticos, generación de assets visuales',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 24,
    uptime: '99.9%',
  },
  {
    id: 'animador_motion',
    name: 'Animador Motion Design',
    role: 'Motion · Cinematografía',
    specialty: 'Animaciones GSAP, scroll cinematográfico, transiciones premium, 3D web',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 18,
    uptime: '99.8%',
  },
  {
    id: 'especialista_3d',
    name: 'Especialista 3D Web',
    role: 'Creatividad · WebGL',
    specialty: 'Three.js, React Three Fiber, shaders GLSL, efectos 3D interactivos',
    model: 'Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.7%',
  },
  {
    id: 'curador_design',
    name: 'Curador de Diseño',
    role: 'Diseño · Auditoría',
    specialty: 'Análisis de experiencia, benchmarks visuales, recomendaciones de polish',
    model: 'Opus 4.8',
    status: 'active',
    tasks: 14,
    uptime: '99.95%',
  },

  // ──────────── DESARROLLO & CÓDIGO ────────────
  {
    id: 'arquitecto_sistemas',
    name: 'Arquitecto de Sistemas',
    role: 'Desarrollo · Arquitectura',
    specialty: 'Diseño de infraestructura, escalabilidad, patrones, database design',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 22,
    uptime: '99.95%',
  },
  {
    id: 'desarrollador_frontend',
    name: 'Desarrollador Frontend',
    role: 'Desarrollo · React',
    specialty: 'React, Next.js, TypeScript, componentes reutilizables, performance',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 39,
    uptime: '99.8%',
  },
  {
    id: 'desarrollador_backend',
    name: 'Desarrollador Backend',
    role: 'Desarrollo · API',
    specialty: 'APIs REST, bases de datos, autenticación, seguridad, escalabilidad',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 35,
    uptime: '99.9%',
  },
  {
    id: 'especialista_devops',
    name: 'Especialista DevOps',
    role: 'Operaciones · Cloud',
    specialty: 'CI/CD, Docker, Kubernetes, deployment, monitoreo, infraestructura',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 17,
    uptime: '99.95%',
  },
  {
    id: 'revisor_codigo',
    name: 'Revisor de Código',
    role: 'QA · Code Review',
    specialty: 'Auditoría de código, best practices, seguridad, performance, refactoring',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 28,
    uptime: '99.9%',
  },
  {
    id: 'ingeniero_qa',
    name: 'Ingeniero QA',
    role: 'Testing · Calidad',
    specialty: 'Test planning, unit tests, E2E, performance, debugging, reportes',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 26,
    uptime: '99.8%',
  },
  {
    id: 'especialista_seguridad',
    name: 'Especialista Seguridad',
    role: 'Seguridad · Compliance',
    specialty: 'Vulnerabilidades, OWASP, encryption, autenticación, compliance regulatorio',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 12,
    uptime: '99.95%',
  },
  {
    id: 'optimizador_performance',
    name: 'Optimizador de Performance',
    role: 'Desarrollo · Optimización',
    specialty: 'Core Web Vitals, bundle size, caching, lazy loading, LCP/FID/CLS',
    model: 'Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.8%',
  },
  {
    id: 'ingeniero_ia',
    name: 'Ingeniero IA',
    role: 'IA · Integración',
    specialty: 'LLMs, embeddings, RAG, fine-tuning, prompting, agentes autónomos',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 19,
    uptime: '99.9%',
  },

  // ──────────── AUTOMATIZACIÓN & INTEGRACIONES ────────────
  {
    id: 'orquestador_n8n',
    name: 'Orquestador n8n',
    role: 'Automatización · Workflows',
    specialty: 'Flujos de n8n, webhooks, sincronización de datos, automatización end-to-end',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 31,
    uptime: '99.9%',
  },
  {
    id: 'integrador_api',
    name: 'Integrador API',
    role: 'Integraciones · Conectores',
    specialty: 'APIs REST, webhooks, OAuth, Zapier, Make, sincronización de servicios',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 24,
    uptime: '99.8%',
  },
  {
    id: 'especialista_scraping',
    name: 'Especialista Web Scraping',
    role: 'Datos · Extracción',
    specialty: 'Web scraping, parsing HTML, APIs públicas, data pipeline, ETL',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 16,
    uptime: '99.7%',
  },
  {
    id: 'analista_datos',
    name: 'Analista de Datos',
    role: 'Analytics · Reporting',
    specialty: 'Análisis de métricas, dashboards, insights, reportes, visualizaciones',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 18,
    uptime: '99.95%',
  },

  // ──────────── SOPORTO & OPERACIONES ────────────
  {
    id: 'gestor_tickets',
    name: 'Gestor de Tickets',
    role: 'Soporte · Clasificación',
    specialty: 'Triaje de incidentes, clasificación automática, routing, priorización',
    model: 'Haiku 4.5',
    status: 'active',
    tasks: 52,
    uptime: '99.95%',
  },
  {
    id: 'especialista_soporte',
    name: 'Especialista Soporte',
    role: 'Soporte · Customer Service',
    specialty: 'Resolución de problemas, FAQ, troubleshooting, customer happiness',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 38,
    uptime: '99.8%',
  },
  {
    id: 'especialista_compliance',
    name: 'Especialista Compliance',
    role: 'Legal · Regulatorio',
    specialty: 'GDPR, CCPA, contratos, términos y condiciones, políticas, auditoría',
    model: 'Opus 4.8',
    status: 'active',
    tasks: 9,
    uptime: '99.95%',
  },

  // ──────────── VIDEO & AUDIO ────────────
  {
    id: 'productor_video',
    name: 'Productor de Video',
    role: 'Video · Producción',
    specialty: 'Guiones, storyboards, edición, efectos visuales, post-producción',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 21,
    uptime: '99.8%',
  },
  {
    id: 'especialista_voz',
    name: 'Especialista Voice Over',
    role: 'Audio · Voz IA',
    specialty: 'Text-to-speech, ElevenLabs, síntesis de voz, locutores multiidioma',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 14,
    uptime: '99.9%',
  },
  {
    id: 'compositor_musica',
    name: 'Compositor Música',
    role: 'Audio · Música',
    specialty: 'Composición, generación de soundtracks, licencias, efectos de sonido',
    model: 'Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.7%',
  },

  // ──────────── EDUCACIÓN & CAPACITACIÓN ────────────
  {
    id: 'entrenador_ia',
    name: 'Entrenador IA',
    role: 'Educación · Training',
    specialty: 'Diseño de cursos, módulos de aprendizaje, evaluaciones, mentoría',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 25,
    uptime: '99.8%',
  },
  {
    id: 'tutor_tecnico',
    name: 'Tutor Técnico',
    role: 'Educación · Consultoría',
    specialty: 'Enseñanza de desarrollo, best practices, architectural guidance',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 13,
    uptime: '99.9%',
  },

  // ──────────── FINANZAS & PRESUPUESTO ────────────
  {
    id: 'analista_presupuesto',
    name: 'Analista de Presupuesto',
    role: 'Finanzas · Budgeting',
    specialty: 'Forecasting, asignación presupuestaria, ROI analysis, cost optimization',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 11,
    uptime: '99.9%',
  },
  {
    id: 'especialista_facturacion',
    name: 'Especialista Facturación',
    role: 'Finanzas · Billing',
    specialty: 'Invoicing, subscriptions, payment processing, reconciliación',
    model: 'Haiku 4.5',
    status: 'active',
    tasks: 32,
    uptime: '99.95%',
  },

  // ──────────── INVESTIGACIÓN & ANÁLISIS ────────────
  {
    id: 'investigador_mercado',
    name: 'Investigador de Mercado',
    role: 'Research · Market Intelligence',
    specialty: 'Market sizing, trends, consumer insights, competitive landscape',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 15,
    uptime: '99.8%',
  },
  {
    id: 'experto_usuario',
    name: 'Experto UX Research',
    role: 'Research · User Studies',
    specialty: 'User interviews, surveys, usability testing, journey mapping',
    model: 'Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.7%',
  },

  // ──────────── SOCIOS & ECOSISTEMA ────────────
  {
    id: 'gerente_socios',
    name: 'Gerente de Socios',
    role: 'Ecosistema · Partnership',
    specialty: 'Identificación de socios, negocios estratégicos, co-marketing',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 8,
    uptime: '99.8%',
  },
  {
    id: 'especialista_integraciones',
    name: 'Especialista Integraciones',
    role: 'Ecosistema · Conectores',
    specialty: 'Marketplace, plugins, extensiones, SDK, API partners',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 12,
    uptime: '99.9%',
  },

  // ──────────── ASISTENTES ESPECIALIZADOS ────────────
  {
    id: 'asistente_productividad',
    name: 'Asistente de Productividad',
    role: 'Asistencia · Organización',
    specialty: 'Gestión de tareas, calendarios, reminders, organización personal',
    model: 'Haiku 4.5',
    status: 'active',
    tasks: 44,
    uptime: '99.9%',
  },
  {
    id: 'asistente_investigacion',
    name: 'Asistente de Investigación',
    role: 'Research · Búsqueda',
    specialty: 'Búsqueda de información, síntesis, referencias, fact-checking',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 28,
    uptime: '99.8%',
  },
  {
    id: 'asistente_traduccion',
    name: 'Asistente de Traducción',
    role: 'Idiomas · Localización',
    specialty: 'Traducción multiidioma, transcreación, localization, cultural adaptation',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 19,
    uptime: '99.9%',
  },

  // ──────────── CREATIVIDAD ESPECIALIZADA ────────────
  {
    id: 'experto_branding',
    name: 'Experto en Branding',
    role: 'Marca · Identidad',
    specialty: 'Naming, brand guidelines, voice & tone, posicionamiento, identidad visual',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 14,
    uptime: '99.95%',
  },
  {
    id: 'diseñador_logos',
    name: 'Diseñador de Logos',
    role: 'Marca · Diseño',
    specialty: 'Logomark, logotype, marca, symbol, propuestas creativas',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 10,
    uptime: '99.8%',
  },
  {
    id: 'especialista_packaging',
    name: 'Especialista Packaging',
    role: 'Diseño · Empaques',
    specialty: 'Diseño de empaques, mockups, especificaciones técnicas de impresión',
    model: 'Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.7%',
  },
  {
    id: 'diseñador_impresion',
    name: 'Diseñador de Impresión',
    role: 'Diseño · Collateral',
    specialty: 'Tarjetas, brochures, flyers, carteles, materiales impresos',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 16,
    uptime: '99.8%',
  },
  {
    id: 'experto_fotografia',
    name: 'Experto Fotografía',
    role: 'Creatividad · Fotografía',
    specialty: 'Dirección fotográfica, composición, edición, retoque, edie',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 12,
    uptime: '99.9%',
  },

  // ──────────── DESARROLLO ESPECIALIZADO ────────────
  {
    id: 'especialista_mobile',
    name: 'Especialista Mobile',
    role: 'Desarrollo · Apps',
    specialty: 'React Native, Flutter, iOS, Android, aplicaciones multiplataforma',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 22,
    uptime: '99.8%',
  },
  {
    id: 'especialista_web3',
    name: 'Especialista Web3',
    role: 'Desarrollo · Blockchain',
    specialty: 'Smart contracts, blockchain, crypto, NFTs, DeFi, solidity',
    model: 'Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.7%',
  },
  {
    id: 'especialista_iot',
    name: 'Especialista IoT',
    role: 'Desarrollo · Dispositivos',
    specialty: 'IoT, microcontrollers, Arduino, embedded systems, telemetría',
    model: 'Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.6%',
  },
  {
    id: 'especialista_ml',
    name: 'Especialista Machine Learning',
    role: 'IA · ML',
    specialty: 'Modelos ML, TensorFlow, PyTorch, training, inference, MLOps',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 17,
    uptime: '99.9%',
  },
  {
    id: 'especialista_datos_big',
    name: 'Especialista Big Data',
    role: 'Datos · Procesamiento',
    specialty: 'Apache Spark, Hadoop, data warehouses, ETL pipelines, data lakes',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 11,
    uptime: '99.8%',
  },
  {
    id: 'experto_bases_datos',
    name: 'Experto Bases de Datos',
    role: 'Datos · Administración',
    specialty: 'SQL, NoSQL, PostgreSQL, MongoDB, Redis, optimización, indices',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 25,
    uptime: '99.9%',
  },
  {
    id: 'especialista_grafos',
    name: 'Especialista Grafos',
    role: 'Datos · Análisis Avanzado',
    specialty: 'Neo4j, análisis de grafos, relaciones complejas, network analysis',
    model: 'Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.7%',
  },
  {
    id: 'especialista_realtime',
    name: 'Especialista Tiempo Real',
    role: 'Desarrollo · Real-time',
    specialty: 'WebSockets, mensajería real-time, streaming, event-driven systems',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 13,
    uptime: '99.9%',
  },

  // ──────────── MARKETING AVANZADO ────────────
  {
    id: 'especialista_growth',
    name: 'Especialista Growth',
    role: 'Marketing · Growth Hacking',
    specialty: 'Growth loops, viral mechanics, retention, LTV, CAC optimization',
    model: '⭐ Sonnet 4.6',
    status: 'active',
    tasks: 20,
    uptime: '99.9%',
  },
  {
    id: 'experto_conversion',
    name: 'Experto Conversión',
    role: 'Marketing · CRO',
    specialty: 'A/B testing, heatmaps, funnel optimization, conversion rate optimization',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 18,
    uptime: '99.8%',
  },
  {
    id: 'especialista_publicidad',
    name: 'Especialista Publicidad Digital',
    role: 'Marketing · Ads',
    specialty: 'Google Ads, Facebook Ads, TikTok, LinkedIn, presupuestación, ROI',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 29,
    uptime: '99.8%',
  },
  {
    id: 'especialista_partnerships',
    name: 'Especialista Partnerships',
    role: 'Marketing · Alianzas',
    specialty: 'Co-marketing, afiliados, influencers, joint ventures, B2B partnerships',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 15,
    uptime: '99.8%',
  },
  {
    id: 'especialista_pr',
    name: 'Especialista PR',
    role: 'Marketing · Relaciones Públicas',
    specialty: 'Press releases, media relations, crisis management, brand reputation',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 12,
    uptime: '99.9%',
  },
  {
    id: 'especialista_influencers',
    name: 'Especialista Influencers',
    role: 'Marketing · Influencer',
    specialty: 'Identificación de influencers, negociación, campaigns, medición',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 14,
    uptime: '99.8%',
  },
  {
    id: 'especialista_eventos',
    name: 'Especialista Eventos',
    role: 'Marketing · Eventos',
    specialty: 'Planificación de eventos, webinars, conferencias, experiencias',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 10,
    uptime: '99.7%',
  },

  // ──────────── INDUSTRIAS VERTICALES ────────────
  {
    id: 'consultor_hoteleria',
    name: 'Consultor Hotelería',
    role: 'Industria · Hospitality',
    specialty: 'Gestión hotelera, yield management, guest experience, reservaciones',
    model: 'Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.7%',
  },
  {
    id: 'consultor_ecommerce',
    name: 'Consultor Ecommerce',
    role: 'Industria · Tiendas Online',
    specialty: 'Plataformas ecommerce, inventory, fulfillment, retail analytics',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 18,
    uptime: '99.8%',
  },
  {
    id: 'consultor_fintech',
    name: 'Consultor Fintech',
    role: 'Industria · Finanzas Digitales',
    specialty: 'Pagos digitales, wallets, compliance financiero, open banking',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 13,
    uptime: '99.95%',
  },
  {
    id: 'consultor_healthtech',
    name: 'Consultor HealthTech',
    role: 'Industria · Salud Digital',
    specialty: 'Telemedicina, EHR, HIPAA, salud personal, wearables',
    model: 'Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.7%',
  },
  {
    id: 'consultor_edtech',
    name: 'Consultor EdTech',
    role: 'Industria · Educación Digital',
    specialty: 'LMS, cursos online, gamification, student engagement, acreditación',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 15,
    uptime: '99.8%',
  },
  {
    id: 'consultor_logistica',
    name: 'Consultor Logística',
    role: 'Industria · Supply Chain',
    specialty: 'Gestión de cadena de suministro, routing, warehouse, tracking',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 9,
    uptime: '99.8%',
  },
  {
    id: 'consultor_energia',
    name: 'Consultor Energía',
    role: 'Industria · Utilities',
    specialty: 'Energías renovables, smart grid, facturación, consumption analytics',
    model: 'Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.6%',
  },
  {
    id: 'consultor_inmobiliario',
    name: 'Consultor Inmobiliario',
    role: 'Industria · Real Estate',
    specialty: 'Mercado inmobiliario, propiedades, valuación, marketing de propiedades',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 11,
    uptime: '99.8%',
  },

  // ──────────── SEGURIDAD & COMPLIANCE AVANZADO ────────────
  {
    id: 'especialista_privacidad',
    name: 'Especialista Privacidad',
    role: 'Seguridad · GDPR/CCPA',
    specialty: 'Regulaciones de privacidad, GDPR, CCPA, consent management, DPA',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 10,
    uptime: '99.95%',
  },
  {
    id: 'especialista_pentest',
    name: 'Especialista Pentesting',
    role: 'Seguridad · Pruebas',
    specialty: 'Penetration testing, vulnerability assessment, ethical hacking, reportes',
    model: 'Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.7%',
  },
  {
    id: 'especialista_incidentes',
    name: 'Especialista Incidentes',
    role: 'Seguridad · Respuesta',
    specialty: 'Incident response, forensics, breach management, disaster recovery',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 8,
    uptime: '99.95%',
  },
  {
    id: 'especialista_certificaciones',
    name: 'Especialista Certificaciones',
    role: 'Compliance · Auditoría',
    specialty: 'ISO 27001, SOC 2, PCI-DSS, HIPAA, certificaciones, auditorías',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 7,
    uptime: '99.9%',
  },

  // ──────────── GESTIÓN DE PRODUCTO ────────────
  {
    id: 'gerente_producto',
    name: 'Gerente de Producto',
    role: 'Producto · Dirección',
    specialty: 'Product roadmap, PRD, feature prioritization, backlog management, go-to-market',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 24,
    uptime: '99.95%',
  },
  {
    id: 'especialista_monetizacion',
    name: 'Especialista Monetización',
    role: 'Producto · Modelos',
    specialty: 'Pricing strategy, subscription models, freemium, revenue optimization',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 12,
    uptime: '99.8%',
  },
  {
    id: 'analista_metricas',
    name: 'Analista de Métricas',
    role: 'Producto · Analytics',
    specialty: 'KPIs, funnel metrics, retention, NPS, engagement, cohort analysis',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 20,
    uptime: '99.9%',
  },
  {
    id: 'especialista_experimentacion',
    name: 'Especialista Experimentación',
    role: 'Producto · Testing',
    specialty: 'Diseño de experimentos, multivariate testing, statistical significance',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 14,
    uptime: '99.8%',
  },

  // ──────────── RECURSOS HUMANOS & CULTURA ────────────
  {
    id: 'especialista_reclutamiento',
    name: 'Especialista Reclutamiento',
    role: 'RRHH · Hiring',
    specialty: 'Job descriptions, sourcing, interviews, candidate evaluation, offers',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 19,
    uptime: '99.8%',
  },
  {
    id: 'especialista_retención',
    name: 'Especialista Retención',
    role: 'RRHH · Talento',
    specialty: 'Employee engagement, career development, retention strategies, surveys',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 11,
    uptime: '99.8%',
  },
  {
    id: 'especialista_capacitacion',
    name: 'Especialista Capacitación',
    role: 'RRHH · Learning',
    specialty: 'Training programs, onboarding, skills development, learning paths',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 16,
    uptime: '99.7%',
  },
  {
    id: 'experto_cultura',
    name: 'Experto Cultura Organizacional',
    role: 'RRHH · Cultura',
    specialty: 'Valores, misión, visión, team building, company culture, leadership',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 9,
    uptime: '99.8%',
  },

  // ──────────── ESPECIALISTAS EN CONTENIDO VISUAL ────────────
  {
    id: 'especialista_infografias',
    name: 'Especialista Infografías',
    role: 'Visualización · Infografías',
    specialty: 'Infografías, data visualization, diagramas, charts interactivos',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 14,
    uptime: '99.8%',
  },
  {
    id: 'especialista_animaciones',
    name: 'Especialista Animaciones SVG',
    role: 'Motion · SVG',
    specialty: 'SVG animations, GSAP DrawSVG, Lottie, micro-interactions',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 17,
    uptime: '99.9%',
  },
  {
    id: 'especialista_drones',
    name: 'Especialista Drones',
    role: 'Creatividad · Aéreo',
    specialty: 'Fotografía aérea con drones, videografía aérea, composición, edición',
    model: 'Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.6%',
  },

  // ──────────── ESPECIALISTAS EN LOCALIZACIÓN ────────────
  {
    id: 'especialista_localizacion_es',
    name: 'Especialista Localización ES',
    role: 'Idiomas · Español',
    specialty: 'Traducción al español, adaptación cultural, market-specific content',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 22,
    uptime: '99.8%',
  },
  {
    id: 'especialista_localizacion_en',
    name: 'Especialista Localización EN',
    role: 'Idiomas · Inglés',
    specialty: 'Traducción al inglés, adaptación cultural, tonalidad de marca',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 28,
    uptime: '99.9%',
  },
  {
    id: 'especialista_seo_multiidioma',
    name: 'Especialista SEO Multiidioma',
    role: 'SEO · Localización',
    specialty: 'International SEO, hreflang, geotargeting, multilingual content',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 11,
    uptime: '99.8%',
  },

  // ──────────── ESPECIALISTAS EMERGENTES ────────────
  {
    id: 'especialista_metaverso',
    name: 'Especialista Metaverso',
    role: 'Emergentes · Web3/Metaverso',
    specialty: 'Experiencias en metaverso, NFTs, virtual events, blockchain',
    model: 'Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.5%',
  },
  {
    id: 'especialista_ar_vr',
    name: 'Especialista AR/VR',
    role: 'Emergentes · Realidad Extendida',
    specialty: 'Augmented reality, virtual reality, WebXR, 3D experiences',
    model: 'Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.5%',
  },
  {
    id: 'especialista_ia_generativa',
    name: 'Especialista IA Generativa',
    role: 'IA · LLMs',
    specialty: 'GPT, fine-tuning, prompt engineering, RAG, agentes autónomos',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 26,
    uptime: '99.95%',
  },
  {
    id: 'especialista_edge_computing',
    name: 'Especialista Edge Computing',
    role: 'Infraestructura · Edge',
    specialty: 'Cloudflare Workers, edge functions, CDN, latency optimization',
    model: 'Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.7%',
  },

  // ──────────── ANÁLISIS AVANZADO ────────────
  {
    id: 'analista_negocios',
    name: 'Analista de Negocios',
    role: 'Análisis · Estrategia',
    specialty: 'Business intelligence, market analysis, strategy recommendations',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 15,
    uptime: '99.9%',
  },
  {
    id: 'especialista_previsiones',
    name: 'Especialista Previsiones',
    role: 'Análisis · Forecasting',
    specialty: 'Forecasting, predictive analytics, trend analysis, scenario planning',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 12,
    uptime: '99.8%',
  },
  {
    id: 'especialista_competitividad',
    name: 'Especialista Competitividad',
    role: 'Análisis · Mercado',
    specialty: 'Análisis competitivo, posicionamiento, diferenciación, FODA',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 10,
    uptime: '99.8%',
  },

  // ──────────── ESPECIALISTAS EN FRAMEWORKS & HERRAMIENTAS ────────────
  {
    id: 'especialista_nextjs',
    name: 'Especialista Next.js',
    role: 'Framework · SSR',
    specialty: 'Next.js 15, App Router, SSR, ISR, API routes, edge runtime',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 21,
    uptime: '99.9%',
  },
  {
    id: 'especialista_react',
    name: 'Especialista React',
    role: 'Frontend · Librería',
    specialty: 'React hooks, context, state management, performance, rendering',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 28,
    uptime: '99.9%',
  },
  {
    id: 'especialista_vue',
    name: 'Especialista Vue.js',
    role: 'Frontend · Framework',
    specialty: 'Vue 3, Nuxt, composables, reactivity, state management',
    model: 'Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.7%',
  },
  {
    id: 'especialista_angular',
    name: 'Especialista Angular',
    role: 'Frontend · Framework',
    specialty: 'Angular 15+, TypeScript, RxJS, modules, dependency injection',
    model: 'Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.6%',
  },
  {
    id: 'especialista_tailwind',
    name: 'Especialista Tailwind CSS',
    role: 'Estilos · CSS',
    specialty: 'Tailwind CSS, design tokens, responsive utilities, custom plugins',
    model: 'Haiku 4.5',
    status: 'active',
    tasks: 18,
    uptime: '99.9%',
  },
  {
    id: 'especialista_typescript',
    name: 'Especialista TypeScript',
    role: 'Lenguaje · Tipado',
    specialty: 'TypeScript avanzado, tipos complejos, genéricos, decoradores',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 16,
    uptime: '99.9%',
  },
  {
    id: 'especialista_node',
    name: 'Especialista Node.js',
    role: 'Backend · Runtime',
    specialty: 'Node.js, Express, streams, clustering, performance, memory',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 20,
    uptime: '99.8%',
  },
  {
    id: 'especialista_python',
    name: 'Especialista Python',
    role: 'Backend · Lenguaje',
    specialty: 'Python, Django, FastAPI, asyncio, data science libraries',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 17,
    uptime: '99.8%',
  },
  {
    id: 'especialista_graphql',
    name: 'Especialista GraphQL',
    role: 'API · Queries',
    specialty: 'GraphQL, Apollo, subscriptions, resolvers, schema design',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 12,
    uptime: '99.8%',
  },
  {
    id: 'especialista_testing',
    name: 'Especialista Testing',
    role: 'QA · Test Frameworks',
    specialty: 'Jest, Vitest, Cypress, Playwright, unit tests, integration tests',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 22,
    uptime: '99.8%',
  },
  {
    id: 'especialista_git',
    name: 'Especialista Git',
    role: 'Control · Versionado',
    specialty: 'Git workflows, branching strategies, merge conflicts, CI/CD',
    model: 'Haiku 4.5',
    status: 'active',
    tasks: 19,
    uptime: '99.95%',
  },
  {
    id: 'especialista_docker',
    name: 'Especialista Docker',
    role: 'Contenedores · DevOps',
    specialty: 'Docker, Dockerfiles, docker-compose, container orchestration',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 14,
    uptime: '99.8%',
  },
  {
    id: 'especialista_kubernetes',
    name: 'Especialista Kubernetes',
    role: 'Orquestación · Cloud',
    specialty: 'Kubernetes, pods, services, deployments, helm, scaling',
    model: 'Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.7%',
  },
  {
    id: 'especialista_firebase',
    name: 'Especialista Firebase',
    role: 'Backend · BaaS',
    specialty: 'Firebase, Firestore, Realtime DB, Auth, Cloud Functions',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 13,
    uptime: '99.8%',
  },
  {
    id: 'especialista_supabase',
    name: 'Especialista Supabase',
    role: 'Backend · PostgreSQL',
    specialty: 'Supabase, PostgreSQL, realtime, auth, edge functions',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 11,
    uptime: '99.8%',
  },
  {
    id: 'especialista_aws',
    name: 'Especialista AWS',
    role: 'Cloud · Amazon',
    specialty: 'AWS, EC2, S3, Lambda, RDS, CloudFront, IAM',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 16,
    uptime: '99.8%',
  },
  {
    id: 'especialista_gcp',
    name: 'Especialista Google Cloud',
    role: 'Cloud · Google',
    specialty: 'GCP, Compute Engine, Cloud SQL, Cloud Storage, BigQuery',
    model: 'Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.6%',
  },
  {
    id: 'especialista_azure',
    name: 'Especialista Azure',
    role: 'Cloud · Microsoft',
    specialty: 'Azure, App Service, SQL Database, Cosmos DB, Functions',
    model: 'Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.6%',
  },
  {
    id: 'especialista_vercel',
    name: 'Especialista Vercel',
    role: 'Hosting · Deployment',
    specialty: 'Vercel, Next.js deployment, edge middleware, analytics',
    model: 'Haiku 4.5',
    status: 'active',
    tasks: 15,
    uptime: '99.95%',
  },
  {
    id: 'especialista_github',
    name: 'Especialista GitHub',
    role: 'Plataforma · Desarrollo',
    specialty: 'GitHub, GitHub Actions, repos, projects, discussions',
    model: 'Haiku 4.5',
    status: 'active',
    tasks: 12,
    uptime: '99.95%',
  },

  // ──────────── ESPECIALISTAS EN HERRAMIENTAS DE NEGOCIO ────────────
  {
    id: 'especialista_hubspot',
    name: 'Especialista HubSpot',
    role: 'CRM · Marketing Automation',
    specialty: 'HubSpot, workflows, forms, analytics, email marketing',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 20,
    uptime: '99.8%',
  },
  {
    id: 'especialista_salesforce',
    name: 'Especialista Salesforce',
    role: 'CRM · Empresarial',
    specialty: 'Salesforce, Apex, Lightning, custom objects, reporting',
    model: 'Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.6%',
  },
  {
    id: 'especialista_stripe',
    name: 'Especialista Stripe',
    role: 'Pagos · Fintech',
    specialty: 'Stripe, webhooks, subscriptions, payments, connect',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 14,
    uptime: '99.9%',
  },
  {
    id: 'especialista_zapier',
    name: 'Especialista Zapier',
    role: 'Automatización · Integraciones',
    specialty: 'Zapier, zaps, integrations, workflows, automation',
    model: 'Haiku 4.5',
    status: 'active',
    tasks: 17,
    uptime: '99.8%',
  },
  {
    id: 'especialista_airtable',
    name: 'Especialista Airtable',
    role: 'Bases de Datos · No-code',
    specialty: 'Airtable, bases, views, automations, scripting',
    model: 'Haiku 4.5',
    status: 'active',
    tasks: 13,
    uptime: '99.8%',
  },
  {
    id: 'especialista_notion',
    name: 'Especialista Notion',
    role: 'Productividad · Documentación',
    specialty: 'Notion, databases, relations, automation, API',
    model: 'Haiku 4.5',
    status: 'active',
    tasks: 12,
    uptime: '99.8%',
  },
  {
    id: 'especialista_figma',
    name: 'Especialista Figma',
    role: 'Diseño · Colaborativo',
    specialty: 'Figma, components, design systems, prototyping, plugins',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 19,
    uptime: '99.9%',
  },
  {
    id: 'especialista_framer',
    name: 'Especialista Framer',
    role: 'Prototipado · Motion',
    specialty: 'Framer, prototypes, interactions, code, design-to-code',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 11,
    uptime: '99.8%',
  },

  // ──────────── CONSULTORES DE INDUSTRIA ────────────
  {
    id: 'consultor_startup',
    name: 'Consultor Startup',
    role: 'Negocio · Emprendimiento',
    specialty: 'Fundraising, pitch decks, MVP, product-market fit, scaling',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 13,
    uptime: '99.95%',
  },
  {
    id: 'consultor_transformacion',
    name: 'Consultor Transformación Digital',
    role: 'Negocio · Estrategia',
    specialty: 'Digital transformation, modernización, cambio organizacional',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 10,
    uptime: '99.95%',
  },
  {
    id: 'consultor_innovacion',
    name: 'Consultor Innovación',
    role: 'Negocio · R&D',
    specialty: 'Innovación, nuevos productos, research, experimentation',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 8,
    uptime: '99.8%',
  },
  {
    id: 'especialista_omnichannel',
    name: 'Especialista Omnichannel',
    role: 'Marketing · Integración',
    specialty: 'Estrategia omnichannel, integración de canales, customer journey',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 9,
    uptime: '99.8%',
  },
  {
    id: 'especialista_customer_success',
    name: 'Especialista Customer Success',
    role: 'Ventas · Retención',
    specialty: 'Customer success, onboarding, renewal, expansion revenue',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 15,
    uptime: '99.8%',
  },
  {
    id: 'especialista_voice_brand',
    name: 'Especialista Voz de Marca',
    role: 'Contenido · Comunicación',
    specialty: 'Brand voice guidelines, tone, messaging, storytelling',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 7,
    uptime: '99.8%',
  },
  {
    id: 'especialista_crisis',
    name: 'Especialista Crisis Management',
    role: 'Riesgos · Comunicación',
    specialty: 'Gestión de crisis, comunicación de emergencia, reputación',
    model: '⭐ Opus 4.8',
    status: 'idle',
    tasks: 0,
    uptime: '99.7%',
  },
  {
    id: 'especialista_sostenibilidad',
    name: 'Especialista Sostenibilidad',
    role: 'ESG · Responsabilidad',
    specialty: 'ESG, sostenibilidad, impacto ambiental, reportes CSR',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 6,
    uptime: '99.8%',
  },
  {
    id: 'especialista_accesibilidad',
    name: 'Especialista Accesibilidad',
    role: 'Inclusión · WCAG',
    specialty: 'WCAG 2.2, accesibilidad web, inclusive design, auditorías a11y',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 13,
    uptime: '99.9%',
  },
];

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(SAMPLE_AGENTS);
  const [filterSpecialty, setFilterSpecialty] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [executingAgentId, setExecutingAgentId] = useState<string | null>(null);
  const [resultModal, setResultModal] = useState<{ visible: boolean; agentId?: string; result?: string; loading?: boolean }>({ visible: false });

  const specialties = Array.from(new Set(agents.map((a) => a.specialty)));
  const filtered = filterSpecialty
    ? agents.filter((a) => a.specialty.includes(filterSpecialty))
    : agents;

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return 'var(--green)';
      case 'thinking':
        return 'var(--orange)';
      case 'running':
        return 'var(--blue)';
      default:
        return 'var(--t3)';
    }
  };

  const getStatusLabel = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return '🟢 Activo';
      case 'thinking':
        return '🟡 Pensando';
      case 'running':
        return '🔵 Ejecutando';
      default:
        return '⚪ Inactivo';
    }
  };

  const handleExecuteAgent = async (agentId: string) => {
    setExecutingAgentId(agentId);
    setAgents(agents.map((a) => (a.id === agentId ? { ...a, status: 'running' as const } : a)));
    setResultModal({ visible: true, agentId, loading: true });

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          userId: 'demo-user',
          params: { prompt: `Execute agent: ${agentId}` },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResultModal({
          visible: true,
          agentId,
          result: data.result || 'Agent executed successfully',
          loading: false,
        });
        setAgents(agents.map((a) => (a.id === agentId ? { ...a, status: 'active' as const } : a)));
      } else {
        setResultModal({
          visible: true,
          agentId,
          result: `Error: ${data.error || 'Unknown error'}`,
          loading: false,
        });
      }
    } catch (error) {
      setResultModal({
        visible: true,
        agentId,
        result: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        loading: false,
      });
    } finally {
      setExecutingAgentId(null);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>🤖 Agentes IA · Sistema Completo</h1>
          <p style={{ fontSize: '12px', color: 'var(--t3)' }}>
            {agents.length} especialistas disponibles · {agents.filter((a) => a.status === 'active' || a.status === 'running').length} activos ahora
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'var(--blue)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          <Plus size={16} />
          Crear Agente
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '8px' }}>
        <button
          onClick={() => setFilterSpecialty(null)}
          style={{
            padding: '8px 14px',
            background: !filterSpecialty ? 'var(--blue)' : 'var(--bg2)',
            color: !filterSpecialty ? 'white' : 'var(--t2)',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}
        >
          Todos
        </button>
        {specialties.map((specialty) => (
          <button
            key={specialty}
            onClick={() => setFilterSpecialty(specialty)}
            style={{
              padding: '8px 14px',
              background: filterSpecialty === specialty ? 'var(--blue)' : 'var(--bg2)',
              color: filterSpecialty === specialty ? 'white' : 'var(--t2)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            {specialty.split(',')[0]}
          </button>
        ))}
      </div>

      {/* Agents Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
        {filtered.map((agent) => (
          <div
            key={agent.id}
            style={{
              padding: '20px',
              background: 'var(--bg2)',
              borderRadius: '12px',
              border: '1px solid var(--b)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Header */}
            <div>
              <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{agent.name}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--t3)' }}>{agent.role}</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 8px',
                    background: 'rgba(0,0,0,0.1)',
                    borderRadius: '4px',
                    fontSize: '10px',
                    color: getStatusColor(agent.status),
                    fontWeight: 600,
                  }}
                >
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusColor(agent.status) }} />
                  {getStatusLabel(agent.status)}
                </div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--t2)' }}>{agent.specialty}</p>
            </div>

            {/* Model & Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--t3)', marginBottom: '4px' }}>MODELO</p>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>{agent.model}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--t3)', marginBottom: '4px' }}>TAREAS</p>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>{agent.tasks}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--t3)', marginBottom: '4px' }}>UPTIME</p>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>{agent.uptime}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleExecuteAgent(agent.id)}
                disabled={executingAgentId === agent.id || agent.status === 'running'}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: agent.status === 'running' ? 'var(--t3)' : 'var(--blue)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: executingAgentId === agent.id || agent.status === 'running' ? 'wait' : 'pointer',
                  fontWeight: 600,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                {agent.status === 'running' ? (
                  <>
                    <span style={{ animation: 'spin 1s linear infinite' }}>⚙️</span>
                    Ejecutando...
                  </>
                ) : (
                  <>
                    <Zap size={14} />
                    Ejecutar
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Result Modal */}
      {resultModal.visible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: 'var(--bg)',
              borderRadius: '12px',
              padding: '24px',
              width: '90%',
              maxWidth: '600px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700 }}>
                Resultado de {agents.find((a) => a.id === resultModal.agentId)?.name}
              </h2>
              <button
                onClick={() => setResultModal({ visible: false })}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--t3)',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {resultModal.loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ fontSize: '14px', color: 'var(--t2)', marginBottom: '16px' }}>Ejecutando agente...</p>
                <div style={{ animation: 'spin 1s linear infinite', fontSize: '32px' }}>⚙️</div>
              </div>
            ) : (
              <>
                <div
                  style={{
                    background: 'var(--bg2)',
                    padding: '16px',
                    borderRadius: '8px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    marginBottom: '20px',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {resultModal.result}
                </div>

                <button
                  onClick={() => setResultModal({ visible: false })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--blue)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Cerrar
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
