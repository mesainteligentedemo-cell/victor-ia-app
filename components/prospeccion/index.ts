/**
 * PROSPECCION COMPONENTS — BARREL EXPORT
 * Central export point for all React components
 * Version: 1.0.0 | Last Updated: 2026-06-10
 */

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export { default as ProspeccionPage } from './ProspeccionPage';

// ============================================================================
// GENERATOR MODALS (INPUT COMPONENTS)
// ============================================================================

export { default as VideoGeneratorModal } from './VideoGeneratorModal';
export { default as ImageGeneratorModal } from './ImageGeneratorModal';
export { default as BatchGeneratorModal } from './BatchGeneratorModal';

// ============================================================================
// DISPLAY & VIEWING COMPONENTS
// ============================================================================

export { default as ResultsGallery } from './ResultsGallery';
export { default as TrendingPanel } from './TrendingPanel';

// ============================================================================
// CUSTOM HOOKS (LOCAL TO PROSPECCION)
// ============================================================================

/**
 * Hook for generation workflow management
 * Usage: const { generate, status, result } = useProspeccion();
 */
export { useProspeccion } from './useProspeccion';