import { Card } from '@heroui/react';
import type {
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
} from '@heroui/react';

export type TenoraCardProps = CardProps;
export type TenoraCardHeaderProps = CardHeaderProps;
export type TenoraCardTitleProps = CardTitleProps;
export type TenoraCardDescriptionProps = CardDescriptionProps;
export type TenoraCardContentProps = CardContentProps;
export type TenoraCardFooterProps = CardFooterProps;

function TenoraCardRoot(props: TenoraCardProps) { return <Card {...props} />; }
function TenoraCardHeader(props: TenoraCardHeaderProps) { return <Card.Header {...props} />; }
function TenoraCardTitle(props: TenoraCardTitleProps) { return <Card.Title {...props} />; }
function TenoraCardDescription(props: TenoraCardDescriptionProps) { return <Card.Description {...props} />; }
function TenoraCardContent(props: TenoraCardContentProps) { return <Card.Content {...props} />; }
function TenoraCardFooter(props: TenoraCardFooterProps) { return <Card.Footer {...props} />; }

export const TenoraCard = Object.assign(TenoraCardRoot, {
  Root: TenoraCardRoot,
  Header: TenoraCardHeader,
  Title: TenoraCardTitle,
  Description: TenoraCardDescription,
  Content: TenoraCardContent,
  Footer: TenoraCardFooter,
});
