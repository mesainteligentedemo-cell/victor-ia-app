'use client';

import { useState, useMemo } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';

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
  { id: 'agente_maestro', name: 'Agente Maestro', role: 'Dirección General · Orquestación', specialty: 'Planificación estratégica, delegación inteligente, síntesis de resultados', model: '⭐ Opus 4.8', status: 'active', tasks: 28, uptime: '100%' },
  { id: 'gerente_ia', name: 'Gerente IA', role: 'Dirección Ejecutiva · Supervisión', specialty: 'Control de calidad, auditoría de tareas, reportes ejecutivos', model: '⭐ Opus 4.8', status: 'active', tasks: 32, uptime: '99.9%' },
  { id: 'director_deep_learning', name: 'Director de Deep Learning', role: 'Mejora Continua · Aprendizaje', specialty: 'Análisis de bitácoras, síntesis de patrones, recomendaciones de evolución', model: '⭐ Opus 4.8', status: 'active', tasks: 16, uptime: '99.95%' },

  // ──────────── VENTAS & NEGOCIO ────────────
  { id: 'calificador_leads', name: 'Calificador de Leads', role: 'Ventas · Lead Scoring', specialty: 'Evaluación de prospectos, priorización, scoring automático', model: '⭐ Sonnet 4.6', status: 'active', tasks: 42, uptime: '99.9%' },
  { id: 'generador_propuestas', name: 'Generador de Propuestas', role: 'Ventas · Pitch & Copy', specialty: 'Redacción de cotizaciones, argumentación de venta, CTAs persuasivos', model: '⭐ Sonnet 4.6', status: 'active', tasks: 38, uptime: '99.8%' },
  { id: 'cierre_automatico', name: 'Cierre Automático', role: 'Ventas · Negociación', specialty: 'Objeción handling, estrategia de cierre, follow-up inteligente', model: '⭐ Sonnet 4.6', status: 'idle', tasks: 0, uptime: '99.7%' },
  { id: 'prospector_clientes', name: 'Prospector de Clientes', role: 'Ventas · Prospecting', specialty: 'Identificación de nichos, búsqueda de empresas, lead sourcing', model: 'Sonnet 4.6', status: 'active', tasks: 18, uptime: '99.8%' },
  { id: 'analista_competencia', name: 'Analista de Competencia', role: 'Negocio · Inteligencia Competitiva', specialty: 'Análisis de rivales, benchmarking, ventajas diferenciables', model: 'Sonnet 4.6', status: 'active', tasks: 12, uptime: '99.9%' },

  // ──────────── CONTENIDO & MARKETING ────────────
  { id: 'estratega_contenido', name: 'Estratega de Contenido', role: 'Marketing · Estrategia', specialty: 'Planificación de contenido, calendarios editoriales, narrativa de marca', model: '⭐ Sonnet 4.6', status: 'active', tasks: 45, uptime: '100%' },
  { id: 'redactor_blog', name: 'Redactor de Blog', role: 'Contenido · Copywriting', specialty: 'Artículos optimizados, storytelling, engagement narrativo', model: 'Sonnet 4.6', status: 'thinking', tasks: 23, uptime: '99.7%' },
  { id: 'especialista_seo', name: 'Especialista SEO', role: 'SEO · Posicionamiento', specialty: 'Technical SEO, keywords, meta tags, estructura JSON-LD', model: 'Haiku 4.5', status: 'active', tasks: 35, uptime: '100%' },
  { id: 'auditor_seo_tecnico', name: 'Auditor SEO Técnico', role: 'SEO · Auditoría', specialty: 'Análisis de velocidad, crawlability, mobile-first, Core Web Vitals', model: 'Sonnet 4.6', status: 'idle', tasks: 0, uptime: '99.8%' },
  { id: 'gestor_redes_sociales', name: 'Gestor de Redes Sociales', role: 'Marketing · Social Media', specialty: 'Calendarios, copywriting, engagement strategy, community management', model: 'Sonnet 4.6', status: 'active', tasks: 28, uptime: '99.9%' },
  { id: 'diseñador_campañas', name: 'Diseñador de Campañas', role: 'Marketing · Campaigns', specialty: 'Diseño de estrategias, creatividad, brief visual, estructuración de anuncios', model: 'Sonnet 4.6', status: 'active', tasks: 19, uptime: '99.8%' },
  { id: 'copywriter_premium', name: 'Copywriter Premium', role: 'Copywriting · Voz de Marca', specialty: 'Copy luxury, argumentación de alto nivel, persuasión refinada', model: '⭐ Sonnet 4.6', status: 'active', tasks: 16, uptime: '99.9%' },
  { id: 'especialista_email', name: 'Especialista Email Marketing', role: 'Marketing · Automatización', specialty: 'Secuencias de email, subject lines, funnels de conversión', model: 'Sonnet 4.6', status: 'active', tasks: 14, uptime: '99.8%' },

  // ──────────── DISEÑO & CREATIVIDAD ────────────
  { id: 'director_arte', name: 'Director de Arte', role: 'Diseño · Dirección Visual', specialty: 'Conceptos visuales, tipografía, paletas, composición, marca', model: '⭐ Opus 4.8', status: 'active', tasks: 26, uptime: '99.9%' },
  { id: 'diseñador_ui_ux', name: 'Diseñador UI/UX', role: 'Diseño · Interfaces', specialty: 'Wireframes, prototipado, accesibilidad, user flows, responsive design', model: 'Sonnet 4.6', status: 'active', tasks: 31, uptime: '99.8%' },
  { id: 'ilustrador_ia', name: 'Ilustrador IA', role: 'Creatividad · Generación Visual', specialty: 'Ilustraciones custom, estilos artísticos, generación de assets visuales', model: 'Sonnet 4.6', status: 'active', tasks: 24, uptime: '99.9%' },
  { id: 'animador_motion', name: 'Animador Motion Design', role: 'Motion · Cinematografía', specialty: 'Animaciones GSAP, scroll cinematográfico, transiciones premium, 3D web', model: 'Sonnet 4.6', status: 'active', tasks: 18, uptime: '99.8%' },
  { id: 'especialista_3d', name: 'Especialista 3D Web', role: 'Creatividad · WebGL', specialty: 'Three.js, React Three Fiber, shaders GLSL, efectos 3D interactivos', model: 'Sonnet 4.6', status: 'idle', tasks: 0, uptime: '99.7%' },
  { id: 'curador_design', name: 'Curador de Diseño', role: 'Diseño · Auditoría', specialty: 'Análisis de experiencia, benchmarks visuales, recomendaciones de polish', model: 'Opus 4.8', status: 'active', tasks: 14, uptime: '99.95%' },

  // ──────────── DESARROLLO & CÓDIGO ────────────
  { id: 'arquitecto_sistemas', name: 'Arquitecto de Sistemas', role: 'Desarrollo · Arquitectura', specialty: 'Diseño de infraestructura, escalabilidad, patrones, database design', model: '⭐ Opus 4.8', status: 'active', tasks: 22, uptime: '99.95%' },
  { id: 'desarrollador_frontend', name: 'Desarrollador Frontend', role: 'Desarrollo · React', specialty: 'React, Next.js, TypeScript, componentes reutilizables, performance', model: 'Sonnet 4.6', status: 'active', tasks: 39, uptime: '99.8%' },
  { id: 'desarrollador_backend', name: 'Desarrollador Backend', role: 'Desarrollo · API', specialty: 'APIs REST, bases de datos, autenticación, seguridad, escalabilidad', model: 'Sonnet 4.6', status: 'active', tasks: 35, uptime: '99.9%' },
  { id: 'especialista_devops', name: 'Especialista DevOps', role: 'Operaciones · Cloud', specialty: 'CI/CD, Docker, Kubernetes, deployment, monitoreo, infraestructura', model: 'Sonnet 4.6', status: 'active', tasks: 17, uptime: '99.95%' },
  { id: 'revisor_codigo', name: 'Revisor de Código', role: 'QA · Code Review', specialty: 'Auditoría de código, best practices, seguridad, performance, refactoring', model: '⭐ Opus 4.8', status: 'active', tasks: 28, uptime: '99.9%' },
  { id: 'ingeniero_qa', name: 'Ingeniero QA', role: 'Testing · Calidad', specialty: 'Test planning, unit tests, E2E, performance, debugging, reportes', model: 'Sonnet 4.6', status: 'active', tasks: 26, uptime: '99.8%' },
  { id: 'especialista_seguridad', name: 'Especialista Seguridad', role: 'Seguridad · Compliance', specialty: 'Vulnerabilidades, OWASP, encryption, autenticación, compliance regulatorio', model: '⭐ Opus 4.8', status: 'active', tasks: 12, uptime: '99.95%' },
  { id: 'optimizador_performance', name: 'Optimizador de Performance', role: 'Desarrollo · Optimización', specialty: 'Core Web Vitals, bundle size, caching, lazy loading, LCP/FID/CLS', model: 'Sonnet 4.6', status: 'idle', tasks: 0, uptime: '99.8%' },
  { id: 'ingeniero_ia', name: 'Ingeniero IA', role: 'IA · Integración', specialty: 'LLMs, embeddings, RAG, fine-tuning, prompting, agentes autónomos', model: '⭐ Opus 4.8', status: 'active', tasks: 19, uptime: '99.9%' },

  // ──────────── AUTOMATIZACIÓN & INTEGRACIONES ────────────
  { id: 'orquestador_n8n', name: 'Orquestador n8n', role: 'Automatización · Workflows', specialty: 'Flujos de n8n, webhooks, sincronización de datos, automatización end-to-end', model: 'Sonnet 4.6', status: 'active', tasks: 31, uptime: '99.9%' },
  { id: 'integrador_api', name: 'Integrador API', role: 'Integraciones · Conectores', specialty: 'APIs REST, webhooks, OAuth, Zapier, Make, sincronización de servicios', model: 'Sonnet 4.6', status: 'active', tasks: 24, uptime: '99.8%' },
  { id: 'especialista_scraping', name: 'Especialista Web Scraping', role: 'Datos · Extracción', specialty: 'Web scraping, parsing HTML, APIs públicas, data pipeline, ETL', model: 'Sonnet 4.6', status: 'active', tasks: 16, uptime: '99.7%' },
  { id: 'analista_datos', name: 'Analista de Datos', role: 'Analytics · Reporting', specialty: 'Análisis de métricas, dashboards, insights, reportes, visualizaciones', model: '⭐ Opus 4.8', status: 'active', tasks: 18, uptime: '99.95%' },

  // ──────────── SOPORTO & OPERACIONES ────────────
  { id: 'gestor_tickets', name: 'Gestor de Tickets', role: 'Soporte · Clasificación', specialty: 'Triaje de incidentes, clasificación automática, routing, priorización', model: 'Haiku 4.5', status: 'active', tasks: 52, uptime: '99.95%' },
  { id: 'especialista_soporte', name: 'Especialista Soporte', role: 'Soporte · Customer Service', specialty: 'Resolución de problemas, FAQ, troubleshooting, customer happiness', model: 'Sonnet 4.6', status: 'active', tasks: 38, uptime: '99.8%' },
  { id: 'especialista_compliance', name: 'Especialista Compliance', role: 'Legal · Regulatorio', specialty: 'GDPR, CCPA, contratos, términos y condiciones, políticas, auditoría', model: 'Opus 4.8', status: 'active', tasks: 9, uptime: '99.95%' },

  // ──────────── VIDEO & AUDIO ────────────
  { id: 'productor_video', name: 'Productor de Video', role: 'Video · Producción', specialty: 'Guiones, storyboards, edición, efectos visuales, post-producción', model: 'Sonnet 4.6', status: 'active', tasks: 21, uptime: '99.8%' },
  { id: 'especialista_voz', name: 'Especialista Voice Over', role: 'Audio · Voz IA', specialty: 'Text-to-speech, ElevenLabs, síntesis de voz, locutores multiidioma', model: 'Sonnet 4.6', status: 'active', tasks: 14, uptime: '99.9%' },
  { id: 'compositor_musica', name: 'Compositor Música', role: 'Audio · Música', specialty: 'Composición, generación de soundtracks, licencias, efectos de sonido', model: 'Sonnet 4.6', status: 'idle', tasks: 0, uptime: '99.7%' },

  // ──────────── EDUCACIÓN & CAPACITACIÓN ────────────
  { id: 'entrenador_ia', name: 'Entrenador IA', role: 'Educación · Training', specialty: 'Diseño de cursos, módulos de aprendizaje, evaluaciones, mentoría', model: 'Sonnet 4.6', status: 'active', tasks: 25, uptime: '99.8%' },
  { id: 'tutor_tecnico', name: 'Tutor Técnico', role: 'Educación · Consultoría', specialty: 'Enseñanza de desarrollo, best practices, architectural guidance', model: '⭐ Opus 4.8', status: 'active', tasks: 13, uptime: '99.9%' },

  // ──────────── FINANZAS & PRESUPUESTO ────────────
  { id: 'analista_presupuesto', name: 'Analista de Presupuesto', role: 'Finanzas · Budgeting', specialty: 'Forecasting, asignación presupuestaria, ROI analysis, cost optimization', model: 'Sonnet 4.6', status: 'active', tasks: 11, uptime: '99.9%' },
  { id: 'especialista_facturacion', name: 'Especialista Facturación', role: 'Finanzas · Billing', specialty: 'Invoicing, subscriptions, payment processing, reconciliación', model: 'Haiku 4.5', status: 'active', tasks: 32, uptime: '99.95%' },

  // ──────────── INVESTIGACIÓN & ANÁLISIS ────────────
  { id: 'investigador_mercado', name: 'Investigador de Mercado', role: 'Research · Market Intelligence', specialty: 'Market sizing, trends, consumer insights, competitive landscape', model: 'Sonnet 4.6', status: 'active', tasks: 15, uptime: '99.8%' },
  { id: 'experto_usuario', name: 'Experto UX Research', role: 'Research · User Studies', specialty: 'User interviews, surveys, usability testing, journey mapping', model: 'Sonnet 4.6', status: 'idle', tasks: 0, uptime: '99.7%' },

  // ──────────── SOCIOS & ECOSISTEMA ────────────
  { id: 'gerente_socios', name: 'Gerente de Socios', role: 'Ecosistema · Partnership', specialty: 'Identificación de socios, negocios estratégicos, co-marketing', model: 'Sonnet 4.6', status: 'active', tasks: 8, uptime: '99.8%' },
  { id: 'especialista_integraciones', name: 'Especialista Integraciones', role: 'Ecosistema · Conectores', specialty: 'Marketplace, plugins, extensiones, SDK, API partners', model: 'Sonnet 4.6', status: 'active', tasks: 12, uptime: '99.9%' },

  // ──────────── ASISTENTES ESPECIALIZADOS ────────────
  { id: 'asistente_productividad', name: 'Asistente de Productividad', role: 'Asistencia · Organización', specialty: 'Gestión de tareas, calendarios, reminders, organización personal', model: 'Haiku 4.5', status: 'active', tasks: 44, uptime: '99.9%' },
  { id: 'asistente_investigacion', name: 'Asistente de Investigación', role: 'Research · Búsqueda', specialty: 'Búsqueda de información, síntesis, referencias, fact-checking', model: 'Sonnet 4.6', status: 'active', tasks: 28, uptime: '99.8%' },
  { id: 'asistente_traduccion', name: 'Asistente de Traducción', role: 'Idiomas · Localización', specialty: 'Traducción multiidioma, transcreación, localization, cultural adaptation', model: 'Sonnet 4.6', status: 'active', tasks: 19, uptime: '99.9%' },

  // ──────────── CREATIVIDAD ESPECIALIZADA ────────────
  { id: 'experto_branding', name: 'Experto en Branding', role: 'Marca · Identidad', specialty: 'Naming, brand guidelines, voice & tone, posicionamiento, identidad visual', model: '⭐ Opus 4.8', status: 'active', tasks: 14, uptime: '99.95%' },
  { id: 'diseñador_logos', name: 'Diseñador de Logos', role: 'Marca · Diseño', specialty: 'Logomark, logotype, marca, symbol, propuestas creativas', model: 'Sonnet 4.6', status: 'active', tasks: 10, uptime: '99.8%' },
  { id: 'especialista_packaging', name: 'Especialista Packaging', role: 'Diseño · Empaques', specialty: 'Diseño de empaques, mockups, especificaciones técnicas de impresión', model: 'Sonnet 4.6', status: 'idle', tasks: 0, uptime: '99.7%' },
  { id: 'diseñador_impresion', name: 'Diseñador de Impresión', role: 'Diseño · Collateral', specialty: 'Tarjetas, brochures, flyers, carteles, materiales impresos', model: 'Sonnet 4.6', status: 'active', tasks: 16, uptime: '99.8%' },
  { id: 'experto_fotografia', name: 'Experto Fotografía', role: 'Creatividad · Fotografía', specialty: 'Dirección fotográfica, composición, edición, retoque, edie', model: 'Sonnet 4.6', status: 'active', tasks: 12, uptime: '99.9%' },

  // ──────────── DESARROLLO ESPECIALIZADO ────────────
  { id: 'especialista_mobile', name: 'Especialista Mobile', role: 'Desarrollo · Apps', specialty: 'React Native, Flutter, iOS, Android, aplicaciones multiplataforma', model: 'Sonnet 4.6', status: 'active', tasks: 22, uptime: '99.8%' },
  { id: 'especialista_web3', name: 'Especialista Web3', role: 'Desarrollo · Blockchain', specialty: 'Smart contracts, blockchain, crypto, NFTs, DeFi, solidity', model: 'Sonnet 4.6', status: 'idle', tasks: 0, uptime: '99.7%' },
  { id: 'especialista_iot', name: 'Especialista IoT', role: 'Desarrollo · Dispositivos', specialty: 'IoT, microcontrollers, Arduino, embedded systems, telemetría', model: 'Sonnet 4.6', status: 'idle', tasks: 0, uptime: '99.6%' },
  { id: 'especialista_ml', name: 'Especialista Machine Learning', role: 'IA · ML', specialty: 'Modelos ML, TensorFlow, PyTorch, training, inference, MLOps', model: '⭐ Opus 4.8', status: 'active', tasks: 17, uptime: '99.9%' },
  { id: 'especialista_datos_big', name: 'Especialista Big Data', role: 'Datos · Procesamiento', specialty: 'Apache Spark, Hadoop, data warehouses, ETL pipelines, data lakes', model: 'Sonnet 4.6', status: 'active', tasks: 11, uptime: '99.8%' },
  { id: 'experto_bases_datos', name: 'Experto Bases de Datos', role: 'Datos · Administración', specialty: 'SQL, NoSQL, PostgreSQL, MongoDB, Redis, optimización, indices', model: 'Sonnet 4.6', status: 'active', tasks: 25, uptime: '99.9%' },
  { id: 'especialista_grafos', name: 'Especialista Grafos', role: 'Datos · Análisis Avanzado', specialty: 'Neo4j, análisis de grafos, relaciones complejas, network analysis', model: 'Sonnet 4.6', status: 'idle', tasks: 0, uptime: '99.7%' },
  { id: 'especialista_realtime', name: 'Especialista Tiempo Real', role: 'Desarrollo · Real-time', specialty: 'WebSockets, mensajería real-time, streaming, event-driven systems', model: 'Sonnet 4.6', status: 'active', tasks: 13, uptime: '99.9%' },

  // ──────────── MARKETING AVANZADO ────────────
  { id: 'especialista_growth', name: 'Especialista Growth', role: 'Marketing · Growth Hacking', specialty: 'Growth loops, viral mechanics, retention, LTV, CAC optimization', model: '⭐ Sonnet 4.6', status: 'active', tasks: 20, uptime: '99.9%' },
  { id: 'experto_conversion', name: 'Experto Conversión', role: 'Marketing · CRO', specialty: 'A/B testing, heatmaps, funnel optimization, conversion rate optimization', model: 'Sonnet 4.6', status: 'active', tasks: 18, uptime: '99.8%' },
  { id: 'especialista_publicidad', name: 'Especialista Publicidad Digital', role: 'Marketing · Ads', specialty: 'Google Ads, Facebook Ads, TikTok, LinkedIn, presupuestación, ROI', model: 'Sonnet 4.6', status: 'active', tasks: 29, uptime: '99.8%' },
  { id: 'especialista_partnerships', name: 'Especialista Partnerships', role: 'Marketing · Alianzas', specialty: 'Co-marketing, afiliados, influencers, joint ventures, B2B partnerships', model: 'Sonnet 4.6', status: 'active', tasks: 15, uptime: '99.8%' },
  { id: 'especialista_pr', name: 'Especialista PR', role: 'Marketing · Relaciones Públicas', specialty: 'Press releases, media relations, crisis management, brand reputation', model: 'Sonnet 4.6', status: 'active', tasks: 12, uptime: '99.9%' },
  { id: 'especialista_influencers', name: 'Especialista Influencers', role: 'Marketing · Influencer', specialty: 'Identificación de influencers, negociación, campaigns, medición', model: 'Sonnet 4.6', status: 'active', tasks: 14, uptime: '99.8%' },
  { id: 'especialista_eventos', name: 'Especialista Eventos', role: 'Marketing · Eventos', specialty: 'Planificación de eventos, webinars, conferencias, experiencias', model: 'Sonnet 4.6', status: 'active', tasks: 10, uptime: '99.7%' },

  // ──────────── INDUSTRIAS VERTICALES ────────────
  { id: 'consultor_hoteleria', name: 'Consultor Hotelería', role: 'Industria · Hospitality', specialty: 'Gestión hotelera, yield management, guest experience, reservaciones', model: 'Sonnet 4.6', status: 'idle', tasks: 0, uptime: '99.7%' },
  { id: 'consultor_ecommerce', name: 'Consultor Ecommerce', role: 'Industria · Tiendas Online', specialty: 'Plataformas ecommerce, inventory, fulfillment, retail analytics', model: 'Sonnet 4.6', status: 'active', tasks: 18, uptime: '99.8%' },
  { id: 'consultor_fintech', name: 'Consultor Fintech', role: 'Industria · Finanzas Digitales', specialty: 'Pagos digitales, wallets, compliance financiero, open banking', model: '⭐ Opus 4.8', status: 'active', tasks: 13, uptime: '99.95%' },
  { id: 'consultor_healthtech', name: 'Consultor HealthTech', role: 'Industria · Salud Digital', specialty: 'Telemedicina, EHR, HIPAA, salud personal, wearables', model: 'Sonnet 4.6', status: 'idle', tasks: 0, uptime: '99.7%' },
  { id: 'consultor_edtech', name: 'Consultor EdTech', role: 'Industria · Educación Digital', specialty: 'LMS, cursos online, gamification, student engagement, acreditación', model: 'Sonnet 4.6', status: 'active', tasks: 15, uptime: '99.8%' },
  { id: 'consultor_logistica', name: 'Consultor Logística', role: 'Industria · Supply Chain', specialty: 'Gestión de cadena de suministro, routing, warehouse, tracking', model: 'Sonnet 4.6', status: 'active', tasks: 9, uptime: '99.8%' },
  { id: 'consultor_energia', name: 'Consultor Energía', role: 'Industria · Utilities', specialty: 'Energías renovables, smart grid, facturación, consumption analytics', model: 'Sonnet 4.6', status: 'idle', tasks: 0, uptime: '99.6%' },
  { id: 'consultor_inmobiliario', name: 'Consultor Inmobiliario', role: 'Industria · Real Estate', specialty: 'Mercado inmobiliario, propiedades, valuación, marketing de propiedades', model: 'Sonnet 4.6', status: 'active', tasks: 11, uptime: '99.8%' },

  // ──────────── SEGURIDAD & COMPLIANCE AVANZADO ────────────
  { id: 'especialista_privacidad', name: 'Especialista Privacidad', role: 'Seguridad · GDPR/CCPA', specialty: 'Regulaciones de privacidad, GDPR, CCPA, consent management, DPA', model: '⭐ Opus 4.8', status: 'active', tasks: 10, uptime: '99.95%' },
  { id: 'especialista_pentest', name: 'Especialista Pentesting', role: 'Seguridad · Pruebas', specialty: 'Penetration testing, vulnerability assessment, ethical hacking, reportes', model: 'Sonnet 4.6', status: 'idle', tasks: 0, uptime: '99.7%' },
  { id: 'especialista_incidentes', name: 'Especialista Incidentes', role: 'Seguridad · Respuesta', specialty: 'Incident response, forensics, breach management, disaster recovery', model: '⭐ Opus 4.8', status: 'active', tasks: 8, uptime: '99.95%' },
  { id: 'especialista_certificaciones', name: 'Especialista Certificaciones', role: 'Compliance · Auditoría', specialty: 'ISO 27001, SOC 2, PCI-DSS, HIPAA, certificaciones, auditorías', model: 'Sonnet 4.6', status: 'active', tasks: 7, uptime: '99.9%' },

  // ──────────── GESTIÓN DE PRODUCTO ────────────
  { id: 'gerente_producto', name: 'Gerente de Producto', role: 'Producto · Dirección', specialty: 'Product roadmap, PRD, feature prioritization, backlog management, go-to-market', model: '⭐ Opus 4.8', status: 'active', tasks: 24, uptime: '99.95%' },
  { id: 'especialista_monetizacion', name: 'Especialista Monetización', role: 'Producto · Modelos', specialty: 'Pricing strategy, subscription models, freemium, revenue optimization', model: 'Sonnet 4.6', status: 'active', tasks: 12, uptime: '99.8%' },
  { id: 'analista_metricas', name: 'Analista de Métricas', role: 'Producto · Analytics', specialty: 'KPIs, funnel metrics, retention, NPS, engagement, cohort analysis', model: 'Sonnet 4.6', status: 'active', tasks: 20, uptime: '99.9%' },
  { id: 'especialista_experimentacion', name: 'Especialista Experimentación', role: 'Producto · Testing', specialty: 'Diseño de experimentos, multivariate testing, statistical significance', model: 'Sonnet 4.6', status: 'active', tasks: 14, uptime: '99.8%' },

  // ──────────── RECURSOS HUMANOS & CULTURA ────────────
  { id: 'especialista_reclutamiento', name: 'Especialista Reclutamiento', role: 'RRHH · Hiring', specialty: 'Job descriptions, sourcing, interviews, candidate evaluation, offers', model: 'Sonnet 4.6', status: 'active', tasks: 19, uptime: '99.8%' },
  { id: 'especialista_retención', name: 'Especialista Retención', role: 'RRHH · Talento', specialty: 'Employee engagement, career development, retention strategies, surveys', model: 'Sonnet 4.6', status: 'active', tasks: 11, uptime: '99.8%' },
  { id: 'especialista_capacitacion', name: 'Especialista Capacitación', role: 'RRHH · Learning', specialty: 'Training programs, onboarding, skills development, learning paths', model: 'Sonnet 4.6', status: 'active', tasks: 16, uptime: '99.7%' },
  { id: 'experto_cultura', name: 'Experto Cultura Organizacional', role: 'RRHH · Cultura', specialty: 'Valores, misión, visión, team building, company culture, leadership', model: 'Sonnet 4.6', status: 'active', tasks: 9, uptime: '99.8%' },

  // ──────────── ESPECIALISTAS EN CONTENIDO VISUAL ────────────
  { id: 'especialista_infografias', name: 'Especialista Infografías', role: 'Visualización · Infografías', specialty: 'Infografías, data visualization, diagramas, charts interactivos', model: 'Sonnet 4.6', status: 'active', tasks: 14, uptime: '99.8%' },
  { id: 'especialista_animaciones', name: 'Especialista Animaciones SVG', role: 'Motion · SVG', specialty: 'SVG animations, GSAP DrawSVG, Lottie, micro-interactions', model: 'Sonnet 4.6', status: 'active', tasks: 17, uptime: '99.9%' },
  { id: 'especialista_drones', name: 'Especialista Drones', role: 'Creatividad · Aéreo', specialty: 'Fotografía aérea con drones, videografía aérea, composición, edición', model: 'Sonnet 4.6', status: 'idle', tasks: 0, uptime: '99.6%' },

  // ──────────── ESPECIALISTAS EN LOCALIZACIÓN ────────────
  { id: 'especialista_localizacion_es', name: 'Especialista Localización ES', role: 'Idiomas · Español', specialty: 'Traducción al español, adaptación cultural, market-specific content', model: 'Sonnet 4.6', status: 'active', tasks: 22, uptime: '99.8%' },
  { id: 'especialista_localizacion_en', name: 'Especialista Localización EN', role: 'Idiomas · Inglés', specialty: 'Traducción al inglés, adaptación cultural, tonalidad de marca', model: 'Sonnet 4.6', status: 'active', tasks: 28, uptime: '99.9%' },
  { id: 'especialista_seo_multiidioma', name: 'Especialista SEO Multiidioma', role: 'SEO · Localización', specialty: 'International SEO, hreflang, geotargeting, multilingual content', model: 'Sonnet 4.6', status: 'active', tasks: 11, uptime: '99.8%' },

  // ──────────── ESPECIALISTAS EMERGENTES ────────────
  { id: 'especialista_metaverso', name: 'Especialista Metaverso', role: 'Emergentes · Web3/Metaverso', specialty: 'Experiencias en metaverso, NFTs, virtual events, blockchain', model: 'Sonnet 4.6', status: 'idle', tasks: 0, uptime: '99.5%' },
  { id: 'especialista_ar_vr', name: 'Especialista AR/VR', role: 'Emergentes · Realidad Extendida', specialty: 'Augmented reality, virtual reality, WebXR, 3D experiences', model: 'Sonnet 4.6', status: 'idle', tasks: 0, uptime: '99.5%' },
  { id: 'especialista_ia_generativa', name: 'Especialista IA Generativa', role: 'IA · LLMs', specialty: 'GPT, fine-tuning, prompt engineering, RAG, agentes autónomos', model: '⭐ Opus 4.8', status: 'active', tasks: 26, uptime: '99.95%' },
  { id: 'especialista_edge_computing', name: 'Especialista Edge Computing', role: 'Infraestructura · Edge', specialty: 'Cloudflare Workers, edge functions, CDN, latency optimization', model: 'Sonnet 4.6', status: 'idle', tasks: 0, uptime: '99.7%' },

  // ──────────── ANÁLISIS AVANZADO ────────────
  { id: 'analista_negocios', name: 'Analista de Negocios', role: 'Análisis · Estrategia', specialty: 'Business intelligence, market analysis, strategy recommendations', model: '⭐ Opus 4.8', status: 'active', tasks: 15, uptime: '99.9%' },
  { id: 'especialista_previsiones', name: 'Especialista Previsiones', role: 'Análisis · Forecasting', specialty: 'Forecasting, predictive analytics, trend analysis, scenario planning', model: 'Sonnet 4.6', status: 'active', tasks: 12, uptime: '99.8%' },
  { id: 'especialista_competitividad', name: 'Especialista Competitividad', role: 'Análisis · Mercado', specialty: 'Análisis competitivo, posicionamiento, diferenciación, FODA', model: 'Sonnet 4.6', status: 'active', tasks: 10, uptime: '99.8%' },
];

function extractCategory(role: string): string {
  return role.split('·')[0].trim();
}

function getStatusColor(status: Agent['status']): { bg: string; text: string } {
  switch (status) {
    case 'active':
      return { bg: 'rgba(16, 185, 129, 0.12)', text: '#10b981' };
    case 'thinking':
      return { bg: 'rgba(245, 158, 11, 0.12)', text: '#f59e0b' };
    case 'running':
      return { bg: 'rgba(59, 130, 246, 0.12)', text: '#3b82f6' };
    default:
      return { bg: 'rgba(255, 255, 255, 0.05)', text: 'rgba(255, 255, 255, 0.4)' };
  }
}

function getStatusLabel(status: Agent['status']): string {
  switch (status) {
    case 'active':
      return 'Activo';
    case 'thinking':
      return 'Pensando';
    case 'running':
      return 'Ejecutando';
    default:
      return 'Inactivo';
  }
}

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const categories = Array.from(new Set(SAMPLE_AGENTS.map((a) => extractCategory(a.role)))).sort();

  const filteredAgents = useMemo(() => {
    return SAMPLE_AGENTS.filter((agent) => {
      const matchesCategory = !selectedCategory || extractCategory(agent.role) === selectedCategory;
      const matchesSearch = searchQuery === '' || agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || agent.specialty.toLowerCase().includes(searchQuery.toLowerCase()) || agent.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const agentsByCategory = filteredAgents.reduce((acc, agent) => {
    const cat = extractCategory(agent.role);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(agent);
    return acc;
  }, {} as Record<string, Agent[]>);

  const visibleCategories = Object.keys(agentsByCategory).sort();

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: '#ffffff' }}>
      {/* Hero Section */}
      <div style={{ padding: 'clamp(48px, 8vw, 80px) clamp(24px, 5vw, 64px)' }}>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '12px', fontFamily: "'Fraunces', serif", fontStyle: 'italic' }}>
          Sistema de Agentes IA
        </h1>
        <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.5, marginBottom: '32px', fontWeight: 400 }}>
          <strong style={{ color: '#ffffff', fontWeight: 600 }}>{filteredAgents.length} agentes</strong> en <strong style={{ color: '#ffffff', fontWeight: 600 }}>{visibleCategories.length} categorías</strong>
        </p>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '32px', maxWidth: '500px' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.4)' }} />
          <input
            type="text"
            placeholder="Buscar por nombre, especialidad o rol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 44px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: 1.5,
              letterSpacing: '0px',
              outline: 'none',
              transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          />
          {searchQuery && <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.4)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>}
        </div>

        {/* Category Filter Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '48px' }}>
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              padding: '10px 16px',
              backgroundColor: selectedCategory === null ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.05)',
              color: selectedCategory === null ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
              border: '1px solid ' + (selectedCategory === null ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'),
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: selectedCategory === null ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 200ms ease',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== null) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== null) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }
            }}
          >
            Todos
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              style={{
                padding: '10px 16px',
                backgroundColor: selectedCategory === cat ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                color: selectedCategory === cat ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                border: '1px solid ' + (selectedCategory === cat ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'),
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: selectedCategory === cat ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 200ms ease',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== cat) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== cat) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Agentes Grid */}
      <div style={{ padding: '0 clamp(24px, 5vw, 64px) clamp(48px, 8vw, 80px)' }}>
        {visibleCategories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px', color: 'rgba(255, 255, 255, 0.4)' }}>
            <p style={{ fontSize: '16px', fontWeight: 400, lineHeight: 1.5 }}>No se encontraron agentes que coincidan con tu búsqueda</p>
          </div>
        ) : (
          visibleCategories.map((category) => (
            <div key={category} style={{ marginBottom: '56px' }}>
              {/* Category Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <h2 style={{ fontSize: 'clamp(18px, 4vw, 28px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0, color: '#ffffff' }}>
                  {category}
                </h2>
                <span style={{ display: 'inline-block', backgroundColor: 'rgba(255, 255, 255, 0.06)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                  {agentsByCategory[category].length}
                </span>
              </div>

              {/* Agents Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                {agentsByCategory[category].map((agent) => {
                  const statusColors = getStatusColor(agent.status);
                  return (
                    <div
                      key={agent.id}
                      style={{
                        padding: '20px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      }}
                    >
                      {/* Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.3, margin: '0 0 4px 0', letterSpacing: '-0.01em', color: '#ffffff' }}>
                            {agent.name}
                          </h3>
                          <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', margin: 0, fontWeight: 500, letterSpacing: '0px', lineHeight: 1.4 }}>
                            {agent.role}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', backgroundColor: statusColors.bg, borderRadius: '6px', whiteSpace: 'nowrap' }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: statusColors.text }} />
                          <span style={{ fontSize: '10px', fontWeight: 600, color: statusColors.text, letterSpacing: '0px' }}>
                            {getStatusLabel(agent.status)}
                          </span>
                        </div>
                      </div>

                      {/* Specialty */}
                      <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)', margin: 0, fontWeight: 400, lineHeight: 1.5, letterSpacing: '0px' }}>
                        {agent.specialty}
                      </p>

                      {/* Stats */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <div>
                          <p style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.35)', margin: '0 0 4px 0', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                            Modelo
                          </p>
                          <p style={{ fontSize: '11px', fontWeight: 600, margin: 0, color: '#ffffff', letterSpacing: '0px' }}>
                            {agent.model}
                          </p>
                        </div>
                        <div>
                          <p style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.35)', margin: '0 0 4px 0', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                            Tareas
                          </p>
                          <p style={{ fontSize: '11px', fontWeight: 600, margin: 0, color: '#ffffff', letterSpacing: '0px' }}>
                            {agent.tasks}
                          </p>
                        </div>
                        <div>
                          <p style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.35)', margin: '0 0 4px 0', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                            Uptime
                          </p>
                          <p style={{ fontSize: '11px', fontWeight: 600, margin: 0, color: '#ffffff', letterSpacing: '0px' }}>
                            {agent.uptime}
                          </p>
                        </div>
                      </div>

                      {/* Ver más button */}
                      <button
                        onClick={() => setSelectedAgent(agent)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          color: '#3b82f6',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          transition: 'all 200ms ease',
                          outline: 'none',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.15)';
                          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                        }}
                      >
                        Ver más <ChevronRight size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Popup */}
      {selectedAgent && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '24px',
          }}
          onClick={() => setSelectedAgent(null)}
        >
          <div
            style={{
              backgroundColor: '#0a0a0a',
              borderRadius: '16px',
              padding: '40px',
              width: '100%',
              maxWidth: '600px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
                  {selectedAgent.name}
                </h2>
                <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', margin: 0, fontWeight: 500 }}>
                  {selectedAgent.role}
                </p>
              </div>
              <button
                onClick={() => setSelectedAgent(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '24px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', margin: '0 0 8px 0', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Modelo
                </p>
                <p style={{ fontSize: '14px', fontWeight: 600, margin: 0, color: '#ffffff' }}>
                  {selectedAgent.model}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', margin: '0 0 8px 0', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Estado
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getStatusColor(selectedAgent.status).text }} />
                  <p style={{ fontSize: '14px', fontWeight: 600, margin: 0, color: '#ffffff' }}>
                    {getStatusLabel(selectedAgent.status)}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', margin: '0 0 12px 0', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Especialidad
              </p>
              <p style={{ fontSize: '14px', fontWeight: 400, margin: 0, color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, letterSpacing: '0px' }}>
                {selectedAgent.specialty}
              </p>
            </div>

            <div style={{ marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', margin: '0 0 12px 0', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                ¿Qué hace?
              </p>
              <p style={{ fontSize: '14px', fontWeight: 400, margin: 0, color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.8, letterSpacing: '0px' }}>
                Este agente se especializa en {selectedAgent.specialty.toLowerCase()}. Es capaz de ejecutar tareas complejas relacionadas con su área de experticia, proporcionando análisis profundos, recomendaciones estratégicas y soluciones prácticas. Trabaja de forma autónoma pero también en colaboración con otros agentes del sistema para alcanzar objetivos empresariales de alto valor.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', margin: '0 0 8px 0', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Tareas activas
                </p>
                <p style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                  {selectedAgent.tasks}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', margin: '0 0 8px 0', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Uptime
                </p>
                <p style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#10b981' }}>
                  {selectedAgent.uptime}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
