import React, { useState } from 'react';
import { Play, Volume2, Settings, Maximize, FastForward, Subtitles, Share2 } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  position: 'top' | 'bottom' | 'left' | 'right';
  element: string;
}

interface VideoOnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function VideoOnboarding({ onComplete, onSkip }: VideoOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Bienvenido a UPlay',
      description: 'Aprende a usar nuestro reproductor de video interactivo para sacar el máximo provecho de tu experiencia de aprendizaje.',
      icon: <Play className="w-8 h-8 text-purple-600" />,
      position: 'center',
      element: '.video-container'
    },
    {
      id: 'playback',
      title: 'Controles básicos',
      description: 'Usa el botón de reproducción para iniciar o pausar el video. También puedes hacer clic directamente en el video.',
      icon: <Play className="w-6 h-6 text-purple-600" />,
      position: 'bottom',
      element: '.play-button'
    },
    {
      id: 'progress',
      title: 'Barra de progreso',
      description: 'Desliza para avanzar o retroceder en el video. El color morado muestra cuánto has visto.',
      icon: <FastForward className="w-6 h-6 text-purple-600" />,
      position: 'bottom',
      element: '.progress-bar'
    },
    {
      id: 'volume',
      title: 'Control de volumen',
      description: 'Ajusta el volumen o silencia el video completamente.',
      icon: <Volume2 className="w-6 h-6 text-purple-600" />,
      position: 'bottom',
      element: '.volume-control'
    },
    {
      id: 'quality',
      title: 'Ajustes de calidad',
      description: 'Cambia la calidad del video y activa los subtítulos según tus necesidades.',
      icon: <Settings className="w-6 h-6 text-purple-600" />,
      position: 'bottom',
      element: '.settings-button'
    },
    {
      id: 'subtitles',
      title: 'Subtítulos',
      description: 'Activa los subtítulos para no perderte ningún detalle del contenido.',
      icon: <Subtitles className="w-6 h-6 text-purple-600" />,
      position: 'bottom',
      element: '.subtitles-button'
    },
    {
      id: 'fullscreen',
      title: 'Pantalla completa',
      description: 'Disfruta del video en pantalla completa para una mejor experiencia.',
      icon: <Maximize className="w-6 h-6 text-purple-600" />,
      position: 'bottom',
      element: '.fullscreen-button'
    },
    {
      id: 'share',
      title: 'Comparte el contenido',
      description: 'Comparte este video con otros jugadores para aprender juntos.',
      icon: <Share2 className="w-6 h-6 text-purple-600" />,
      position: 'right',
      element: '.share-button'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Progress dots */}
          <div className="px-6 pt-4 flex justify-center">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${
                  index === currentStep ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
              {currentStepData.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {currentStepData.title}
            </h3>
            <p className="text-gray-600 mb-6">
              {currentStepData.description}
            </p>

            {/* Buttons */}
            <div className="flex justify-between">
              <button
                onClick={onSkip}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Omitir
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700"
              >
                {currentStep === steps.length - 1 ? 'Empezar' : 'Siguiente'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}