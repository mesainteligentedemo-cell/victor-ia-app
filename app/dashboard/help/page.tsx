'use client';

import { useState, useMemo } from 'react';
import {
  MessageSquare,
  Zap,
  Library,
  BarChart3,
  TrendingUp,
  Megaphone,
  LifeBuoy,
  DollarSign,
  Settings,
  ChevronDown,
  Search,
  X,
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  question: string;
  answer: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  articles: Article[];
}

const categories: Category[] = [
  {
    id: 'chat',
    name: 'Chat',
    icon: <MessageSquare size={20} />,
    articles: [
      {
        id: 'chat-1',
        title: '¿Cómo inicio una conversación?',
        question: '¿Cómo inicio una conversación?',
        answer:
          'Para iniciar una conversación, haz clic en el botón "Nuevo Chat" en la barra lateral izquierda. Se abrirá un cuadro de diálogo donde puedes elegir un agente o crear un chat general. Escribe tu mensaje en el campo de entrada y presiona Enter o haz clic en el botón de envío.',
      },
      {
        id: 'chat-2',
        title: '¿Cómo veo mi historial de chats?',
        question: '¿Cómo veo mi historial de chats?',
        answer:
          'Tu historial de chats se muestra en la barra lateral izquierda. Haz clic en cualquier chat anterior para reabrir la conversación. Los chats se ordenan por fecha, con los más recientes al principio. Puedes usar la búsqueda de chats para encontrar conversaciones específicas.',
      },
      {
        id: 'chat-3',
        title: '¿Puedo exportar una conversación?',
        question: '¿Puedo exportar una conversación?',
        answer:
          'Sí. Abre un chat y haz clic en el icono de tres puntos en la esquina superior derecha. Selecciona "Exportar como PDF" o "Exportar como texto". El archivo se descargará automáticamente a tu carpeta de descargas.',
      },
      {
        id: 'chat-4',
        title: '¿Cómo edito un mensaje enviado?',
        question: '¿Cómo edito un mensaje enviado?',
        answer:
          'Pasa el cursor sobre el mensaje que deseas editar y haz clic en el icono de lápiz. Se abrirá el editor de mensajes donde puedes hacer cambios. Haz clic en "Guardar" para confirmar o "Cancelar" para descartar los cambios.',
      },
      {
        id: 'chat-5',
        title: '¿Puedo usar @ para mencionar agentes?',
        question: '¿Puedo usar @ para mencionar agentes?',
        answer:
          'Sí. Escribe @ en tu mensaje para ver una lista de agentes disponibles. Selecciona uno para mencionarlo. El agente recibirá una notificación y podrá responder directamente a tu mensaje.',
      },
    ],
  },
  {
    id: 'agents',
    name: 'Agentes',
    icon: <Zap size={20} />,
    articles: [
      {
        id: 'agents-1',
        title: '¿Qué es un agente?',
        question: '¿Qué es un agente?',
        answer:
          'Un agente es una IA especializada diseñada para realizar tareas específicas. Cada agente tiene roles, conocimientos y herramientas únicas. Por ejemplo, el agente de Ventas ayuda con estrategias de cierre, mientras que el agente de Análisis maneja datos y métricas.',
      },
      {
        id: 'agents-2',
        title: '¿Cuántos agentes tengo disponibles?',
        question: '¿Cuántos agentes tengo disponibles?',
        answer:
          'Tienes acceso a 12 agentes principales: CEO, CTO, CMO, CSO, CXO, CFO, Analyst, Sales, Marketing, Support, Product, y Finance. Tu plan determina cuántos puedes usar simultáneamente. Verifica tu suscripción en Configuración → Planes.',
      },
      {
        id: 'agents-3',
        title: '¿Cómo ejecuto un agente?',
        question: '¿Cómo ejecuto un agente?',
        answer:
          'Ve a la sección "Agentes" en el menú principal. Haz clic en el agente que deseas ejecutar. Se abrirá un panel con opciones de configuración. Define los parámetros necesarios y haz clic en "Ejecutar". El agente comenzará su tarea y verás el progreso en tiempo real.',
      },
      {
        id: 'agents-4',
        title: '¿Puedo crear un agente personalizado?',
        question: '¿Puedo crear un agente personalizado?',
        answer:
          'Sí, con el plan Pro o superior. Ve a Agentes → "Crear Nuevo Agente". Define el nombre, rol, descripción, herramientas y flujo de trabajo. Prueba el agente antes de guardarlo. Puedes editarlo o eliminarlo en cualquier momento desde la biblioteca de agentes.',
      },
      {
        id: 'agents-5',
        title: '¿Cómo monitoreo el progreso de un agente?',
        question: '¿Cómo monitoreo el progreso de un agente?',
        answer:
          'Abre el panel de "Agentes Activos" en el dashboard. Verás una lista de todos los agentes en ejecución con barras de progreso, tiempos estimados de finalización y logs en vivo. Haz clic en un agente para ver detalles completos.',
      },
    ],
  },
  {
    id: 'library',
    name: 'Biblioteca',
    icon: <Library size={20} />,
    articles: [
      {
        id: 'library-1',
        title: '¿Qué puedo encontrar en la Biblioteca?',
        question: '¿Qué puedo encontrar en la Biblioteca?',
        answer:
          'La Biblioteca contiene plantillas, flujos de trabajo, componentes reutilizables, documentos de referencia y mejores prácticas. Incluye plantillas para propuestas, reportes, campaña de marketing, emails, y más. Todos los recursos son editables y personalizables.',
      },
      {
        id: 'library-2',
        title: '¿Cómo busco en la Biblioteca?',
        question: '¿Cómo busco en la Biblioteca?',
        answer:
          'Usa la barra de búsqueda en la parte superior de la Biblioteca. Filtra por tipo (plantilla, flujo, componente), categoría, o etiqueta. También puedes ordenar por fecha, popularidad o relevancia. Los favoritos aparecen al inicio.',
      },
      {
        id: 'library-3',
        title: '¿Puedo guardar un recurso como favorito?',
        question: '¿Puedo guardar un recurso como favorito?',
        answer:
          'Sí. Abre cualquier recurso y haz clic en el icono de corazón en la esquina superior derecha. Los favoritos se sincronizan en todos tus dispositivos y aparecen en una sección especial de la Biblioteca para acceso rápido.',
      },
      {
        id: 'library-4',
        title: '¿Cómo comparto un recurso con mi equipo?',
        question: '¿Cómo comparto un recurso con mi equipo?',
        answer:
          'Abre el recurso y haz clic en "Compartir". Selecciona los miembros del equipo o copia el enlace para compartir. Puedes dar permisos de vista, comentario o edición. Los cambios se actualizan en tiempo real para todos los colaboradores.',
      },
      {
        id: 'library-5',
        title: '¿Puedo crear mis propios recursos?',
        question: '¿Puedo crear mis propios recursos?',
        answer:
          'Sí. Ve a Biblioteca → "Crear Recurso". Elige el tipo (plantilla, flujo, componente), define el contenido, agrega etiquetas y descripción. Guarda como privado (solo tú) o compartido con tu equipo. Puedes monetizarlo si lo haces público.',
      },
    ],
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: <BarChart3 size={20} />,
    articles: [
      {
        id: 'analytics-1',
        title: '¿Dónde veo mis métricas principales?',
        question: '¿Dónde veo mis métricas principales?',
        answer:
          'Ve al Dashboard → Analytics. Verás un resumen con KPIs clave: conversaciones totales, agentes ejecutados, tiempo promedio de respuesta, satisfacción del cliente, y ROI. Cada métrica muestra comparación con el período anterior.',
      },
      {
        id: 'analytics-2',
        title: '¿Cómo personalizo mi dashboard de analytics?',
        question: '¿Cómo personalizo mi dashboard de analytics?',
        answer:
          'Haz clic en el icono de engranaje en la esquina superior derecha de Analytics. Selecciona qué widgets deseas mostrar, ordénalos arrastrando, cambia el rango de fechas y aplica filtros por equipo o proyecto. Los cambios se guardan automáticamente.',
      },
      {
        id: 'analytics-3',
        title: '¿Puedo exportar reportes?',
        question: '¿Puedo exportar reportes?',
        answer:
          'Sí. En Analytics, haz clic en "Exportar". Elige el formato (PDF, CSV, Excel), el rango de fechas y las métricas incluidas. El reporte se generará y descargará automáticamente. También puedes programar reportes automáticos vía email.',
      },
      {
        id: 'analytics-4',
        title: '¿Cómo interpreto los gráficos de tendencias?',
        question: '¿Cómo interpreto los gráficos de tendencias?',
        answer:
          'Los gráficos de línea muestran cambios en el tiempo. El área sombreada indica el rango normal. Si la línea sube, la métrica mejora. Los puntos rojos indican anomalías o problemas. Pasa el cursor sobre un punto para ver el valor exacto en esa fecha.',
      },
      {
        id: 'analytics-5',
        title: '¿Qué es el Score de Salud?',
        question: '¿Qué es el Score de Salud?',
        answer:
          'El Score de Salud (0-100) resume la efectividad general de tu equipo. Combina velocidad de respuesta, satisfacción de clientes, completitud de tareas y calidad de agentes. Un score >80 es excelente. Haz clic para ver el desglose de cada factor.',
      },
    ],
  },
  {
    id: 'sales',
    name: 'Sales',
    icon: <TrendingUp size={20} />,
    articles: [
      {
        id: 'sales-1',
        title: '¿Cómo gestiono mi pipeline de ventas?',
        question: '¿Cómo gestiono mi pipeline de ventas?',
        answer:
          'Ve a Sales → Pipeline. Verás un tablero Kanban con etapas: Prospecto, Propuesta, Negociación, Cerrado. Arrastra leads entre columnas para actualizar su estado. Haz clic en un lead para ver detalles, historial, y próximas acciones.',
      },
      {
        id: 'sales-2',
        title: '¿Cómo agrego un nuevo prospecto?',
        question: '¿Cómo agrego un nuevo prospecto?',
        answer:
          'En Sales → Pipeline, haz clic en "Agregar Prospecto". Ingresa nombre de la empresa, contacto, email, teléfono, y valor estimado. Asigna un agente de ventas responsable. El prospecto aparecerá en la columna "Prospecto" y recibirá seguimiento automático.',
      },
      {
        id: 'sales-3',
        title: '¿Puedo automatizar seguimientos?',
        question: '¿Puedo automatizar seguimientos?',
        answer:
          'Sí. Abre un prospecto y ve a "Automatización de Seguimiento". Configura reglas: si no hay actividad en 3 días, enviar email automático. Si responde, crear tarea para el agente. Define frecuencia, canales (email, SMS, WhatsApp) y mensajes personalizados.',
      },
      {
        id: 'sales-4',
        title: '¿Cómo veo mi forecast de ingresos?',
        question: '¿Cómo veo mi forecast de ingresos?',
        answer:
          'Ve a Sales → Forecast. Verás una proyección de ingresos basada en leads actuales ponderados por probabilidad de cierre. Ajusta manualmente las probabilidades para leads específicos. El forecast se actualiza en tiempo real y muestra el mejor y peor escenario.',
      },
      {
        id: 'sales-5',
        title: '¿Cómo importo leads desde una lista?',
        question: '¿Cómo importo leads desde una lista?',
        answer:
          'En Sales → Pipeline, haz clic en "Importar". Sube un CSV con columnas: Empresa, Contacto, Email, Teléfono, Valor. La app valida emails y deduplica automáticamente. Los leads importados se asignan a un agente según reglas configurables.',
      },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: <Megaphone size={20} />,
    articles: [
      {
        id: 'marketing-1',
        title: '¿Cómo creo una campaña de email?',
        question: '¿Cómo creo una campaña de email?',
        answer:
          'Ve a Marketing → Campañas. Haz clic en "Nueva Campaña" y elige "Email". Selecciona una plantilla o crea desde cero. Define audiencia, asunto, cuerpo, y CTA. Configura envío inmediato o programado. Revisa la vista previa antes de enviar.',
      },
      {
        id: 'marketing-2',
        title: '¿Cómo segmento mi audiencia?',
        question: '¿Cómo segmento mi audiencia?',
        answer:
          'En Marketing → Audiencias, crea un segmento nuevo. Define criterios: ubicación, comportamiento, histórico de compra, etiquetas personalizadas. Los segmentos se actualizan automáticamente. Reutiliza en múltiples campañas para consistencia.',
      },
      {
        id: 'marketing-3',
        title: '¿Puedo hacer A/B testing?',
        question: '¿Puedo hacer A/B testing?',
        answer:
          'Sí. Al crear una campaña de email, haz clic en "A/B Test". Define dos variantes (asunto, cuerpo, CTA). Elige qué porcentaje de audiencia recibe cada variante. La app automáticamente corona al ganador y envía la variante ganadora al resto de la audiencia.',
      },
      {
        id: 'marketing-4',
        title: '¿Cómo veo el rendimiento de mis campañas?',
        question: '¿Cómo veo el rendimiento de mis campañas?',
        answer:
          'Ve a Marketing → Resultados. Verás métricas por campaña: tasa de apertura, clicks, conversiones, ROI. Gráficos temporales muestran comportamiento a lo largo del tiempo. Exporta datos para análisis profundo o integra con Google Analytics.',
      },
      {
        id: 'marketing-5',
        title: '¿Puedo integrar redes sociales?',
        question: '¿Puedo integrar redes sociales?',
        answer:
          'Sí. Ve a Marketing → Integraciones. Conecta Facebook, Instagram, LinkedIn y TikTok. Crea campañas multi-canal una sola vez. Programa publicaciones, rastrea engagement, y ve resultados consolidados. Los bots responden automáticamente en comentarios.',
      },
    ],
  },
  {
    id: 'support',
    name: 'Support',
    icon: <LifeBuoy size={20} />,
    articles: [
      {
        id: 'support-1',
        title: '¿Cómo atiendo tickets de clientes?',
        question: '¿Cómo atiendo tickets de clientes?',
        answer:
          'Ve a Support → Tickets. Verás una cola de tickets con prioridad (urgente, alta, normal, baja). Haz clic en uno para verlo. El agente de support puede responder, reasignar, o cerrar. Los clientes reciben notificaciones por email en cada cambio.',
      },
      {
        id: 'support-2',
        title: '¿Puedo automatizar respuestas comunes?',
        question: '¿Puedo automatizar respuestas comunes?',
        answer:
          'Sí. Ve a Support → Respuestas Automáticas. Crea reglas: si el ticket contiene "cambiar contraseña", responder automáticamente con instrucciones. Puedes usar templates de respuesta e ir mejorando. Los clientes pueden resolver sin intervención humana.',
      },
      {
        id: 'support-3',
        title: '¿Cómo priorizo tickets?',
        question: '¿Cómo priorizo tickets?',
        answer:
          'Al crear o ver un ticket, asigna prioridad manualmente. También puedes configurar reglas automáticas: clientes VIP → urgente, palabras clave específicas → alta prioridad. Los tickets urgentes aparecen al inicio de la cola con alertas visuales.',
      },
      {
        id: 'support-4',
        title: '¿Puedo ofrecer un chat en vivo a clientes?',
        question: '¿Puedo ofrecer un chat en vivo a clientes?',
        answer:
          'Sí. Ve a Support → Chat Vivo. Activa el widget y personaliza color, mensaje de bienvenida, horarios de atención. Los clientes ven el chat en tu sitio web. El agente de support recibe notificaciones en tiempo real y puede responder instantáneamente.',
      },
      {
        id: 'support-5',
        title: '¿Cómo mejoro el tiempo de resolución?',
        question: '¿Cómo mejoro el tiempo de resolución?',
        answer:
          'Ve a Support → Análisis. Verás tiempo promedio de resolución por agente y tipo de ticket. Identifica cuellos de botella. Usa la IA para sugerir respuestas más rápidas. Entrena agentes con casos difíciles. Aumenta la cobertura de respuestas automáticas.',
      },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: <DollarSign size={20} />,
    articles: [
      {
        id: 'finance-1',
        title: '¿Cómo veo mi estado financiero?',
        question: '¿Cómo veo mi estado financiero?',
        answer:
          'Ve a Finance → Resumen. Verás: ingresos por período, gastos, ganancias netas, y flujo de caja. Gráficos temporales muestran tendencias. Compara con períodos anteriores para análisis. Exporta reportes financieros oficiales en PDF.',
      },
      {
        id: 'finance-2',
        title: '¿Cómo agrego una transacción?',
        question: '¿Cómo agrego una transacción?',
        answer:
          'Ve a Finance → Transacciones. Haz clic en "Nueva Transacción". Define tipo (ingreso/gasto), categoría, monto, fecha, descripción, y adjunta recibo. La transacción se procesa inmediatamente. Sincroniza con tu banco para validación automática.',
      },
      {
        id: 'finance-3',
        title: '¿Puedo hacer seguimiento de facturas?',
        question: '¿Puedo hacer seguimiento de facturas?',
        answer:
          'Sí. Ve a Finance → Facturas. Crea facturas con plantillas, define términos de pago, y envía a clientes. Recibe notificaciones automáticas de pagos recibidos. Rastrea qué facturas están pendientes y envía recordatorios automáticos.',
      },
      {
        id: 'finance-4',
        title: '¿Cómo calculo impuestos?',
        question: '¿Cómo calculo impuestos?',
        answer:
          'Ve a Finance → Impuestos. Define tu régimen fiscal, tasas, y desgravaciones aplicables. La app calcula automáticamente. Genera reportes por período fiscal. Exporta datos para tu contador. Recibe alertas de plazos de pago de impuestos.',
      },
      {
        id: 'finance-5',
        title: '¿Puedo vincular mi banco?',
        question: '¿Puedo vincular mi banco?',
        answer:
          'Sí. Ve a Finance → Integraciones. Selecciona tu banco y conecta usando Open Banking. La app sincroniza transacciones automáticamente cada día. Valida gastos, detecta fraude, y sugiere categorización. Los datos se encriptan end-to-end.',
      },
    ],
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: <Settings size={20} />,
    articles: [
      {
        id: 'settings-1',
        title: '¿Cómo cambio mi contraseña?',
        question: '¿Cómo cambio mi contraseña?',
        answer:
          'Ve a Settings → Seguridad. Haz clic en "Cambiar Contraseña". Ingresa la contraseña actual, luego la nueva dos veces. Debe tener al menos 12 caracteres, con mayúsculas, números y símbolos. Se cerrará tu sesión automáticamente después del cambio.',
      },
      {
        id: 'settings-2',
        title: '¿Cómo activo autenticación de dos factores?',
        question: '¿Cómo activo autenticación de dos factores?',
        answer:
          'Ve a Settings → Seguridad → 2FA. Elige entre autenticador de apps (Google Authenticator) o SMS. Si eliges app, escanea el código QR. Si eliges SMS, verifica tu número. Guarda los códigos de recuperación en lugar seguro. La 2FA se requerirá en cada login.',
      },
      {
        id: 'settings-3',
        title: '¿Cómo agrego miembros al equipo?',
        question: '¿Cómo agrego miembros al equipo?',
        answer:
          'Ve a Settings → Equipo. Haz clic en "Invitar Miembro". Ingresa email, elige rol (admin, gerente, usuario), y permisos específicos. Se enviará invitación por email. El miembro debe aceptar para unirse. Puedes cambiar roles en cualquier momento.',
      },
      {
        id: 'settings-4',
        title: '¿Cómo configuro notificaciones?',
        question: '¿Cómo configuro notificaciones?',
        answer:
          'Ve a Settings → Notificaciones. Elige qué eventos disparan notificaciones (nuevo chat, ticket cerrado, reporte listo). Define canales: app, email, SMS. Configura horarios de silencio. Puedes silenciar proyectos o equipos específicos sin afectar otros.',
      },
      {
        id: 'settings-5',
        title: '¿Cómo actualizo mi información de facturación?',
        question: '¿Cómo actualizo mi información de facturación?',
        answer:
          'Ve a Settings → Facturación. Actualiza dirección, razón social, RFC/NIF. Define método de pago (tarjeta, transferencia, PayPal). Elige frecuencia de facturación (mensual, anual). Los cambios aplican a la próxima factura. Se enviará comprobante por email.',
      },
    ],
  },
];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    Object.fromEntries(categories.map((cat) => [cat.id, true]))
  );

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) {
      return categories;
    }

    const term = searchTerm.toLowerCase();
    return categories
      .map((cat) => ({
        ...cat,
        articles: cat.articles.filter(
          (article) =>
            article.title.toLowerCase().includes(term) ||
            article.question.toLowerCase().includes(term) ||
            article.answer.toLowerCase().includes(term)
        ),
      }))
      .filter((cat) => cat.articles.length > 0);
  }, [searchTerm]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const totalResults = filteredCategories.reduce((sum, cat) => sum + cat.articles.length, 0);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        padding: '40px 20px',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '12px',
            }}
          >
            Centro de Ayuda
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--text-secondary)',
            }}
          >
            Encuentra respuestas a tus preguntas sobre Victor IA
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search
              size={20}
              style={{
                position: 'absolute',
                left: '16px',
                color: 'var(--text-secondary)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Busca por palabra clave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 44px',
                paddingRight: searchTerm ? '44px' : '16px',
                fontSize: '16px',
                border: `2px solid ${searchTerm ? 'var(--blue)' : 'var(--border)'}`,
                borderRadius: '8px',
                backgroundColor: 'var(--bg2)',
                color: 'var(--text-primary)',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'all 0.2s',
              }}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                style={{
                  position: 'absolute',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>
          {searchTerm && (
            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                marginTop: '8px',
              }}
            >
              {totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Categories */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {filteredCategories.length === 0 ? (
            <div
              style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: 'var(--text-secondary)',
              }}
            >
              <p style={{ fontSize: '16px' }}>
                No encontramos resultados para "{searchTerm}". Intenta con otras palabras clave.
              </p>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div
                key={category.id}
                style={{
                  border: `1px solid var(--border)`,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: 'var(--bg2)',
                }}
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderBottom: expandedCategories[category.id]
                      ? `1px solid var(--border)`
                      : 'none',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'var(--bg)',
                        borderRadius: '8px',
                        color: 'var(--blue)',
                      }}
                    >
                      {category.icon}
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <h2
                        style={{
                          fontSize: '18px',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          margin: 0,
                        }}
                      >
                        {category.name}
                      </h2>
                      <p
                        style={{
                          fontSize: '14px',
                          color: 'var(--text-secondary)',
                          margin: '4px 0 0 0',
                        }}
                      >
                        {category.articles.length} artículos
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    size={20}
                    style={{
                      color: 'var(--text-secondary)',
                      transform: expandedCategories[category.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s',
                    }}
                  />
                </button>

                {/* Articles */}
                {expandedCategories[category.id] && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0px',
                    }}
                  >
                    {category.articles.map((article, index) => (
                      <details
                        key={article.id}
                        style={{
                          borderTop: index > 0 ? `1px solid var(--border)` : 'none',
                        }}
                      >
                        <summary
                          style={{
                            padding: '16px',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            userSelect: 'none',
                            backgroundColor: 'transparent',
                            transition: 'background-color 0.2s',
                            fontSize: '15px',
                            fontWeight: 500,
                            color: 'var(--text-primary)',
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg)';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                          }}
                        >
                          <span>{article.question}</span>
                          <ChevronDown
                            size={16}
                            style={{
                              color: 'var(--text-secondary)',
                              marginLeft: '12px',
                              flexShrink: 0,
                              transform: 'rotate(0deg)',
                            }}
                          />
                        </summary>
                        <div
                          style={{
                            padding: '0 16px 16px 16px',
                            paddingLeft: '40px',
                            backgroundColor: 'var(--bg)',
                            fontSize: '15px',
                            lineHeight: '1.6',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {article.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer CTA */}
        {filteredCategories.length > 0 && (
          <div
            style={{
              marginTop: '48px',
              padding: '24px',
              backgroundColor: 'var(--bg2)',
              border: `1px solid var(--border)`,
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '8px',
              }}
            >
              ¿No encontraste lo que buscas?
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                marginBottom: '16px',
              }}
            >
              Nuestro equipo de soporte está aquí para ayudarte
            </p>
            <button
              style={{
                padding: '10px 24px',
                backgroundColor: 'var(--blue)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--blue-dark)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--blue)';
              }}
            >
              Contacta a Soporte
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
