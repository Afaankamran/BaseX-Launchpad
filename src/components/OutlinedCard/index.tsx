import { Card, CardProps, alpha } from '@mui/material';
import { styled } from '@mui/system';

export const OutlinedCard = styled((props: CardProps) => (
  <Card variant="outlined" {...props} />
))(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.09),
}));
type ExtendedCardProps = CardProps & {
  bgOpacity?: number;
};
export const OutlinedCardPrimaryDark = styled((props: ExtendedCardProps) => (
  <Card variant="outlined" {...props} />
))(({ theme, bgOpacity = 0.05 }) => ({
  backgroundColor: alpha(theme.palette.primary.dark, bgOpacity),
}));

export const OutlinedCardTransparent = styled((props: CardProps) => (
  <Card variant="outlined" {...props} />
))(({ theme }) => ({
  backgroundColor: 'transparent',
}));

export const OutlinedCardGradient = styled((props: CardProps) => (
  <Card variant="outlined" {...props} />
))(({ theme }) => ({
  background: `linear-gradient(90deg, ${alpha(
    theme.palette.secondary.main,
    0.1,
  )} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
}));

export const OutlinedCardBorderGradient = styled((props: CardProps) => (
  <Card variant="outlined" {...props} />
))(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.dark, 0.05),
}));
export const SocialOutlinedCard = styled((props: CardProps) => (
  <Card variant="outlined" {...props} />
))(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  borderRadius: '5px',
}));
