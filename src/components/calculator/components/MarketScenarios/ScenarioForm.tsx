import { useState } from 'react';
import { Button } from '../../../ui/button';
import { Label } from '../../../ui/label';
import { Input } from '../../../ui/input';

interface ScenarioFormProps {
  onSubmit: (name: string) => void;
}

export function ScenarioForm({ onSubmit }: ScenarioFormProps) {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name);
      setName('');
    }
  };

  return (
    <div className="flex items-end gap-4">
      <div className="flex-1">
        <Label htmlFor="scenarioName" className="text-sm font-medium mb-2">
          New Scenario Name
        </Label>
        <Input
          id="scenarioName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter scenario name"
          className="h-9"
        />
      </div>
      <Button onClick={handleSubmit} className="h-9">
        Add Scenario
      </Button>
    </div>
  );
}
