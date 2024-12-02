import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

interface Props {
  title: string;
  content: string;
}

export const ExampleComponent: React.FC<Props> = ({ title, content }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{content}</p>
        <Button>Action</Button>
      </CardContent>
    </Card>
  );
};
