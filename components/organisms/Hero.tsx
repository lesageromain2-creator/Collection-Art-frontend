// ============================================
// COMPOSANT ORGANISM: HERO SECTION
// ============================================

import React from 'react';
import { useRouter } from 'next/router';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/atoms';
import { cn } from '@/utils/cn';

export interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  image?: string;
  variant?: 'default' | 'centered' | 'split';
  gradient?: boolean;
  badge?: string;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  primaryCta,
  secondaryCta,
  image,
  variant = 'default',
  gradient = true,
  badge,
}) => {
  const router = useRouter();

  if (variant === 'centered') {
    return (
      <section
        className={cn(
          'relative py-20 px-4 sm:px-6 lg:px-8',
          gradient && 'bg-gradient-to-br from-primary via-purple-600 to-secondary'
        )}
      >
        <div className="max-w-4xl mx-auto text-center">
          {badge && (
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              {badge}
            </div>
          )}

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {title}
          </h1>

          {subtitle && (
            <p className="text-xl md:text-2xl text-white/90 mb-4">{subtitle}</p>
          )}

          {description && (
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              {description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {primaryCta && (
              <Button
                size="lg"
                variant="secondary"
                onClick={() => router.push(primaryCta.href)}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                {primaryCta.text}
              </Button>
            )}
            {secondaryCta && (
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary"
                onClick={() => router.push(secondaryCta.href)}
              >
                {secondaryCta.text}
              </Button>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'split') {
    return (
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              {badge && (
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {badge}
                </div>
              )}

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                {title}
              </h1>

              {subtitle && (
                <p className="text-xl md:text-2xl text-gray-600 mb-4">
                  {subtitle}
                </p>
              )}

              {description && (
                <p className="text-lg text-gray-600 mb-8">{description}</p>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                {primaryCta && (
                  <Button
                    size="lg"
                    onClick={() => router.push(primaryCta.href)}
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    {primaryCta.text}
                  </Button>
                )}
                {secondaryCta && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => router.push(secondaryCta.href)}
                  >
                    {secondaryCta.text}
                  </Button>
                )}
              </div>
            </div>

            {/* Right Image */}
            {image && (
              <div className="relative">
                <img
                  src={image}
                  alt={title}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Default variant
  return (
    <section
      className={cn(
        'relative py-20 px-4 sm:px-6 lg:px-8',
        gradient && 'bg-gradient-to-r from-primary to-secondary'
      )}
    >
      <div className="max-w-7xl mx-auto">
        {badge && (
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            {badge}
          </div>
        )}

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-4xl">
          {title}
        </h1>

        {subtitle && (
          <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl">
            {subtitle}
          </p>
        )}

        {description && (
          <p className="text-lg text-white/80 mb-8 max-w-2xl">{description}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          {primaryCta && (
            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.push(primaryCta.href)}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              {primaryCta.text}
            </Button>
          )}
          {secondaryCta && (
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
              onClick={() => router.push(secondaryCta.href)}
            >
              {secondaryCta.text}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

Hero.displayName = 'Hero';

export default Hero;
