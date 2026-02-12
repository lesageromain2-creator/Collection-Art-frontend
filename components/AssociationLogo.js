// Logo de l'association (logo final.PNG) — image seule, sans cadre
import Image from 'next/image';
import Link from 'next/link';

const SIZES = {
  sm: { width: 80, height: 80 },
  md: { width: 140, height: 140 },
  lg: { width: 200, height: 200 },
  hero: null, // responsive, géré en CSS
};

export default function AssociationLogo({ size = 'md', linkToHome = false, className = '' }) {
  const s = SIZES[size];
  const isHero = size === 'hero';

  const content = (
    <div className={`association-logo association-logo--${size} ${className}`}>
      {isHero ? (
        <>
          <div className="association-logo-inner">
            <Image
              src="/images/logo final.PNG"
              alt="Collection Aur'art"
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 88vw, min(62vmin, 520px)"
              priority
            />
          </div>
          <style jsx>{`
            .association-logo.association-logo--hero {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
            }
            .association-logo-inner {
              position: relative;
              width: min(88vw, min(62vmin, 520px));
              aspect-ratio: 1;
            }
          `}</style>
        </>
      ) : (
        <Image
          src="/images/logo final.PNG"
          alt="Collection Aur'art"
          width={s.width}
          height={s.height}
          className="object-contain"
          sizes="(max-width: 768px) 120px, 200px"
        />
      )}
    </div>
  );

  if (linkToHome) {
    return <Link href="/" className="inline-block association-logo-link">{content}</Link>;
  }
  return content;
}
