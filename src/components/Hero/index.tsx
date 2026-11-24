import { Coffee, Package, ShoppingCart, Timer } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { useTheme } from 'styled-components'
import { Benefit, Benefits, HeroContent, HeroImage, HeroSection, IconBubble } from './styles'

export function Hero() {
  const { colors } = useTheme()

  const benefits: { icon: ReactNode; color: string; text: string }[] = [
    {
      icon: <ShoppingCart weight="fill" />,
      color: colors.accentStrong,
      text: 'Compra simples e segura',
    },
    {
      icon: <Package weight="fill" />,
      color: colors.text,
      text: 'Embalagem mantém o café intacto',
    },
    { icon: <Timer weight="fill" />, color: colors.accent, text: 'Entrega rápida e rastreada' },
    {
      icon: <Coffee weight="fill" />,
      color: colors.primary,
      text: 'O café chega fresquinho até você',
    },
  ]

  return (
    <HeroSection>
      <HeroContent>
        <h1>Encontre o café perfeito para qualquer hora do dia</h1>
        <p>Com o Coffee Delivery você recebe seu café onde estiver, a qualquer hora</p>

        <Benefits>
          {benefits.map((benefit) => (
            <Benefit key={benefit.text}>
              <IconBubble $color={benefit.color} aria-hidden>
                {benefit.icon}
              </IconBubble>
              {benefit.text}
            </Benefit>
          ))}
        </Benefits>
      </HeroContent>

      <HeroImage src="/hero.svg" alt="" width={480} height={360} />
    </HeroSection>
  )
}
