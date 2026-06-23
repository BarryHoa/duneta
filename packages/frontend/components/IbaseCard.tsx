import { Card } from '@heroui/react';
import type {
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
} from '@heroui/react';

export type IbaseCardProps = CardProps;
export type IbaseCardHeaderProps = CardHeaderProps;
export type IbaseCardTitleProps = CardTitleProps;
export type IbaseCardDescriptionProps = CardDescriptionProps;
export type IbaseCardContentProps = CardContentProps;
export type IbaseCardFooterProps = CardFooterProps;

function IbaseCardRoot(props: IbaseCardProps) { return <Card {...props} />; }
function IbaseCardHeader(props: IbaseCardHeaderProps) { return <Card.Header {...props} />; }
function IbaseCardTitle(props: IbaseCardTitleProps) { return <Card.Title {...props} />; }
function IbaseCardDescription(props: IbaseCardDescriptionProps) { return <Card.Description {...props} />; }
function IbaseCardContent(props: IbaseCardContentProps) { return <Card.Content {...props} />; }
function IbaseCardFooter(props: IbaseCardFooterProps) { return <Card.Footer {...props} />; }

export const IbaseCard = Object.assign(IbaseCardRoot, {
  Root: IbaseCardRoot,
  Header: IbaseCardHeader,
  Title: IbaseCardTitle,
  Description: IbaseCardDescription,
  Content: IbaseCardContent,
  Footer: IbaseCardFooter,
});
