import { createElement, useEffect, useRef, useState } from 'react'
import type { ModelViewerElement } from '@google/model-viewer'
import { Expand, Minimize, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react'
import type { ProjectModelViewerConfig } from '../../types'

type ProjectModelViewerProps = {
  config: ProjectModelViewerConfig
  title: string
  poster: string
  onClose: () => void
}

export default function ProjectModelViewer({ config, title, poster, onClose }: ProjectModelViewerProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const modelRef = useRef<ModelViewerElement | null>(null)
  const [libraryReady, setLibraryReady] = useState(config.type === 'sketchfab')
  const [loaded, setLoaded] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (config.type !== 'local') return
    let cancelled = false

    import('@google/model-viewer')
      .then(({ ModelViewerElement }) => {
        if (cancelled) return
        ModelViewerElement.modelCacheSize = 1
        setLibraryReady(true)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })

    return () => { cancelled = true }
  }, [config.type, attempt])

  useEffect(() => {
    const model = modelRef.current
    if (!model || config.type !== 'local' || !libraryReady) return

    const handleProgress = (event: Event) => {
      const detail = (event as CustomEvent<{ totalProgress?: number }>).detail
      if (typeof detail?.totalProgress === 'number') setProgress(Math.round(detail.totalProgress * 100))
    }
    const handleLoad = () => {
      setProgress(100)
      setLoaded(true)
      setError(false)
    }
    const handleError = () => setError(true)

    model.addEventListener('progress', handleProgress)
    model.addEventListener('load', handleLoad)
    model.addEventListener('error', handleError)
    if (model.loaded) handleLoad()

    return () => {
      model.removeEventListener('progress', handleProgress)
      model.removeEventListener('load', handleLoad)
      model.removeEventListener('error', handleError)
    }
  }, [config.type, libraryReady, attempt])

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(document.fullscreenElement === stageRef.current)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  useEffect(() => () => {
    if (modelRef.current) modelRef.current.src = ''
  }, [])

  const closeViewer = () => {
    if (modelRef.current) {
      modelRef.current.src = ''
      modelRef.current.showPoster()
    }
    onClose()
  }

  const toggleFullscreen = async () => {
    const stage = stageRef.current
    if (!stage) return
    try {
      if (document.fullscreenElement === stage) await document.exitFullscreen()
      else await stage.requestFullscreen()
    } catch {
      setError(true)
    }
  }

  const resetCamera = () => {
    if (!modelRef.current || config.type !== 'local') return
    modelRef.current.cameraOrbit = config.initialCamera?.orbit ?? '0deg 75deg 105%'
    modelRef.current.cameraTarget = config.initialCamera?.target ?? 'auto auto auto'
    modelRef.current.fieldOfView = config.initialCamera?.fieldOfView ?? 'auto'
    modelRef.current.resetTurntableRotation(0)
    modelRef.current.jumpCameraToGoal()
  }

  const retry = () => {
    if (modelRef.current) modelRef.current.src = ''
    setError(false)
    setLoaded(false)
    setProgress(0)
    setLibraryReady(config.type === 'sketchfab')
    setAttempt((value) => value + 1)
  }

  const modelViewerElement = config.type === 'local' && libraryReady && !error
    ? createElement('model-viewer', {
        key: attempt,
        ref: modelRef,
        src: config.src,
        poster,
        alt: config.description ?? `Modelo 3D interactivo de ${title}`,
        'camera-controls': true,
        'touch-action': 'pan-y',
        loading: 'eager',
        reveal: 'auto',
        'interaction-prompt': 'auto',
        'camera-orbit': config.initialCamera?.orbit ?? '0deg 75deg 105%',
        'camera-target': config.initialCamera?.target ?? 'auto auto auto',
        'field-of-view': config.initialCamera?.fieldOfView ?? 'auto',
        'shadow-intensity': '0.8',
        style: { backgroundColor: config.backgroundColor ?? '#101419' },
      } as never)
    : null

  return (
    <div className="project-model-viewer">
      <div className="project-model-viewer-toolbar" aria-label="Controles del visor 3D">
        <span>{config.type === 'local' ? 'MODELO LOCAL' : 'SKETCHFAB'}</span>
        <div>
          {config.type === 'local' && loaded && <>
            <button type="button" onClick={() => modelRef.current?.zoom(-1)} aria-label="Alejar modelo"><ZoomOut size={16} /></button>
            <button type="button" onClick={() => modelRef.current?.zoom(1)} aria-label="Acercar modelo"><ZoomIn size={16} /></button>
            <button type="button" onClick={resetCamera} aria-label="Reiniciar cámara"><RotateCcw size={16} /></button>
          </>}
          <button type="button" onClick={toggleFullscreen} aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Ver en pantalla completa'}>{isFullscreen ? <Minimize size={16} /> : <Expand size={16} />}</button>
          <button type="button" onClick={closeViewer} aria-label="Cerrar visor y liberar el modelo"><X size={17} /></button>
        </div>
      </div>
      <div ref={stageRef} className="project-model-viewer-stage" style={{ backgroundColor: config.backgroundColor ?? '#101419' }}>
        {config.type === 'sketchfab' ? (
          <iframe
            src={config.url}
            title={`Visor 3D de ${title}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : libraryReady && !error ? modelViewerElement : null}
        {config.type === 'local' && !loaded && !error && (
          <div className="project-model-progress" role="status" aria-live="polite">
            <span>{libraryReady ? (progress ? `Cargando modelo · ${progress}%` : 'Preparando modelo…') : 'Preparando visor…'}</span>
            <progress max="100" value={progress} aria-label="Progreso de carga del modelo 3D" />
          </div>
        )}
        {config.type === 'sketchfab' && !loaded && (
          <span className="project-model-progress project-model-progress-compact" role="status">Cargando Sketchfab…</span>
        )}
        {error && (
          <div className="project-model-error" role="alert"><strong>No se pudo cargar el modelo.</strong><p>Comprueba el archivo y vuelve a intentarlo.</p><div><button type="button" className="button button-primary" onClick={retry}>Reintentar</button><button type="button" className="button button-quiet" onClick={closeViewer}>Cerrar</button></div></div>
        )}
      </div>
    </div>
  )
}
