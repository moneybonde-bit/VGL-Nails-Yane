import { Reveal } from '@/components/ui/Reveal';

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <Reveal className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-3xl leading-tight text-ink sm:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-4 text-ink-muted">{subtitle}</p> : null}
    </Reveal>
  );
}
