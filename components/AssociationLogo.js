// Logo de l'association (logo final.PNG) avec cadre élégant — réutilisable sur toutes les pages
import Image from 'next/image';
import Link from 'next/link';

const SIZES = {
  sm: { width: 80, height: 80, borderInset: 6, radius: 16 },
  md: { width: 140, height: 140, borderInset: 10, radius: 20 },
  lg: { width: 200, height: 200, borderInset: 14, radius: 24 },
};

export default function AssociationLogo({ size = 'md', linkToHome = false, className = '' }) {
  const s = SIZES[size] || SIZES.md;
  const totalSize = s.width + s.borderInset * 4;
  const content = (
    <div
      className={`association-logo association-logo--${size} ${className}`}
      style={{
        '--al-size': `${totalSize}px`,
        '--al-inner': `${s.width}px`,
        '--al-inset1': `${s.borderInset}px`,
        '--al-inset2': `${s.borderInset * 2}px`,
        '--al-radius': `${s.radius}px`,
        '--al-radius2': `${s.radius + 4}px`,
      }}
    >
      <div className="association-logo-border association-logo-border--1" />
      <div className="association-logo-border association-logo-border--2" />
      <div className="association-logo-wrap">
        <Image
          src="/images/logo final.PNG"
          alt="Collection Aur'art"
          width={s.width}
          height={s.height}
          className="object-contain"
          sizes="(max-width: 768px) 120px, 200px"
        />
      </div>
      <style jsx>{`
        .association-logo {
          position: relative;
          width: var(--al-size);
          height: var(--al-size);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: auto;
          margin-right: auto;
        }
        .association-logo-border {
          position: absolute;
          border-radius: var(--al-radius2);
          border: 2px solid;
          pointer-events: none;
        }
        .association-logo-border--1 {
          inset: calc(-1 * var(--al-inset1));
          border-color: rgba(108, 129, 87, 0.35);
        }
        .association-logo-border--2 {
          inset: calc(-1 * var(--al-inset2));
          border-color: rgba(33, 46, 80, 0.2);
        }
        .association-logo-wrap {
          position: relative;
          width: var(--al-inner);
          height: var(--al-inner);
          border-radius: var(--al-radius);
          overflow: hidden;
          background: #F9F6F0;
          box-shadow: 0 6px 24px rgba(33, 46, 80, 0.1);
        }
        .association-logo--sm .association-logo-wrap {
          box-shadow: 0 2px 12px rgba(33, 46, 80, 0.08);
        }
      `}</style>
    </div>
  );

  if (linkToHome) {
    return <Link href="/" className="inline-block association-logo-link">{content}</Link>;
  }
  return content;
}
