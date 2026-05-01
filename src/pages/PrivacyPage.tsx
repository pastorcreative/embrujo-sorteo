import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import logo from '../assets/embrujo-sin-fondo.webp'

const SECTIONS = [
  {
    title: '1. Responsable del tratamiento',
    body: 'Embrujo Modas es el responsable del tratamiento de los datos personales recogidos a través de esta aplicación de sorteos.',
  },
  {
    title: '2. Finalidad',
    body: 'Los datos (nombres de participantes) se recopilan exclusivamente para realizar sorteos internos de forma aleatoria. No se almacenan de forma permanente ni se transmiten a terceros.',
  },
  {
    title: '3. Datos tratados',
    body: 'Únicamente se tratan los nombres públicos de los usuarios que comentan en la publicación de Facebook seleccionada por el organizador del sorteo. No se recogen datos de contacto, datos sensibles ni información de pago.',
  },
  {
    title: '4. Base legal',
    body: 'El tratamiento se fundamenta en el consentimiento del participante al comentar en una publicación pública con fines de participación en el sorteo (art. 6.1.a RGPD).',
  },
  {
    title: '5. Conservación de datos',
    body: 'Los datos solo existen en memoria durante la sesión activa de la aplicación. Al cerrar o recargar la página, los datos se eliminan automáticamente. No se utilizan bases de datos ni cookies propias.',
  },
  {
    title: '6. Integración con Facebook',
    body: 'Esta aplicación utiliza la API de Facebook (Meta Platforms, Inc.) para leer comentarios de publicaciones de páginas gestionadas por el organizador. El acceso requiere autenticación OAuth y se limita a los permisos estrictamente necesarios: pages_show_list, pages_read_engagement y pages_read_user_content. Los tokens de acceso no se almacenan fuera de la sesión del navegador.',
  },
  {
    title: '7. Transferencias internacionales',
    body: 'La consulta a la API de Facebook implica una transferencia de datos a servidores de Meta Platforms, Inc. (EE. UU.), amparada por las cláusulas contractuales tipo aprobadas por la Comisión Europea.',
  },
  {
    title: '8. Derechos de los usuarios',
    body: 'Los participantes pueden ejercer sus derechos de acceso, rectificación, supresión, oposición y portabilidad contactando con Embrujo Modas a través de sus canales oficiales en redes sociales. Asimismo, tienen derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).',
  },
  {
    title: '9. Cambios en esta política',
    body: 'Esta política puede actualizarse para adaptarse a cambios legales o funcionales de la aplicación. La fecha de última revisión se indica al pie de esta página.',
  },
]

export const PrivacyPage = () => {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-dvh flex flex-col items-center px-4 py-10 gap-8"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Header */}
      <motion.div
        className="w-full max-w-2xl flex flex-col items-center gap-2 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <img
          src={logo}
          alt="Embrujo Modas"
          className="mx-auto"
          style={{ height: '120px', objectFit: 'contain' }}
        />
        <p
          className="text-base tracking-[0.3em] uppercase mt-1"
          style={{ color: 'var(--color-accent)', fontFamily: "'DM Mono', monospace" }}
        >
          Política de privacidad
        </p>
      </motion.div>

      {/* Contenido */}
      <motion.div
        className="w-full max-w-2xl flex flex-col gap-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        {/* Intro */}
        <div
          className="rounded-2xl px-6 py-5"
          style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)' }}
        >
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--color-text)', fontFamily: "'DM Mono', monospace", opacity: 0.75 }}
          >
            En cumplimiento del Reglamento (UE) 2016/679 General de Protección de Datos (RGPD) y la
            Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales
            (LOPDGDD), a continuación se informa sobre el tratamiento de datos personales realizado a
            través de la aplicación de sorteos de Embrujo Modas.
          </p>
        </div>

        {/* Secciones */}
        {SECTIONS.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.04, duration: 0.4 }}
            className="rounded-2xl px-6 py-5 flex flex-col gap-2"
            style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)' }}
          >
            <h2
              className="text-sm font-semibold"
              style={{ color: 'var(--color-accent)', fontFamily: "'DM Mono', monospace" }}
            >
              {section.title}
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--color-text)', fontFamily: "'Playfair Display', serif", opacity: 0.85 }}
            >
              {section.body}
            </p>
          </motion.div>
        ))}

        {/* Pie */}
        <p
          className="text-center text-xs opacity-40 pb-2"
          style={{ color: 'var(--color-text)', fontFamily: "'DM Mono', monospace" }}
        >
          Última revisión: mayo de 2026
        </p>
      </motion.div>

      {/* Botón volver */}
      <motion.button
        onClick={() => navigate('/setup')}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-200"
        style={{
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          border: '1.5px solid var(--color-border)',
          fontFamily: "'DM Mono', monospace",
        }}
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Volver al sorteo
      </motion.button>
    </div>
  )
}
